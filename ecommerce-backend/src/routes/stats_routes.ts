import express from 'express';
import { adminOnly } from '../middlewares/auth.js';

import {
	barChartStats,
	getDashboardStats,
	lineChartStats,
	pieChartStats,
} from '../controllers/stats_controller.js';

const app = express.Router();

// http://localhost:4000/api/v1/dashboard/stats
app.get('/stats', adminOnly, getDashboardStats);

// http://localhost:4000/api/v1/dashboard/pie
app.get('/pie', adminOnly, pieChartStats);

// http://localhost:4000/api/v1/dashboard/bar
app.get('/bar', adminOnly, barChartStats);

// http://localhost:4000/api/v1/dashboard/line
app.get('/line', adminOnly, lineChartStats);

export default app;
