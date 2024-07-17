import ErrorHandler from '../utils/utilityClass.js';
import { NextFunction, Request, Response } from 'express';
import { controllerType } from '../types/types.js';

export const errorMiddleware = (
	err: ErrorHandler,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.message ||= 'Internal Server Error';
	err.statusCode ||= 500;

	if (err.name === 'CastError') err.message = 'Invalid ID';

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
	});
};

export const TryCatch = (func: controllerType) => {
	return (req: Request, res: Response, next: NextFunction) => {
		return Promise.resolve(func(req, res, next)).catch(next);
	};
};
