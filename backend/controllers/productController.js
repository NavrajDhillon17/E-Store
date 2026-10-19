const Product = require("../models/Products");

// Get all products with advanced filtering and sorting
const getProducts = async (req, res) => {
    try {
        const { category, brand, search, minPrice, maxPrice, inStock, sort } = req.query;

        let query = {};

        if (category && category !== "all") {
            query.category = category.toLowerCase();
        }

        if (brand && brand !== "all") {
            query.brand = new RegExp(`^${brand}$`, "i");
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (inStock === "true") {
            query.inStock = true;
        }

        let sortOption = { createdAt: -1 }; // default newest
        if (sort === "price_asc") sortOption = { price: 1 };
        if (sort === "price_desc") sortOption = { price: -1 };
        if (sort === "rating") sortOption = { rating: -1 };

        const products = await Product.find(query).sort(sortOption);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch products", error: err.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch product", error: err.message });
    }
};

// Add a product (Admin only)
const addProduct = async (req, res) => {
    try {
        const {
            title,
            brand,
            category,
            price,
            originalPrice,
            discount,
            image,
            description,
            features,
            rating,
            reviewsCount,
            inStock,
            tag,
            colors
        } = req.body;

        if (!title || !brand || !category || !price || !image || !description) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const product = await Product.create({
            title,
            brand,
            category: category.toLowerCase(),
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : null,
            discount: discount ? Number(discount) : 0,
            image,
            description,
            features: Array.isArray(features) ? features : (features ? features.split(",").map(f => f.trim()) : []),
            rating: rating ? Number(rating) : 4.8,
            reviewsCount: reviewsCount ? Number(reviewsCount) : 10,
            inStock: inStock !== undefined ? Boolean(inStock) : true,
            tag: tag || "",
            colors: Array.isArray(colors) ? colors : (colors ? colors.split(",").map(c => c.trim()) : [])
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: "Failed to create product", error: err.message });
    }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.price) updates.price = Number(updates.price);
        if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);
        if (updates.discount) updates.discount = Number(updates.discount);
        if (updates.rating) updates.rating = Number(updates.rating);
        if (updates.category) updates.category = updates.category.toLowerCase();
        if (typeof updates.features === "string") {
            updates.features = updates.features.split(",").map(f => f.trim());
        }
        if (typeof updates.colors === "string") {
            updates.colors = updates.colors.split(",").map(c => c.trim());
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "Failed to update product", error: err.message });
    }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete product", error: err.message });
    }
};

// Inventory statistics (Admin Dashboard)
const getStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const inStockCount = await Product.countDocuments({ inStock: true });
        const outOfStockCount = await Product.countDocuments({ inStock: false });

        const products = await Product.find({}, "price inStock category brand");
        const totalValue = products.reduce((acc, curr) => acc + (curr.price || 0), 0);

        const categories = await Product.distinct("category");
        const brands = await Product.distinct("brand");

        res.status(200).json({
            totalProducts,
            inStockCount,
            outOfStockCount,
            totalValue: Math.round(totalValue),
            categoriesCount: categories.length,
            brandsCount: brands.length
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to calculate stats", error: err.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getStats
};
