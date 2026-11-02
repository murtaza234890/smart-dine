'use client';

import React, { useState } from 'react';
import { useDine } from '../context/DineContext';
import { Icons } from './icons';

export function DemoSimulationToolkit() {
  const { 
    placeOrder, 
    callStaff, 
    orders, 
    updateOrderStatus, 
    updatePaymentStatus,
    selectedTable, 
    setSelectedTable, 
    setRole 
  } = useDine();

  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSimulateNewOrder = () => {
    // Generate realistic order at Table 02
    const originalTable = selectedTable;
    setSelectedTable('02');
    
    // Simulate order placement
    const mockItems = [
      {
        id: `c-${Date.now()}-1`,
        menuItemId: 'item-2',
        name: 'Nashville Fiery Crispy Zinger',
        basePrice: 890,
        quantity: 2,
        selectedAddons: [
          { groupId: 'vg-spice', groupTitle: 'Heat Level', optionId: 'sp-hot', optionName: 'Nashville Hot', priceDelta: 0 },
          { groupId: 'vg-addon', groupTitle: 'Extras', optionId: 'ad-cheese', optionName: 'Cheese Slice', priceDelta: 90 },
        ],
        itemTotal: 1960,
        station: 'fryer' as const,
      },
      {
        id: `c-${Date.now()}-2`,
        menuItemId: 'item-5',
        name: 'Haveli Animal-Style Monster Fries',
        basePrice: 680,
        quantity: 1,
        selectedAddons: [],
        itemTotal: 680,
        station: 'fryer' as const,
      },
    ];

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableNumber: '02',
        items: mockItems,
        paymentMethod: 'JAZZCASH',
        specialInstructions: 'Extra ranch dip please',
        customerName: 'Ali Raza',
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.order) {
          // Trigger local place order to sync state
          showToast('🚀 New Order #1043 placed from Table 02! (Bell chime triggered)');
        }
      })
      .catch(() => {
        showToast('🚀 New Order placed from Table 02!');
      });

    setSelectedTable(originalTable);
  };

  const handleSimulateServiceCall = () => {
    callStaff('Water');
    showToast('💧 Table 04 requested Fresh Water!');
  };

  const handleSimulateKitchenReady = () => {
    const preparingOrder = orders.find(o => o.status === 'PREPARING');
    if (preparingOrder) {
      updateOrderStatus(preparingOrder.id, 'READY');
      showToast(`👨‍🍳 Kitchen marked Order ${preparingOrder.orderNumber} as READY!`);
    } else {
      const acceptedOrder = orders.find(o => o.status === 'ACCEPTED');
      if (acceptedOrder) {
        updateOrderStatus(acceptedOrder.id, 'PREPARING');
        showToast(`👨‍🍳 Kitchen started cooking Order ${acceptedOrder.orderNumber}!`);
      } else {
        showToast('ℹ️ No orders in kitchen queue to advance.');
      }
    }
  };

  const handleSimulateJazzCashPayment = () => {
    const unpaidOrder = orders.find(o => o.paymentStatus === 'UNPAID');
    if (unpaidOrder) {
      fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: 'JAZZCASH',
          amount: unpaidOrder.totalAmount,
          orderNumber: unpaidOrder.orderNumber,
          accountOrPhone: '0300-7654321',
        }),
      })
        .then(res => res.json())
        .then(data => {
          updatePaymentStatus(unpaidOrder.id, 'PAID');
          showToast(`✅ JazzCash Txn ${data.transactionReference} verified for Order ${unpaidOrder.orderNumber}!`);
        });
    } else {
      showToast('ℹ️ All active orders are already paid.');
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 p-3.5 rounded-2xl bg-orange-500 text-white font-bold text-xs shadow-2xl shadow-orange-500/40 border border-white/20 animate-slide-in">
          {toastMessage}
        </div>
      )}

      {/* Floating Demo Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-black text-xs shadow-2xl shadow-orange-500/40 flex items-center gap-2 border border-white/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Icons.Sparkles size={18} />
          <span className="hidden sm:inline">QA Demo Controls</span>
        </button>

        {/* Demo Controls Popover */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 rounded-3xl glass-panel-elevated p-4 border border-white/15 shadow-2xl space-y-3 animate-slide-up text-left">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Live SaaS Demo Toolkit</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <Icons.X size={15} />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Trigger real-time restaurant events with 1 click to test POS alerts, KDS station queues, and customer order tracking:
            </p>

            <div className="space-y-2">
              <button
                onClick={handleSimulateNewOrder}
                className="w-full py-2.5 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-bold text-xs border border-orange-500/40 flex items-center justify-between transition-colors"
              >
                <span>⚡ Simulate Incoming Order</span>
                <span className="text-[10px] text-orange-400 font-mono">T-02</span>
              </button>

              <button
                onClick={handleSimulateServiceCall}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center justify-between transition-colors"
              >
                <span>🔔 Simulate Water Request</span>
                <span className="text-[10px] text-amber-400 font-mono">T-04</span>
              </button>

              <button
                onClick={handleSimulateKitchenReady}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center justify-between transition-colors"
              >
                <span>👨‍🍳 Advance Kitchen Step (Cook/Ready)</span>
                <span className="text-[10px] text-emerald-400 font-mono">KDS</span>
              </button>

              <button
                onClick={handleSimulateJazzCashPayment}
                className="w-full py-2.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs border border-red-500/40 flex items-center justify-between transition-colors"
              >
                <span>💳 Simulate JazzCash Webhook Verify</span>
                <span className="text-[10px] text-red-400 font-mono">PKR</span>
              </button>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span>SmartDine SaaS v1.0</span>
              <span className="text-emerald-400 font-mono">● Online</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
