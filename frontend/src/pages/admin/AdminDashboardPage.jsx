import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Package, ShoppingBag, DollarSign, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboardMetrics()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">Overview of business performance and live system metrics</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card rounded-3xl p-6 h-32 animate-pulse bg-slate-900/40"></div>
            ))}
          </div>
        ) : (
          <>
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Total Revenue</span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white">${Number(metrics?.totalRevenue || 0).toFixed(2)}</h2>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> Confirmed Earnings
                </p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Total Orders</span>
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white">{metrics?.totalOrders || 0}</h2>
                <p className="text-[10px] text-indigo-400 font-semibold">
                  {metrics?.pendingOrders || 0} Pending Action
                </p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Active Products</span>
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white">{metrics?.totalProducts || 0}</h2>
                <p className="text-[10px] text-cyan-400 font-semibold">Catalog Items</p>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Low Stock Alert</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-amber-400">{metrics?.lowStockCount || 0}</h2>
                <p className="text-[10px] text-amber-400 font-semibold">Items below threshold</p>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base">Recent Customer Orders</h3>
                <Link to="/admin/orders" className="text-xs text-indigo-400 hover:underline">
                  View All Orders
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {metrics?.recentOrders?.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono font-bold text-white">#{order.id}</td>
                        <td className="py-3 px-4">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="py-3 px-4 font-bold text-white">${Number(order.totalprice).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to="/admin/orders"
                            className="p-1.5 rounded-lg glass-card text-indigo-400 hover:text-white inline-block"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
