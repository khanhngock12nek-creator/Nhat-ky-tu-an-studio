import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Gift,
  Coins,
  ChevronLeft,
  ChevronRight,
  Trophy,
  CheckCircle2,
  Heart,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../../types';

interface ClawMachineGameProps {
  darkMode: boolean;
  onBack: () => void;
  character?: Character | null;
}

interface PrizeItem {
  id: string;
  name: string;
  emoji: string;
  rarity: 'Phổ Thông' | 'Hiếm' | 'Huyền Thoại' | 'Bảo Vật Tối Thượng';
  color: string;
  xPos: number; // percentage 10 to 90
  yPos?: number; // vertical position in chamber
}

const PACKED_PRIZES: PrizeItem[] = [
  { id: 'p1', name: 'Gấu Bông Tù Nhân #07', emoji: '🧸', rarity: 'Phổ Thông', color: '#f43f5e', xPos: 15, yPos: 80 },
  { id: 'p2', name: 'Còng Tay Hoàng Gia Mạ Vàng', emoji: '🔗', rarity: 'Hiếm', color: '#eab308', xPos: 25, yPos: 75 },
  { id: 'p3', name: 'Chìa Khóa Vàng Buồng Giam', emoji: '🗝️', rarity: 'Hiếm', color: '#f59e0b', xPos: 35, yPos: 82 },
  { id: 'p4', name: 'Búp Bê Thần Bí Ngục Tối', emoji: '🪆', rarity: 'Phổ Thông', color: '#8b5cf6', xPos: 45, yPos: 78 },
  { id: 'p5', name: 'Nhẫn Định Ước Kim Cương', emoji: '💍', rarity: 'Huyền Thoại', color: '#06b6d4', xPos: 55, yPos: 72 },
  { id: 'p6', name: 'Trái Tim Pha Lê Hồng', emoji: '💎', rarity: 'Hiếm', color: '#ec4899', xPos: 65, yPos: 80 },
  { id: 'p7', name: 'Vương Miện Quản Ngục Cổ', emoji: '👑', rarity: 'Bảo Vật Tối Thượng', color: '#fbbf24', xPos: 75, yPos: 74 },
  { id: 'p8', name: 'Hũ Thuốc Độc Bí Ẩn', emoji: '🧪', rarity: 'Hiếm', color: '#10b981', xPos: 85, yPos: 79 },
  { id: 'p9', name: 'Thẻ Bài Tarot Định Mệnh', emoji: '🎴', rarity: 'Phổ Thông', color: '#6366f1', xPos: 20, yPos: 60 },
  { id: 'p10', name: 'Túi Xu Phạt Vàng Ròng', emoji: '💰', rarity: 'Hiếm', color: '#f59e0b', xPos: 32, yPos: 65 },
  { id: 'p11', name: 'Hộp Nhạc Ký Ức Cấm', emoji: '🎶', rarity: 'Huyền Thoại', color: '#ec4899', xPos: 50, yPos: 62 },
  { id: 'p12', name: 'Hồng Ngọc Huyết Tộc', emoji: '❤️', rarity: 'Bảo Vật Tối Thượng', color: '#ef4444', xPos: 68, yPos: 66 },
  { id: 'p13', name: 'Hoa Hồng Đen Tù Tội', emoji: '🌹', rarity: 'Phổ Thông', color: '#475569', xPos: 80, yPos: 63 },
  { id: 'p14', name: 'Ly Rượu Đắng Hoàng Gia', emoji: '🍷', rarity: 'Hiếm', color: '#881337', xPos: 40, yPos: 55 },
  { id: 'p15', name: 'Quả Cầu Tiên Tri Sáng', emoji: '🔮', rarity: 'Huyền Thoại', color: '#8b5cf6', xPos: 60, yPos: 53 },
];

