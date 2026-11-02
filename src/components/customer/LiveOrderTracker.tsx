'use client';

import React, { useState, useEffect } from 'react';
import { useDine } from '../../context/DineContext';
import { Icons } from '../icons';
import { OrderStatus } from '../../types/dining';

interface LiveOrderTrackerProps {
  onOpenFeedback: () => void;
}

export function LiveOrderTracker({ onOpenFeedback }: LiveOrderTrackerProps) {
  const { activeOrder, callStaff } = useDine();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [staffCalledType, setStaffCalledType] = useState<string | null>(null);

  useEffect(() => {
    if (!activeOrder) return;
    const startTime = new Date(activeOrder.acceptedAt || activeOrder.placedAt).getTime();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  if (!activeOrder) return null;

  const totalPrepSeconds = activeOrder.estimatedPrepTimeMinutes * 60;
  const remainingSeconds = Math.max(0, totalPrepSeconds - elapsedSeconds);
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalPrepSeconds) * 100));

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const steps: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'PENDING',
      label: 'Order Placed',
      desc: 'Received by restaurant system',
      icon: <Icons.Clock size={16} />,
    },
    {
      key: 'ACCEPTED',
      label: 'Order Confirmed',
      desc: 'Captain accepted & dispatched',
      icon: <Icons.CheckCircle2 size={16} />,
    },
    {
      key: 'PREPARING',
      label: 'Kitchen Preparation',
      desc: 'Chef crafting your dishes',
      icon: <Icons.ChefHat size={16} />,
    },
    {
      key: 'READY',
      label: 'Ready for Table',
      desc: 'Hot & ready on serving pass',
      icon: <Icons.Sparkles size={16} />,
    },
    {
      key: 'SERVED',
      label: 'Served & Enjoy',
      desc: 'Delivered directly to table',
      icon: <Icons.Utensils size={16} />,
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'ACCEPTED': return 1;
      case 'PREPARING': return 2;
      case 'READY': return 3;
      case 'SERVED':
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(activeOrder.status);

  const handleCallStaff = (type: 'Water' | 'Extra Cutlery & Napkins' | 'Call Waiter' | 'Bill Receipt') => {
    callStaff(type);
    setStaffCalledType(type);
    setTimeout(() => setStaffCalledType(null), 3000);
  };

  return (
    <div className="w-full rounded-3xl glass-panel-elevated p-5 border border-white/10 shadow-2xl space-y-5 text-left mb-6">
      
      {/* Tracker Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
            Live Order Tracking
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Order {activeOrder.orderNumber}
          </h3>
          <p className="text-xs text-slate-400">
            Table {activeOrder.tableNumber} • {activeOrder.paymentMethod.replace(/_/g, ' ')}
          </p>
        </div>

        {/* Smart ETA Timer Display */}
        <div className="text-right">
          <div className="text-2xl font-black text-orange-400 font-mono tracking-tight">
            {activeOrder.status === 'SERVED' ? '00:00' : formatMinSec(remainingSeconds)}
          </div>
          <span className="text-[10px] text-slate-400 block">
            {activeOrder.status === 'SERVED' ? 'Delivered' : 'Est. time remaining'}
          </span>
          <span className="text-[9px] text-slate-500 block">
            ({formatMinSec(elapsedSeconds)} elapsed)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            activeOrder.status === 'SERVED' 
              ? 'bg-emerald-500' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500'
          }`}
          style={{ width: `${activeOrder.status === 'SERVED' ? 100 : Math.max(12, progressPercent)}%` }}
        />
      </div>

      {/* 5-Step Timeline */}
      <div className="space-y-3 pt-1">
        {steps.map((st, idx) => {
          const isDone = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;

          return (
            <div key={st.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isCurrent
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                      : 'bg-slate-900 text-slate-500 border border-white/5'
                  }`}
                >
                  {isDone ? <Icons.CheckCircle2 size={14} /> : st.icon}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 h-6 my-0.5 ${idx < currentStepIdx ? 'bg-emerald-500/40' : 'bg-white/5'}`} />
                )}
              </div>

              <div className="flex-1 pb-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold ${isCurrent ? 'text-orange-400' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                    {st.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] text-orange-400 font-semibold px-2 py-0.5 rounded-full bg-orange-400/10 animate-pulse">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ordered Items Preview */}
      <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Items in this order:
        </span>
        <div className="space-y-1">
          {activeOrder.items.map((it) => (
            <div key={it.id} className="text-xs flex justify-between text-slate-300">
              <span>{it.quantity}× {it.name}</span>
              <span className="text-slate-400">Rs. {it.itemTotal.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Service Request Buttons */}
      <div className="pt-2 border-t border-white/5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Need Assistance at Table {activeOrder.tableNumber}?
        </span>
        
        {staffCalledType && (
          <div className="mb-2 p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs text-center border border-emerald-500/30">
            ✓ &ldquo;{staffCalledType}&rdquo; request sent to staff dashboard!
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleCallStaff('Water')}
            className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-[11px] font-medium border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
          >
            💧 Water
          </button>
          <button
            onClick={() => handleCallStaff('Extra Cutlery & Napkins')}
            className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-[11px] font-medium border border-white/5 flex items-center justify-center gap-1.5 transition-colors"
          >
            🍴 Napkins
          </button>
          <button
            onClick={() => handleCallStaff('Call Waiter')}
            className="py-2 px-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-[11px] font-medium border border-orange-500/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            🔔 Call Waiter
          </button>
        </div>
      </div>

      {/* If Served: Review CTA */}
      {activeOrder.status === 'SERVED' && !activeOrder.feedbackGiven && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-center space-y-2">
          <h4 className="text-xs font-bold text-emerald-300">Hope you loved your feast!</h4>
          <p className="text-[11px] text-slate-300">Please share quick feedback and rate your experience.</p>
          <button
            onClick={onOpenFeedback}
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Leave Feedback & Google Review ⭐
          </button>
        </div>
      )}

    </div>
  );
}
