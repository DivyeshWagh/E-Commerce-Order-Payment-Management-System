import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { useToast } from '../../context/ToastContext';
import { CreditCard, Wallet, Smartphone, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Process payment creation via POST /api/payments/initiate?orderId=&method=
      const payment = await paymentService.initiatePayment(orderId, paymentMethod);
      
      // 2. Complete payment status to SUCCESS (triggers stock confirmation & order status CONFIRMED)
      await paymentService.updatePaymentStatus(payment.id, 'SUCCESS');

      addToast('Payment successful! Your order has been confirmed.', 'success');
      navigate(`/orders/${orderId}`);
    } catch (err) {
      console.error('Payment error:', err);
      const msg = err.response?.data?.message || 'Payment simulation failed';
      addToast(msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8 max-w-lg mx-auto">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 w-full shadow-2xl relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl gradient-btn flex items-center justify-center mx-auto mb-2 shadow-xl">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Payment Checkout</h1>
          <p className="text-xs text-slate-400">Order ID: #{orderId}</p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase">Select Payment Method</label>

          <div
            onClick={() => setPaymentMethod('CREDIT_CARD')}
            className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
              paymentMethod === 'CREDIT_CARD'
                ? 'bg-indigo-500/10 border-indigo-500/60 ring-2 ring-indigo-500/30'
                : 'glass-card border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <div>
                <h4 className="font-bold text-white text-sm">Credit / Debit Card</h4>
                <p className="text-xs text-slate-400">Visa, Mastercard, Amex</p>
              </div>
            </div>
            {paymentMethod === 'CREDIT_CARD' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
          </div>

          <div
            onClick={() => setPaymentMethod('PAYPAL')}
            className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
              paymentMethod === 'PAYPAL'
                ? 'bg-indigo-500/10 border-indigo-500/60 ring-2 ring-indigo-500/30'
                : 'glass-card border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-bold text-white text-sm">PayPal Wallet</h4>
                <p className="text-xs text-slate-400">Fast 1-Click Checkout</p>
              </div>
            </div>
            {paymentMethod === 'PAYPAL' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
          </div>

          <div
            onClick={() => setPaymentMethod('UPI')}
            className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
              paymentMethod === 'UPI'
                ? 'bg-indigo-500/10 border-indigo-500/60 ring-2 ring-indigo-500/30'
                : 'glass-card border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-bold text-white text-sm">UPI / QR Payment</h4>
                <p className="text-xs text-slate-400">Instant App Payment</p>
              </div>
            </div>
            {paymentMethod === 'UPI' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
          </div>
        </div>

        <button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full py-4 rounded-2xl gradient-btn font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
          ) : (
            <>
              Confirm & Pay Now <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit Encrypted Simulated Payment Gateway
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
