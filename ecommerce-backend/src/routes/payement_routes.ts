import express from 'express';
import { adminOnly } from '../middlewares/auth.js';

import {
	deleteCoupon,
	getAllCoupons,
	newCoupon,
	newPaymentIntent,
	paymentDiscount,
} from '../controllers/coupon_controller.js';

const app = express.Router();

// http://localhost:4000/api/v1/payment/created
app.post('/create', newPaymentIntent);

// http://localhost:4000/api/v1/payment/coupon/new
app.post('/coupon/new', adminOnly, newCoupon);

// http://localhost:4000/api/v1/payment/discount
app.get('/discount', paymentDiscount);

// http://localhost:4000/api/v1/payment//coupon/all
app.get('/coupon/all', adminOnly, getAllCoupons);

// http://localhost:4000/api/v1/payment//coupon/:id
app.delete('/coupon/:id', adminOnly, deleteCoupon);

export default app;
