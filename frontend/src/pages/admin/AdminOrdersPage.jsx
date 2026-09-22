import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import { Edit3, Filter, X } from 'lucide-react';

const AdminOrdersPage = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    try {
      const data = await adminService.getDashboardMetrics();
      setOrders(data.recentOrders || []);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (order) => {
    setUpdatingOrder(order);
    setNewStatus(order.status || 'PENDING');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!updatingOrder) return;
    try {
      await orderService.updateOrderStatus(updatingOrder.id, newStatus);
      addToast(`Order #${updatingOrder.id} status updated to ${newStatus}`, 'success');
      setUpdatingOrder(null);
      fetchOrders();
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const filteredOrders = orders.filter((o) =>
    selectedStatus === 'ALL' ? true : o.status === selectedStatus
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Order Management</h1>
            <p className="text-sm text-slate-400">Track and update customer order fulfillment statuses</p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 glass-card p-1.5 rounded-2xl">
            <Filter className="w-4 h-4 text-indigo-400 ml-2" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none pr-3 py-1"
            >
              <option value="ALL" className="bg-slate-900">All Statuses</option>
              <option value="PENDING" className="bg-slate-900">PENDING</option>
              <option value="CONFIRMED" className="bg-slate-900">CONFIRMED</option>
              <option value="PROCESSING" className="bg-slate-900">PROCESSING</option>
              <option value="SHIPPED" className="bg-slate-900">SHIPPED</option>
              <option value="DELIVERED" className="bg-slate-900">DELIVERED</option>
              <option value="CANCELLED" className="bg-slate-900">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-white">#{order.id}</td>
                    <td className="py-3 px-4">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</td>
                    <td className="py-3 px-4 font-bold text-white">${Number(order.totalprice).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="p-1.5 rounded-lg glass-card text-indigo-400 hover:text-white inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" /> Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {updatingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Update Status (Order #{updatingOrder.id})</h3>
                <button onClick={() => setUpdatingOrder(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">New Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs bg-slate-900 text-slate-200"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-semibold text-xs shadow-lg mt-2">
                  Update Status
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrdersPage;
