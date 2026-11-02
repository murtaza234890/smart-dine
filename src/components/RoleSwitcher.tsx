'use client';

import React from 'react';
import { useDine } from '../context/DineContext';
import { UserRole } from '../types/dining';
import { Icons } from './icons';

export function RoleSwitcher() {
  const { 
    role, 
    setRole, 
    orders, 
    cart, 
    serviceRequests, 
    audioEnabled, 
    setAudioEnabled 
  } = useDine();

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const kitchenCookingCount = orders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING').length;
  const unresolvedRequestsCount = serviceRequests.filter(r => !r.resolved).length;
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const roles: { id: UserRole; title: string; subtitle: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'customer',
      title: 'Customer View',
      subtitle: 'Mobile QR Dining',
      icon: <Icons.Smartphone size={16} />,
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      id: 'waiter',
      title: 'Waiter / POS',
      subtitle: 'Floor & Orders',
      icon: <Icons.Utensils size={16} />,
      badge: (pendingOrdersCount + unresolvedRequestsCount) > 0 
        ? (pendingOrdersCount + unresolvedRequestsCount) 
        : undefined,
    },
    {
      id: 'kitchen',
      title: 'Kitchen Display',
      subtitle: 'Live KDS Routing',
      icon: <Icons.ChefHat size={16} />,
      badge: kitchenCookingCount > 0 ? kitchenCookingCount : undefined,
    },
    {
      id: 'admin',
      title: 'Owner & Admin',
      subtitle: 'Analytics & Standees',
      icon: <Icons.TrendingUp size={16} />,
    },
    {
      id: 'super_admin',
      title: 'SaaS Super-Admin',
      subtitle: 'Tenants & MRR',
      icon: <Icons.ShieldCheck size={16} />,
    },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-[#070a10]/90 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand identity tag */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-orange-500/30">
            SD
          </div>
          <span className="font-extrabold text-sm text-white tracking-tight hidden sm:inline">
            SmartDine <span className="text-[10px] text-orange-400 font-semibold px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">SaaS OS</span>
          </span>
        </div>

        {/* Central Role Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/10 overflow-x-auto no-scrollbar">
          {roles.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`relative px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{r.icon}</span>
                <span className="text-left">
                  <span className="block leading-none">{r.title}</span>
                </span>

                {/* Notification Badge */}
                {r.badge !== undefined && r.badge > 0 && (
                  <span className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-black text-orange-400' : 'bg-orange-500 text-white animate-pulse'
                  }`}>
                    {r.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right audio and settings toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              audioEnabled
                ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                : 'bg-white/[0.04] border-white/10 text-slate-500'
            }`}
            title={audioEnabled ? 'Sound alerts active' : 'Sound alerts muted'}
          >
            <Icons.Volume2 size={15} />
            <span className="text-[11px] hidden sm:inline">{audioEnabled ? 'Sound ON' : 'Muted'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
