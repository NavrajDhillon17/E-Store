const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getStats
} = require("../controllers/productController");

// Public routes
router.get("/", getProducts);
router.get("/stats", getStats);
router.get("/:id", getProductById);

// Admin-protected routes
router.post("/", authMiddleware, adminMiddleware, addProduct);
router.patch("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
