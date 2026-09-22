import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Package, Clock, Eye, XCircle, ArrowRight } from 'lucide-react';

const MyOrdersPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const data = await orderService.getUserOrders(user.userId);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(orderId);
      addToast('Order cancelled and reserved stock released', 'info');
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot cancel order in current state';
      addToast(msg, 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Delivered</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Shipped</span>;
      case 'CONFIRMED':
      case 'PROCESSING':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{status}</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{status || 'PENDING'}</span>;
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">My Orders</h1>
        <p className="text-sm text-slate-400">Track and manage your order history</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card rounded-3xl p-6 h-32 animate-pulse bg-slate-900/40"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-slate-400">You haven't placed any orders yet.</p>
          <Link to="/products" className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2">
            Explore Storefront <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Order #{order.id}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="text-lg font-extrabold text-white">${Number(order.totalprice).toFixed(2)}</span>
                </div>
              </div>

              {/* Order Items Snapshot */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Items: </span>
                  <span className="font-semibold text-white">
                    {order.items ? [...order.items].map((i) => `${i.quantity}x ${i.product?.name || 'Item'}`).join(', ') : 'No items'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/orders/${order.id}`}
                    className="gradient-btn px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </Link>

                  {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3.5 py-2 rounded-xl glass-card text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
