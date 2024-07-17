import ErrorHandler from '../utils/utilityClass.js';
import { User } from '../models/user_models.js';
import { TryCatch } from './error.js';

// Middleware to which only admin is allowed

export const adminOnly = TryCatch(async (req, res, next) => {
	const { id } = req.query;

	if (!id) {
		return next(new ErrorHandler('Please Login!', 401));
	}

	const user = await User.findById(id);
	if (!user) {
		return next(new ErrorHandler('User does not exists.Invalid ID', 401));
	}

	if (user.role != 'admin') {
		return next(new ErrorHandler('Access Denied.Only Admin can access', 401));
	}

	next();
});
