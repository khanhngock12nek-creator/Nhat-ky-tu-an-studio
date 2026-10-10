import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  BookOpen,
  Dices,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trophy,
  Mail,
  X,
  MessageCircleHeart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveTab } from '../types';

interface HeroBannerProps {
  onNavigate: (tab: ActiveTab) => void;
  bannerBg: string;
  darkMode?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, bannerBg }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showStoryLetter, setShowStoryLetter] = useState(false);

  const handleOpenStoryLetter = () => {
    setShowStoryLetter(true);
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#38bdf8', '#fda4af', '#fef08a'],
      });
    } catch {
      // ignore
    }
  };

  const slides = [
    {
      topPill: 'Nhật Ký Tù Án',
      badge: '✨ TRẠI GIAM TÂM TÌNH',
      title: 'Nhật Ký Tù Án',
      quote:
        '"nơi giam giữ các phạm nhân nhỏ chào mừng các nàng ghé thăm và rước về"',
      btn1Text: 'Chuyện Nhà Giam',
      btn1Icon: BookOpen,
      btn1Action: handleOpenStoryLetter,
      btn2Text: 'Quay Gacha Chồng Nhỏ',
      btn2Icon: Dices,
      btn2Action: () => onNavigate('gacha'),
      watermark: '✨ Trại Giam Ngọt Ngào',
    },
    {
      topPill: 'Hồ Sơ Phạm Nhân',
      badge: '🔒 PHÒNG GIAM BÍ MẬT',
      title: 'Hồ Sơ Các Chồng Nhỏ',
      quote:
        '"Mỗi phạm nhân mang một tội danh si tình, đang ngoan ngoãn đếm từng giây chờ nàng tới thăm nuôi."',
      btn1Text: 'Chuyện Nhà Giam',
      btn1Icon: BookOpen,
      btn1Action: handleOpenStoryLetter,
      btn2Text: 'Xem Bảng Xếp Hạng',
      btn2Icon: Trophy,
      btn2Action: () => onNavigate('ranking'),
      watermark: '✨ Nhật Ký Tù Án',
    },
    {
      topPill: 'Đánh Giá & Idea',
      badge: '💡 ĐÓNG GÓP Ý TƯỞNG',
      title: 'Hòm Thư Đánh Giá & Idea',
      quote:
        '"Nơi các nàng gửi những đánh giá chân tình và đóng góp những ý tưởng phát triển mới mẻ cho Nhật Ký Tù Án."',
      btn1Text: 'Chuyện Nhà Giam',
      btn1Icon: BookOpen,
      btn1Action: handleOpenStoryLetter,
      btn2Text: 'Danh Mục Thể Loại',
      btn2Icon: Sparkles,
      btn2Action: () => onNavigate('genres'),
      watermark: '✨ Trại Giam An Yên',
    },
  ];

  // Auto-play interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide];
  const Btn1Icon = slide.btn1Icon;
  const Btn2Icon = slide.btn2Icon;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-pink-200/80 dark:border-pink-500/30 shadow-2xl shadow-pink-200/40 dark:shadow-pink-950/40 select-none">
      {/* Background Image / Wallpaper */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bannerBg}
          alt="Nhật Ký Tù Án Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out"
        />
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 sm:via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
      </div>

      {/* Banner Content Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 min-h-[380px] sm:min-h-[430px] flex flex-col justify-between">
        {/* Top Header Row in Banner */}
        <div className="flex items-center justify-between gap-4">
          {/* Top Left Tag / Pill */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-black/40 backdrop-blur-md border border-white/20 shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
              <span>{slide.topPill}</span>
              <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
            </div>
          </div>

          {/* Top Right Watermark */}
          <div className="text-xs font-semibold text-white/90 drop-shadow-md flex items-center gap-1 tracking-wide">
            <span>{slide.watermark}</span>
          </div>
        </div>

        {/* Middle Main Content */}
        <div className="my-auto py-6 max-w-2xl space-y-3.5">
          {/* Secondary Kicker Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-teal-200 bg-teal-950/60 backdrop-blur-md border border-teal-500/40 shadow-sm">
            <span>{slide.badge}</span>
          </div>

          {/* Big Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-lg font-['Quicksand',sans-serif]">
            {slide.title}
          </h1>

          {/* Subtitle with Quote */}
          <p className="text-sm sm:text-base font-medium text-pink-100/95 leading-relaxed drop-shadow italic max-w-xl">
            {slide.quote}
          </p>

          {/* Action Buttons Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Button 1: White pill button */}
            <button
              type="button"
              onClick={slide.btn1Action}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-pink-50 shadow-lg shadow-black/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Btn1Icon className="w-4 h-4 text-teal-600" />
              <span>{slide.btn1Text}</span>
            </button>

            {/* Button 2: Teal / Cyan Gradient Pill button */}
            <button
              type="button"
              onClick={slide.btn2Action}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer border border-teal-300/30"
            >
              <Btn2Icon className="w-4 h-4 text-white" />
              <span>{slide.btn2Text}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Nav Arrows */}
        <div className="pt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide trước"
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/15 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide tiếp theo"
            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/15 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Short Letter Modal for "Chuyện Nhà Giam" */}
      {showStoryLetter && (
        <div
          onClick={() => setShowStoryLetter(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 dark:border-pink-500/30 bg-gradient-to-b from-pink-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 text-slate-800 dark:text-slate-100 relative overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Vintage Postal Stamp in top-right */}
            <div className="absolute top-5 right-14 w-12 h-12 rounded-xl bg-white/80 dark:bg-slate-800/80 border-2 border-dashed border-pink-400/60 flex items-center justify-center text-2xl shadow-sm rotate-6 select-none pointer-events-none">
              💌
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowStoryLetter(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer absolute top-4 right-4"
              aria-label="Đóng thư"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Seal */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-pink-400/30">
                <MessageCircleHeart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider text-pink-500 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Chuyện Nhà Giam
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight font-['Quicksand',sans-serif]">
                  Bức Thư Nhỏ Gửi Nàng
                </h3>
              </div>
            </div>

            {/* Letter Body in Parchment Card */}
            <div className="p-4 sm:p-5 rounded-2xl border border-pink-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/70 shadow-inner my-4 relative">
              <p className="text-xs sm:text-sm font-semibold text-pink-600 dark:text-pink-400 mb-2 italic">
                "Gửi nàng thơ dịu dàng ghé thăm Cửa Nhà Giam..."
              </p>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                Nơi đây lưu giữ những chàng trai mang tội danh <em>'si tình quá độ'</em>. Từng chấn song sắt không phải để giam cầm họ, mà là để che chở và chờ một ngày nàng bước đến mở khóa trái tim.
              </p>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 mt-2.5 font-medium">
                Mỗi khi nàng ghé thăm, phòng giam lạnh lẽo lại ngập tràn ánh nắng và vị ngọt của kẹo bông. Hãy dạo bước thật chậm, lắng nghe lời tự thú của từng phạm nhân nhỏ và rước chàng trai của lòng mình về nhé! 💕
              </p>

              <div className="mt-4 pt-3 border-t border-dashed border-pink-200 dark:border-slate-700 flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>Trại giam ngọt ngào #001</span>
                <span className="text-pink-500 font-bold">— Ban Quản Giáo & Các Chồng Nhỏ</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowStoryLetter(false);
                  onNavigate('cards');
                }}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 hover:opacity-95 shadow-lg shadow-pink-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Vào Thăm Các Phạm Nhân Ngay</span>
              </button>

              <button
                type="button"
                onClick={() => setShowStoryLetter(false)}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl font-semibold text-xs transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                Gấp thư lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
