'use client';

import React, { useState } from 'react';
import { Order } from '../../types/dining';
import { Icons } from '../icons';
import { generateKOTText, generateGuestBillText } from '../../utils/thermalPrinter';

interface ThermalKOTModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'KOT' | 'BILL';
}

export function ThermalKOTModal({ order, isOpen, onClose, defaultType = 'KOT' }: ThermalKOTModalProps) {
  const [printType, setPrintType] = useState<'KOT' | 'BILL'>(defaultType);
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [paperWidth, setPaperWidth] = useState<'80mm' | '58mm'>('80mm');
  const [copiedRaw, setCopiedRaw] = useState(false);

  if (!isOpen || !order) return null;

  const rawContent = printType === 'KOT'
    ? generateKOTText(order, selectedStation)
    : generateGuestBillText(order);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRaw = () => {
    navigator.clipboard?.writeText(rawContent);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-elevated p-6 border border-white/10 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
              <Icons.Printer size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Thermal Printer Hardware Bridge
              </h3>
              <p className="text-[11px] text-slate-400">
                Epson / Xprinter / Sunmi ESC/POS Engine (80mm & 58mm)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/60 p-3 rounded-2xl border border-white/5 text-xs">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/5">
            <button
              onClick={() => setPrintType('KOT')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                printType === 'KOT' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              👨‍🍳 Kitchen Ticket (KOT)
            </button>
            <button
              onClick={() => setPrintType('BILL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                printType === 'BILL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧾 Guest Bill (Receipt)
            </button>
          </div>

          {/* Paper Width & Station */}
          <div className="flex items-center gap-2">
            {printType === 'KOT' && (
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="bg-black/50 border border-white/10 text-orange-300 font-bold px-2.5 py-1.5 rounded-xl text-xs focus:outline-none"
              >
                <option value="all">All Stations</option>
                <option value="grill">Grill Station</option>
                <option value="fryer">Fryer Station</option>
                <option value="pizza">Pizza Station</option>
                <option value="beverage">Beverage Bar</option>
              </select>
            )}

            <button
              onClick={() => setPaperWidth(paperWidth === '80mm' ? '58mm' : '80mm')}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white font-mono font-bold text-xs"
            >
              {paperWidth} Roll
            </button>
          </div>
        </div>

        {/* Monospaced Thermal Paper Preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-white text-slate-950 font-mono text-[11px] leading-relaxed rounded-2xl border-4 border-slate-300 shadow-inner select-all">
          <pre className="whitespace-pre-wrap font-mono tracking-tight font-semibold">
            {rawContent}
          </pre>

          {printType === 'BILL' && (
            <div className="text-center pt-2 border-t border-dashed border-slate-400 space-y-1">
              <div className="w-16 h-16 mx-auto border border-slate-400 p-1 rounded flex items-center justify-center bg-slate-50">
                <Icons.QrCode size={52} className="text-slate-900" />
              </div>
              <p className="text-[9px] text-slate-600">
                FBR / PRA POS Invoicing Verified
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-between gap-3 border-t border-white/10 mt-3">
          <button
            onClick={handleCopyRaw}
            className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white font-bold text-xs border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <span>{copiedRaw ? '✓ Raw Copied!' : 'Copy ESC/POS Raw'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Icons.Printer size={16} />
            <span>Print {printType} on Thermal Roll ({paperWidth})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
