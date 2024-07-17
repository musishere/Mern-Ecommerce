import mongoose from 'mongoose';

const productScehma = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please Enter your Name'],
		},
		photo: {
			type: String,
			required: [true, 'Please add Photo'],
		},
		price: {
			type: Number,
			required: [true, 'Please price'],
		},
		stock: {
			type: Number,
			required: [true, 'Please enter stock'],
		},
		category: {
			type: String,
			required: [true, 'Please Enter Product category'],
			trim: true,
		},
	},
	{ timestamps: true }
);

export const Product = mongoose.model('Product', productScehma);
