import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const { cart, cartItemsCount, cartTotal, updateItemQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const tax = cartTotal * 0.1; // 10% Tax
  const shipping = cartTotal > 0 ? (cartTotal > 100 ? 0 : 15) : 0;
  const grandTotal = cartTotal + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!cart?.items || [...cart.items].length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 my-12 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-sm text-slate-400">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products" className="gradient-btn px-6 py-3 rounded-xl text-xs font-semibold inline-flex items-center gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Shopping Cart</h1>
          <p className="text-sm text-slate-400">You have {cartItemsCount} item(s) in your cart</p>
        </div>
        <Link to="/products" className="text-sm font-semibold text-indigo-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {[...cart.items].map((item) => (
            <div key={item.id} className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shrink-0">
                <img
                  src={'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=60'}
                  alt={item.product?.name || 'Product'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product?.id}`} className="font-bold text-white text-base hover:text-indigo-400 transition-colors truncate block">
                  {item.product?.name || 'Cart Product'}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">Unit Price: ${Number(item.price).toFixed(2)}</p>
                <div className="text-sm font-black text-indigo-300 mt-1">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>

              {/* Quantity Adjuster */}
              <div className="flex items-center gap-2 glass-card p-1 rounded-xl">
                <button
                  onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                <button
                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.product?.id)}
                className="p-2.5 rounded-xl glass-card text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 h-fit">
          <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Items Total ({cartItemsCount})</span>
              <span className="font-semibold text-white">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Tax (10%)</span>
              <span className="font-semibold text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping Fee</span>
              <span className="font-semibold text-emerald-400">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="h-px bg-slate-800 my-2"></div>
            <div className="flex justify-between text-base font-extrabold text-white">
              <span>Grand Total</span>
              <span className="gradient-text text-xl">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 rounded-2xl gradient-btn font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Checkout & Stock Reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
