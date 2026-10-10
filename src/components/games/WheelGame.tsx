import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Dices,
  AlertTriangle,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../../types';
import { GameHeader } from './GameHeader';

interface WheelGameProps {
  darkMode: boolean;
  onBack: () => void;
  character?: Character | null;
  characters?: Character[];
  onSelectCharacter?: (char: Character) => void;
}

interface WheelSegment {
  id: number;
  text: string;
  type: 'dare' | 'truth' | 'punish' | 'reward';
  color: string;
  badge: string;
}

const SEGMENTS: WheelSegment[] = [
  {
    id: 1,
    text: 'Thú nhận 1 bí mật thầm kín nhất',
    type: 'truth',
    color: '#ec4899', // pink-500
    badge: 'NÓI THẬT',
  },
  {
    id: 2,
    text: 'Hát 1 đoạn tình ca cho quản ngục',
    type: 'dare',
    color: '#8b5cf6', // purple-500
    badge: 'THỬ THÁCH',
  },
  {
    id: 3,
    text: 'Chống đẩy 15 cái ngay lập tức',
    type: 'punish',
    color: '#f97316', // orange-500
    badge: 'THỂ LỰC',
  },
  {
    id: 4,
    text: 'Kể 3 tật xấu của bản thân trong ngục',
    type: 'truth',
    color: '#3b82f6', // blue-500
    badge: 'THÀNH THẬT',
  },
  {
    id: 5,
    text: 'Biệt giam buồng tối 1 lượt',
    type: 'punish',
    color: '#ef4444', // red-500
    badge: 'HÌNH PHẠT',
  },
  {
    id: 6,
    text: 'Thưởng 500 Xu & Miễn Thẩm Vấn',
    type: 'reward',
    color: '#eab308', // yellow-500
    badge: 'ĐẠI VẬN MAY',
  },
  {
    id: 7,
    text: 'Nhại giọng 1 nhân vật trong 30 giây',
    type: 'dare',
    color: '#10b981', // emerald-500
    badge: 'DIỄN XUẤT',
  },
  {
    id: 8,
    text: 'Làm theo 1 mệnh lệnh bất kỳ',
    type: 'dare',
    color: '#d946ef', // fuchsia-500
    badge: 'PHỤC TÙNG',
  },
];

