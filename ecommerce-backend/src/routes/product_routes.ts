import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';

import {
	deleteProduct,
	getAdminProducts,
	getAllCategories,
	getSingleProduct,
	getlatestProducts,
	newProduct,
	searchProducts,
	updateProduct,
} from '../controllers/product_controller.js';

const app = express.Router();

// http://localhost:4000/api/v1/product/new
app.post('/new', adminOnly, singleUpload, newProduct);

// http://localhost:4000/api/v1/product/all
app.get('/all', searchProducts);

// http://localhost:4000/api/v1/product/latest
app.get('/latest', getlatestProducts);

// http://localhost:4000/api/v1/product/categories
app.get('/categories', getAllCategories);

// http://localhost:4000/api/v1/product/admin-products
app.get('/admin-products', adminOnly, getAdminProducts);

// http://localhost:4000/api/v1/product/:id
app.route('/:id')
	.get(getSingleProduct)
	.put(adminOnly, singleUpload, updateProduct)
	.delete(adminOnly, deleteProduct);

export default app;
