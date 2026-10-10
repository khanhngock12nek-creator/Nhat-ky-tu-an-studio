import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Briefcase,
  PhoneCall,
  DollarSign,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuitcaseGameProps {
  darkMode: boolean;
  onBack: () => void;
}

const MONEY_VALUES = [
  1, 5, 10, 50, 100, 250, 500, 1000,
  5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000,
];

interface Suitcase {
  id: number;
  value: number;
  isOpened: boolean;
}

export const SuitcaseGame: React.FC<SuitcaseGameProps> = ({ darkMode, onBack }) => {
  const [suitcases, setSuitcases] = useState<Suitcase[]>(() => {
    const shuffled = [...MONEY_VALUES].sort(() => 0.5 - Math.random());
    return shuffled.map((val, idx) => ({
      id: idx + 1,
      value: val,
      isOpened: false,
    }));
  });

  const [mySuitcaseId, setMySuitcaseId] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [toOpenInRound, setToOpenInRound] = useState(4); // number of cases to open in this round
  const [bankerOffer, setBankerOffer] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);
  const [acceptedDeal, setAcceptedDeal] = useState(false);

  const resetGame = () => {
    const shuffled = [...MONEY_VALUES].sort(() => 0.5 - Math.random());
    setSuitcases(
      shuffled.map((val, idx) => ({
        id: idx + 1,
        value: val,
        isOpened: false,
      }))
    );
    setMySuitcaseId(null);
    setRound(1);
    setToOpenInRound(4);
    setBankerOffer(null);
    setIsGameOver(false);
    setWonAmount(null);
    setAcceptedDeal(false);
  };

  const remainingCases = suitcases.filter((s) => !s.isOpened && s.id !== mySuitcaseId);

  const handleSuitcaseClick = (suitcase: Suitcase) => {
    if (isGameOver || bankerOffer !== null) return;

    // Pick player's own case
    if (mySuitcaseId === null) {
      setMySuitcaseId(suitcase.id);
      return;
    }

    // Cannot open own case until end
    if (suitcase.id === mySuitcaseId || suitcase.isOpened) return;

    // Open this case
    const updated = suitcases.map((s) =>
      s.id === suitcase.id ? { ...s, isOpened: true } : s
    );
    setSuitcases(updated);

    const newToOpen = toOpenInRound - 1;
    if (newToOpen <= 0) {
      // Round complete -> Banker makes offer!
      const unrevealedValues = updated
        .filter((s) => !s.isOpened)
        .map((s) => s.value);

      if (unrevealedValues.length <= 2) {
        // Final case reached
        finishGame(updated, false);
      } else {
        const avg =
          unrevealedValues.reduce((a, b) => a + b, 0) / unrevealedValues.length;
        // Banker pays 75% to 90% of expected value
        const offer = Math.floor(avg * (0.75 + round * 0.04));
        setBankerOffer(offer);
      }
    } else {
      setToOpenInRound(newToOpen);
    }
  };

  const handleAcceptDeal = () => {
    if (bankerOffer === null) return;
    setAcceptedDeal(true);
    setWonAmount(bankerOffer);
    setIsGameOver(true);
    // Reveal all
    setSuitcases((prev) => prev.map((s) => ({ ...s, isOpened: true })));
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleRejectDeal = () => {
    setBankerOffer(null);
    setRound((r) => r + 1);
    const remainingCount = suitcases.filter((s) => !s.isOpened && s.id !== mySuitcaseId).length;
    setToOpenInRound(Math.min(3, remainingCount - 1));
  };

  const finishGame = (currentCases: Suitcase[], accepted: boolean) => {
    setIsGameOver(true);
    const myCase = currentCases.find((s) => s.id === mySuitcaseId);
    if (myCase) {
      setWonAmount(myCase.value);
    }
    // Reveal all
    setSuitcases(currentCases.map((s) => ({ ...s, isOpened: true })));
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' Xu';
  };

  const openedValues = new Set(
    suitcases.filter((s) => s.isOpened).map((s) => s.value)
  );

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

        <div className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Chưa có nhân vật nào để chơi cùng • Bạn đang đối đầu với Công Tố Viên</span>
        </div>
      </div>

      {/* Banner */}
      <div
        className={`p-6 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-amber-100'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30">
              💼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  VỤ ÁN VALI (DEAL OR NO DEAL)
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
                  16 Vali Niêm Phong
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn vali may mắn của bạn, loại trừ các số tiền và đàm phán với Công Tố Viên Ngục Tối
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetGame}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Chơi Lại Vụ Án Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Banker Offer Popup / Notification */}
      {bankerOffer !== null && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-2xl animate-scaleIn space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>CÔNG TỐ VIÊN NGỤC TỐI GỌI ĐẾN!</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-bold">
              Vòng {round}
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <div className="text-xs opacity-90 uppercase tracking-widest font-bold">
              Lời đề nghị mua lại chiếc vali của bạn:
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-yellow-300 drop-shadow">
              {formatMoney(bankerOffer)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleAcceptDeal}
              className="py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CHẤP NHẬN (DEAL)</span>
            </button>
            <button
              type="button"
              onClick={handleRejectDeal}
              className="py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-black text-sm uppercase tracking-wider backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>TỪ CHỐI (NO DEAL)</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over Banner */}
      {isGameOver && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-center shadow-2xl animate-scaleIn space-y-3">
          <Trophy className="w-10 h-10 mx-auto text-yellow-300 animate-bounce" />
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
            {acceptedDeal
              ? 'BẠN ĐÃ ĐỒNG Ý BÁN VALI CHO CÔNG TỐ VIÊN!'
              : 'BẠN ĐÃ MỞ VALI CỦA CHÍNH MÌNH!'}
          </h3>
          <div className="text-3xl sm:text-4xl font-black text-yellow-200">
            {formatMoney(wonAmount || 0)}
          </div>
          <p className="text-xs opacity-90">
            {mySuitcaseId && (
              <>
                Chiếc vali #{mySuitcaseId} ban đầu của bạn chứa:{' '}
                <strong>
                  {formatMoney(
                    suitcases.find((s) => s.id === mySuitcaseId)?.value || 0
                  )}
                </strong>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={resetGame}
            className="mt-3 px-6 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs uppercase tracking-wider shadow hover:bg-slate-100 cursor-pointer"
          >
            Chơi vụ án khác
          </button>
        </div>
      )}

      {/* Main Board Grid with Left & Right Money Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Lower values */}
        <div className="space-y-1.5 order-2 lg:order-1">
          <div className="text-[11px] font-black uppercase text-slate-400 pb-1">
            Mức Tiền Thấp
          </div>
          {MONEY_VALUES.slice(0, 8).map((val) => {
            const isEliminated = openedValues.has(val);
            return (
              <div
                key={val}
                className={`p-2 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                  isEliminated
                    ? 'opacity-20 line-through bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}
              >
                <span>{formatMoney(val)}</span>
              </div>
            );
          })}
        </div>

        {/* Center 2 Cols: Suitcases */}
        <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
          {/* Status bar */}
          <div
            className={`p-3.5 rounded-2xl border text-center text-xs font-bold ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-amber-100'
            }`}
          >
            {mySuitcaseId === null ? (
              <span className="text-rose-500 font-black animate-pulse">
                👉 Hãy bấm chọn 1 chiếc vali để làm vali của riêng bạn!
              </span>
            ) : !isGameOver && bankerOffer === null ? (
              <span className="text-amber-600 dark:text-amber-400">
                Hãy mở thêm <strong>{toOpenInRound}</strong> vali nữa để gọi cho Công Tố Viên
              </span>
            ) : (
              <span className="text-slate-400">Vụ án hoàn tất</span>
            )}
          </div>

          {/* 16 Suitcases Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {suitcases.map((s) => {
              const isMyCase = s.id === mySuitcaseId;

              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={s.isOpened || (mySuitcaseId !== null && isMyCase) || isGameOver}
                  onClick={() => handleSuitcaseClick(s)}
                  className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all relative cursor-pointer group ${
                    isMyCase
                      ? 'border-yellow-400 bg-gradient-to-tr from-amber-500 to-yellow-500 text-white shadow-xl scale-105 ring-4 ring-yellow-400/30'
                      : s.isOpened
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-slate-400 opacity-60'
                      : darkMode
                      ? 'border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 text-white hover:border-amber-400 hover:scale-102 shadow-md'
                      : 'border-amber-200 bg-gradient-to-br from-white to-amber-50 text-slate-800 hover:border-amber-400 hover:scale-102 shadow-md'
                  }`}
                >
                  <Briefcase
                    className={`w-6 h-6 sm:w-7 sm:h-7 mb-1 ${
                      isMyCase
                        ? 'text-white'
                        : s.isOpened
                        ? 'text-slate-400'
                        : 'text-amber-500'
                    }`}
                  />
                  <span className="text-xs sm:text-sm font-black">#{s.id}</span>

                  {/* If opened, reveal value */}
                  {s.isOpened && (
                    <span className="text-[10px] sm:text-xs font-black text-rose-500 truncate w-full text-center mt-0.5">
                      {formatMoney(s.value)}
                    </span>
                  )}

                  {isMyCase && (
                    <span className="absolute -top-2 bg-yellow-300 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                      Vali của bạn
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Higher values */}
        <div className="space-y-1.5 order-3">
          <div className="text-[11px] font-black uppercase text-slate-400 pb-1">
            Mức Tiền Lớn
          </div>
          {MONEY_VALUES.slice(8).map((val) => {
            const isEliminated = openedValues.has(val);
            return (
              <div
                key={val}
                className={`p-2 rounded-xl border text-xs font-black transition-all flex items-center justify-between ${
                  isEliminated
                    ? 'opacity-20 line-through bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}
              >
                <span>{formatMoney(val)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
