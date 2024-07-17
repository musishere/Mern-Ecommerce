import express from 'express';
import { adminOnly } from '../middlewares/auth.js';

import {
	allOrders,
	deleteOrder,
	getProcessDetail,
	getSingleOrder,
	myOrder,
	newOrder,
} from '../controllers/order_controller.js';

const app = express.Router();

// http://localhost:4000/api/v1/order/new
app.post('/new', newOrder);

// http://localhost:4000/api/v1/order/my
app.get('/my', myOrder);

// http://localhost:4000/api/v1/order/all
app.get('/all', adminOnly, allOrders);

// http://localhost:4000/api/v1/order/:id
app.route('/:id')
	.get(getSingleOrder)
	.put(adminOnly, getProcessDetail)
	.delete(adminOnly, deleteOrder);
export default app;
