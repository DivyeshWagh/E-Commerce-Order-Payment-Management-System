import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
import { Search, Filter, ShoppingBag, Eye, SlidersHorizontal, RefreshCcw } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState('default');

  // Load Categories
  useEffect(() => {
    categoryService.getAllCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch Products based on Active Filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let data = [];
      const currentSearch = searchParams.get('search');
      const currentCat = searchParams.get('category');
      const currentMin = searchParams.get('minPrice');
      const currentMax = searchParams.get('maxPrice');

      if (currentSearch) {
        data = await productService.searchProducts(currentSearch);
      } else if (currentCat) {
        data = await productService.getProductsByCategory(currentCat);
      } else if (currentMin && currentMax) {
        data = await productService.getProductsByPriceRange(currentMin, currentMax);
      } else {
        data = await productService.getAllProducts();
      }

      // Local Sort
      if (sortBy === 'price-low') {
        data.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        data.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'name') {
        data.sort((a, b) => a.name.localeCompare(b.name));
      }

      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedCategory) params.category = selectedCategory;
    if (minPrice && maxPrice) {
      params.minPrice = minPrice;
      params.maxPrice = maxPrice;
    }
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Product Catalog</h1>
        <p className="text-sm text-slate-400 mt-1">Explore our wide selection of items</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="glass-panel p-6 rounded-3xl space-y-6 h-fit border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Filters
            </h3>
            <button onClick={handleResetFilters} className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
              <RefreshCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <form onSubmit={handleApplyFilters} className="space-y-5">
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs bg-slate-900 text-slate-200"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-2.5 rounded-xl gradient-btn text-xs font-semibold shadow-md">
              Apply Filters
            </button>
          </form>
        </div>

        {/* Product Grid & Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar Sort & Count */}
          <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
            <span className="text-xs font-medium text-slate-400">
              Showing <span className="text-white font-bold">{products.length}</span> products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl glass-input text-xs bg-slate-900 text-slate-200"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Product Name</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card rounded-2xl p-4 h-80 animate-pulse bg-slate-900/40"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
              <Filter className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters or search terms</p>
              <button onClick={handleResetFilters} className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="glass-card rounded-2xl p-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="aspect-square rounded-xl bg-slate-900/60 overflow-hidden relative border border-slate-800">
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-slate-800">
                        {product.category?.name || 'Catalog'}
                      </span>
                    </div>

                    <div>
                      <Link to={`/products/${product.id}`} className="font-bold text-slate-100 text-base line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {product.name}
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{product.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-slate-400 block">Price</span>
                      <span className="text-lg font-extrabold text-white">${Number(product.price).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => addToCart(product.id, 1)}
                        className="p-2.5 rounded-xl gradient-btn shadow-md hover:scale-105 transition-transform"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
