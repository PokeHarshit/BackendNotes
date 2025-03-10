import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    productImage: {
        type: String
    },
    price: {
        type: Number, 
        default: 0
    },
    stock: {
        default: 0,
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);