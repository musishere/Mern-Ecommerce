import { Document } from 'mongoose';

export interface myDocument extends Document {
	createdAt: Date;
	discount?: number;
	total?: number;
}

type getChartDataType = {
	length: number;
	docArr: myDocument[];
	today: Date;
	property?: 'discount' | 'total';
};

export const getChartData = ({ length, docArr, today, property }: getChartDataType) => {
	const data: number[] = new Array(6).fill(0);
	docArr.forEach((i) => {
		const creationDate = i.createdAt;
		const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

		if (monthDiff < length) {
			if (property) {
				data[length - monthDiff - 1] += i[property]!;
			} else {
				data[length - monthDiff - 1] += 1;
			}
		}
	});

	return data;
};
