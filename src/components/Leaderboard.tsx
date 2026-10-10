import React, { useState } from 'react';
import {
  Trophy,
  Crown,
  Heart,
  Sparkles,
  Send,
  X,
  Medal,
  Clock,
  UserPlus,
  User,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../types';

interface LeaderboardProps {
  characters: Character[];
  onOpenDetail?: (character: Character) => void;
  onOpenAdmin: () => void;
  onLikeCharacter?: (characterId: string) => void;
  onSendLove?: (characterId: string, senderName: string, message: string) => void;
  darkMode: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  characters,
  onOpenDetail,
  onOpenAdmin,
  onLikeCharacter,
  onSendLove,
  darkMode,
}) => {
  // Daily free hearts privilege ("ĐẶC QUYỀN QUẢN NGỤC")
  const [freeHearts, setFreeHearts] = useState<number>(3);

  // Filter states
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  // Love letter pop-up state
  const [selectedTarget, setSelectedTarget] = useState<{ id: string; name: string } | null>(null);
  const [loveSender, setLoveSender] = useState('');
  const [loveLetterText, setLoveLetterText] = useState('');
  const [loveSuccessMsg, setLoveSuccessMsg] = useState<string | null>(null);

  // Confetti helper
  const triggerConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#38bdf8'],
    });
  };

  // Handle +1 Thả Tim for Real character
  const handleVoteReal = (characterId: string) => {
    if (freeHearts > 0) {
      setFreeHearts((prev) => prev - 1);
    }
    if (onLikeCharacter) {
      onLikeCharacter(characterId);
    }
    triggerConfetti();
  };

  // Submit love letter
  const handleSubmitLoveLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loveLetterText.trim() || !selectedTarget) return;

    if (onSendLove) {
      onSendLove(
        selectedTarget.id,
        loveSender.trim() || 'Nàng Quản Ngục Dịu Dàng',
        loveLetterText.trim()
      );
    }

    triggerConfetti();
    setLoveSuccessMsg(`Bức thư tình đã được gửi kín đáo đến phòng giam của ${selectedTarget.name}! 💌`);
    setLoveLetterText('');

    setTimeout(() => {
      setLoveSuccessMsg(null);
      setSelectedTarget(null);
    }, 1800);
  };

  // Filter real characters based on zone (Phòng Giam Lạnh, Phòng Giam Ấm, Phòng Giam Chữa Lành)
  const filteredCharacters = characters.filter((c) => {
    if (zoneFilter === 'all') return true;
    if (zoneFilter === 'lanh') {
      return (
        c.zone === 'Phòng Giam Lạnh' ||
        (!c.zone && (
          c.genres.some((g) => g.toLowerCase().includes('lạnh') || g.toLowerCase().includes('kuudere') || g.toLowerCase().includes('băng')) ||
          c.backstory.toLowerCase().includes('lạnh')
        ))
      );
    }
    if (zoneFilter === 'am') {
      return (
        c.zone === 'Phòng Giam Ấm' ||
        (!c.zone && (
          c.genres.some((g) => g.toLowerCase().includes('ấm') || g.toLowerCase().includes('ngọt sủng') || g.toLowerCase().includes('nuông chiều') || g.toLowerCase().includes('cún con')) ||
          c.backstory.toLowerCase().includes('ấm')
        ))
      );
    }
    if (zoneFilter === 'chualanh') {
      return (
        c.zone === 'Phòng Giam Chữa Lành' ||
        (!c.zone && (
          c.genres.some((g) => g.toLowerCase().includes('chữa lành') || g.toLowerCase().includes('thanh xuân') || g.toLowerCase().includes('dịu dàng')) ||
          c.backstory.toLowerCase().includes('chữa lành')
        ))
      );
    }
    return true;
  });

  // Calculate real characters ranking
  const sortedReal = [...filteredCharacters].sort((a, b) => b.likes - a.likes);
  const totalRealLikes = sortedReal.reduce((sum, c) => sum + Math.max(c.likes, 1), 0);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* 
        ========================================================================
        HEADER SECTION
        ========================================================================
      */}
      <div className="space-y-4">
        {/* Top Notification / Season Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pink-100 dark:bg-pink-950/70 text-rose-600 dark:text-pink-300 border border-pink-200/80 dark:border-pink-800/50 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Mùa Giam Giữ Thứ IV</span>
            <span className="opacity-50">•</span>
            <span className="text-[11px] font-semibold text-rose-500/80">CẬP NHẬT 5 PHÚT TRƯỚC</span>
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {characters.length === 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Mẫu Bảng Xếp Hạng · Chưa có nhân vật</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Đang xếp hạng {characters.length} nhân vật</span>
              </span>
            )}
          </div>
        </div>

        {/* Main Title Row & Right "Đặc Quyền Quản Ngục" Card */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          {/* Left Title & Subtitle */}
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.15]">
              <span className="text-slate-900 dark:text-white">Bảng Xếp Hạng </span>
              <span className="italic font-serif text-rose-800 dark:text-rose-400">Phạm Nhân</span>
              <br />
              <span className="text-slate-900 dark:text-white">Được Yêu Thích</span>
            </h1>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Trái tim nàng thuộc về xiềng xích của ai? Hãy trao gửi những nhịp đập ngọt ngào nhất để cứu rỗi hoặc giam cầm linh hồn họ mãi mãi.
            </p>
          </div>

          {/* Right Card: ĐẶC QUYỀN QUẢN NGỤC */}
          <div
            className={`p-3.5 sm:p-4 rounded-3xl border shadow-sm flex items-center gap-3.5 shrink-0 self-start lg:self-auto ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50'
                : 'bg-white/95 border-rose-100/90 text-slate-800 shadow-rose-100/40'
            }`}
          >
            {/* Circular Purple Icon with Heart */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center shrink-0 shadow-inner">
              <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                ĐẶC QUYỀN QUẢN NGỤC
              </span>
              <p className="text-xs sm:text-sm font-semibold">
                Hôm nay còn:{' '}
                <span className="font-extrabold text-rose-600 dark:text-rose-400">
                  {freeHearts} tim miễn phí
                </span>
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 inline" />
                <span>Tự động làm mới lúc 00:00</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Row (Time tabs on left, Zone buttons on right) */}
        <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4 dark:border-slate-800 border-rose-100">
          {/* Time Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/80 dark:bg-slate-800/60 self-start">
            <button
              type="button"
              onClick={() => setTimeFilter('week')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timeFilter === 'week'
                  ? 'bg-rose-400 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tuần này
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('month')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timeFilter === 'month'
                  ? 'bg-rose-400 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tháng này
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                timeFilter === 'all'
                  ? 'bg-rose-400 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Toàn thời gian
            </button>
          </div>

          {/* Area / Zone Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              PHÂN KHU:
            </span>
            <button
              type="button"
              onClick={() => setZoneFilter('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                zoneFilter === 'all'
                  ? 'bg-rose-900 dark:bg-rose-950 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              Tất Cả Phân Khu
            </button>
            <button
              type="button"
              onClick={() => setZoneFilter('lanh')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                zoneFilter === 'lanh'
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>❄️</span>
              <span>Phòng Giam Lạnh</span>
            </button>
            <button
              type="button"
              onClick={() => setZoneFilter('am')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                zoneFilter === 'am'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>☀️</span>
              <span>Phòng Giam Ấm</span>
            </button>
            <button
              type="button"
              onClick={() => setZoneFilter('chualanh')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                zoneFilter === 'chualanh'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>🌿</span>
              <span>Phòng Giam Chữa Lành</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        Notice Banner for Template State (when currently no characters exist)
      */}
      {characters.length === 0 && (
        <div
          className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            darkMode
              ? 'bg-indigo-950/40 border-indigo-900/60 text-indigo-200'
              : 'bg-pink-50/90 border-pink-200 text-pink-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-pink-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Mẫu Bảng Xếp Hạng Mẫu (Hiện tại chưa có nhân vật nào)</p>
              <p className="opacity-80 mt-0.5">
                Các vị trí Quán Quân (Vàng), Hạng 2 (Bạc), Hạng 3 (Đồng) bên dưới đã sẵn sàng. Khi Quản Trị Viên thêm nhân vật mới, các chàng trai sẽ tự động xuất hiện và tranh tài thăng hạng tại đây!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-90 shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm nhân vật mới</span>
          </button>
        </div>
      )}

      {/* 
        ========================================================================
        PODIUM CARDS LAYOUT
        Layout: 3-column grid (Left: Hạng 2 Bạc, Center: Hạng 1 Vàng Quán Quân, Right: Hạng 3 Đồng)
        ========================================================================
      */}
      {characters.length === 0 ? (
        /* TEMPLATE PODIUM WHEN NO CHARACTERS EXIST YET */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-5 lg:gap-6 items-end pt-6">
          {/* ==================== RANK 2: BẠC (PLACEHOLDER TEMPLATE) ==================== */}
          <div
            className={`relative rounded-3xl p-5 border-2 border-dashed transition-all duration-300 flex flex-col items-center text-center shadow-sm ${
              darkMode
                ? 'bg-slate-900/60 border-slate-700/80 text-slate-100'
                : 'bg-white/80 border-slate-300 text-slate-800'
            }`}
          >
            {/* Silver Medal Icon & Badge Tag */}
            <div className="flex flex-col items-center -mt-8 mb-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400 text-slate-700 flex items-center justify-center shadow-md border border-white">
                <Medal className="w-5 h-5 fill-slate-500 text-slate-700" />
              </div>
              <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700">
                HẠNG 2 • BẠC
              </span>
            </div>

            {/* Circular Placeholder Avatar */}
            <div className="relative my-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/60 shadow-inner flex flex-col items-center justify-center p-2 text-slate-400">
                <User className="w-10 h-10 opacity-40 mb-1" />
                <span className="text-[10px] font-bold">Vị Trí Trống</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-md bg-sky-950 text-sky-200 border border-sky-400/30 whitespace-nowrap">
                ❄️ Phòng Giam Lạnh
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-3 space-y-0.5">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-700 dark:text-slate-200">
                Vị Trí Hạng 2 Trống
              </h3>
              <p className="text-xs italic font-medium opacity-60">“Phòng Giam Lạnh · Chờ ứng viên Á Quân”</p>
            </div>

            {/* Tags row */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                ❄️ Phòng Giam Lạnh
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                Chưa có dữ liệu
              </span>
            </div>

            {/* Quote placeholder */}
            <p className="mt-3 text-xs italic opacity-60 leading-relaxed min-h-[44px] flex items-center justify-center px-2 font-serif text-slate-500 dark:text-slate-400">
              Vị trí Á Quân Án Tù tại Phòng Giam Lạnh đang để trống. Khi có nhân vật được thêm vào, bảng xếp hạng sẽ tự động cập nhật tại đây.
            </p>

            {/* Progress bar placeholder */}
            <div className="w-full mt-4 space-y-1.5">
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-300 dark:bg-slate-700 rounded-full w-0" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>0% Tỷ lệ phiếu</span>
                <span className="flex items-center gap-0.5">
                  <Heart className="w-3 h-3 text-slate-400 inline" />
                  <span>0</span>
                </span>
              </div>
            </div>

            {/* Action Buttons placeholder */}
            <div className="w-full mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled
                className="py-2.5 px-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Chờ nhân vật</span>
              </button>
              <button
                type="button"
                disabled
                className="py-2.5 px-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chờ nhân vật</span>
              </button>
            </div>
          </div>

          {/* ==================== RANK 1: QUÁN QUÂN VÀNG (PLACEHOLDER TEMPLATE) ==================== */}
          <div
            className={`relative rounded-3xl p-6 sm:p-7 border-2 border-dashed transition-all duration-300 flex flex-col items-center text-center shadow-md md:-translate-y-4 ${
              darkMode
                ? 'bg-slate-900/80 border-amber-500/60 text-slate-100'
                : 'bg-white/95 border-amber-400 text-slate-800'
            }`}
          >
            {/* Floating Crown Icon on Top */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-xl shadow-amber-500/40 border-2 border-white animate-bounce-short">
                <Crown className="w-7 h-7 fill-amber-950 drop-shadow-sm" />
              </div>
            </div>

            {/* Top Badge: ★ QUÁN QUÂN ÁN TÙ • HẠNG 1 VÀNG */}
            <div className="mt-3 mb-2">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300 shadow-sm inline-flex items-center gap-1">
                <span>★ QUÁN QUÂN ÁN TÙ • HẠNG 1 VÀNG</span>
              </span>
            </div>

            {/* Circular Placeholder Avatar */}
            <div className="relative my-2.5">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-dashed border-amber-400/80 bg-amber-50/50 dark:bg-amber-950/30 shadow-inner flex flex-col items-center justify-center p-3 text-amber-500">
                <Crown className="w-12 h-12 opacity-50 mb-1" />
                <span className="text-xs font-bold">Ngôi Vương Trống</span>
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-black shadow-md bg-amber-950 text-amber-200 border border-amber-400/40 whitespace-nowrap">
                ☀️ Phòng Giam Ấm
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-3 space-y-0.5">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Vị Trí Quán Quân Trống
              </h3>
              <p className="text-sm italic font-serif text-amber-700 dark:text-amber-400 font-bold">
                “Phòng Giam Ấm · Đang chờ chủ nhân Ngôi Vương”
              </p>
            </div>

            {/* Tags row */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800">
                ☀️ Phòng Giam Ấm
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                Chưa có dữ liệu
              </span>
            </div>

            {/* Quote placeholder */}
            <p className="mt-3.5 text-xs sm:text-sm italic text-slate-500 dark:text-slate-400 leading-relaxed min-h-[48px] flex items-center justify-center px-2 font-serif">
              Ngai vàng Quán Quân Án Tù số 1 tại Phòng Giam Ấm đang chờ đón chàng trai nhận được nhiều tình cảm nhất từ các nàng quản ngục.
            </p>

            {/* Progress bar placeholder */}
            <div className="w-full mt-4 space-y-1.5">
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                <div className="h-full bg-amber-300 dark:bg-amber-700 rounded-full w-0" />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>0% Tỷ lệ phiếu</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                  <span>0</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="py-3 px-3 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-amber-500 to-rose-400 text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Thêm nhân vật</span>
              </button>
              <button
                type="button"
                disabled
                className="py-3 px-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>Chờ nhân vật</span>
              </button>
            </div>
          </div>

          {/* ==================== RANK 3: ĐỒNG (PLACEHOLDER TEMPLATE) ==================== */}
          <div
            className={`relative rounded-3xl p-5 border-2 border-dashed transition-all duration-300 flex flex-col items-center text-center shadow-sm ${
              darkMode
                ? 'bg-slate-900/60 border-slate-700/80 text-slate-100'
                : 'bg-white/80 border-slate-300 text-slate-800'
            }`}
          >
            {/* Bronze Medal Icon & Badge Tag */}
            <div className="flex flex-col items-center -mt-8 mb-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-center shadow-md border border-white">
                <Medal className="w-5 h-5 fill-amber-200 text-amber-200" />
              </div>
              <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                HẠNG 3 • ĐỒNG
              </span>
            </div>

            {/* Circular Placeholder Avatar */}
            <div className="relative my-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-amber-700/40 bg-amber-950/10 dark:bg-amber-950/30 shadow-inner flex flex-col items-center justify-center p-2 text-amber-700/60">
                <User className="w-10 h-10 opacity-40 mb-1" />
                <span className="text-[10px] font-bold">Vị Trí Trống</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-md bg-emerald-950 text-emerald-200 border border-emerald-500/40 whitespace-nowrap">
                🌿 Phòng Giam Chữa Lành
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-3 space-y-0.5">
              <h3 className="text-xl font-extrabold tracking-tight text-slate-700 dark:text-slate-200">
                Vị Trí Hạng 3 Trống
              </h3>
              <p className="text-xs italic font-medium opacity-60">“Phòng Giam Chữa Lành · Chờ ứng viên Quý Quân”</p>
            </div>

            {/* Tags row */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                🌿 Phòng Giam Chữa Lành
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                Chưa có dữ liệu
              </span>
            </div>

            {/* Quote placeholder */}
            <p className="mt-3 text-xs italic opacity-60 leading-relaxed min-h-[44px] flex items-center justify-center px-2 font-serif text-slate-500 dark:text-slate-400">
              Vị trí Quý Quân Án Tù tại Phòng Giam Chữa Lành đang để trống. Sẽ tự động ghi nhận khi các nàng quản ngục bắt đầu bình chọn.
            </p>

            {/* Progress bar placeholder */}
            <div className="w-full mt-4 space-y-1.5">
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-300 dark:bg-slate-700 rounded-full w-0" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>0% Tỷ lệ phiếu</span>
                <span className="flex items-center gap-0.5">
                  <Heart className="w-3 h-3 text-slate-400 inline" />
                  <span>0</span>
                </span>
              </div>
            </div>

            {/* Action Buttons placeholder */}
            <div className="w-full mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled
                className="py-2.5 px-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Chờ nhân vật</span>
              </button>
              <button
                type="button"
                disabled
                className="py-2.5 px-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800/50 text-slate-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chờ nhân vật</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* LIVE PODIUM FOR REAL CHARACTERS (Dynamic ranking when characters are added) */
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-5 lg:gap-6 items-end pt-6">
            {/* ==================== RANK 2: BẠC (REAL) ==================== */}
            {sortedReal[1] ? (
              <div
                className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                  darkMode ? 'bg-slate-900/90 border-slate-700/80 text-slate-100 shadow-slate-950/60' : 'bg-white border-slate-200/90 text-slate-800 shadow-slate-200/50'
                }`}
              >
                <div className="flex flex-col items-center -mt-8 mb-2">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400 text-slate-700 flex items-center justify-center shadow-md">
                    <Medal className="w-5 h-5 fill-slate-500 text-slate-700" />
                  </div>
                  <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    HẠNG 2 • BẠC
                  </span>
                </div>

                <div className="relative my-2 cursor-pointer" onClick={() => onOpenDetail?.(sortedReal[1])}>
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 shadow-lg flex items-center justify-center overflow-hidden">
                    {sortedReal[1].avatarUrl ? (
                      <img src={sortedReal[1].avatarUrl} alt={sortedReal[1].name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-700 text-white font-black text-2xl flex items-center justify-center">
                        {sortedReal[1].name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-md bg-sky-950 text-sky-200 border border-sky-400/30 whitespace-nowrap">
                    {sortedReal[1].zone || 'Phòng Giam Lạnh'} · {sortedReal[1].prisonId}
                  </div>
                </div>

                <h3 className="mt-3 text-xl font-extrabold tracking-tight cursor-pointer hover:text-pink-500" onClick={() => onOpenDetail?.(sortedReal[1])}>
                  {sortedReal[1].name}
                </h3>
                <p className="text-xs italic opacity-75 font-medium">{sortedReal[1].genres.join(' · ')}</p>

                <p className="mt-3 text-xs italic opacity-75 leading-relaxed min-h-[44px] flex items-center justify-center px-1 font-serif line-clamp-2">
                  “{sortedReal[1].backstory || 'Phạm nhân đang chờ quản ngục thăm nuôi...'}”
                </p>

                <div className="w-full mt-4 space-y-1.5">
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
                      style={{ width: `${Math.round((sortedReal[1].likes / totalRealLikes) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{Math.round((sortedReal[1].likes / totalRealLikes) * 100)}% Tỷ lệ phiếu</span>
                    <span className="text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
                      <Heart className="w-3 h-3 fill-sky-500" />
                      <span>{sortedReal[1].likes.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleVoteReal(sortedReal[1].id)}
                    className="py-2.5 px-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>+1 Thả Tim</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTarget({ id: sortedReal[1].id, name: sortedReal[1].name })}
                    className="py-2.5 px-3 rounded-2xl font-bold text-xs bg-white dark:bg-slate-900 border border-pink-200 text-pink-600 hover:bg-pink-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Thư Tình</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                <Medal className="w-6 h-6 opacity-30 mb-2" />
                <span>Đang chờ ứng viên Hạng 2</span>
              </div>
            )}

            {/* ==================== RANK 1: VÀNG QUÁN QUÂN (REAL) ==================== */}
            {sortedReal[0] ? (
              <div
                className={`relative rounded-3xl p-6 sm:p-7 border-2 transition-all duration-300 flex flex-col items-center text-center shadow-2xl md:-translate-y-4 ${
                  darkMode
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-pink-950/40 border-amber-400/80 text-slate-100'
                    : 'bg-gradient-to-b from-white via-white to-pink-50/50 border-amber-400 text-slate-800'
                }`}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-xl border-2 border-white animate-bounce-short">
                    <Crown className="w-7 h-7 fill-amber-950" />
                  </div>
                </div>

                <div className="mt-3 mb-2">
                  <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300 shadow-sm inline-flex items-center gap-1">
                    <span>★ QUÁN QUÂN ÁN TÙ • HẠNG 1 VÀNG</span>
                  </span>
                </div>

                <div className="relative my-2.5 cursor-pointer" onClick={() => onOpenDetail?.(sortedReal[0])}>
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr from-pink-400 via-amber-300 to-rose-400 shadow-xl flex items-center justify-center overflow-hidden">
                    {sortedReal[0].avatarUrl ? (
                      <img src={sortedReal[0].avatarUrl} alt={sortedReal[0].name} className="w-full h-full rounded-full object-cover ring-2 ring-white/80" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-pink-600 text-white font-black text-3xl flex items-center justify-center">
                        {sortedReal[0].name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-black shadow-md bg-rose-950 text-rose-200 border border-pink-400/40 whitespace-nowrap">
                    {sortedReal[0].zone || 'Phòng Giam Ấm'} · {sortedReal[0].prisonId}
                  </div>
                </div>

                <h3 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight cursor-pointer hover:text-pink-500" onClick={() => onOpenDetail?.(sortedReal[0])}>
                  {sortedReal[0].name}
                </h3>
                <p className="text-sm italic font-serif text-rose-700 dark:text-rose-400 font-bold">{sortedReal[0].genres.join(' · ')}</p>

                <p className="mt-3.5 text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed min-h-[48px] flex items-center justify-center px-1 font-serif line-clamp-2">
                  “{sortedReal[0].backstory || 'Chồng nhỏ quốc dân đang nhận trọn vẹn tình cảm từ các nàng quản ngục...'}”
                </p>

                <div className="w-full mt-4 space-y-1.5">
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-rose-400 rounded-full"
                      style={{ width: `${Math.round((sortedReal[0].likes / totalRealLikes) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-rose-600 dark:text-rose-400">
                      {Math.round((sortedReal[0].likes / totalRealLikes) * 100)}% Áp đảo phiếu bầu
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      <span>{sortedReal[0].likes.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <div className="w-full mt-5 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleVoteReal(sortedReal[0].id)}
                    className="py-3 px-3 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-pink-500/30 hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>+1 Thả Tim</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTarget({ id: sortedReal[0].id, name: sortedReal[0].name })}
                    className="py-3 px-3 rounded-2xl font-bold text-xs bg-white dark:bg-slate-900 border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Gửi Thư Tình</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-3xl border border-dashed border-amber-300 dark:border-amber-900/60 flex flex-col items-center justify-center text-xs text-amber-500 p-4 text-center">
                <Crown className="w-8 h-8 opacity-40 mb-2" />
                <span>Đang chờ Quán Quân Án Tù</span>
              </div>
            )}

            {/* ==================== RANK 3: ĐỒNG (REAL) ==================== */}
            {sortedReal[2] ? (
              <div
                className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                  darkMode ? 'bg-slate-900/90 border-slate-700/80 text-slate-100 shadow-slate-950/60' : 'bg-white border-slate-200/90 text-slate-800 shadow-slate-200/50'
                }`}
              >
                <div className="flex flex-col items-center -mt-8 mb-2">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-center shadow-md">
                    <Medal className="w-5 h-5 fill-amber-200 text-amber-200" />
                  </div>
                  <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                    HẠNG 3 • ĐỒNG
                  </span>
                </div>

                <div className="relative my-2 cursor-pointer" onClick={() => onOpenDetail?.(sortedReal[2])}>
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-lg flex items-center justify-center overflow-hidden">
                    {sortedReal[2].avatarUrl ? (
                      <img src={sortedReal[2].avatarUrl} alt={sortedReal[2].name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-amber-700 text-white font-black text-2xl flex items-center justify-center">
                        {sortedReal[2].name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-md bg-emerald-950 text-emerald-200 border border-emerald-400/30 whitespace-nowrap">
                    {sortedReal[2].zone || 'Phòng Giam Chữa Lành'} · {sortedReal[2].prisonId}
                  </div>
                </div>

                <h3 className="mt-3 text-xl font-extrabold tracking-tight cursor-pointer hover:text-pink-500" onClick={() => onOpenDetail?.(sortedReal[2])}>
                  {sortedReal[2].name}
                </h3>
                <p className="text-xs italic opacity-75 font-medium">{sortedReal[2].genres.join(' · ')}</p>

                <p className="mt-3 text-xs italic opacity-75 leading-relaxed min-h-[44px] flex items-center justify-center px-1 font-serif line-clamp-2">
                  “{sortedReal[2].backstory || 'Phạm nhân đang tích cực cạnh tranh thứ hạng...'}”
                </p>

                <div className="w-full mt-4 space-y-1.5">
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                      style={{ width: `${Math.round((sortedReal[2].likes / totalRealLikes) * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{Math.round((sortedReal[2].likes / totalRealLikes) * 100)}% Tỷ lệ phiếu</span>
                    <span className="text-purple-600 dark:text-purple-400 flex items-center gap-0.5">
                      <Heart className="w-3 h-3 fill-purple-500" />
                      <span>{sortedReal[2].likes.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <div className="w-full mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleVoteReal(sortedReal[2].id)}
                    className="py-2.5 px-3 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-purple-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>+1 Thả Tim</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTarget({ id: sortedReal[2].id, name: sortedReal[2].name })}
                    className="py-2.5 px-3 rounded-2xl font-bold text-xs bg-white dark:bg-slate-900 border border-pink-200 text-pink-600 hover:bg-pink-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Thư Tình</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                <Medal className="w-6 h-6 opacity-30 mb-2" />
                <span>Đang chờ ứng viên Hạng 3</span>
              </div>
            )}
          </div>

          {/* Ranks 4 and beyond for real characters */}
          {sortedReal.length > 3 && (
            <div
              className={`rounded-3xl border overflow-hidden ${
                darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-pink-100 shadow-sm'
              }`}
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-extrabold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Các Hạng Kế Tiếp (Từ Hạng 4)</span>
                </span>
                <span className="text-xs text-slate-400">Cập nhật thời gian thực</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedReal.slice(3).map((char, idx) => (
                  <div
                    key={char.id}
                    onClick={() => onOpenDetail?.(char)}
                    className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-pink-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500">
                        {idx + 4}
                      </span>
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        {char.avatarUrl ? (
                          <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-600">
                            {char.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold">{char.name}</h4>
                        <p className="text-[11px] text-slate-400">{char.zone ? `${char.zone} · ` : ''}{char.prisonId} · {char.genres.join(', ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        <span>{char.likes}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 
        ========================================================================
        LOVE LETTER MODAL ("GỬI THƯ TÌNH ĐẾN CHỒNG NHỎ")
        ========================================================================
      */}
      {selectedTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative transition-all ${
              darkMode
                ? 'bg-slate-900 border-pink-500/40 text-slate-100 shadow-pink-950/60'
                : 'bg-white border-pink-200 text-slate-800 shadow-pink-200/60'
            }`}
          >
            <button
              type="button"
              onClick={() => setSelectedTarget(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-pink-500/15 text-pink-500 border border-pink-500/20">
                💌 Gửi Thư Tình Vào Phòng Giam
              </span>
              <h3 className="text-lg font-black">
                Gửi Đến: <span className="text-rose-500">{selectedTarget.name}</span>
              </h3>
              <p className="text-xs opacity-65">
                Bức thư sẽ được đính kèm vào hồ sơ và gửi những lời vỗ về ngọt ngào nhất.
              </p>
            </div>

            {loveSuccessMsg ? (
              <div className="py-8 text-center space-y-2 animate-fadeIn">
                <div className="w-14 h-14 mx-auto rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-500 flex items-center justify-center text-2xl animate-bounce-short">
                  💖
                </div>
                <p className="text-sm font-bold text-pink-600 dark:text-pink-400">{loveSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLoveLetter} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-75">
                    Tên Nàng (Người gửi):
                  </label>
                  <input
                    type="text"
                    value={loveSender}
                    onChange={(e) => setLoveSender(e.target.value)}
                    placeholder="Ví dụ: Nàng Quản Ngục Bé Nhỏ"
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs border outline-none bg-pink-50/40 dark:bg-slate-800/60 border-pink-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-75">
                    Lời Thư Tình Dành Cho Chàng:
                  </label>
                  <textarea
                    rows={4}
                    value={loveLetterText}
                    onChange={(e) => setLoveLetterText(e.target.value)}
                    required
                    placeholder="Viết những lời dỗ dành, yêu thương gửi đến chàng trong phòng giam..."
                    className="w-full px-3.5 py-2.5 rounded-2xl text-xs border outline-none bg-pink-50/40 dark:bg-slate-800/60 border-pink-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-400 resize-none"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold opacity-60 w-full">Gợi ý nhanh:</span>
                  {[
                    'Dù xích son giam giữ, tim em vẫn luôn hướng về anh~',
                    'Đừng buồn nhé chồng nhỏ, em sẽ mang bánh dâu đến thăm anh!',
                    'Anh là quán quân duy nhất trong trái tim em 💖',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLoveLetterText(preset)}
                      className="text-[10px] px-2.5 py-1 rounded-full bg-pink-100/70 dark:bg-slate-800 text-pink-700 dark:text-pink-300 hover:bg-pink-200 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTarget(null)}
                    className="flex-1 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-500/30 hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Thư Tình</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
