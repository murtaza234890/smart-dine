'use client';

import React, { useState, useEffect } from 'react';
import { useDine } from '../../context/DineContext';
import { KitchenStation } from '../../types/dining';
import { Icons } from '../icons';

export function KitchenDisplay() {
  const { 
    orders, 
    updateOrderStatus, 
    menuItems, 
    toggleItemAvailability, 
    activeStationFilter, 
    setActiveStationFilter 
  } = useDine();

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showStockManager, setShowStockManager] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter kitchen relevant orders (ACCEPTED or PREPARING)
  const kitchenOrders = orders.filter(
    o => o.status === 'ACCEPTED' || o.status === 'PREPARING'
  );

  const stations: { id: KitchenStation; label: string; icon: string }[] = [
    { id: 'all', label: 'All Kitchen Stations', icon: '👨‍🍳' },
    { id: 'grill', label: 'Flame Grill & BBQ', icon: '🥩' },
    { id: 'fryer', label: 'Deep Fryer Station', icon: '🍟' },
    { id: 'pizza', label: 'Woodfired Pizza', icon: '🍕' },
    { id: 'beverage', label: 'Drinks & Bar', icon: '🍹' },
    { id: 'dessert', label: 'Pastry & Dessert', icon: '🍰' },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] p-4 sm:p-6 text-slate-100 text-left">
      
      {/* KDS Header Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Icons.ChefHat size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                Kitchen Display System (KDS)
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse">
                Live Station Routing
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Station Queues, Cooking Timers & Item 86 Inventory Controls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowStockManager(!showStockManager)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showStockManager
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-white/[0.04] text-slate-300 hover:text-white border-white/10'
            }`}
          >
            <Icons.AlertTriangle size={15} />
            <span>Manage Sold Out (86) Items</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* Sold Out / Out of Stock Fast Toggle Bar */}
        {showStockManager && (
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-3 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Icons.AlertTriangle size={16} />
                Real-Time Menu Availability (Immediate 86 Toggling)
              </h3>
              <span className="text-xs text-slate-400">
                Click any dish to toggle between Available and Sold Out
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                    item.isAvailable
                      ? 'bg-slate-950/60 border-white/10 hover:border-white/20'
                      : 'bg-red-500/20 border-red-500/50 text-red-300'
                  }`}
                >
                  <span className="truncate pr-2 font-medium">{item.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    item.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500 text-white'
                  }`}>
                    {item.isAvailable ? 'In Stock' : '86 Sold Out'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Station Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {stations.map(st => {
            const isActive = activeStationFilter === st.id;
            const stationOrderCount = kitchenOrders.filter(ord => {
              if (st.id === 'all') return true;
              return ord.items.some(it => it.station === st.id);
            }).length;

            return (
              <button
                key={st.id}
                onClick={() => setActiveStationFilter(st.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : 'glass-panel text-slate-300 hover:text-white'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-orange-400'
                }`}>
                  {stationOrderCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Ticket Cards Grid */}
        {kitchenOrders.length === 0 ? (
          <div className="p-16 rounded-3xl glass-panel text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500">
              <Icons.CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-300">Kitchen Display is Clear</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All active orders have been prepared and dispatched to the serving pass.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {kitchenOrders.map(order => {
              const relevantItems = activeStationFilter === 'all'
                ? order.items
                : order.items.filter(i => i.station === activeStationFilter);

              if (relevantItems.length === 0) return null;

              const acceptedTime = new Date(order.acceptedAt || order.placedAt).getTime();
              const elapsedMinutes = Math.floor((currentTime - acceptedTime) / 60000);
              const elapsedSeconds = Math.floor(((currentTime - acceptedTime) % 60000) / 1000);

              // Color code by urgency:
              // < 10 mins: Normal (green accent)
              // 10-18 mins: Warning (amber accent)
              // > 18 mins: Delayed (critical red glow)
              const isDelayed = elapsedMinutes >= order.estimatedPrepTimeMinutes;
              const isWarning = elapsedMinutes >= 10 && !isDelayed;

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl glass-panel-elevated overflow-hidden border-2 flex flex-col justify-between transition-all ${
                    isDelayed
                      ? 'border-red-500/80 shadow-2xl shadow-red-500/20'
                      : isWarning
                      ? 'border-amber-500/70 shadow-xl shadow-amber-500/15'
                      : 'border-white/10'
                  }`}
                >
                  
                  {/* Ticket Header */}
                  <div className={`p-4 flex items-center justify-between ${
                    isDelayed ? 'bg-red-500/20' : isWarning ? 'bg-amber-500/20' : 'bg-slate-900/80'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">{order.orderNumber}</span>
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-black/40 text-orange-400 border border-white/10">
                          Table {order.tableNumber}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {order.status === 'ACCEPTED' ? 'Pending Prep' : 'On Grill / Stove'}
                      </span>
                    </div>

                    {/* Timer Badge */}
                    <div className="text-right">
                      <div className={`text-base font-black font-mono tracking-tight ${
                        isDelayed ? 'text-red-400 animate-pulse' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {elapsedMinutes.toString().padStart(2, '0')}:{elapsedSeconds.toString().padStart(2, '0')}
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                        isDelayed ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {isDelayed ? 'DELAYED ALERT' : `Target: ${order.estimatedPrepTimeMinutes}m`}
                      </span>
                    </div>
                  </div>

                  {/* Ticket Items List */}
                  <div className="p-4 space-y-3 flex-1 text-xs">
                    {relevantItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-extrabold text-white">
                            <span className="text-orange-400 mr-1.5">{item.quantity}×</span>
                            {item.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                            {item.station}
                          </span>
                        </div>

                        {/* Emphasized Addons */}
                        {item.selectedAddons.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.selectedAddons.map((addon, aIdx) => (
                              <span
                                key={aIdx}
                                className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md"
                              >
                                ★ {addon.optionName}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Emphasized Chef Instruction Note */}
                        {item.specialInstructions && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-[11px] font-bold text-red-300">
                            🚨 Special Request: &ldquo;{item.specialInstructions}&rdquo;
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Overall Order Special Note */}
                    {order.specialInstructions && (
                      <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-[11px] text-orange-200">
                        <strong>Order Note:</strong> {order.specialInstructions}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 bg-slate-950/70 border-t border-white/5">
                    {order.status === 'ACCEPTED' ? (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                      >
                        <Icons.ChefHat size={16} />
                        <span>Start Cooking Dish</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'READY')}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25"
                      >
                        <Icons.CheckCircle2 size={16} />
                        <span>Mark Order as Ready & Notify Waiter</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
