import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  DollarSign,
  Layers,
  AlertTriangle,
  CheckCircle,
  X,
  ExternalLink,
  RotateCcw
} from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToast } = useToast();

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "smartphones",
    price: "",
    originalPrice: "",
    discount: "",
    image: "",
    description: "",
    features: "",
    tag: "",
    colors: "",
    inStock: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, statsRes] = await Promise.all([
        api.get("/products"),
        api.get("/products/stats"),
      ]);
      setProducts(productsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      addToast("Failed to load inventory data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      brand: "",
      category: "smartphones",
      price: "",
      originalPrice: "",
      discount: "",
      image: "",
      description: "",
      features: "",
      tag: "New Arrival",
      colors: "Black, Silver",
      inStock: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      title: product.title || "",
      brand: product.brand || "",
      category: product.category || "smartphones",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      discount: product.discount || "",
      image: product.image || "",
      description: product.description || "",
      features: Array.isArray(product.features) ? product.features.join(", ") : "",
      tag: product.tag || "",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      inStock: product.inStock !== undefined ? product.inStock : true,
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.brand || !formData.price || !formData.image) {
      addToast("Please fill all required fields", "error");
      return;
    }

    try {
      if (editingId) {
        await api.patch(`/products/${editingId}`, formData);
        addToast("Product updated successfully", "success");
      } else {
        await api.post("/products", formData);
        addToast("Product created successfully", "success");
      }
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await api.delete(`/products/${deletingProduct._id}`);
      addToast(`Deleted "${deletingProduct.title}"`, "success");
      setDeletingProduct(null);
      loadData();
    } catch (err) {
      addToast("Failed to delete product", "error");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] pt-28 pb-20 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Shield className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Control Center
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              Inventory & Catalog CMS
            </h1>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Device
          </button>
        </div>

        {/* KPI Metrics Strip */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Total Hardware</span>
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-2xl font-extrabold text-white">
                {stats.totalProducts}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Across {stats.categoriesCount} categories
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Catalog Valuation</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-white">
                ${stats.totalValue.toLocaleString()}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Combined list inventory value
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Active In-Stock</span>
                <CheckCircle className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-400">
                {stats.inStockCount}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Ready for immediate shipping
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Verified Brands</span>
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-2xl font-extrabold text-white">
                {stats.brandsCount}
              </span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                Apple, Sony, Dell, Samsung etc.
              </span>
            </div>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 mb-6">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or brand..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["all", "smartphones", "laptops", "audio", "wearables", "accessories"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Inventory Data Table */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Tag</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition">
                    {/* Item */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-950 p-1 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block text-sm">
                            {p.title}
                          </span>
                          <span className="text-slate-400 text-[11px] font-semibold">
                            {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-6">
                      <span className="capitalize text-slate-300 font-medium">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-6 font-bold text-white">
                      ${p.price.toLocaleString()}
                      {p.originalPrice && (
                        <span className="block text-[10px] text-slate-500 line-through">
                          ${p.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.inStock
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.inStock ? "bg-emerald-400" : "bg-rose-400"
                          }`}
                        />
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Tag */}
                    <td className="py-3.5 px-6">
                      {p.tag ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {p.tag}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-white">
                {editingId ? "Update Product" : "Add New Hardware"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. iPhone 16 Pro"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Apple, Sony, Dell"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="audio">Audio</option>
                    <option value="wearables">Wearables</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="999"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="1099"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className="text-[11px] text-slate-400">Image thumbnail preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Comprehensive technical overview..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Best Seller, New, Editor's Pick"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Color Variants (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Space Black, Silver, Blue"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Key Bullet Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="A18 Pro chip, 48MP camera, 33h battery"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-semibold text-slate-300">In Stock for Immediate Delivery</span>
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition mt-4"
              >
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Confirm Deletion</h3>
            <p className="text-xs text-slate-400 mt-2">
              Are you sure you want to remove <strong className="text-white">"{deletingProduct.title}"</strong> from the store catalog? This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
