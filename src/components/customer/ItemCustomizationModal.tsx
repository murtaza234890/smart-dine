'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuItem, SelectedAddon, CartItem } from '../../types/dining';
import { Icons } from '../icons';

interface ItemCustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export function ItemCustomizationModal({ item, isOpen, onClose, onAddToCart }: ItemCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [specialNote, setSpecialNote] = useState('');

  if (!isOpen || !item) return null;

  const toggleOption = (groupId: string, groupTitle: string, optionId: string, optionName: string, priceDelta: number, isRequired: boolean) => {
    setSelectedAddons(prev => {
      if (isRequired) {
        // Radio behavior: replace existing in this group
        const filtered = prev.filter(a => a.groupId !== groupId);
        return [...filtered, { groupId, groupTitle, optionId, optionName, priceDelta }];
      } else {
        // Checkbox behavior: toggle
        const exists = prev.some(a => a.groupId === groupId && a.optionId === optionId);
        if (exists) {
          return prev.filter(a => !(a.groupId === groupId && a.optionId === optionId));
        } else {
          return [...prev, { groupId, groupTitle, optionId, optionName, priceDelta }];
        }
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.priceDelta, 0);
  const unitPrice = item.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    const cartLine: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItemId: item.id,
      name: item.name,
      basePrice: item.price,
      quantity,
      selectedAddons,
      specialInstructions: specialNote.trim() || undefined,
      itemTotal: totalPrice,
      station: item.station,
    };
    onAddToCart(cartLine);
    onClose();
    // Reset state
    setQuantity(1);
    setSelectedAddons([]);
    setSpecialNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full sm:max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl glass-panel-elevated border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header Image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-900">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151c28] via-transparent to-black/40" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-black/50 backdrop-blur-md transition-colors"
          >
            <Icons.X size={18} />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[10px] tracking-wider uppercase font-bold text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-md border border-orange-500/30">
                {item.station.toUpperCase()} STATION
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{item.name}</h2>
              <p className="text-xs text-orange-300 font-urdu">{item.nameUrdu}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Base Price</span>
              <span className="text-lg font-extrabold text-white">Rs. {item.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-left">
          <p className="text-xs text-slate-300 leading-relaxed">
            {item.description}
          </p>

          {item.variantGroups.map((group) => {
            return (
              <div key={group.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    {group.title}
                    {group.required && (
                      <span className="text-[10px] font-semibold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {group.required ? 'Choose 1' : 'Optional extras'}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isSelected = selectedAddons.some(
                      a => a.groupId === group.id && a.optionId === option.id
                    );

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleOption(group.id, group.title, option.id, option.name, option.priceDelta, group.required)}
                        className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? 'bg-orange-500/20 border border-orange-500/50 text-white'
                            : 'bg-slate-900/40 border border-white/5 text-slate-300 hover:bg-slate-900/80 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-${group.required ? 'full' : 'md'} border flex items-center justify-center ${
                            isSelected ? 'border-orange-400 bg-orange-500' : 'border-slate-500'
                          }`}>
                            {isSelected && (
                              group.required 
                                ? <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                : <Icons.CheckCircle2 size={12} className="text-white" />
                            )}
                          </div>
                          <span className="text-xs font-medium">{option.name}</span>
                        </div>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-orange-300' : 'text-slate-400'}`}>
                          {option.priceDelta > 0 ? `+Rs. ${option.priceDelta}` : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Kitchen / Special Chef Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Icons.Utensils size={14} className="text-orange-400" />
              Special Chef Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. No onion, sauce on the side, extra crispy..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        {/* Footer Bar with Quantity & Total */}
        <div className="p-4 bg-slate-950/90 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Icons.Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Icons.Plus size={14} />
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-between transition-transform active:scale-[0.98]"
          >
            <span>Add to Order</span>
            <span>Rs. {totalPrice.toLocaleString()}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
