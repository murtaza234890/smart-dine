'use client';

import React, { useState } from 'react';
import { useDine } from '../../context/DineContext';
import { Icons } from '../icons';
import { RESTAURANT_INFO } from '../../data/mockRestaurant';

export function AdminDashboard() {
  const { orders, tables, reviews, menuItems } = useDine();
  const [standeeTable, setStandeeTable] = useState('04');

  // Compute live statistics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'SERVED');
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const occupancyPercent = Math.round((occupiedTables / tables.length) * 100);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const peakHours = [
    { hour: '12 PM', orders: 8, height: '35%' },
    { hour: '1 PM', orders: 19, height: '75%' },
    { hour: '2 PM', orders: 24, height: '95%' },
    { hour: '3 PM', orders: 14, height: '55%' },
    { hour: '5 PM', orders: 6, height: '25%' },
    { hour: '7 PM', orders: 18, height: '70%' },
    { hour: '8 PM', orders: 28, height: '100%' },
    { hour: '9 PM', orders: 26, height: '92%' },
    { hour: '10 PM', orders: 20, height: '80%' },
    { hour: '11 PM', orders: 12, height: '48%' },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] p-4 sm:p-6 text-slate-100 text-left">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Icons.TrendingUp size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                Restaurant Executive Insights & SaaS Admin
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Multi-Tenant Portal
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {RESTAURANT_INFO.name} • {RESTAURANT_INFO.branch}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
            Currency: <strong className="text-white">PKR (Rs.)</strong>
          </span>
          <span className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
            FBR/PRA POS: <strong className="text-emerald-400">Integrated</strong>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl glass-panel space-y-2 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 block">Total Sales Revenue</span>
            <div className="text-2xl font-black text-white">Rs. {totalRevenue.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Icons.TrendingUp size={13} /> +24.8% vs last week
            </span>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 block">Total Orders</span>
            <div className="text-2xl font-black text-white">{orders.length}</div>
            <span className="text-[11px] text-slate-400">
              {completedOrders.length} Completed • {orders.length - completedOrders.length} In Progress
            </span>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 block">Average Dining Spend</span>
            <div className="text-2xl font-black text-orange-400">Rs. {avgOrderValue.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400">
              Per order average
            </span>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 block">Table Occupancy</span>
            <div className="text-2xl font-black text-white">{occupancyPercent}%</div>
            <span className="text-[11px] text-amber-400">
              {occupiedTables} of {tables.length} tables currently active
            </span>
          </div>
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Peak Dining Hours Bar Graph */}
          <div className="lg:col-span-2 p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Peak Dining Hours Traffic</h3>
                <p className="text-xs text-slate-400">Hourly table order volume</p>
              </div>
              <span className="text-xs text-orange-400 font-bold bg-orange-500/10 px-2.5 py-1 rounded-xl border border-orange-500/20">
                Busiest: 8:00 PM – 9:30 PM
              </span>
            </div>

            <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-white/10">
              {peakHours.map((ph, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {ph.orders}
                  </span>
                  <div
                    className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-orange-600/60 to-amber-400 group-hover:from-orange-500 group-hover:to-amber-300 transition-all shadow-md"
                    style={{ height: ph.height }}
                  />
                  <span className="text-[10px] text-slate-400 font-medium">{ph.hour}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>⚡ Fast kitchen dispatch during peak times prevents table backlogs.</span>
              <span>Live Hourly Tracking</span>
            </div>
          </div>

          {/* Customer Ratings Summary */}
          <div className="p-6 rounded-3xl glass-panel space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Google & Guest Reviews</h3>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Icons.Star size={14} fill="currentColor" /> 4.9 / 5.0
                </span>
              </div>

              <div className="space-y-3">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Table {rev.tableNumber}</span>
                      <div className="flex gap-0.5 text-amber-400">
                        {Array.from({ length: rev.overallRating }).map((_, i) => (
                          <Icons.Star key={i} size={12} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                    <span className="text-[10px] text-slate-500 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 space-y-1">
              <strong className="text-blue-300 block">Google Review Sync Active</strong>
              <p className="text-[11px] text-slate-400">Customers with 5-star feedback are seamlessly prompted to post on Google Maps.</p>
            </div>
          </div>

        </div>

        {/* Printable Acrylic QR Standee Generator */}
        <div className="p-6 rounded-3xl glass-panel space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Icons.QrCode size={20} className="text-orange-400" />
                Physical Acrylic Table Standee Generator
              </h3>
              <p className="text-xs text-slate-400">
                Generate high-resolution printable table stands with Dual QR codes (Wi-Fi + Digital Menu).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-300">Select Table:</label>
              <select
                value={standeeTable}
                onChange={(e) => setStandeeTable(e.target.value)}
                className="bg-slate-900 border border-white/10 text-white font-bold text-xs px-3 py-2 rounded-xl focus:outline-none"
              >
                {tables.map(t => (
                  <option key={t.id} value={t.number}>Table {t.number}</option>
                ))}
              </select>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Icons.Printer size={15} />
                <span>Print Standee Card</span>
              </button>
            </div>
          </div>

          {/* Standee Preview Card (Authentic Wooden/Acrylic Stand Simulation) */}
          <div className="max-w-sm mx-auto p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-500/40 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Icons.ChefHat size={24} />
            </div>

            <div>
              <h4 className="text-lg font-black uppercase tracking-wider text-white">
                {RESTAURANT_INFO.name}
              </h4>
              <p className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">
                Table {standeeTable}
              </p>
            </div>

            {/* Dual QR Block */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* QR 1: Wi-Fi */}
              <div className="p-3 rounded-2xl bg-white text-slate-950 space-y-2 flex flex-col items-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-orange-600">
                  1. Free Wi-Fi
                </span>
                <div className="w-24 h-24 border border-slate-300 rounded-lg p-1 flex items-center justify-center">
                  <Icons.QrCode size={80} className="text-slate-900" />
                </div>
                <span className="text-[8px] font-bold text-slate-600">
                  Scan to Connect
                </span>
              </div>

              {/* QR 2: Digital Menu */}
              <div className="p-3 rounded-2xl bg-white text-slate-950 space-y-2 flex flex-col items-center">
                <span className="text-[9px] font-black uppercase tracking-wider text-orange-600">
                  2. Digital Menu
                </span>
                <div className="w-24 h-24 border border-slate-300 rounded-lg p-1 flex items-center justify-center">
                  <Icons.QrCode size={80} className="text-slate-900" />
                </div>
                <span className="text-[8px] font-bold text-slate-600">
                  Order & Track Live
                </span>
              </div>

            </div>

            <div className="pt-2 text-[10px] text-slate-400 border-t border-white/10 space-y-0.5">
              <p className="font-semibold text-slate-300">Point mobile camera to order directly</p>
              <p className="font-urdu text-amber-300/80">موبائل کیمرے سے اسکین کریں اور آرڈر کریں</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
