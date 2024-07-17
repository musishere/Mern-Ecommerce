import ErrorHandler from '../utils/utilityClass.js';
import Stripe from 'stripe';
import { Request } from 'express';
import { nextTick } from 'process';
import { stripe } from '../app.js';
import { TryCatch } from '../middlewares/error.js';
import { Coupon } from '../models/coupon_models.js';
import { NewCouponRequestBody } from '../types/types.js';

export const newPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) return next(new ErrorHandler('Please enter amount', 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: 'inr',
  });

  res.status(201).json({
    succes: true,
    clientSecret: paymentIntent.client_secret,
  });
});

export const newCoupon = TryCatch(
  async (req: Request<{}, {}, NewCouponRequestBody>, res, next) => {
    const { coupon, amount } = req.body;

    if (!coupon || !amount)
      return next(new ErrorHandler('Please fill all fields', 400));

    await Coupon.create({ code: coupon, amount });

    return res.status(201).json({
      success: true,
      message: `Coupon ${coupon} created successfully`,
    });
  }
);

export const paymentDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;

  const discount = await Coupon.findOne({ code: coupon });
  if (!discount) return next(new ErrorHandler('Invalid coupon', 400));

  res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

export const getAllCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);
  if (!coupon) return next(new ErrorHandler('Invalid ID', 400));

  await coupon.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Coupon deleted succesfully',
  });
});
