import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowRight, Sparkles, Tag, Grid } from 'lucide-react';

const HomePage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ]);
        setProducts(prodData.slice(0, 8)); // Top 8 featured
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Premium E-Commerce Experience
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Discover Quality Products for Your <span className="gradient-text">Lifestyle</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Shop the latest electronics, fashion, home essentials, and more with real-time stock reservation and seamless checkout.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/products"
              className="gradient-btn px-6 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="glass-card px-6 py-3.5 rounded-full text-sm font-semibold text-slate-200 hover:text-white border border-slate-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-indigo-400" /> Browse by Category
            </h2>
            <Link to="/products" className="text-xs font-semibold text-indigo-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="glass-card p-4 rounded-2xl text-center hover:border-indigo-500/50 group transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white">{cat.name}</h3>
                {cat.description && <p className="text-xs text-slate-400 truncate mt-0.5">{cat.description}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Products</h2>
            <p className="text-sm text-slate-400">Handpicked collection of top items</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-indigo-400 hover:underline flex items-center gap-1">
            See More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card rounded-2xl p-4 h-80 animate-pulse bg-slate-900/40"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      {product.category?.name || 'Item'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 text-base line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{product.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Price</span>
                    <span className="text-lg font-extrabold text-white">${Number(product.price).toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product.id, 1)}
                    className="p-2.5 rounded-xl gradient-btn shadow-md hover:scale-105 transition-transform"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
