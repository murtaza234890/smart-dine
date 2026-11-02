'use client';

import React, { useState } from 'react';
import { Icons } from '../icons';

interface TenantRestaurant {
  id: string;
  name: string;
  slug: string;
  city: string;
  ownerName: string;
  phone: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  monthlyFee: number;
  tablesCount: number;
  branchesCount: number;
  status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE';
  fbrStatus: 'CONNECTED' | 'NOT_REQUIRED';
  joinedDate: string;
}

const INITIAL_TENANTS: TenantRestaurant[] = [
  {
    id: 't-1',
    name: 'Haveli & Co. Artisan Grill',
    slug: 'haveli',
    city: 'Lahore (Gulberg & DHA)',
    ownerName: 'Mian Tariq',
    phone: '0300-8451920',
    plan: 'Enterprise',
    monthlyFee: 9999,
    tablesCount: 24,
    branchesCount: 2,
    status: 'ACTIVE',
    fbrStatus: 'CONNECTED',
    joinedDate: 'Jan 2026',
  },
  {
    id: 't-2',
    name: 'SmashBros Bistro',
    slug: 'smashbros',
    city: 'Islamabad (F-7 Markaz)',
    ownerName: 'Zainab Qureshi',
    phone: '0321-5544332',
    plan: 'Professional',
    monthlyFee: 5999,
    tablesCount: 16,
    branchesCount: 1,
    status: 'ACTIVE',
    fbrStatus: 'CONNECTED',
    joinedDate: 'Feb 2026',
  },
  {
    id: 't-3',
    name: 'Chai Kafi Express & Bites',
    slug: 'chaikafi',
    city: 'Karachi (Clifton Block 4)',
    ownerName: 'Bilal Siddiqui',
    phone: '0333-2198765',
    plan: 'Starter',
    monthlyFee: 2999,
    tablesCount: 8,
    branchesCount: 1,
    status: 'ACTIVE',
    fbrStatus: 'NOT_REQUIRED',
    joinedDate: 'Mar 2026',
  },
  {
    id: 't-4',
    name: 'Shinwari Flame Dumba House',
    slug: 'shinwari',
    city: 'Rawalpindi (Saddar)',
    ownerName: 'Haji Gulzar',
    phone: '0345-9871234',
    plan: 'Professional',
    monthlyFee: 5999,
    tablesCount: 20,
    branchesCount: 1,
    status: 'TRIAL',
    fbrStatus: 'CONNECTED',
    joinedDate: '2 Days ago',
  },
];

