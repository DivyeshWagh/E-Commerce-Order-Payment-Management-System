import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Package, ArrowLeft, Clock, MapPin, XCircle, CreditCard } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const data = await orderService.getOrderById(id, user.userId);
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  }, [id, user?.userId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Cancel this order and release inventory stock?')) return;
    try {
      await orderService.cancelOrder(id);
      addToast('Order cancelled', 'info');
      fetchOrder();
    } catch (err) {
      addToast('Failed to cancel order', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto my-12">
        <Package className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <Link to="/orders" className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-8">
        {/* Header Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white">Order #{order.id}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {order.status === 'PENDING' && (
              <Link
                to={`/payment/${order.id}`}
                className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Complete Payment
              </Link>
            )}

            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2.5 rounded-xl glass-card text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Address & Payment Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" /> Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipcode}</p>
                <p className="text-slate-400 uppercase">{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Standard Delivery Destination</p>
            )}
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Order Financials
            </h3>
            <div className="text-xs text-slate-300 space-y-1">
              <div className="flex justify-between"><span>Subtotal:</span><span className="text-white">${Number(order.subtotal || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax:</span><span className="text-white">${Number(order.tax || 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Grand Total:</span><span className="font-extrabold text-white">${Number(order.totalprice).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="font-bold text-indigo-300">{order.status}</span></div>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-base">Purchased Items</h3>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden glass-card">
            {order.items ? [...order.items].map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden border border-slate-800 shrink-0">
                    <img
                      src={'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60'}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.product?.name || 'Order Item'}</h4>
                    <p className="text-xs text-slate-400">Unit Price: ${Number(item.price).toFixed(2)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Quantity: {item.quantity}</span>
                  <span className="font-extrabold text-indigo-300">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            )) : <p className="p-4 text-xs text-slate-400">No items found</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
