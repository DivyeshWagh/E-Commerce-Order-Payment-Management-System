import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import { Boxes, Edit2, AlertTriangle, CheckCircle, X } from 'lucide-react';

const AdminInventoryPage = () => {
  const { addToast } = useToast();
  const [inventoryList, setInventoryList] = useState([]);
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);

  const fetchInventory = useCallback(async () => {
    try {
      let data = [];
      if (onlyLowStock) {
        data = await adminService.getLowStockInventory(5);
      } else {
        data = await adminService.getInventory();
      }
      setInventoryList(data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  }, [onlyLowStock]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleOpenStockModal = (item) => {
    setEditingItem(item);
    setNewQuantity(item.availableQuantity || 0);
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await adminService.updateInventoryStock(editingItem.product?.id, parseInt(newQuantity, 10));
      addToast('Inventory stock updated', 'success');
      setEditingItem(null);
      fetchInventory();
    } catch (err) {
      addToast('Failed to update inventory stock', 'error');
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Inventory Management</h1>
            <p className="text-sm text-slate-400">Monitor available stock levels and active order reservations</p>
          </div>

          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              onlyLowStock
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'glass-card text-slate-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {onlyLowStock ? 'Showing Low Stock Only' : 'Filter Low Stock (< 5)'}
          </button>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Available Qty</th>
                  <th className="py-3 px-4">Reserved Qty</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {inventoryList.map((item) => {
                  const isLow = (item.availableQuantity || 0) <= 5;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400">
                          <Boxes className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white">{item.product?.name || 'Inventory Item'}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-base text-white">
                        {item.availableQuantity || 0}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                        {item.reservedQuantity || 0}
                      </td>
                      <td className="py-3 px-4">
                        {isLow ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                            <CheckCircle className="w-3 h-3" /> In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenStockModal(item)}
                          className="p-1.5 rounded-lg glass-card text-indigo-400 hover:text-white inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" /> Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Adjust Stock ({editingItem.product?.name})</h3>
                <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStock} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Available Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-semibold text-xs shadow-lg mt-2">
                  Update Stock Quantity
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminInventoryPage;