export function SuperAdminPortal() {
  const [tenants, setTenants] = useState<TenantRestaurant[]>(INITIAL_TENANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestSlug, setNewRestSlug] = useState('');
  const [newRestCity, setNewRestCity] = useState('Lahore');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newPlan, setNewPlan] = useState<'Starter' | 'Professional' | 'Enterprise'>('Professional');

  const totalMRR = tenants
    .filter(t => t.status === 'ACTIVE')
    .reduce((sum, t) => sum + t.monthlyFee, 0);

  const filteredTenants = tenants.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q) ||
      t.ownerName.toLowerCase().includes(q)
    );
  });

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const fees = { Starter: 2999, Professional: 5999, Enterprise: 9999 };
    const newTenant: TenantRestaurant = {
      id: `t-${Date.now()}`,
      name: newRestName.trim(),
      slug: (newRestSlug.trim() || newRestName.toLowerCase().replace(/\s+/g, '-')).toLowerCase(),
      city: newRestCity,
      ownerName: 'Restaurant Owner',
      phone: newOwnerPhone.trim() || '0300-XXXXXXX',
      plan: newPlan,
      monthlyFee: fees[newPlan],
      tablesCount: newPlan === 'Enterprise' ? 24 : newPlan === 'Professional' ? 16 : 8,
      branchesCount: 1,
      status: 'TRIAL',
      fbrStatus: 'CONNECTED',
      joinedDate: 'Just now',
    };

    setTenants([newTenant, ...tenants]);
    setShowAddModal(false);
    setNewRestName('');
    setNewRestSlug('');
    setNewOwnerPhone('');
  };

  return (
    <div className="min-h-screen bg-[#060910] p-4 sm:p-6 text-slate-100 text-left font-sans">
      
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
            <Icons.ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                SmartDine SaaS Global Super-Admin
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Master Platform Control
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-Tenant Subscriptions, Pakistan Market Expansion & Partner Management
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/25 transition-transform active:scale-95"
        >
          <Icons.Plus size={16} />
          <span>Onboard New Restaurant Partner</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* SaaS Global KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl glass-panel space-y-2 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 block">Total SaaS MRR</span>
            <div className="text-2xl font-black text-emerald-400">Rs. {totalMRR.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400">Monthly Recurring Revenue</span>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 block">Active Restaurant Partners</span>
            <div className="text-2xl font-black text-white">{tenants.length}</div>
            <span className="text-[11px] text-purple-400">
              {tenants.filter(t => t.status === 'ACTIVE').length} Active Subscriptions
            </span>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 block">Digital Dining Tables</span>
            <div className="text-2xl font-black text-orange-400">
              {tenants.reduce((s, t) => s + t.tablesCount, 0)} Tables
            </div>
            <span className="text-[11px] text-slate-400">Live QR Standees deployed</span>
          </div>

          <div className="p-5 rounded-3xl glass-panel space-y-2 border border-white/5">
            <span className="text-xs font-semibold text-slate-400 block">Avg. Subscription Value</span>
            <div className="text-2xl font-black text-white">
              Rs. {Math.round(totalMRR / Math.max(1, tenants.length)).toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Per restaurant monthly</span>
          </div>
        </div>

        {/* Pricing & Plan Tiers Matrix */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Commercial SaaS Subscription Tiers (PKR)</h3>
              <p className="text-xs text-slate-400">Configured monthly recurring pricing plans for Pakistan restaurants</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
              14-Day Free Trial Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Starter Plan */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Starter</span>
                <span className="text-xs font-black text-white">Rs. 2,999 / mo</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
                <li>✓ Contactless Table QR Menu</li>
                <li>✓ Basic Waiter & Floor POS</li>
                <li>✓ Up to 10 Tables</li>
                <li className="text-slate-500">✗ Kitchen Display System (KDS)</li>
                <li className="text-slate-500">✗ Automated KOT Thermal Printing</li>
              </ul>
            </div>

            {/* Professional Plan */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-orange-500/15 to-transparent border-2 border-orange-500/50 space-y-3 shadow-xl shadow-orange-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400">Professional</span>
                  <span className="text-[9px] font-bold bg-orange-500 text-slate-950 px-1.5 py-0.5 rounded">POPULAR</span>
                </div>
                <span className="text-sm font-black text-white">Rs. 5,999 / mo</span>
              </div>
              <ul className="text-xs text-slate-200 space-y-1.5 pt-2 border-t border-white/5">
                <li>✓ Everything in Starter</li>
                <li>✓ Kitchen Display System (KDS)</li>
                <li>✓ Automatic KOT Thermal Printing (80mm/58mm)</li>
                <li>✓ Smart ETA Live Order Tracking</li>
                <li>✓ JazzCash & Easypaisa Integration</li>
                <li>✓ Up to 30 Tables</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">Enterprise</span>
                <span className="text-xs font-black text-white">Rs. 9,999+ / mo</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-white/5">
                <li>✓ Everything in Professional</li>
                <li>✓ Multi-Branch Chain Management</li>
                <li>✓ FBR Tier-1 POS Integration</li>
                <li>✓ Google Maps 5-Star Review Automator</li>
                <li>✓ Unlimited Tables & Waiter Accounts</li>
                <li>✓ Priority SLA Hardware Support</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Tenants Directory Table */}
        <div className="p-6 rounded-3xl glass-panel space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icons.Users size={16} className="text-orange-400" />
                Subscribed Restaurant Tenants Directory ({tenants.length})
              </h3>
              <p className="text-xs text-slate-400">Independent multi-tenant database partitions & brand instances</p>
            </div>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search restaurant or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Icons.Search size={14} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Restaurant Brand</th>
                  <th className="pb-3">Location & Branches</th>
                  <th className="pb-3">Active Plan</th>
                  <th className="pb-3">Monthly Billing</th>
                  <th className="pb-3">FBR Status</th>
                  <th className="pb-3">Subscription</th>
                  <th className="pb-3 text-right">Quick Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-extrabold text-white text-sm">{tenant.name}</div>
                      <span className="text-[11px] font-mono text-orange-400/90">
                        smartdine.app/r/{tenant.slug}
                      </span>
                    </td>

                    <td className="py-3.5 pr-3">
                      <div className="text-slate-300 font-medium">{tenant.city}</div>
                      <span className="text-[10px] text-slate-500">{tenant.branchesCount} Branch • {tenant.tablesCount} Tables</span>
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                        tenant.plan === 'Enterprise'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : tenant.plan === 'Professional'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {tenant.plan}
                      </span>
                    </td>

                    <td className="py-3.5 pr-3 font-mono font-bold text-white">
                      Rs. {tenant.monthlyFee.toLocaleString()}
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        tenant.fbrStatus === 'CONNECTED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/5 text-slate-400'
                      }`}>
                        {tenant.fbrStatus}
                      </span>
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        tenant.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400 animate-pulse'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <a
                        href={`/r/${tenant.slug}?table=01`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Open QR Menu</span>
                        <Icons.ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Onboard New Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-md rounded-3xl glass-panel-elevated p-6 border border-white/10 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5"
            >
              <Icons.X size={18} />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Onboard New Restaurant</h3>
            <p className="text-xs text-slate-400 mb-5">Provision a new multi-tenant database instance and digital menu</p>

            <form onSubmit={handleAddRestaurant} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Spice Bistro"
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">URL Identifier (Slug)</label>
                  <input
                    type="text"
                    placeholder="royal-spice"
                    value={newRestSlug}
                    onChange={(e) => setNewRestSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">City / Region</label>
                  <select
                    value={newRestCity}
                    onChange={(e) => setNewRestCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Owner Contact Phone</label>
                <input
                  type="text"
                  placeholder="0300-1234567"
                  value={newOwnerPhone}
                  onChange={(e) => setNewOwnerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Subscription Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Starter', 'Professional', 'Enterprise'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPlan(p)}
                      className={`py-2 rounded-xl text-center font-bold transition-all border ${
                        newPlan === p
                          ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all"
              >
                Create Restaurant Instance & Start 14-Day Trial
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