export const ClawMachineGame: React.FC<ClawMachineGameProps> = ({ darkMode, onBack }) => {
  const [coins, setCoins] = useState(30);
  const [clawX, setClawX] = useState(50); // percentage 10% - 90%
  const [clawY, setClawY] = useState(15); // percentage 15% (top) - 75% (bottom)
  const [isClawing, setIsClawing] = useState(false);
  const [clawClosed, setClawClosed] = useState(false);
  const [chamberPrizes, setChamberPrizes] = useState<PrizeItem[]>(PACKED_PRIZES);
  const [caughtPrize, setCaughtPrize] = useState<PrizeItem | null>(null);
  const [inventory, setInventory] = useState<PrizeItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const moveLeft = () => {
    if (isClawing) return;
    setClawX((prev) => Math.max(10, prev - 6));
  };

  const moveRight = () => {
    if (isClawing) return;
    setClawX((prev) => Math.min(90, prev + 6));
  };

  const handleDropClaw = () => {
    if (isClawing || coins <= 0) return;
    setCoins((c) => c - 1);
    setIsClawing(true);
    setCaughtPrize(null);
    setMessage('🕹️ Đang hạ càng gắp xuống khoang bảo vật...');

    // 1. Drop down
    setTimeout(() => {
      setClawY(78);

      // Check collision with any item in chamber near clawX
      setTimeout(() => {
        setClawClosed(true);

        // Find nearest prize or any prize within generous tolerance (or pick random from chamber if any)
        const nearbyPrizes = chamberPrizes.filter(
          (p) => Math.abs(p.xPos - clawX) <= 15
        );

        let targetPrize: PrizeItem | null = null;
        if (nearbyPrizes.length > 0) {
          // pick closest
          targetPrize = nearbyPrizes.reduce((prev, curr) =>
            Math.abs(curr.xPos - clawX) < Math.abs(prev.xPos - clawX) ? curr : prev
          );
        } else if (chamberPrizes.length > 0) {
          // fallback to any random item in the chamber so you can always grab anything!
          targetPrize = chamberPrizes[Math.floor(Math.random() * chamberPrizes.length)];
        }

        const success = targetPrize !== null;

        if (success && targetPrize) {
          setCaughtPrize(targetPrize);
          setMessage(`🎯 Đã tóm được "${targetPrize.name}"! Đang đưa về hộc quà...`);
          // Remove from chamber
          setChamberPrizes((prev) => prev.filter((p) => p.id !== targetPrize?.id));
        } else {
          setMessage('💨 Hụt mất rồi! Khoang đầy ắp, hãy thử lại nhé.');
        }

        // 2. Retract up
        setTimeout(() => {
          setClawY(15);

          // 3. Move claw back to chute (left x=15)
          setTimeout(() => {
            setClawX(15);

            // 4. Release claw into chute
            setTimeout(() => {
              setClawClosed(false);
              if (success && targetPrize) {
                setInventory((prev) => [targetPrize!, ...prev]);
                setMessage(`🎉 TUYỆT VỜI! Đã nhận thành công "${targetPrize.name}" vào Tủ Quà!`);
                confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
              }

              // Automatically refill chamber if running low
              if (chamberPrizes.length <= 5) {
                setChamberPrizes(PACKED_PRIZES);
              }

              setCaughtPrize(null);
              setIsClawing(false);
            }, 600);
          }, 800);
        }, 800);
      }, 700);
    }, 200);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'bg-white border-rose-200 text-slate-700 hover:bg-rose-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-rose-500" />
          <span>Về Khu Trò Chơi</span>
        </button>

        <div className="px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Khoang bảo vật đầy ắp • Có thể gắp bất kỳ món đồ nào bên trong</span>
        </div>
      </div>

      {/* Banner */}
      <div
        className={`p-6 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-pink-100'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-pink-500/30">
              🕹️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  MÁY GẮP BẢO VẬT HOÀNG GIA (CLAW MACHINE)
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-500">
                  Khoang Đầy Ắp Vật Phẩm
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Khoang kính chứa hàng chục món bảo vật lung linh di chuyển tự do. Căn tọa độ và gắp bất kỳ món quà nào bạn thích!
              </p>
            </div>
          </div>

          {/* Coin Counter & Refill */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{coins} Xu Xèng</span>
            </div>
            <button
              type="button"
              onClick={() => setCoins((c) => c + 15)}
              className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow hover:bg-amber-600 cursor-pointer"
            >
              +15 Xu
            </button>
            <button
              type="button"
              onClick={() => setChamberPrizes(PACKED_PRIZES)}
              className="px-3 py-2 rounded-xl bg-pink-500 text-white text-xs font-bold shadow hover:bg-pink-600 cursor-pointer"
              title="Làm đầy lại khoang bảo vật"
            >
              Làm Đầy Khoang
            </button>
          </div>
        </div>
      </div>

      {/* Main Claw Area + Collection Shelf */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Claw Machine Cabinet */}
        <div
          className={`lg:col-span-2 p-6 rounded-3xl border shadow-2xl flex flex-col items-center justify-between relative overflow-hidden ${
            darkMode
              ? 'bg-slate-950 border-purple-900/50'
              : 'bg-gradient-to-b from-pink-50 via-white to-purple-50 border-pink-200'
          }`}
        >
          {/* Glass Chamber */}
          <div className="w-full h-96 sm:h-[420px] rounded-2xl border-4 border-pink-400/60 dark:border-purple-600/60 relative overflow-hidden bg-slate-900/20 dark:bg-slate-950 shadow-inner flex flex-col justify-between p-3">
            {/* Top rail */}
            <div className="w-full h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full relative shadow-md">
              {/* Claw trolley */}
              <div
                className="absolute top-0 w-8 h-4 bg-amber-400 border border-amber-600 rounded-md -translate-x-1/2 transition-all duration-300 shadow"
                style={{ left: `${clawX}%` }}
              />
            </div>

            {/* Cable + Claw */}
            <div
              className="absolute pointer-events-none transition-all duration-300 flex flex-col items-center z-20"
              style={{
                left: `${clawX}%`,
                top: '12px',
                transform: 'translateX(-50%)',
              }}
            >
              {/* String cable */}
              <div
                className="w-1 bg-amber-300 transition-all duration-500"
                style={{ height: `${(clawY / 100) * 320}px` }}
              />

              {/* Claw Head */}
              <div className="relative flex flex-col items-center">
                <div className="w-6 h-4 bg-amber-500 rounded-t-lg border border-white shadow" />
                {/* 3 Prongs */}
                <div
                  className={`flex gap-1.5 transition-transform duration-300 ${
                    clawClosed ? 'scale-75' : 'scale-100'
                  }`}
                >
                  <div className="w-2.5 h-6 bg-amber-400 rounded-bl-full rotate-12 shadow" />
                  <div className="w-2.5 h-6 bg-amber-400 rounded-br-full -rotate-12 shadow" />
                </div>

                {/* Caught Prize sticking to claw */}
                {caughtPrize && (
                  <div className="text-3xl -mt-2 animate-bounce bg-white/90 dark:bg-slate-900/90 p-1 rounded-full shadow-lg">
                    {caughtPrize.emoji}
                  </div>
                )}
              </div>
            </div>

            {/* Prize Chute (Bottom-Left) */}
            <div className="absolute bottom-2 left-3 w-16 h-16 rounded-xl bg-slate-800/80 border-2 border-dashed border-amber-400/80 flex flex-col items-center justify-center text-[9px] font-bold text-amber-300 text-center shadow-lg z-10">
              <span>HỘC QUÀ</span>
              <span className="text-xs">⬇️</span>
            </div>

            {/* Packed Chamber Floor & Stacked Treasures */}
            <div className="w-full h-64 relative">
              {chamberPrizes.map((prize) => (
                <div
                  key={prize.id}
                  className="absolute flex flex-col items-center transition-transform hover:scale-125 select-none animate-pulse cursor-pointer group"
                  style={{
                    left: `${prize.xPos}%`,
                    top: `${prize.yPos || 70}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={`${prize.name} (${prize.rarity})`}
                >
                  <span className="text-3xl sm:text-4xl drop-shadow-lg filter group-hover:brightness-125">
                    {prize.emoji}
                  </span>
                  <span className="text-[8px] font-bold text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 px-1 rounded shadow opacity-80 group-hover:opacity-100 whitespace-nowrap">
                    {prize.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Message */}
          {message && (
            <div className="w-full mt-3 p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-400 text-xs font-bold text-center animate-bounce">
              {message}
            </div>
          )}

          {/* Control Deck (Joystick Buttons) */}
          <div className="w-full mt-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Left/Right buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={moveLeft}
                disabled={isClawing}
                className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow hover:bg-slate-50 cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={moveRight}
                disabled={isClawing}
                className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow hover:bg-slate-50 cursor-pointer disabled:opacity-40"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <span className="text-xs font-bold text-slate-400 ml-1">
                Di chuyển cần gạt
              </span>
            </div>

            {/* Drop Claw Button */}
            <button
              type="button"
              onClick={handleDropClaw}
              disabled={isClawing || coins <= 0}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isClawing ? 'ĐANG GẮP...' : 'HẠ CÀNG GẮP (-1 XU)'}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Collection Shelf (Tủ Quà Đã Gắp Thành Công) */}
        <div className="space-y-4">
          <div
            className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-pink-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-500" />
                <span>Tủ Quà Đã Gắp ({inventory.length})</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500">
                Lưu Trữ Ngục Tối
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Các bảo vật gắp thành công từ khoang đầy ắp sẽ lưu tại đây để chuẩn bị tặng nhân vật.
            </p>

            {inventory.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                <Package className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                <div className="text-xs font-bold text-slate-400">Tủ quà hiện đang trống</div>
                <div className="text-[11px] text-slate-400">
                  Hãy thả càng gắp vào khoang bảo vật để thu thập ngay nhé!
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {inventory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          {item.rarity}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-400 text-[10px] font-bold flex items-center gap-1 cursor-not-allowed"
                      title="Chưa có nhân vật nào để tặng"
                    >
                      <Heart className="w-3 h-3 text-slate-400" />
                      <span>Chưa có NV</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
