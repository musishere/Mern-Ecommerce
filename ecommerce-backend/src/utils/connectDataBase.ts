import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectDataBase = (uri: string) => {
	mongoose
		.connect(uri, {
			dbName: 'Ecommerce_2024',
		})
		.then((c) => console.log(`Data Base connecte to ${c.connection.host}`))
		.catch((e) => console.log(e));
};
