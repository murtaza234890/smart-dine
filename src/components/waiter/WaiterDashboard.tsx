'use client';

import React, { useState } from 'react';
import { useDine } from '../../context/DineContext';
import { Icons } from '../icons';
import { Order, OrderStatus, PaymentStatus } from '../../types/dining';
import { RESTAURANT_INFO } from '../../data/mockRestaurant';
import { ThermalKOTModal } from './ThermalKOTModal';

export function WaiterDashboard() {
  const { 
    orders, 
    updateOrderStatus, 
    updatePaymentStatus, 
    tables, 
    serviceRequests, 
    resolveStaffRequest, 
    setSelectedTable,
    setRole,
    playOrderBell
  } = useDine();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [thermalModalOrder, setThermalModalOrder] = useState<Order | null>(null);
  const [thermalModalType, setThermalModalType] = useState<'KOT' | 'BILL'>('KOT');

  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const unresolvedRequests = serviceRequests.filter(r => !r.resolved);

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return o.status !== 'COMPLETED' && o.status !== 'CANCELLED';
    return o.status === filterStatus;
  });

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'ACCEPTED');
  };

  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, 'CANCELLED');
  };

  const handleMarkServed = (orderId: string) => {
    updateOrderStatus(orderId, 'SERVED');
  };

  const handleCompleteDining = (orderId: string) => {
    updateOrderStatus(orderId, 'COMPLETED');
    updatePaymentStatus(orderId, 'PAID');
  };

  return (
    <div className="min-h-screen bg-[#090d14] p-4 sm:p-6 text-slate-100 text-left">
      
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Icons.Utensils size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">
                POS & Captain Service Station
              </h1>
              <p className="text-xs text-slate-400">
                Floor Management, Table Orders & Live Service Calls
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => playOrderBell()}
            className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <Icons.Volume2 size={15} className="text-orange-400" />
            <span>Test Bell Sound</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Urgent Service Call Banner (Water / Napkins / Call Waiter) */}
        {unresolvedRequests.length > 0 && (
          <div className="p-4 rounded-3xl bg-amber-500/15 border border-amber-500/30 animate-pulse flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                <Icons.Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {unresolvedRequests.length} Active Customer Service Call(s)
                </h3>
                <p className="text-xs text-amber-200/90">
                  {unresolvedRequests.map(r => `Table ${r.tableNumber}: ${r.type}`).join(' • ')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {unresolvedRequests.map(r => (
                <button
                  key={r.id}
                  onClick={() => resolveStaffRequest(r.id)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-colors shadow-sm"
                >
                  Resolve T-{r.tableNumber} ({r.type})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Incoming Orders Alert Cards */}
        {pendingOrders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping" />
                Incoming New Table Orders ({pendingOrders.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingOrders.map(order => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl glass-panel-elevated border-2 border-orange-500/60 shadow-xl shadow-orange-500/10 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 px-2.5 py-0.5 rounded-md border border-orange-500/30">
                        NEW ORDER {order.orderNumber}
                      </span>
                      <h3 className="text-lg font-black text-white mt-1">Table {order.tableNumber}</h3>
                      <p className="text-xs text-slate-400">
                        Payment: {order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total</span>
                      <span className="text-lg font-black text-white">Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                    {order.items.map(it => (
                      <div key={it.id} className="flex justify-between text-slate-200">
                        <span>
                          {it.quantity}× <strong className="text-white">{it.name}</strong>
                          {it.selectedAddons.length > 0 && (
                            <span className="text-[10px] text-slate-400 block ml-4">
                              {it.selectedAddons.map(a => a.optionName).join(', ')}
                            </span>
                          )}
                        </span>
                        <span className="text-slate-400">Rs. {it.itemTotal.toLocaleString()}</span>
                      </div>
                    ))}

                    {order.specialInstructions && (
                      <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 italic">
                        Chef Note: &ldquo;{order.specialInstructions}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button
                      onClick={() => handleReject(order.id)}
                      className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 font-bold text-xs border border-red-500/30 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(order.id)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Icons.CheckCircle2 size={16} />
                      <span>Accept & Route to Kitchen</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Occupancy Heatmap Floor Grid */}
        <div className="p-5 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Icons.Users size={16} className="text-orange-400" />
              Live Table Floor Layout
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Free
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Dining / Occupied
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {tables.map(table => {
              const tableOrder = orders.find(o => o.id === table.activeOrderId);
              const isOccupied = table.status === 'occupied';

              return (
                <div
                  key={table.id}
                  onClick={() => {
                    setSelectedTable(table.number);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28 ${
                    isOccupied
                      ? 'bg-orange-500/10 border-orange-500/40 hover:bg-orange-500/20'
                      : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">T-{table.number}</span>
                    <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-orange-400' : 'bg-emerald-400'}`} />
                  </div>

                  <div>
                    <span className="text-base font-black text-white block">
                      {isOccupied ? `Order ${tableOrder?.orderNumber || 'Active'}` : 'Available'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {table.capacity} Seats {isOccupied && tableOrder ? `• ${tableOrder.status}` : ''}
                    </span>
                  </div>

                  <div className="text-[9px] text-orange-400/80 font-mono">
                    {isOccupied ? `Rs. ${tableOrder?.totalAmount.toLocaleString()}` : 'Ready for Guest'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Floor Orders Table */}
        <div className="p-5 rounded-3xl glass-panel space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Icons.Clock size={16} className="text-orange-400" />
              Active Dining Orders Queue
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/5 text-xs">
              {['all', 'PREPARING', 'READY', 'SERVED'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterStatus === st
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Active' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-white">{order.orderNumber}</span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      Table {order.tableNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'READY'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                        : order.status === 'PREPARING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : order.status === 'SERVED'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(' • ')}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Payment: <strong className="text-slate-300">{order.paymentMethod.replace(/_/g, ' ')}</strong> ({order.paymentStatus}) • Total: <strong className="text-white">Rs. {order.totalAmount.toLocaleString()}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setThermalModalOrder(order);
                      setThermalModalType('KOT');
                    }}
                    className="p-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Icons.Printer size={15} />
                    <span>Print KOT</span>
                  </button>

                  <button
                    onClick={() => {
                      setThermalModalOrder(order);
                      setThermalModalType('BILL');
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Icons.Printer size={15} />
                    <span>Print Bill</span>
                  </button>

                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleMarkServed(order.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
                    >
                      <Icons.CheckCircle2 size={15} />
                      <span>Mark as Served</span>
                    </button>
                  )}

                  {order.status === 'SERVED' && (
                    <button
                      onClick={() => handleCompleteDining(order.id)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Icons.ShieldCheck size={15} />
                      <span>Settle & Free Table</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Advanced Thermal Printer KOT & Guest Receipt Hardware Modal */}
      <ThermalKOTModal
        order={thermalModalOrder}
        isOpen={!!thermalModalOrder}
        onClose={() => setThermalModalOrder(null)}
        defaultType={thermalModalType}
      />

    </div>
  );
}
