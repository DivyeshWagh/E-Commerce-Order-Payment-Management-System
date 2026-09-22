import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowLeft, CheckCircle, AlertTriangle, Truck, ShieldCheck, Tag, Plus, Minus } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    productService
      .getProductById(id)
      .then(setProduct)
      .catch(() => setErrorMsg('Product not found or unavailable'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (errorMsg || !product) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 my-12 max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Item Not Found</h2>
        <p className="text-sm text-slate-400">{errorMsg || 'The requested product does not exist.'}</p>
        <Link to="/products" className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold inline-block">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="aspect-square rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden relative">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.category && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-slate-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> {product.category.name}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-white">${Number(product.price).toFixed(2)}</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> In Stock & Ready to Ship
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed border-t border-b border-slate-800 py-4">
              {product.description || 'No detailed description available for this item.'}
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-300 uppercase">Quantity:</span>
              <div className="flex items-center glass-card rounded-xl border border-slate-700 p-1">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl gradient-btn font-extrabold text-base shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <ShoppingBag className="w-5 h-5" /> Add {quantity} to Shopping Cart
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-2 p-3 glass-card rounded-xl">
              <Truck className="w-4 h-4 text-indigo-400" /> Fast Delivery
            </div>
            <div className="flex items-center gap-2 p-3 glass-card rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Guaranteed Quality
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
