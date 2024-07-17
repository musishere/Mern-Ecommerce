import { nodeCache } from '../app.js';
import { TryCatch } from '../middlewares/error.js';
import { Order } from '../models/order_models.js';
import { Product } from '../models/product_models.js';
import { User } from '../models/user_models.js';
import { calculatePercentage } from '../utils/calculateAverage.js';
import { getInventories } from '../utils/getCategorires.js';
import { getChartData, myDocument } from '../utils/revenueCalculate.js';

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (nodeCache.has('admin-stats'))
    stats = JSON.parse(nodeCache.get('admin-stats') as string);
  else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const productsThisMonthPromise = await Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const productsLastMonthPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const usersThisMonthPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const usersLastMonthPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const ordersThisMonthPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const ordersLastMonthPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const orderLastsixMonthsPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });

    const latestTransectionsPromise = Order.find({})
      .select(['orderItems', 'discount', 'total', 'status'])
      .limit(4);

    const [
      usersThisMonth,
      productsThisMonth,
      ordersThisMonth,
      usersLastMonth,
      productsLastMonth,
      ordersLastMonth,
      productsCount,
      userCount,
      allOrders,
      orderLastsixMonths,
      categories,
      femaleUserCount,
      latestTransection,
    ] = await Promise.all([
      usersThisMonthPromise,
      productsThisMonthPromise,
      ordersThisMonthPromise,
      usersLastMonthPromise,
      productsLastMonthPromise,
      ordersLastMonthPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select('total'),
      orderLastsixMonthsPromise,
      Product.distinct('category'),
      User.countDocuments({ gender: 'Female' }),
      latestTransectionsPromise,
    ]);

    const thisMonthRevenue = ordersThisMonth.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = ordersLastMonth.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercentage = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        usersThisMonth.length,
        usersLastMonth.length
      ),
      user: calculatePercentage(
        productsThisMonth.length,
        productsLastMonth.length
      ),
      order: calculatePercentage(
        ordersThisMonth.length,
        ordersLastMonth.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
      revenue,
      user: userCount,
      product: productsCount,
      order: allOrders.length,
    };

    const orderMonthsCount = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    orderLastsixMonths.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDifference =
        (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDifference < 6) {
        orderMonthsCount[6 - monthDifference - 1] += 1;
        orderMonthlyRevenue[6 - monthDifference - 1] += order.total;
      }
    });

    const categoryCount = await getInventories({ categories, productsCount });

    const Userratio = {
      male: userCount - femaleUserCount,
      female: femaleUserCount,
    };

    const mofifiedLatestTrasection = latestTransection.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    stats = {
      categoryCount,
      changePercentage,
      count,
      chart: {
        order: orderMonthsCount,
        revenue: orderMonthlyRevenue,
      },
      Userratio,
      latestTransection: mofifiedLatestTrasection,
    };

    nodeCache.set('admin-stats', JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const pieChartStats = TryCatch(async (req, res, next) => {
  let charts;
  if (nodeCache.has('admin-pie-charts'))
    charts = JSON.parse(nodeCache.get('admin-pie-charts') as string);
  else {
    const [
      processingOrder,
      shippedOrder,
      deleviredOrder,
      categories,
      productsCount,
      productOutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: 'Processing' }),
      Order.countDocuments({ status: 'Shipped' }),
      Order.countDocuments({ status: 'Delevired' }),
      Product.distinct('category'),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      Order.find({}).select([
        'total',
        'discount',
        'subtotal',
        'tax',
        'shippingCharges',
      ]),
      User.find({}).select(['role', 'dob']),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'user' }),
    ]);

    const productCategories = await getInventories({
      categories,
      productsCount,
    });

    const orderFullFilment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delevired: deleviredOrder,
    };

    const stockAvailability = {
      inStock: productsCount - productOutOfStock,
      productOutOfStock,
    };

    const totalGrossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const totatDiscount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const totalproductionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const totalBurnt = allOrders.reduce(
      (prev, order) => prev + (order.tax || 0),
      0
    );

    const totalMarketingCost = Math.round(totalGrossIncome * (30 / 100));

    const totalnetMargin =
      totalGrossIncome -
      totatDiscount -
      totalproductionCost -
      totalBurnt -
      totalMarketingCost;

    const revenueDistribution = {
      netMargin: totalnetMargin,
      discount: totatDiscount,
      productionCost: totalproductionCost,
      burnt: totalBurnt,
      marketingCost: totalMarketingCost,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    const adminUser = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullFilment,
      productCategories,
      stockAvailability,
      revenueDistribution,
      usersAgeGroup,
      adminUser,
    };

    nodeCache.set('admin-pie-charts', JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const barChartStats = TryCatch(async (req, res, next) => {
  let charts;
  const key = 'admin-bar-charts';

  if (nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
  else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

    const lastSixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select('createdAt');

    const LastSixMonthUserPromise = User.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select('createdAt');

    const orderLastTwelevemonth = Order.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select('createdAt');

    const [lastSixMonthProduct, lastSixMonthUser, OrderLastTweleveMonth] =
      await Promise.all([
        lastSixMonthProductPromise,
        LastSixMonthUserPromise,
        orderLastTwelevemonth,
      ]);

    const producCounts = getChartData({
      length: 6,
      today,
      docArr: lastSixMonthProduct,
    });

    const userCounts = getChartData({
      length: 6,
      today,
      docArr: lastSixMonthUser,
    });
    const orderCounts = getChartData({
      length: 12,
      today,
      docArr: OrderLastTweleveMonth,
    });

    charts = {
      users: userCounts,
      products: producCounts,
      orders: orderCounts,
    };

    nodeCache.set(key, JSON.stringify(charts));
  }

  res.status(200).json({
    success: true,
    charts,
  });
});

export const lineChartStats = TryCatch(async (req, res, next) => {
  let charts;
  const key = 'admin-line-charts';

  if (nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
  else {
    const today = new Date();

    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

    const productsLastTweleveMonthsPromise = Product.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select('createdAt');

    const userLastTweleveMonthsPromise = User.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select('createdAt');

    const ordersLastTwelveMonthPromise = Order.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select(['createdAt', 'discount', 'total ']);

    const [products, users, orders] = await Promise.all([
      productsLastTweleveMonthsPromise,
      userLastTweleveMonthsPromise,
      ordersLastTwelveMonthPromise,
    ]);

    const producCounts = getChartData({
      length: 12,
      today,
      docArr: products,
    });

    const userCounts = getChartData({
      length: 12,
      today,
      docArr: users,
    });

    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: 'discount',
    });

    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: 'total',
    });

    charts = {
      users: userCounts,
      producs: producCounts,
      discount,
      revenue,
    };

    nodeCache.set(key, JSON.stringify(charts));
  }

  res.status(200).json({
    success: true,
    charts,
  });
});
