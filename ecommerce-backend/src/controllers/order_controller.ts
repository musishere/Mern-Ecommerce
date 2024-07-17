import ErrorHandler from '../utils/utilityClass.js';
import { Request } from 'express';
import { nodeCache } from '../app.js';
import { TryCatch } from '../middlewares/error.js';
import { Order } from '../models/order_models.js';
import { NewOrderRequestBody } from '../types/types.js';
import { reduceStock } from '../utils/reduceStock.js';
import { invalidateCache } from '../utils/revalidateCache.js';

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
    } = req.body;

    if (!user || !subtotal || !tax || !orderItems || !shippingInfo || !total) {
      return next(new ErrorHandler('Please fill all fields', 400));
    }

    const order = await Order.create({
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderItems,
    });

    await reduceStock(orderItems);
    await invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res.status(201).json({
      success: true,
      message: 'Order Placed successfully',
    });
  }
);

export const myOrder = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;

  let key = `my-order-${user}`;
  let orders = [];
  if (nodeCache.has(key)) {
    orders = JSON.parse(nodeCache.get('my-orders')!);
  } else {
    orders = await Order.find({ user });
    if (!orders) return next(new ErrorHandler('Order not Found', 400));
    nodeCache.set(key, orders);
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = 'all-orders';
  let orders;

  if (nodeCache.has(key)) {
    orders = JSON.parse(nodeCache.get(key)!);
  } else {
    const orders = await Order.find().populate('user', 'name');
    if (!orders) return next(new ErrorHandler('Order not Found', 400));
    nodeCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const key = `order-${id}`;

  let order;
  if (nodeCache.has(key)) {
    order = JSON.parse(nodeCache.get(key) as string);
  } else {
    order = await Order.findById(id).populate('user', 'name');
    if (!order) return next(new ErrorHandler('Order not found', 400));
    nodeCache.set(key, JSON.stringify(order));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

export const getProcessDetail = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler('Order does not exists', 400));

  switch (order.status) {
    case 'Processing':
      order.status = 'Shipped';
      break;
    case 'Shipped':
      order.status = 'Delivered';
      break;
    default:
      order.status = 'Delivered';
      break;
  }

  await order.save();
  await invalidateCache({
    product: true,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    succes: true,
    message: 'Order processed successfully',
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler('Order does not exists', 400));

  await order?.deleteOne();
  await invalidateCache({
    product: true,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    succes: true,
    message: 'Order deleted successfully',
  });
});
