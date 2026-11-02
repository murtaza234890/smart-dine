'use client';

import React, { useState } from 'react';
import { useDine } from '../../context/DineContext';
import { Icons } from '../icons';
import { RESTAURANT_INFO } from '../../data/mockRestaurant';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { activeOrder, submitReview } = useDine();
  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !activeOrder) return null;

  const overallRating = Math.round((foodRating + serviceRating + cleanlinessRating) / 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview({
      orderNumber: activeOrder.orderNumber,
      tableNumber: activeOrder.tableNumber,
      foodRating,
      serviceRating,
      cleanlinessRating,
      overallRating,
      comment: comment.trim(),
      wantsGoogleReviewRedirect: true,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-md rounded-3xl glass-panel-elevated p-6 border border-white/10 shadow-2xl overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Icons.X size={18} />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Icons.Star size={28} fill="currentColor" />
              </div>
              <h3 className="text-lg font-bold text-white">How was your Dining Experience?</h3>
              <p className="text-xs text-slate-400">Table {activeOrder.tableNumber} • Order {activeOrder.orderNumber}</p>
            </div>

            {/* Rating Categories */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              
              {/* Food Quality */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Food Taste & Freshness</span>
                  <span className="text-[10px] text-slate-400">Temperature & flavour quality</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFoodRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Icons.Star size={18} fill={star <= foodRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Service & Speed */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Staff & Service Speed</span>
                  <span className="text-[10px] text-slate-400">Attentiveness & hospitality</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setServiceRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Icons.Star size={18} fill={star <= serviceRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Cleanliness */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Cleanliness & Ambience</span>
                  <span className="text-[10px] text-slate-400">Table hygiene & vibe</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setCleanlinessRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Icons.Star size={18} fill={star <= cleanlinessRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Your Comments (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="What did you enjoy most about your meal today?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all"
            >
              Submit Feedback
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Icons.CheckCircle2 size={32} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-1">Shukriya! Thank You!</h3>
              <p className="text-xs text-slate-300">
                Your feedback has been delivered to restaurant management.
              </p>
            </div>

            {/* Google Review Call to Action */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-900/30 to-amber-900/20 border border-blue-500/30 text-left space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Support Us on Google Maps</h4>
                  <p className="text-[10px] text-slate-400">It only takes 30 seconds and helps fellow foodies discover us.</p>
                </div>
              </div>

              <a
                href={RESTAURANT_INFO.googleReviewUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-blue-600/30"
              >
                <span>Write a Review on Google</span>
                <Icons.ExternalLink size={14} />
              </a>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white font-medium"
            >
              Back to Menu
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
