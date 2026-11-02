'use client';

import React, { useState } from 'react';
import { useDine } from '../../context/DineContext';
import { Icons } from '../icons';
import { PaymentMethod } from '../../types/dining';
import { RESTAURANT_INFO } from '../../data/mockRestaurant';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity, placeOrder, selectedTable } = useDine();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_AT_TABLE');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [splitCount, setSplitCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const taxAmount = Math.round(subtotal * (RESTAURANT_INFO.taxRatePercent / 100));
  const serviceCharges = Math.round(subtotal * (RESTAURANT_INFO.serviceChargePercent / 100));
  const totalAmount = subtotal + taxAmount + serviceCharges;
  const perPersonShare = Math.round(totalAmount / splitCount);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder(paymentMethod, specialInstructions.trim() || undefined, splitCount);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-fade-in flex justify-end">
      <div className="w-full max-w-md h-full bg-[#111824] border-l border-white/10 flex flex-col shadow-2xl text-left">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Icons.ShoppingCart size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Your Dining Cart</h3>
              <p className="text-[11px] text-orange-400 font-medium">Table {selectedTable} • {cart.length} item(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Content Area */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 mb-4">
              <Icons.Utensils size={36} />
            </div>
            <h4 className="text-base font-bold text-slate-200 mb-1">Your cart is empty</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Browse our chef-crafted menu and add your favorite dishes to begin.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-semibold border border-orange-500/30 transition-colors"
            >
              Explore Digital Menu
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Items List */}
            <div className="space-y-2.5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <span className="text-[11px] font-semibold text-orange-400">
                        Rs. {item.itemTotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/5">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
                      >
                        <Icons.Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
                      >
                        <Icons.Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Addons selected */}
                  {item.selectedAddons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5">
                      {item.selectedAddons.map((addon, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white/[0.05] text-slate-300 px-2 py-0.5 rounded-md border border-white/5"
                        >
                          +{addon.optionName} ({addon.priceDelta > 0 ? `Rs. ${addon.priceDelta}` : 'Free'})
                        </span>
                      ))}
                    </div>
                  )}

                  {item.specialInstructions && (
                    <p className="text-[10px] text-amber-300/90 italic bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                      Note: &ldquo;{item.specialInstructions}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Split Bill Calculator Tool */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icons.Users size={16} className="text-orange-400" />
                  <span className="text-xs font-bold text-white">Split Bill with Friends</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSplitCount(count)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        splitCount === count
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                          : 'bg-black/30 text-slate-400 hover:text-white'
                      }`}
                    >
                      {count}x
                    </button>
                  ))}
                </div>
              </div>
              {splitCount > 1 && (
                <div className="text-[11px] text-amber-300 flex items-center justify-between pt-1 border-t border-orange-500/10">
                  <span>Each person pays:</span>
                  <span className="font-bold text-sm text-white">Rs. {perPersonShare.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Order Note */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Special Kitchen Note
              </label>
              <input
                type="text"
                placeholder="All items served together, extra napkins..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Preferred Payment Method
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH_AT_TABLE')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                    paymentMethod === 'CASH_AT_TABLE'
                      ? 'bg-orange-500/20 border-orange-500/60 text-white'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/10'
                  }`}
                >
                  <span className="font-bold">Cash at Table</span>
                  <span className="text-[10px] text-slate-400">Pay waiter upon serve</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH_AT_COUNTER')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                    paymentMethod === 'CASH_AT_COUNTER'
                      ? 'bg-orange-500/20 border-orange-500/60 text-white'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/10'
                  }`}
                >
                  <span className="font-bold">Cash at Counter</span>
                  <span className="text-[10px] text-slate-400">Pay at cashier counter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('JAZZCASH')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                    paymentMethod === 'JAZZCASH'
                      ? 'bg-red-500/20 border-red-500/60 text-white'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/10'
                  }`}
                >
                  <span className="font-bold text-red-400">JazzCash</span>
                  <span className="text-[10px] text-slate-400">Instant Mobile Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('EASYPAISA')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                    paymentMethod === 'EASYPAISA'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-white'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/10'
                  }`}
                >
                  <span className="font-bold text-emerald-400">Easypaisa</span>
                  <span className="text-[10px] text-slate-400">Direct Till / QR</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPaymentMethod('BANK_CARD')}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  paymentMethod === 'BANK_CARD'
                    ? 'bg-blue-500/20 border-blue-500/60 text-white'
                    : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/10'
                }`}
              >
                <div>
                  <span className="font-bold block">Debit / Credit Card</span>
                  <span className="text-[10px] text-slate-400">Visa, Mastercard, PayPak, UnionPay</span>
                </div>
                <Icons.ShieldCheck size={16} className="text-blue-400" />
              </button>
            </div>

            {/* Bill Summary */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Govt. Tax (PRA 16%)</span>
                <span>Rs. {taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Service Charges (4%)</span>
                <span>Rs. {serviceCharges.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-white font-extrabold text-sm">
                <span>Total Payable</span>
                <span className="text-orange-400">Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>

          </div>
        )}

        {/* Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-950 border-t border-white/10">
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-between transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Routing to Kitchen...' : 'Confirm & Place Order'}</span>
              <span className="flex items-center gap-1.5">
                Rs. {totalAmount.toLocaleString()}
                <Icons.ArrowRight size={16} />
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
