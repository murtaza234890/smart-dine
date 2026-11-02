'use client';

import React, { useState } from 'react';
import { Icons } from '../icons';
import { RESTAURANT_INFO } from '../../data/mockRestaurant';

interface WifiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WifiModal({ isOpen, onClose }: WifiModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(RESTAURANT_INFO.wifiPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl glass-panel-elevated p-6 text-center border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Icons.X size={18} />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/10">
          <Icons.Wifi size={32} />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">Complimentary High-Speed Wi-Fi</h3>
        <p className="text-xs text-slate-400 mb-6">
          Connect seamlessly to browse our interactive digital menu with zero data charges.
        </p>

        <div className="space-y-3 mb-6 text-left">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] font-semibold tracking-wider text-orange-400 uppercase block mb-0.5">Network (SSID)</span>
            <div className="text-sm font-medium text-slate-200">{RESTAURANT_INFO.wifiSsid}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-orange-400 uppercase block mb-0.5">Password</span>
              <div className="text-sm font-mono font-medium text-white tracking-wide">{RESTAURANT_INFO.wifiPassword}</div>
            </div>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98]"
        >
          Connected & Start Ordering
        </button>
      </div>
    </div>
  );
}
