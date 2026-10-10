import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Key,
  DoorOpen,
  Sparkles,
  Lock,
} from 'lucide-react';

interface GateModalProps {
  onEnter: () => void;
  darkMode: boolean;
}

export const GateModal: React.FC<GateModalProps> = ({ onEnter, darkMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRejected, setIsRejected] = useState(false);

  // Smooth loading progression from 0% to 100%
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            try {
              confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f43f5e', '#ec4899', '#a855f7', '#ffd700'],
              });
            } catch {
              // Ignore
            }
            return 100;
          }
          // Increment smoothly
          const step = Math.floor(Math.random() * 5) + 3;
          return Math.min(100, prev + step);
        });
      }, 45);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Auto enter after reaching 100% after a short delay
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onEnter();
      }, 1100);
      return () => clearTimeout(timeout);
    }
  }, [progress, onEnter]);

  const handleStartLoading = () => {
    setIsRejected(false);
    setIsLoading(true);
    setProgress(0);
  };

  const handleHesitate = () => {
    setIsRejected(true);
  };

  // Dynamic progress status text
  const getStatusText = () => {
    if (progress >= 100) {
      return 'Mở khóa thành công! Chào mừng Quản Ngục Tối Cao bước vào buồng giam. ✨';
    }
    if (progress >= 85) {
      return 'Nhịp tim phạm nhân nhỏ tăng vọt 135 BPM vì ngóng đợi! 💓';
    }
    if (progress >= 55) {
      return 'Đang hạ rèm nhung và chuẩn bị phòng tiếp tế... 🛏️';
    }
    if (progress >= 25) {
      return 'Đang tra chìa khóa vàng vào ổ buồng giam... 🗝️';
    }
    return 'Đang khởi động cổng hoa hồng và nhận diện bước chân nàng... 🌸';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Modal Container: Compact & Fits 1 screen neatly */}
      <div
        className={`w-full max-w-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xl border transition-all text-center relative overflow-hidden my-auto ${
          darkMode
            ? 'bg-slate-900/95 border-rose-950/80 text-slate-100 shadow-rose-950/60'
            : 'bg-white/95 border-pink-100 text-slate-800 shadow-pink-200/50'
        }`}
      >
        {/* Soft Background Radial Glows */}
        <div className="absolute -top-14 -left-14 w-32 h-32 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-14 -right-14 w-32 h-32 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. TOP HEADER PILL TAG */}
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <div className="h-px w-5 sm:w-8 bg-rose-200/60 dark:bg-rose-900/40" />
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
            <Lock className="w-2 h-2 text-rose-500" />
            <span>Gilded Velvet Portal • Cổng Trọng Tâm</span>
            <Lock className="w-2 h-2 text-rose-500" />
          </div>
          <div className="h-px w-5 sm:w-8 bg-rose-200/60 dark:bg-rose-900/40" />
        </div>

        {/* 2. MAIN TITLE & SUBTITLE */}
        <h2 className="text-base sm:text-lg font-bold tracking-tight font-serif mb-1 text-rose-900 dark:text-rose-100 leading-snug">
          Các nàng yiu có muốn ghé<br className="hidden sm:inline" /> thăm chồng nhỏ không?
        </h2>

        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-2.5 leading-relaxed">
          Cánh cổng hoa hồng và song sắt bọc nhung đang hé mở. Các phạm nhân nhỏ đang đếm từng tiếng bước chân đợi nàng bước vào...
        </p>

        {/* 3. PINK/PEACH ALERT BOX */}
        <div
          className={`p-2 sm:p-2.5 rounded-xl border mb-2.5 text-center transition-all ${
            darkMode
              ? 'bg-rose-950/30 border-rose-900/50 text-rose-200'
              : 'bg-rose-50/70 border-rose-200/60 text-rose-900'
          }`}
        >
          <div className="flex items-center justify-center gap-1 font-bold text-[11px] text-rose-600 dark:text-rose-400 mb-0.5">
            <span>💔</span>
            <span>Hờn Dỗi Khóc Nhè!</span>
          </div>
          <p className="text-[9.5px] sm:text-[10px] text-rose-700/90 dark:text-rose-300 leading-relaxed">
            {isRejected
              ? 'Huhu nàng nỡ bấm suy nghĩ lại sao? Phạm nhân nhỏ đang rơm rớm nước mắt ở góc phòng giam đợi nàng dỗ dành kìa... 🥺'
              : 'Phạm nhân nhỏ sẽ rơm rớm nước mắt ở góc phòng đấy nàng ơi... Nàng nỡ từ chối sao? 🥺'}
          </p>
        </div>

        {/* 4. TWO ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-2.5">
          {/* Button 1: Em Đến Với Chồng Đây! */}
          <button
            type="button"
            onClick={handleStartLoading}
            disabled={isLoading && progress < 100}
            className="w-full sm:w-auto flex-1 py-2 px-3.5 rounded-full font-bold text-[11px] sm:text-xs text-white bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-700 hover:opacity-95 shadow-md shadow-rose-400/25 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-3 h-3 fill-white text-white" />
            <span>Em Đến Với Chồng Đây!</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Button 2: Để Em Suy Nghĩ Lại... */}
          <button
            type="button"
            onClick={handleHesitate}
            disabled={isLoading}
            className={`w-full sm:w-auto py-2 px-3 rounded-full font-semibold text-[10.5px] sm:text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 ${
              darkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>⏳</span>
            <span>Để Em Suy Nghĩ Lại...</span>
          </button>
        </div>

        {/* 5. LOADING PROGRESS BAR */}
        {isLoading && (
          <div
            className={`p-2.5 sm:p-3 rounded-xl border mb-2.5 text-left space-y-1.5 transition-all animate-in fade-in zoom-in-95 duration-150 ${
              darkMode
                ? 'bg-slate-800/70 border-slate-700'
                : 'bg-rose-50/50 border-rose-100 shadow-2xs'
            }`}
          >
            <span className="text-[8.5px] font-black uppercase text-slate-400 tracking-wider block">
              QUY TRÌNH KHAI MỞ BUỒNG GIAM
            </span>

            {/* Status and Percentage row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5.5 h-5.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-500 flex items-center justify-center shrink-0">
                  {progress >= 100 ? (
                    <Sparkles className="w-3 h-3 text-rose-500" />
                  ) : (
                    <Key className="w-3 h-3 text-rose-500 animate-spin-slow" />
                  )}
                </div>
                <p className="text-[10.5px] sm:text-[11px] font-bold text-rose-900 dark:text-rose-100 truncate">
                  {getStatusText()}
                </p>
              </div>

              <span className="px-1.5 py-0.2 rounded-full font-mono font-black text-[10.5px] bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 shrink-0 border border-pink-100 dark:border-slate-600">
                {progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-0.5 pb-0.5">
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-700 h-full rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress Head Handle */}
              {progress > 2 && progress < 100 && (
                <div
                  className="absolute top-0.5 -translate-y-1/4 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-rose-500 shadow-xs flex items-center justify-center transition-all duration-75"
                  style={{ left: `${progress}%` }}
                >
                  <div className="w-1 h-1 rounded-full bg-rose-500" />
                </div>
              )}
            </div>

            {/* 4 Milestones */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[8.5px] sm:text-[9px] text-slate-400 font-medium">
              <span className={progress >= 25 ? 'text-rose-500 font-bold' : ''}>
                • 25% Tra Chìa
              </span>
              <span className={progress >= 55 ? 'text-rose-500 font-bold' : ''}>
                • 55% Hạ Rèm
              </span>
              <span className={progress >= 85 ? 'text-rose-500 font-bold' : ''}>
                • 85% 135 BPM
              </span>
              <span className={progress >= 100 ? 'text-rose-600 font-black' : ''}>
                • 100% Cổng Mở
              </span>
            </div>

            {/* Action button if 100% */}
            {progress >= 100 && (
              <div className="pt-0.5 flex justify-end">
                <button
                  type="button"
                  onClick={onEnter}
                  className="px-3 py-1 rounded-lg font-black text-[10.5px] sm:text-[11px] text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-95 shadow-xs transition-all flex items-center gap-1 cursor-pointer animate-bounce-short"
                >
                  <span>Bước Vào Ngay Lập Tức</span>
                  <DoorOpen className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. THREE FOOTER NOTES */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[9px] sm:text-[9.5px] text-slate-400 font-medium">
          <span className="flex items-center gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
            Bảo mật tình ái 100%
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <span>🛏️</span>
            Nệm nhung & hoa hồng tươi
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <span>🫂</span>
            Nuông chiều không giới hạn
          </span>
        </div>
      </div>
    </div>
  );
};
