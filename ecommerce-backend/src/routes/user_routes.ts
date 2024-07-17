import express from 'express';
import { adminOnly } from '../middlewares/auth.js';

import {
	deleteUser,
	getAllUsers,
	getUser,
	newUser,
} from '../controllers/user_controller.js';

const app = express.Router();

// http://localhost::4000/api/v1/user/new
app.post('/new', newUser);

// http://localhost::4000/api/v1/user/all
app.get('/all', adminOnly, getAllUsers);

// http://localhost::4000/api/v1/user/DynamicID
app.get('/:id', getUser);
app.delete('/:id', adminOnly, deleteUser);

export default app;
