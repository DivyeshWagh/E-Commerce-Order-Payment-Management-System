import React, { useEffect, useState, useCallback } from 'react';
import { addressService } from '../../services/addressService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MapPin, Plus, Trash2, Edit2, Home, X } from 'lucide-react';

const AddressesPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'USA',
  });

  const fetchAddresses = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const data = await addressService.getUserAddresses(user.userId);
      setAddresses(data);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormData({ street: '', city: '', state: '', zipcode: '', country: 'USA' });
    setShowModal(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipcode: addr.zipcode || '',
      country: addr.country || 'USA',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, formData);
        addToast('Address updated successfully', 'success');
      } else {
        await addressService.addAddress(user.userId, formData);
        addToast('Address added successfully', 'success');
      }
      setShowModal(false);
      fetchAddresses();
    } catch (err) {
      addToast('Failed to save address', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await addressService.deleteAddress(id);
      addToast('Address deleted', 'info');
      fetchAddresses();
    } catch (err) {
      addToast('Failed to delete address', 'error');
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Delivery Addresses</h1>
          <p className="text-sm text-slate-400">Manage your shipping destinations</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="glass-card rounded-3xl p-6 h-44 animate-pulse bg-slate-900/40"></div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <MapPin className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Addresses Found</h3>
          <p className="text-xs text-slate-400">Add a delivery address to enable quick checkout.</p>
          <button onClick={handleOpenAddModal} className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold">
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 relative group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Shipping Destination</h3>
                    <span className="text-xs text-slate-400">{addr.city}, {addr.state}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(addr)}
                    className="p-2 rounded-lg glass-card text-slate-300 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 rounded-lg glass-card text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-300 space-y-1 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                <p className="font-medium text-white">{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.zipcode}</p>
                <p className="text-xs text-slate-400 uppercase font-semibold">{addr.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 space-y-6 relative animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="123 Market Street, Apt 4B"
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="NY"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zipcode}
                    onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                    placeholder="10001"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="USA"
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl gradient-btn font-semibold text-xs shadow-lg mt-4">
                Save Shipping Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;
