import NodeCache from 'node-cache';
import Stripe from 'stripe';
import cors from 'cors';
import dashboardRoute from './routes/stats_routes.js';
import express from 'express';
import morgan from 'morgan';
import orderRoute from './routes/order_routes.js';
import paymentRoute from './routes/payement_routes.js';
import productRoute from './routes/product_routes.js';
import userRoutes from './routes/user_routes.js';
import { config } from 'dotenv';
import { METHODS } from 'http';
import { errorMiddleware } from './middlewares/error.js';
import { connectDataBase } from './utils/connectDataBase.js';

const app = express();
config({
  path: './.env',
});
connectDataBase(process.env.MONGODB_URI || '');
const stripeKey = process.env.STRIPE_KEY || '';
export const stripe = new Stripe(stripeKey);
export const nodeCache = new NodeCache();
const port = 4000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes:
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/order', orderRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/dashboard', dashboardRoute);

app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on Port http://localhost:${port}`);
});
