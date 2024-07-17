import { Product } from '../models/product_models.js';

export const getInventories = async ({
	categories,
	productsCount,
}: {
	categories: string[];
	productsCount: number;
}) => {
	const categoriesCountPromise = categories.map((category) =>
		Product.countDocuments({ category })
	);

	const categoriesCount = await Promise.all(categoriesCountPromise);

	const categoryCount: Record<string, number>[] = [];

	categories.forEach((category, i) => {
		categoryCount.push({
			[category]: Math.round((categoriesCount[i] / productsCount) * 100),
		});
	});

	return categoryCount;
};
