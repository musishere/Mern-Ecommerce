import { NextFunction, Request, Response } from 'express';

export interface newUserRequestBody {
	name: string;
	email: string;
	photo: string;
	role: 'user' | 'admin';
	gender: 'Male' | 'Female';
	_id: string;
	dob: Date;
}

export interface newProductRequestBody {
	name: string;
	category: string;
	price: number;
	stock: number;
}

export type controllerType = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type searchRequestQuery = {
	search?: string;
	price?: string;
	category?: string;
	sort?: string;
	page?: string;
};

export interface BaseQuery {
	name?: {
		$regex: string;
		$options: string;
	};
	price?: {
		$lte: number;
	};
	category?: string;
}

export type invalidateCacheType = {
	product?: boolean;
	order?: boolean;
	admin?: boolean;
	userId?: string;
	orderId?: string;
	productId?: string | string[];
};

export type orderItems = {
	name: string;
	photo: string;
	price: number;
	quantity: number;
	productId: string;
};

export type shippingInfoType = {
	address: string;
	state: string;
	country: string;
	pinCode: number;
	city: string;
};

export interface NewOrderRequestBody {
	shippingInfo: shippingInfoType;
	user: string;
	subtotal: number;
	tax: number;
	shippingCharges: number;
	discount: number;
	total: number;
	orderItems: orderItems[];
}

export interface NewCouponRequestBody {
	coupon: string;
	amount: number;
}
