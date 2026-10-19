const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        brand: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            enum: ["smartphones", "laptops", "audio", "wearables", "accessories"],
            lowercase: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        originalPrice: {
            type: Number,
            default: null
        },
        discount: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        features: {
            type: [String],
            default: []
        },
        rating: {
            type: Number,
            default: 4.8,
            min: 0,
            max: 5
        },
        reviewsCount: {
            type: Number,
            default: 85
        },
        inStock: {
            type: Boolean,
            default: true
        },
        tag: {
            type: String,
            default: ""
        },
        colors: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
