import ErrorHandler from '../utils/utilityClass.js';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { rm } from 'fs';
import { nodeCache } from '../app.js';
import { TryCatch } from '../middlewares/error.js';
import { Product } from '../models/product_models.js';
import { invalidateCache } from '../utils/revalidateCache.js';

import {
  BaseQuery,
  newProductRequestBody,
  searchRequestQuery,
} from '../types/types.js';

// import { faker } from '@faker-js/faker';

dotenv.config();

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, newProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, category, stock } = req.body;

    const photo = req.file;

    if (!photo) return next(new ErrorHandler('Please add photo', 400));

    if (!name || !price || !category || !stock) {
      rm(photo.path, () => {
        console.log('Photo Deleted');
      });

      return next(new ErrorHandler('Please Fill all fields', 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLocaleLowerCase(),
      photo: photo.path,
    });

    await invalidateCache({
      product: true,
      admin: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
    });
  }
);

export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;
  if (nodeCache.has('latest-products')) {
    products = JSON.parse(nodeCache.get('latest-products')!);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    nodeCache.set('latest-products', JSON.stringify(products));
  }

  res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (nodeCache.has('categories')) {
    categories = JSON.parse(nodeCache.get('categories') as string);
  } else {
    categories = await Product.distinct('category');
    nodeCache.set('categories', JSON.stringify(categories));
  }

  res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (nodeCache.has('all-products')) {
    products = JSON.parse(nodeCache.get('all-products') as string);
  } else {
    products = await Product.find({});
    nodeCache.set('all-products', JSON.stringify(products));
  }

  res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;

  if (nodeCache.has(`product-${id}`)) {
    product = JSON.parse(nodeCache.get(`product-${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler('Product does not exists', 400));

    nodeCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product)
    return next(new ErrorHandler('Product does not exists.Invalid id', 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log('old photo deleted');
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();
  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Product updated successfulyy',
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler('Product Not Found', 404));

  rm(product.photo!, () => {
    console.log('Product Photo Deleted');
  });

  await product.deleteOne();

  invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Product Deleted Successfully',
  });
});

export const searchProducts = TryCatch(
  async (req: Request<{}, {}, {}, searchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;
    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,15,16
    // 17,18,19,20,21,22,23,24
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: 'i',
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === 'asc' ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

// const generateRandomProducts = async (count: number = 10) => {
// 	const products = [];

// 	for (let i = 0; i < count; i++) {
// 		const product = {
// 			name: faker.commerce.productName(),
// 			photo: 'uploads/fd06220b-ab58-4145-a2bd-5f39b049c3ad.jpg',
// 			price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
// 			stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
// 			category: faker.commerce.department(),
// 			createdAt: new Date(faker.date.past()),
// 			updatedAt: new Date(faker.date.recent()),
// 			__v: 0,
// 		};

// 		products.push(product);
// 	}

// 	await Product.create(products);

// 	console.log({ succecss: true });
// };

// const deleteRandomsProducts = async (count: number = 10) => {
// 	const products = await Product.find({}).skip(2);

// 	for (let i = 0; i < products.length; i++) {
// 		const product = products[i];
// 		await product.deleteOne();
// 	}

// 	console.log({ succecss: true });
// };
