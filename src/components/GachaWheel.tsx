import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Dices,
  Heart,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Gift,
  HelpCircle,
  FolderHeart,
  Send,
  X,
  PlusCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character, PrisonZone } from '../types';

export interface GachaCard {
  id: string;
  prisonId: string;
  name: string;
  zone: PrisonZone;
  rarity: 'SSR' | 'SR' | 'R';
  genres: string[];
  backstory: string;
  firstMessage: string;
  avatarUrl?: string;
  avatarGradient: string;
  likes: number;
  isCustom?: boolean;
}

// 9 Mẫu Thẻ Gacha Chuẩn Phân Khu (3 Phòng Giam Lạnh, 3 Phòng Giam Ấm, 3 Phòng Giam Chữa Lành)
const SAMPLE_GACHA_CARDS: GachaCard[] = [];

interface GachaWheelProps {
  characters: Character[];
  onOpenDetail: (character: Character) => void;
  onOpenAdmin: () => void;
  onSendLove?: (characterId: string, message: string, senderName: string) => void;
  darkMode: boolean;
}

export const GachaWheel: React.FC<GachaWheelProps> = ({
  characters,
  onOpenDetail,
  onOpenAdmin,
  onSendLove,
  darkMode,
}) => {
  // Pool mode: if user has created characters, allow them to choose, otherwise default to sample template
  const hasRealCharacters = characters.length > 0;
  const [useSamplePool, setUseSamplePool] = useState<boolean>(!hasRealCharacters);

  // Tickets state
  const [tickets, setTickets] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('gacha_tickets_count');
      return saved ? Math.max(parseInt(saved, 10), 10) : 15;
    } catch {
      return 15;
    }
  });

  // Selected Zone filter
  const [selectedZone, setSelectedZone] = useState<'all' | PrisonZone>('all');

  // Animation states
  const [isSpinning, setIsSpinning] = useState(false);
  const [singleResult, setSingleResult] = useState<GachaCard | null>(null);
  const [multiResults, setMultiResults] = useState<GachaCard[]>([]);
  const [revealedMultiIndices, setRevealedMultiIndices] = useState<number[]>([]);
  const [pullType, setPullType] = useState<'single' | 'ten' | null>(null);

  // Active view: 'machine' | 'collection' | 'rates'
  const [activeSubTab, setActiveSubTab] = useState<'machine' | 'collection' | 'rates'>('machine');

  // Pulled collection stored in localStorage
  const [collectedCards, setCollectedCards] = useState<GachaCard[]>(() => {
    try {
      const saved = localStorage.getItem('gacha_collected_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quick Love Message Modal
  const [loveModalCard, setLoveModalCard] = useState<GachaCard | null>(null);
  const [loveNoteText, setLoveNoteText] = useState('');
  const [loveSenderName, setLoveSenderName] = useState('Nàng Quản Ngục Nhỏ');
  const [isEnvelopeSealing, setIsEnvelopeSealing] = useState(false);
  const [loveSuccessMessage, setLoveSuccessMessage] = useState(false);

  // Save tickets
  useEffect(() => {
    try {
      localStorage.setItem('gacha_tickets_count', tickets.toString());
    } catch {
      // ignore
    }
  }, [tickets]);

  // Save collection
  useEffect(() => {
    try {
      localStorage.setItem('gacha_collected_cards', JSON.stringify(collectedCards));
    } catch {
      // ignore
    }
  }, [collectedCards]);

  // Prepare full pool based on active settings
  const getAvailablePool = (): GachaCard[] => {
    let pool: GachaCard[] = characters.map((c, idx) => ({
      id: c.id,
      prisonId: c.prisonId,
      name: c.name,
      zone: c.zone || (idx % 3 === 0 ? 'Phòng Giam Lạnh' : idx % 3 === 1 ? 'Phòng Giam Ấm' : 'Phòng Giam Chữa Lành'),
      rarity: (idx % 5 === 0 ? 'SSR' : idx % 3 === 0 ? 'SR' : 'R') as 'SSR' | 'SR' | 'R',
      genres: c.genres,
      backstory: c.backstory,
      firstMessage: c.firstMessage,
      avatarUrl: c.avatarUrl,
      avatarGradient: c.avatarGradient || 'from-pink-500 to-sky-400',
      likes: c.likes || 10,
      isCustom: true,
    }));

    if (selectedZone !== 'all') {
      const zoneFiltered = pool.filter((c) => c.zone === selectedZone);
      return zoneFiltered.length > 0 ? zoneFiltered : pool;
    }

    return pool;
  };

  // Convert GachaCard to Character for onOpenDetail
  const convertCardToCharacter = (card: GachaCard): Character => {
    return {
      id: card.id,
      prisonId: card.prisonId,
      name: card.name,
      zone: card.zone,
      genres: card.genres,
      backstory: card.backstory,
      firstMessage: card.firstMessage,
      chatLink: '#',
      avatarUrl: card.avatarUrl,
      avatarGradient: card.avatarGradient,
      likes: card.likes,
      loveCount: 0,
      loveMessages: [],
      createdAt: Date.now(),
    };
  };

  // Add card to collection
  const addToCollection = (cards: GachaCard[]) => {
    setCollectedCards((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      cards.forEach((c) => map.set(c.id, c));
      return Array.from(map.values());
    });
  };

  // Trigger celebration confetti
  const fireConfetti = (rarity: 'SSR' | 'SR' | 'R' = 'SSR') => {
    try {
      if (rarity === 'SSR') {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#fbbf24', '#f59e0b', '#ec4899', '#38bdf8', '#a855f7'],
        });
      } else {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#38bdf8', '#fb7185'],
        });
      }
    } catch {
      // ignore
    }
  };

  // Single pull
  const handleSinglePull = () => {
    if (tickets < 1 || isSpinning) return;

    setTickets((prev) => Math.max(0, prev - 1));
    setIsSpinning(true);
    setPullType('single');
    setSingleResult(null);
    setMultiResults([]);

    const pool = getAvailablePool();

    // Rarity weighted draw
    setTimeout(() => {
      const rand = Math.random();
      let targetRarity: 'SSR' | 'SR' | 'R' = 'R';
      if (rand < 0.15) targetRarity = 'SSR';
      else if (rand < 0.55) targetRarity = 'SR';

      const rarityCandidates = pool.filter((c) => c.rarity === targetRarity);
      const finalCandidateList = rarityCandidates.length > 0 ? rarityCandidates : pool;
      const picked = finalCandidateList[Math.floor(Math.random() * finalCandidateList.length)];

      setSingleResult(picked);
      setIsSpinning(false);
      addToCollection([picked]);
      fireConfetti(picked.rarity);
    }, 1800);
  };

  // 10-Pull
  const handleTenPull = () => {
    if (tickets < 10 || isSpinning) return;

    setTickets((prev) => Math.max(0, prev - 10));
    setIsSpinning(true);
    setPullType('ten');
    setSingleResult(null);
    setMultiResults([]);
    setRevealedMultiIndices([]);

    const pool = getAvailablePool();

    setTimeout(() => {
      const pulls: GachaCard[] = [];
      for (let i = 0; i < 10; i++) {
        const rand = Math.random();
        let targetRarity: 'SSR' | 'SR' | 'R' = 'R';
        // Guaranteed at least SR on the 10th pull
        if (i === 9 || rand < 0.12) targetRarity = rand < 0.08 ? 'SSR' : 'SR';
        else if (rand < 0.45) targetRarity = 'SR';

        const rarityCandidates = pool.filter((c) => c.rarity === targetRarity);
        const finalCandidateList = rarityCandidates.length > 0 ? rarityCandidates : pool;
        const picked = finalCandidateList[Math.floor(Math.random() * finalCandidateList.length)];
        pulls.push(picked);
      }

      setMultiResults(pulls);
      setIsSpinning(false);
      addToCollection(pulls);

      const hasSsr = pulls.some((p) => p.rarity === 'SSR');
      fireConfetti(hasSsr ? 'SSR' : 'SR');
    }, 2200);
  };

  // Reveal all 10 cards
  const revealAllCards = () => {
    setRevealedMultiIndices([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  };

  // Reveal single index in 10-pull
  const toggleRevealIndex = (idx: number) => {
    if (!revealedMultiIndices.includes(idx)) {
      setRevealedMultiIndices((prev) => [...prev, idx]);
    }
  };

  // Add Free Tickets
  const handleAddFreeTickets = () => {
    setTickets((prev) => prev + 10);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.3 },
        colors: ['#ec4899', '#f43f5e', '#a855f7'],
      });
    } catch {
      // ignore
    }
  };

  // Send quick love note
  const handleSendLoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loveModalCard || !loveNoteText.trim()) return;

    setIsEnvelopeSealing(true);

    setTimeout(() => {
      if (onSendLove) {
        onSendLove(
          loveModalCard.id,
          loveNoteText.trim(),
          loveSenderName.trim() || 'Nàng Quản Ngục Nhỏ'
        );
      }
      setIsEnvelopeSealing(false);
      setLoveSuccessMessage(true);
      setTimeout(() => {
        setLoveSuccessMessage(false);
        setLoveModalCard(null);
        setLoveNoteText('');
      }, 1500);
    }, 1000);
  };

  // Colors helper for rarity
  const getRarityBadge = (rarity: 'SSR' | 'SR' | 'R') => {
    switch (rarity) {
      case 'SSR':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md shadow-amber-400/40 border border-amber-200 animate-pulse">
            ★ SSR Cực Phẩm
          </span>
        );
      case 'SR':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-sm border border-pink-200">
            ★ SR Định Mệnh
          </span>
        );
      case 'R':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm border border-sky-200">
            ★ R Hiếm
          </span>
        );
    }
  };

  // Zone icon/tag
  const getZoneBadge = (zone: PrisonZone) => {
    switch (zone) {
      case 'Phòng Giam Lạnh':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300/40">
            ❄️ Phòng Giam Lạnh
          </span>
        );
      case 'Phòng Giam Ấm':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/40">
            ☀️ Phòng Giam Ấm
          </span>
        );
      case 'Phòng Giam Chữa Lành':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
            🌿 Phòng Giam Chữa Lành
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 text-pink-600 dark:text-pink-300 border border-pink-400/30 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-pink-500 animate-spin" />
          <span>VÒNG QUAY ĐỊNH MỆNH TRẠI GIAM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400">
          Máy Gacha Nhân Phẩm Tình Ái
        </h1>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Nếu nàng phân vân chưa biết hôm nay nên ghé thăm phân khu nào hay gặp gỡ chàng trai nào, hãy rút một lá bài định mệnh để duyên phận dẫn lối!
        </p>

        {/* Mode & Notice Indicator */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {useSamplePool ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Đang mở: <strong>Bản Mẫu Gacha Trải Nghiệm (Demo Showcase)</strong></span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Đang dùng: <strong>Hồ Sơ Nhân Vật Thật ({characters.length} nhân vật)</strong></span>
            </div>
          )}

          {hasRealCharacters && (
            <button
              type="button"
              onClick={() => setUseSamplePool(!useSamplePool)}
              className="text-xs font-bold underline text-pink-500 hover:text-pink-600 cursor-pointer"
            >
              {useSamplePool ? 'Chuyển sang hồ sơ thật' : 'Xem lại bản mẫu demo'}
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs: Machine / Collection / Drop Rates */}
      <div className="flex items-center justify-center gap-2 border-b border-pink-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('machine')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'machine'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-400/30'
              : 'text-slate-500 hover:bg-pink-50 dark:hover:bg-slate-800'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>Máy Quay Gacha</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('collection')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'collection'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-400/30'
              : 'text-slate-500 hover:bg-pink-50 dark:hover:bg-slate-800'
          }`}
        >
          <FolderHeart className="w-4 h-4" />
          <span>Túi Sưu Tập ({collectedCards.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('rates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeSubTab === 'rates'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-400/30'
              : 'text-slate-500 hover:bg-pink-50 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Tỉ Lệ & Phân Khu</span>
        </button>
      </div>

      {/* MAIN VIEW: GACHA MACHINE */}
      {activeSubTab === 'machine' && (
        <div className="space-y-6">
          {/* Top Control Bar: Tickets & Zone Selection */}
          <div
            className={`p-4 sm:p-5 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all shadow-sm ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-pink-100 shadow-pink-100/50'
            }`}
          >
            {/* Tickets */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-2xl shadow-md shadow-pink-400/30">
                🎟️
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vé Duyên Phận</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-pink-500">{tickets}</span>
                  <span className="text-xs text-slate-400 font-medium">lượt quay khả dụng</span>
                  <button
                    type="button"
                    onClick={handleAddFreeTickets}
                    title="Nhận thêm 10 vé miễn phí"
                    className="p-1 px-2 text-[11px] font-bold rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 hover:bg-pink-200 transition-colors cursor-pointer flex items-center gap-1 ml-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+10 Vé Free</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Zone Selector */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Phân Khu:
              </span>
              <button
                type="button"
                onClick={() => setSelectedZone('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedZone === 'all'
                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 hover:text-slate-800'
                }`}
              >
                🌈 Tất Cả
              </button>
              <button
                type="button"
                onClick={() => setSelectedZone('Phòng Giam Lạnh')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedZone === 'Phòng Giam Lạnh'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-400/30'
                    : 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 hover:bg-sky-100'
                }`}
              >
                ❄️ Phòng Giam Lạnh
              </button>
              <button
                type="button"
                onClick={() => setSelectedZone('Phòng Giam Ấm')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedZone === 'Phòng Giam Ấm'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-400/30'
                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                }`}
              >
                ☀️ Phòng Giam Ấm
              </button>
              <button
                type="button"
                onClick={() => setSelectedZone('Phòng Giam Chữa Lành')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedZone === 'Phòng Giam Chữa Lành'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-400/30'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                }`}
              >
                🌿 Phòng Giam Chữa Lành
              </button>
            </div>
          </div>

          {/* Machine Showcase Box */}
          <div
            className={`p-6 sm:p-10 rounded-3xl border text-center transition-all relative overflow-hidden ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-2xl shadow-indigo-950/50'
                : 'bg-white/95 border-pink-100 text-slate-800 shadow-2xl shadow-pink-200/50'
            }`}
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-sky-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* STATE 1: SPINNING SUSPENSE */}
            {isSpinning && (
              <div className="py-14 sm:py-20 flex flex-col items-center justify-center space-y-5 animate-pulse">
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-sky-400 animate-spin blur-md opacity-75" />
                  <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-sky-300 flex items-center justify-center text-5xl shadow-2xl text-white animate-bounce">
                    🔮
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-sky-400">
                    Đang xáo trộn thẻ duyên phận ngục tù...
                  </h3>
                  <p className="text-xs text-slate-400">
                    {pullType === 'ten' ? 'Chuẩn bị mở đồng loạt 10 lá bài định mệnh...' : 'Quả cầu may mắn đang chuẩn bị bung mở...'}
                  </p>
                </div>
              </div>
            )}

            {/* STATE 2: SINGLE PULL RESULT */}
            {!isSpinning && singleResult && (
              <div className="py-4 space-y-6 animate-scale-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>KẾT QUẢ RÚT THẺ GACHA ĐỊNH MỆNH</span>
                </div>

                {/* Card Display */}
                <div
                  className={`max-w-md mx-auto p-6 rounded-3xl border transition-all text-left relative overflow-hidden shadow-2xl group ${
                    darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-gradient-to-b from-white to-pink-50/50 border-pink-200'
                  }`}
                >
                  {/* Glowing header strip */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {getRarityBadge(singleResult.rarity)}
                    {getZoneBadge(singleResult.zone)}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${singleResult.avatarGradient} flex items-center justify-center text-white font-black text-3xl shrink-0 overflow-hidden shadow-lg border-2 border-white/40`}
                    >
                      {singleResult.avatarUrl ? (
                        <img
                          src={singleResult.avatarUrl}
                          alt={singleResult.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{singleResult.name.charAt(0)}</span>
                      )}
                    </div>

                    {/* Basic details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-pink-500">
                          {singleResult.prisonId}
                        </span>
                        <h4 className="text-xl font-black truncate">{singleResult.name}</h4>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {singleResult.genres.map((g) => (
                          <span
                            key={g}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300"
                          >
                            #{g}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-rose-500 font-bold">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        <span>{singleResult.likes} lượt ái mộ</span>
                      </div>
                    </div>
                  </div>

                  {/* First Message */}
                  <div
                    className={`mt-4 p-3.5 rounded-2xl border text-xs italic ${
                      darkMode ? 'bg-slate-900/60 border-slate-700 text-slate-300' : 'bg-white/80 border-pink-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-pink-500 not-italic mb-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>Lời thì thầm từ phòng giam:</span>
                    </div>
                    "{singleResult.firstMessage}"
                  </div>

                  {/* Backstory */}
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {singleResult.backstory}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLoveModalCard(singleResult)}
                      className="w-full py-2.5 px-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-95 shadow-md shadow-pink-400/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>Gửi Lời Yêu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenDetail(convertCardToCharacter(singleResult))}
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Hồ Sơ</span>
                    </button>
                  </div>
                </div>

                {/* Continue Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSinglePull}
                    disabled={tickets < 1}
                    className="py-3 px-6 rounded-2xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4 text-pink-500" />
                    <span>Quay lại lượt 1 thẻ (1 Vé)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTenPull}
                    disabled={tickets < 10}
                    className="py-3 px-6 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 hover:opacity-95 shadow-md shadow-pink-400/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Rút liên hoàn x10 thẻ (10 Vé)</span>
                  </button>
                </div>
              </div>
            )}

            {/* STATE 3: TEN PULL RESULT */}
            {!isSpinning && multiResults.length > 0 && (
              <div className="py-4 space-y-6 animate-scale-up">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    <span>KẾT QUẢ 10 LƯỢT RÚT LIÊN HOÀN (x10 PULL)</span>
                  </div>

                  <button
                    type="button"
                    onClick={revealAllCards}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-colors cursor-pointer"
                  >
                    Lật Mở Toàn Bộ 10 Thẻ
                  </button>
                </div>

                {/* 10 Card Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {multiResults.map((card, idx) => {
                    const isRevealed = revealedMultiIndices.includes(idx);
                    return (
                      <div
                        key={`${card.id}-${idx}`}
                        onClick={() => toggleRevealIndex(idx)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[170px] ${
                          isRevealed
                            ? darkMode
                              ? 'bg-slate-800/90 border-slate-700 shadow-md'
                              : 'bg-white border-pink-200 shadow-sm'
                            : 'bg-gradient-to-br from-pink-400 via-rose-400 to-indigo-500 border-white/40 text-white flex items-center justify-center hover:scale-105 shadow-md'
                        }`}
                      >
                        {!isRevealed ? (
                          <div className="text-center space-y-2 my-auto">
                            <div className="text-3xl animate-bounce">🎴</div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-pink-100">Bấm để lật #{idx + 1}</p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                {getRarityBadge(card.rarity)}
                                <span className="text-[9px] font-mono text-slate-400">{card.prisonId}</span>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <div
                                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.avatarGradient} flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden shadow-sm`}
                                >
                                  {card.avatarUrl ? (
                                    <img
                                      src={card.avatarUrl}
                                      alt={card.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span>{card.name.charAt(0)}</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-xs font-black truncate">{card.name}</h5>
                                  <span className="text-[9px] block text-slate-400 truncate">{card.zone}</span>
                                </div>
                              </div>

                              <p className="text-[10px] text-slate-500 italic line-clamp-2">
                                "{card.firstMessage}"
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLoveModalCard(card);
                                }}
                                className="text-[10px] font-bold text-pink-500 hover:underline flex items-center gap-1"
                              >
                                <Heart className="w-2.5 h-2.5 fill-pink-500" /> Gửi yêu
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDetail(convertCardToCharacter(card));
                                }}
                                className="text-[10px] font-bold text-sky-500 hover:underline"
                              >
                                Chi tiết
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Continue actions */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleTenPull}
                    disabled={tickets < 10}
                    className="py-3 px-6 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-95 shadow-md shadow-pink-400/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Tiếp tục rút x10 (10 Vé)</span>
                  </button>
                </div>
              </div>
            )}

            {/* STATE 4: IDLE GACHA MACHINE */}
            {!isSpinning && !singleResult && multiResults.length === 0 && (
              <div className="py-8 sm:py-12 space-y-7">
                {/* Visual Capsule Machine */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-400/30 via-rose-300/30 to-sky-300/30 blur-xl animate-pulse" />
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-400 to-sky-400 flex flex-col items-center justify-center text-white shadow-2xl shadow-pink-400/40 p-4 border-2 border-white/30 animate-bob">
                    <span className="text-5xl sm:text-6xl mb-1">🎁</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-100">Bóng Pha Lê</span>
                  </div>

                  {/* Little floating orbs */}
                  <span className="absolute -top-2 -left-2 text-2xl animate-spin">✨</span>
                  <span className="absolute -bottom-2 -right-2 text-2xl animate-pulse">💖</span>
                  <span className="absolute top-1/2 -right-4 text-2xl animate-bounce">❄️</span>
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-black">Lồng Quay Định Mệnh Sẵn Sàng</h3>
                  <p className="text-xs text-slate-400">
                    Phân khu đang chọn: <strong className="text-pink-500">{selectedZone === 'all' ? 'Tất Cả Phân Khu' : selectedZone}</strong>.
                    Tỉ lệ rơi thẻ SSR là 15%, chúc nàng sớm tìm thấy tri kỷ!
                  </p>
                </div>

                {/* 2 Primary Pull Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pt-2">
                  <button
                    type="button"
                    onClick={handleSinglePull}
                    disabled={tickets < 1}
                    className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl font-black text-sm text-pink-600 dark:text-pink-300 bg-pink-100 dark:bg-pink-950/80 hover:bg-pink-200 dark:hover:bg-pink-900/80 border border-pink-300/50 shadow-lg shadow-pink-200/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Dices className="w-5 h-5 text-pink-500" />
                    <span>RÚT 1 LẦN (1 VÉ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTenPull}
                    disabled={tickets < 10}
                    className="w-full sm:w-auto flex-1 py-4 px-7 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 hover:scale-105 active:scale-95 shadow-xl shadow-pink-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>RÚT 10 LẦN (10 VÉ)</span>
                  </button>
                </div>

                {tickets < 1 && (
                  <p className="text-xs text-rose-500 font-bold">
                    Nàng đã hết vé rồi! Hãy bấm nút "+10 Vé Free" phía trên để tiếp tục trải nghiệm nhé.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* COLLECTION SUB-TAB */}
      {activeSubTab === 'collection' && (
        <div className="space-y-6 animate-fade-in">
          <div
            className={`p-6 rounded-3xl border ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-pink-100'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <FolderHeart className="w-5 h-5 text-pink-500" />
                  <span>Kho Thẻ Định Mệnh Đã Rút ({collectedCards.length} thẻ)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Tất cả những chàng trai nàng đã quay trúng được lưu trữ vĩnh viễn trong nhật ký.
                </p>
              </div>

              {collectedCards.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Nàng có chắc muốn làm trống kho thẻ đã sưu tập không?')) {
                      setCollectedCards([]);
                    }
                  }}
                  className="text-xs text-slate-400 hover:text-rose-500 font-bold transition-colors cursor-pointer"
                >
                  Xóa kho lưu
                </button>
              )}
            </div>

            {collectedCards.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="text-4xl">📭</div>
                <h4 className="text-base font-bold text-slate-400">Chưa có thẻ nào trong bộ sưu tập</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hãy quay lại tab Máy Gacha và bốc thăm ngay để sưu tầm các chàng trai nhé!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('machine')}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-pink-500 hover:bg-pink-600 transition-colors cursor-pointer"
                >
                  Bắt đầu quay ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {collectedCards.map((card) => (
                  <div
                    key={card.id}
                    className={`p-4 rounded-2xl border transition-all hover:shadow-lg ${
                      darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-pink-50/50 border-pink-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-2">
                      {getRarityBadge(card.rarity)}
                      {getZoneBadge(card.zone)}
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.avatarGradient} flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden shadow-sm`}
                      >
                        {card.avatarUrl ? (
                          <img
                            src={card.avatarUrl}
                            alt={card.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          card.name.charAt(0)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-pink-500 font-bold">{card.prisonId}</span>
                        <h4 className="text-sm font-black truncate">{card.name}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-rose-500 font-bold">
                          <Heart className="w-3 h-3 fill-rose-500" />
                          <span>{card.likes} tim</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 italic line-clamp-2 my-2">
                      "{card.firstMessage}"
                    </p>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setLoveModalCard(card)}
                        className="text-xs font-bold text-pink-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Heart className="w-3 h-3 fill-pink-500" />
                        <span>Gửi Lời Yêu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenDetail(convertCardToCharacter(card))}
                        className="text-xs font-bold text-sky-500 hover:underline cursor-pointer"
                      >
                        Hồ sơ chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DROP RATES & ZONE INFO TAB */}
      {activeSubTab === 'rates' && (
        <div className="space-y-6 animate-fade-in">
          <div
            className={`p-6 sm:p-8 rounded-3xl border ${
              darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-pink-100'
            }`}
          >
            <h3 className="text-lg font-black mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-pink-500" />
              <span>Quy Tắc Vòng Quay & Tỉ Lệ Xuất Hiện</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Hệ thống Gacha hoạt động công khai, bảo chứng duyên phận công bằng giữa 3 phân khu ngục tù.
            </p>

            {/* Rarity breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-2xl border border-amber-400/40 bg-amber-500/10 text-center space-y-1">
                <span className="text-xl">🌟</span>
                <h4 className="text-sm font-black text-amber-500">Hạng SSR (Cực Phẩm)</h4>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-300">15%</p>
                <p className="text-[11px] text-slate-400">Hiệu ứng lấp lánh vàng, lời nhắn độc quyền</p>
              </div>

              <div className="p-4 rounded-2xl border border-pink-400/40 bg-pink-500/10 text-center space-y-1">
                <span className="text-xl">💖</span>
                <h4 className="text-sm font-black text-pink-500">Hạng SR (Định Mệnh)</h4>
                <p className="text-2xl font-black text-pink-600 dark:text-pink-300">40%</p>
                <p className="text-[11px] text-slate-400">Đảm bảo trúng ít nhất 1 thẻ khi rút x10</p>
              </div>

              <div className="p-4 rounded-2xl border border-sky-400/40 bg-sky-500/10 text-center space-y-1">
                <span className="text-xl">🌸</span>
                <h4 className="text-sm font-black text-sky-500">Hạng R (Gặp Gỡ)</h4>
                <p className="text-2xl font-black text-sky-600 dark:text-sky-300">45%</p>
                <p className="text-[11px] text-slate-400">Các cuộc hạnh ngộ bất ngờ thường nhật</p>
              </div>
            </div>

            {/* 3 Zones Overview */}
            <h4 className="text-sm font-black mb-3">3 Phân Khu Đặc Trưng Trại Giam:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-sky-300/40 bg-sky-50 dark:bg-sky-950/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">❄️</span>
                  <h5 className="font-bold text-sky-600 dark:text-sky-300">Phòng Giam Lạnh</h5>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Dành cho những chàng trai bề ngoài lạnh lùng, trầm mặc, độc chiếm hoặc khó gần nhưng bên trong cháy bỏng khao khát được nàng sưởi ấm.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-amber-300/40 bg-amber-50 dark:bg-amber-950/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">☀️</span>
                  <h5 className="font-bold text-amber-700 dark:text-amber-300">Phòng Giam Ấm</h5>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Dành cho những chàng trai ngọt ngào như nắng sớm, dịu dàng săn sóc, chu đáo và luôn xem nàng là ánh dương rạng ngời nhất.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-300/40 bg-emerald-50 dark:bg-emerald-950/40 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌿</span>
                  <h5 className="font-bold text-emerald-700 dark:text-emerald-300">Phòng Giam Chữa Lành</h5>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Dành cho những tâm hồn êm đềm, biết lắng nghe, giỏi xoa dịu những vết thương lòng và mang lại cảm giác bình yên tuyệt đối.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK LOVE NOTE MODAL ("Gửi lời yêu đến chồng nhỏ") */}
      {loveModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative transition-all ${
              darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-pink-200 text-slate-800'
            }`}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLoveModalCard(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {loveSuccessMessage ? (
              <div className="py-8 text-center space-y-3 animate-scale-up">
                <div className="text-5xl animate-bounce">💌</div>
                <h4 className="text-lg font-black text-pink-500">Đã Gửi Lời Yêu Thành Công!</h4>
                <p className="text-xs text-slate-400">
                  Lá thư gấp kín đã được chuyển đến tận tay {loveModalCard.name} ({loveModalCard.prisonId}).
                </p>
              </div>
            ) : isEnvelopeSealing ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-3xl animate-spin">
                  ✉️
                </div>
                <h4 className="text-sm font-bold text-pink-500 animate-pulse">
                  Đang gấp giấy và dán niêm phong thư gửi đến phòng giam...
                </h4>
              </div>
            ) : (
              <form onSubmit={handleSendLoveSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-2xl shadow-md">
                    💌
                  </div>
                  <div>
                    <h4 className="text-base font-black">Gửi Lời Yêu Đến Chồng Nhỏ</h4>
                    <p className="text-xs text-slate-400">
                      Gửi tới: <strong className="text-pink-500">{loveModalCard.name}</strong> ({loveModalCard.prisonId} · {loveModalCard.zone})
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Tên của nàng:
                  </label>
                  <input
                    type="text"
                    value={loveSenderName}
                    onChange={(e) => setLoveSenderName(e.target.value)}
                    required
                    placeholder="VD: Nàng Quản Ngục Nhỏ..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-pink-200 dark:border-slate-700 bg-pink-50/30 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Lời nhắn gửi yêu thương:
                  </label>
                  <textarea
                    rows={4}
                    value={loveNoteText}
                    onChange={(e) => setLoveNoteText(e.target.value)}
                    required
                    placeholder={`Gửi ${loveModalCard.name}, hôm nay em lại nhớ anh rồi...`}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-pink-200 dark:border-slate-700 bg-pink-50/30 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none font-serif"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setLoveModalCard(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-95 shadow-md shadow-pink-400/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gấp Thư & Gửi Đi</span>
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
