import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressService } from '../../services/addressService';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { MapPin, ArrowRight, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, cartTotal, clearCartState } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Address inline state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'USA'
  });

  useEffect(() => {
    if (!user?.userId) return;
    addressService
      .getUserAddresses(user.userId)
      .then((data) => {
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.userId]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const created = await addressService.addAddress(user.userId, newAddr);
      setAddresses([...addresses, created]);
      setSelectedAddress(created);
      setShowAddForm(false);
      addToast('Address added!', 'success');
    } catch (err) {
      addToast('Failed to add address', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      addToast('Please select or add a shipping address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdOrder = await orderService.checkout(user.userId, selectedAddress);
      clearCartState();
      addToast('Order placed successfully! Proceeding to payment...', 'success');
      navigate(`/payment/${createdOrder.id}`);
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || 'Failed to place order (check stock levels)';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tax = cartTotal * 0.1;
  const shipping = cartTotal > 100 ? 0 : 15;
  const grandTotal = cartTotal + tax + shipping;

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Order Checkout</h1>
        <p className="text-sm text-slate-400">Review address and items before completing order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Address Picker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" /> Select Shipping Address
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddNewAddress} className="glass-card p-4 rounded-2xl space-y-3 my-3">
                <input
                  type="text"
                  placeholder="Street Address"
                  required
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Zip Code"
                    required
                    value={newAddr.zipcode}
                    onChange={(e) => setNewAddr({ ...newAddr, zipcode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    required
                    value={newAddr.country}
                    onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
                <button type="submit" className="w-full py-2 rounded-xl gradient-btn text-xs font-semibold">
                  Save Address
                </button>
              </form>
            )}

            {loading ? (
              <div className="h-20 animate-pulse bg-slate-900/40 rounded-xl"></div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No delivery address found. Please add one above.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddress?.id === addr.id
                        ? 'bg-indigo-500/10 border-indigo-500/60 ring-2 ring-indigo-500/30'
                        : 'glass-card border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-xs">Destination</span>
                      {selectedAddress?.id === addr.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{addr.street}</p>
                    <p className="text-xs text-slate-400">{addr.city}, {addr.state} {addr.zipcode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Items Preview */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">Review Items</h3>
            <div className="divide-y divide-slate-800">
              {cart?.items ? [...cart.items].map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                      {item.quantity}x
                    </span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{item.product?.name}</span>
                  </div>
                  <span className="font-bold text-indigo-300">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              )) : null}
            </div>
          </div>
        </div>

        {/* Order Summary & Confirm */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 h-fit">
          <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3">Final Breakdown</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold text-white">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax (10%)</span>
              <span className="font-semibold text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping</span>
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
            onClick={handlePlaceOrder}
            disabled={isSubmitting || !selectedAddress}
            className="w-full py-4 rounded-2xl gradient-btn font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                Place Order & Pay <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Stock reserved upon placement
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