export const WheelGame: React.FC<WheelGameProps> = ({
  darkMode,
  onBack,
  character,
  characters = [],
  onSelectCharacter,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [history, setHistory] = useState<WheelSegment[]>([]);

  const totalSegments = SEGMENTS.length;
  const degreesPerSegment = 360 / totalSegments;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Random winner index
    const winningIndex = Math.floor(Math.random() * totalSegments);
    // Number of full rotations (5 to 8 rotations) + target angle
    const extraRotations = 360 * (5 + Math.floor(Math.random() * 3));
    // The top pointer points to 270 deg (top).
    // Calculate angle so winningIndex lands at top
    const segmentCenterAngle = winningIndex * degreesPerSegment + degreesPerSegment / 2;
    const targetAngle = 360 - segmentCenterAngle;
    const newRotation = rotation + extraRotations + (targetAngle - (rotation % 360));

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const selected = SEGMENTS[winningIndex];
      setResult(selected);
      setSpinCount((prev) => prev + 1);
      setHistory((prev) => [selected, ...prev.slice(0, 9)]);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Header with Character Selector */}
      <GameHeader
        darkMode={darkMode}
        onBack={onBack}
        character={character}
        characters={characters}
        onSelectCharacter={onSelectCharacter}
        gameTitle="VÒNG QUAY THỬ THÁCH"
        badgeText="Đang quay thử nghiệm buồng giam"
      />

      {/* Banner */}
      <div
        className={`p-6 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-pink-500/30">
              🎡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {character ? `VÒNG QUAY ${character.name.toUpperCase()}` : 'VÒNG QUAY THỬ THÁCH CẢM XÚC'}
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-500">
                  Truth or Dare • Ngục Tối
                </span>
              </div>
              <p className="text-xs text-slate-900 dark:text-slate-400">
                {character
                  ? `Quay bánh xe số phận để cùng ${character.name} thực hiện các thử thách Truth or Dare đầy kịch tính`
                  : 'Quay bánh xe số phận để nhận các mệnh lệnh, câu hỏi bí mật hoặc hình phạt bất ngờ'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Lượt quay hôm nay:</span>
            <div className="text-xl font-black text-rose-500">{spinCount} lượt</div>
          </div>
        </div>
      </div>

      {/* Main Wheel Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 p-6 sm:p-10 rounded-3xl border shadow-xl flex flex-col items-center justify-center relative overflow-hidden ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50 border-sky-200'
          }`}
        >
          {/* Wheel Pointer (Top Needle) */}
          <div className="absolute top-4 sm:top-6 z-20 flex flex-col items-center pointer-events-none">
            <div className="w-6 h-8 bg-rose-600 shadow-xl clip-triangle transform rotate-180 drop-shadow-md animate-bounce" />
            <div className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-white -mt-1 shadow" />
          </div>

          {/* SVG Spinning Wheel */}
          <div className="relative mt-4">
            <div
              className="w-72 h-72 sm:w-84 sm:h-84 rounded-full shadow-2xl p-2 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 transition-transform duration-[4000ms] ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionTimingFunction: 'cubic-bezier(0.15, 0.85, 0.25, 1)',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
                {SEGMENTS.map((seg, i) => {
                  const startAngle = i * (360 / totalSegments);
                  const endAngle = (i + 1) * (360 / totalSegments);
                  const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                  const textAngle = startAngle + 360 / totalSegments / 2;
                  const textRad = (Math.PI * (textAngle - 90)) / 180;
                  const tx = 50 + 32 * Math.cos(textRad);
                  const ty = 50 + 32 * Math.sin(textRad);

                  return (
                    <g key={seg.id}>
                      <path d={pathData} fill={seg.color} stroke="#ffffff" strokeWidth="0.6" />
                      <text
                        x={tx}
                        y={ty}
                        fill="#ffffff"
                        fontSize="3.8"
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                      >
                        {seg.badge}
                      </text>
                    </g>
                  );
                })}
                {/* Center Hub */}
                <circle cx="50" cy="50" r="10" fill="#1e1b4b" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="6" fill="#f43f5e" />
              </svg>
            </div>
          </div>

          {/* Spin Trigger Button */}
          <div className="mt-8 z-10">
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Đang Quay Bánh Xe...' : 'QUAY THỬ THÁCH NGAY'}</span>
            </button>
          </div>
        </div>

        {/* Result & History Sidebar */}
        <div className="space-y-4">
          {/* Active Result Card */}
          {result && (
            <div
              className={`p-6 rounded-3xl border shadow-xl animate-scaleIn space-y-4 ${
                darkMode ? 'bg-slate-900/90 border-rose-900/60' : 'bg-sky-50 border-sky-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white shadow" style={{ backgroundColor: result.color }}>
                  {result.badge}
                </span>
                <span className="text-xs font-bold text-slate-400">Kết quả vòng quay</span>
              </div>

              <div className="text-base font-black text-slate-900 dark:text-white leading-snug">
                "{result.text}"
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã Hoàn Thành Thử Thách</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Bỏ Qua / Quay Lại</span>
                </button>
              </div>
            </div>
          )}

          {/* History */}
          <div
            className={`p-5 rounded-3xl border shadow-md space-y-3 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50 border-sky-200'
            }`}
          >
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Lịch Sử Quay Gần Đây</span>
            </h4>

            {history.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6 italic">
                Chưa có lượt quay nào. Hãy bấm nút quay để thử vận may!
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-sky-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-900 dark:text-slate-200 truncate pr-2">
                      {h.text}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white shrink-0"
                      style={{ backgroundColor: h.color }}
                    >
                      {h.badge}
                    </span>
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
