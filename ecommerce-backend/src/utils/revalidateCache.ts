import { nodeCache } from '../app.js';
import { Order } from '../models/order_models.js';
import { Product } from '../models/product_models.js';
import { invalidateCacheType } from '../types/types.js';

export const invalidateCache = async ({
	product,
	order,
	admin,
	userId,
	orderId,
	productId,
}: invalidateCacheType) => {
	if (product) {
		const productKeys: string[] = [
			'latest-products',
			'categories',
			'all-products',
			`product-${productId}`,
		];

		if (typeof productId === 'string') productKeys.push(`product-${productId}`);

		if (typeof productId === 'object') {
			productId.forEach((i) => {
				productKeys.push(`product-${i}`);
			});
		}

		nodeCache.del(productKeys);
	}

	if (order) {
		const orderKeys: string[] = [
			'all-orders',
			`my-orders-${userId}`,
			`order-${orderId}`,
		];
		const orders = await Order.find({}).select('_id');

		orders.forEach((i) => {
			orderKeys.push();
		});

		nodeCache.del(orderKeys);
	}

	if (admin) {
		nodeCache.del([
			'admin-stats',
			'admin-pie-charts',
			'admin-line-charts',
			'admin-bar-charts',
		]);
	}
};
