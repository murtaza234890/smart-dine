'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useDine } from '../../context/DineContext';
import { CATEGORIES, RESTAURANT_INFO } from '../../data/mockRestaurant';
import { MenuItem } from '../../types/dining';
import { Icons } from '../icons';
import { WifiModal } from './WifiModal';
import { ItemCustomizationModal } from './ItemCustomizationModal';
import { CartDrawer } from './CartDrawer';
import { LiveOrderTracker } from './LiveOrderTracker';
import { FeedbackModal } from './FeedbackModal';

export function CustomerView() {
  const { 
    menuItems, 
    cart, 
    addToCart, 
    selectedTable, 
    setSelectedTable, 
    tables, 
    activeOrder, 
    callStaff,
    showWifiModal,
    setShowWifiModal,
  } = useDine();

  const [activeCategory, setActiveCategory] = useState<string>('cat-burgers');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilterOnly, setVegFilterOnly] = useState(false);
  const [selectedItemForCustom, setSelectedItemForCustom] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [callStaffNotification, setCallStaffNotification] = useState<string | null>(null);

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    if (!item.isAvailable) return false;
    if (vegFilterOnly && !item.isVeg) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchUrdu = item.nameUrdu.includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchUrdu && !matchDesc) return false;
    } else {
      if (item.categoryId !== activeCategory) return false;
    }
    return true;
  });

  const cartTotalCount = cart.reduce((sum, it) => sum + it.quantity, 0);
  const cartSubtotal = cart.reduce((sum, it) => sum + it.itemTotal, 0);

  const handleCallStaff = () => {
    callStaff('Call Waiter');
    setCallStaffNotification('🔔 Waiter has been notified to attend Table ' + selectedTable);
    setTimeout(() => setCallStaffNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0c1017] pb-32 text-slate-100">
      
      {/* Top Banner / Restaurant Info */}
      <header className="relative w-full overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-900/90 to-[#0c1017]">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-orange-500/15 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/20">
                <div className="w-full h-full bg-[#111824] rounded-[14px] flex items-center justify-center text-orange-400">
                  <Icons.ChefHat size={24} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    {RESTAURANT_INFO.name}
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Open Now
                  </span>
                </div>
                <p className="text-xs text-slate-400">{RESTAURANT_INFO.tagline} • {RESTAURANT_INFO.branch}</p>
              </div>
            </div>

            {/* Table Badge Selector */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="appearance-none bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-orange-300 font-extrabold text-xs px-3.5 py-2 rounded-xl cursor-pointer focus:outline-none transition-colors"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.number} className="bg-slate-900 text-white">
                      Table {t.number} ({t.capacity} Seats)
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-orange-400">
                  <Icons.QrCode size={12} />
                </div>
              </div>
            </div>

          </div>

          {/* Quick Action Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWifiModal(true)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                <Icons.Wifi size={14} className="text-orange-400" />
                <span>Wi-Fi Connect</span>
              </button>

              <button
                onClick={handleCallStaff}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                <Icons.Bell size={14} className="text-amber-400" />
                <span>Call Waiter</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Icons.Clock size={13} className="text-orange-400" />
                Avg. Prep: ~{RESTAURANT_INFO.averagePrepTimeMinutes} mins
              </span>
            </div>
          </div>

          {/* Floating alert if staff called */}
          {callStaffNotification && (
            <div className="mt-3 p-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs text-center font-medium animate-bounce">
              {callStaffNotification}
            </div>
          )}

        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-5">
        
        {/* If Active Order Exists for this table, show Live Tracker prominently */}
        {activeOrder && (
          <LiveOrderTracker onOpenFeedback={() => setIsFeedbackOpen(true)} />
        )}

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search dishes, burgers, karahi, shakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs"
            />
            <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Icons.Search size={16} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
              >
                <Icons.X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setVegFilterOnly(!vegFilterOnly)}
            className={`px-3 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap ${
              vegFilterOnly
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Veg Only
          </button>
        </div>

        {/* Category Horizontal Nav */}
        {!searchQuery && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                      : 'glass-panel text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-normal ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    ({cat.nameUrdu})
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl glass-panel p-3.5 hover:glass-panel-elevated transition-all flex flex-col justify-between border border-white/5 hover:border-orange-500/30 text-left"
            >
              <div>
                {/* Dish Photo */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3 bg-slate-900">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Badges on image */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {item.isPopular && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg shadow-md">
                        Popular
                      </span>
                    )}
                    {item.isChefSpecial && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-lg shadow-md">
                        Chef Choice
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <span className="text-[11px] font-semibold flex items-center gap-1 text-slate-300 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <Icons.Clock size={12} className="text-orange-400" />
                      {item.prepTimeMinutes}m
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-md">
                      {item.station}
                    </span>
                  </div>
                </div>

                {/* Dish Info */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-orange-300 font-urdu">{item.nameUrdu}</p>
                  </div>
                  <span className={`w-3 h-3 rounded-full shrink-0 mt-1 border ${
                    item.isVeg ? 'border-emerald-500 bg-emerald-500/20' : 'border-red-500 bg-red-500/20'
                  }`} />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              {/* Price & Action Button */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Price</span>
                  <span className="text-sm font-extrabold text-white">
                    Rs. {item.price.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedItemForCustom(item)}
                  className="px-3.5 py-2 rounded-xl bg-orange-500/15 hover:bg-orange-500 text-orange-400 hover:text-white font-bold text-xs border border-orange-500/30 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <Icons.Plus size={14} />
                  <span>Customize</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">No items found matching your filter.</p>
          </div>
        )}

      </main>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 animate-slide-up">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-2xl shadow-orange-500/30 flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center font-bold text-sm">
                {cartTotalCount}
              </div>
              <div>
                <span className="text-xs font-semibold block text-orange-100">Table {selectedTable} Cart</span>
                <span className="text-sm font-black">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="py-2 px-4 rounded-xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <span>View Order</span>
              <Icons.ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <WifiModal
        isOpen={showWifiModal}
        onClose={() => setShowWifiModal(false)}
      />

      <ItemCustomizationModal
        item={selectedItemForCustom}
        isOpen={!!selectedItemForCustom}
        onClose={() => setSelectedItemForCustom(null)}
        onAddToCart={addToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

    </div>
  );
}
