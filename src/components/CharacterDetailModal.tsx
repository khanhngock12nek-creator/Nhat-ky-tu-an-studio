import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Code,
  Volume2,
  VolumeX,
  Send,
  Lock,
  Flame,
  Bookmark,
  Share2,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../types';
import defaultLucCanhTieuImg from '../assets/images/luc_canh_tieu_avatar_1791553296431.jpg';

interface CharacterDetailModalProps {
  character: Character | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onLikeCharacter: (id: string) => void;
  onSendLove?: (characterId: string, senderName: string, message: string) => void;
  onSelectCharacter?: (character: Character) => void;
  onDeleteCharacter?: (id: string) => void;
  allCharacters?: Character[];
  darkMode: boolean;
}

const SWEET_PRESETS = [
  'Chồng nhỏ ngoan ngoãn chờ em ở buồng giam nhé, tối nay em lại ghé thăm! 💕',
  'Hôm nay em đến phát kẹo ngọt cho anh nè, có nhớ em không? ✨',
  'Dù anh có phạm tội tày đình cỡ nào thì em cũng nuôi anh cả đời! 💖',
  'Đừng nhìn ai khác ngoài em nhé, em độc chiếm anh rồi! 🌸',
  'Cố gắng cải tạo tốt nha, em sẽ sớm mang chìa khóa vàng đến mở cửa đón anh! 🗝️',
];

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  isFavorite,
  onToggleFavorite,
  onLikeCharacter,
  onSendLove,
  onSelectCharacter,
  onDeleteCharacter,
  allCharacters = [],
  darkMode,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [likesCount, setLikesCount] = useState(character?.likes || 1024);
  const [hasLiked, setHasLiked] = useState(false);

  // Audio voice simulation & real audio player
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceIntervalRef = useRef<any>(null);

  // Stop any playing voice audio
  const stopVoiceAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
      voiceIntervalRef.current = null;
    }
    setIsPlayingVoice(false);
    setVoiceProgress(0);
  };

  // Stop playing voice when character changes or modal closes
  useEffect(() => {
    return () => {
      stopVoiceAudio();
    };
  }, [character?.id]);

  // Love letter drawer state
  const [showLoveLetter, setShowLoveLetter] = useState(false);
  const [loveSender, setLoveSender] = useState('Nàng Quản Ngục Nhỏ');
  const [loveMessage, setLoveMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  // Sync likes with prop changes
  useEffect(() => {
    if (character) {
      setLikesCount(character.likes);
    }
  }, [character]);

  if (!character) return null;

  // Determine current character details with high-fidelity fallbacks matching the exact design
  const charName = character.name || 'Lục Cảnh Tiêu';
  const charPrisonId = character.prisonId || '#PRISON-07-LCT';
  const charAge = character.age || '27 Tuổi';
  const charSubtitle = character.subtitle || 'Buồng Giam 07: Tình Cầu Của Riêng Em';
  const charOrigin =
    character.origin ||
    'Nguyên là người thừa kế Tập đoàn Tài chính Lục Thị • Tội danh: Tự nguyện giam cầm vì tình';
  const charRarity = character.rarity || 'SSR';
  const charLoyalty = character.loyalty ?? 99;
  const charDanger = character.danger ?? 50;
  const charHeartbeat = character.heartbeat ?? 136;
  const charLoveRate = character.loveRate || '100%';
  const charSentenceTerm = character.sentenceTerm || character.crime || 'Án Chung Thân';
  const charPossession = character.possession || 'Chiếm Hữu Tuyệt Đối';
  const charQuote =
    character.quote ||
    '“Em tưởng buồng giam này khóa giữ anh sao? Không đâu, nó là nơi anh tự nguyện giam giữ để em không thể quay lưng với anh…”';
  const charVoiceActor = character.voiceActor || 'Haruto K. [Độc quyền AI]';
  const charImage = character.avatarUrl || defaultLucCanhTieuImg;
  const charChatLink =
    character.chatLink || 'https://beta.character.ai/chat?char=luc_canh_tieu_sample';

  // Navigation between prisoners
  const pool = allCharacters.length > 0 ? allCharacters : [character];
  const currentIndex = pool.findIndex((c) => c.id === character.id);
  const prevPrisoner =
    currentIndex > 0 ? pool[currentIndex - 1] : pool[pool.length - 1];
  const nextPrisoner =
    currentIndex !== -1 && currentIndex < pool.length - 1
      ? pool[currentIndex + 1]
      : pool[0];

  const handlePrevClick = () => {
    if (onSelectCharacter && prevPrisoner) {
      onSelectCharacter(prevPrisoner);
    }
  };

  const handleNextClick = () => {
    if (onSelectCharacter && nextPrisoner) {
      onSelectCharacter(nextPrisoner);
    }
  };

  // Copy Chat Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(charChatLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy JSON Model
  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(
      {
        id: character.id,
        prisonId: charPrisonId,
        name: charName,
        age: charAge,
        subtitle: charSubtitle,
        origin: charOrigin,
        rarity: charRarity,
        loyalty: `${charLoyalty}%`,
        danger: `${charDanger}%`,
        heartbeat: `${charHeartbeat} bpm`,
        loveRate: charLoveRate,
        sentenceTerm: charSentenceTerm,
        genres: character.genres,
        backstory: character.backstory,
        firstMessage: character.firstMessage,
        quote: charQuote,
        voiceActor: charVoiceActor,
        chatLink: charChatLink,
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Heart like click
  const handleLikeClick = () => {
    setLikesCount((prev) => prev + 1);
    setHasLiked(true);
    onLikeCharacter(character.id);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ec4899', '#f43f5e', '#fda4af', '#f472b6'],
      });
    } catch {
      // ignore
    }
  };

  // Play voice sample (supports real audio URL / uploaded audio file or Web Speech API)
  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      stopVoiceAudio();
      return;
    }

    setIsPlayingVoice(true);
    setVoiceProgress(0);

    // Case 1: Character has an uploaded audio file or direct audio URL
    if (character.voiceAudioUrl) {
      try {
        const audio = new Audio(character.voiceAudioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          stopVoiceAudio();
          setVoiceProgress(100);
        };

        audio.onerror = () => {
          // Fallback to speech synthesis if audio link fails
          stopVoiceAudio();
        };

        audio.ontimeupdate = () => {
          if (audio.duration && !isNaN(audio.duration)) {
            const pct = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
            setVoiceProgress(pct);
          }
        };

        audio.play().catch(() => {
          // Audio play blocked or failed
          stopVoiceAudio();
        });
        return;
      } catch {
        // Fall back to SpeechSynthesis
      }
    }

    // Case 2: Web Speech Synthesis using custom voice line or first message
    const speechText = character.voiceLine || character.firstMessage;
    if ('speechSynthesis' in window && speechText) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = 'vi-VN';
        utterance.rate = character.voiceRate ?? 0.95;
        utterance.pitch = character.voicePitch ?? 0.85; // slightly deeper male voice tone
        utterance.onend = () => {
          stopVoiceAudio();
          setVoiceProgress(100);
        };
        utterance.onerror = () => {
          stopVoiceAudio();
        };
        window.speechSynthesis.speak(utterance);
      } catch {
        // fallback to timer animation
      }
    }

    // Progress bar animation timer fallback (approx 14 seconds)
    voiceIntervalRef.current = setInterval(() => {
      setVoiceProgress((prev) => {
        if (prev >= 100) {
          stopVoiceAudio();
          return 0;
        }
        return prev + 5;
      });
    }, 700);
  };

  // Submit love letter
  const handleSendLoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loveMessage.trim()) return;

    if (onSendLove) {
      onSendLove(character.id, loveSender.trim() || 'Nàng Quản Ngục Nhỏ', loveMessage.trim());
    }

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#fda4af', '#fbbf24'],
      });
    } catch {
      // ignore
    }

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setLoveMessage('');
      setShowLoveLetter(false);
    }, 1500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl rounded-[32px] border shadow-2xl transition-all my-auto max-h-[95vh] flex flex-col overflow-hidden relative ${
          darkMode
            ? 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-pink-950/40'
            : 'bg-[#fffbfb] border-pink-200/90 text-slate-800 shadow-pink-200/60'
        }`}
      >
        {/* TOP NAVIGATION & ACTION BAR */}
        <div
          className={`px-5 sm:px-8 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 ${
            darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-pink-100 bg-white/70'
          }`}
        >
          {/* Breadcrumb & Hot Tags */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-slate-400">
              <span>🏠 Trang Chủ</span>
              <span>/</span>
              <span>Thẻ Nhân Vật</span>
              <span>/</span>
              <span className="text-pink-500 font-extrabold">Mẫu Hồ Sơ Chi Tiết</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Flame className="w-3 h-3 fill-rose-500" />
                <span>BẢN HỒ SƠ PHẠM NHÂN HOT</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>Đang Giam Giữ Yêu Thương</span>
              </span>
            </div>
          </div>

          {/* Right Controls: Prisoner Switcher & JSON Copy & Close */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Switch Prisoners */}
            {prevPrisoner && (
              <button
                type="button"
                onClick={handlePrevClick}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
                title={`Chuyển sang ${prevPrisoner.name}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Phạm Nhân {prevPrisoner.prisonId.replace('#PRISON-', '#').replace('-KV', '').replace('-LCT', '').replace('-RA', '')}</span>
              </button>
            )}

            <span className="text-slate-300 dark:text-slate-700">|</span>

            {nextPrisoner && (
              <button
                type="button"
                onClick={handleNextClick}
                className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
                title={`Chuyển sang ${nextPrisoner.name}`}
              >
                <span>Phạm Nhân {nextPrisoner.prisonId.replace('#PRISON-', '#').replace('-KV', '').replace('-LCT', '').replace('-RA', '')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Copy JSON */}
            <button
              type="button"
              onClick={handleCopyJson}
              className={`p-1.5 px-3 rounded-xl text-[11px] font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ml-1 ${
                copiedJson
                  ? 'bg-emerald-500/10 border-emerald-400 text-emerald-500'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-pink-300'
              }`}
              title="Sao chép toàn bộ mẫu hồ sơ dưới định dạng JSON"
            >
              <Code className="w-3.5 h-3.5 text-pink-500" />
              <span>{copiedJson ? 'Đã chép JSON' : 'Sao Chép Mẫu JSON'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ml-1"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: TWO COLUMNS LIKE SCREENSHOT */}
        <div className="p-5 sm:p-7 md:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* ================= LEFT COLUMN: CARD VISUAL & STATS (5 cols) ================= */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`p-5 rounded-3xl border transition-all text-center relative overflow-hidden shadow-lg ${
                darkMode
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-white border-pink-100 shadow-pink-100/60'
              }`}
            >
              {/* Card top badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 via-rose-400 to-amber-500 text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-200 animate-spin" />
                  <span>ĐẲNG CẤP {charRarity}</span>
                </span>
                <span className="text-[11px] font-bold font-mono text-slate-400 dark:text-slate-500">
                  Mã Số Lồng Giam: {charPrisonId}
                </span>
              </div>

              {/* Photo Card with Overlay ECG Heartbeat */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-800 shadow-inner group border border-pink-100/60 dark:border-slate-800">
                <img
                  src={charImage}
                  alt={charName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Decorative floating mini icons on left overlay */}
                <div className="absolute left-3 top-3 flex flex-col gap-2 z-10 opacity-80">
                  <span className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center text-xs shadow-sm">
                    👑
                  </span>
                  <span className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center text-xs shadow-sm">
                    🌹
                  </span>
                  <span className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center text-xs shadow-sm">
                    🗝️
                  </span>
                </div>

                {/* Bottom ECG Heartbeat Banner over the photo */}
                <div className="absolute bottom-2 inset-x-2 p-2.5 rounded-xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-pink-200/50 dark:border-slate-800 shadow-md z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-sm animate-pulse">
                      💓
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-tight">
                        Nhịp Tim Khi Gặp Nàng Quản Ngục
                      </p>
                      <p className="text-xs font-black text-rose-500">
                        {charHeartbeat} bpm
                      </p>
                    </div>
                  </div>

                  {/* Animated ECG Pulse Line SVG */}
                  <div className="w-24 h-6 flex items-center overflow-hidden">
                    <svg
                      viewBox="0 0 100 24"
                      className="w-full h-full text-rose-500 stroke-current fill-none stroke-[2] animate-pulse"
                    >
                      <path d="M0,12 L20,12 L25,4 L30,20 L35,8 L40,16 L45,12 L100,12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Character Name & Subtitle under photo */}
              <div className="mt-4 space-y-1">
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {charName}
                </h3>
                <p className="text-xs italic text-rose-400 font-semibold font-serif">
                  "{charSubtitle}"
                </p>
              </div>

              {/* BỐN CHỈ SỐ XUỐNG DƯỚI: Chiếm Hữu Tuyệt Đối, Án Chung Thân, Độ Trung Thành, Độ Nguy Hiểm */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-left">
                {/* 1. Chiếm Hữu Tuyệt Đối & Án Chung Thân */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/50 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                        Đặc Tính
                      </p>
                      <p className="text-xs font-black text-rose-600 dark:text-rose-300 truncate" title={charPossession}>
                        {charPossession}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center text-sm shrink-0">
                      ⛓️
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                        Bản Án
                      </p>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate" title={charSentenceTerm}>
                        {charSentenceTerm}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Độ Trung Thành & Độ Nguy Hiểm (Gauges) */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-pink-200/60 dark:border-slate-800 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        🛡️ Trung Thành
                      </span>
                      <span className="text-xs font-black text-pink-600 dark:text-pink-400">
                        {charLoyalty}%
                      </span>
                    </div>
                    <div className="w-full bg-pink-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, charLoyalty))}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-amber-200/60 dark:border-slate-800 shadow-2xs">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        ⚠️ Nguy Hiểm
                      </span>
                      <span className="text-xs font-black text-amber-500 dark:text-amber-400">
                        {charDanger}%
                      </span>
                    </div>
                    <div className="w-full bg-amber-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-red-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, charDanger))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Measurement Boxes: Cuồng Ái & Thụ Án */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Mức Độ Cuồng Ái
                  </p>
                  <p className="text-xl font-black text-rose-500">{charLoveRate}</p>
                  <div className="w-full bg-rose-200/60 dark:bg-rose-900/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full w-full" />
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Thời Hạn Thụ Án
                  </p>
                  <p className="text-xl font-black text-sky-600 dark:text-sky-300">
                    {charSentenceTerm}
                  </p>
                  <div className="w-full bg-sky-200/60 dark:bg-sky-900/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-400 to-indigo-600 h-full rounded-full w-full" />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Like & Save Bookmark */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleLikeClick}
                  className={`py-2.5 px-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                    hasLiked
                      ? 'bg-rose-600 text-white shadow-rose-500/30'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-400/30'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{likesCount.toLocaleString('vi-VN')} TRÁI TIM</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => onToggleFavorite(character.id, e)}
                  className={`py-2.5 px-3 rounded-2xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isFavorite
                      ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-400/30'
                      : 'bg-white dark:bg-slate-800 border-pink-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-pink-400'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : 'text-amber-500'}`} />
                  <span>{isFavorite ? 'Đã Lưu Hồ Sơ ★' : 'Lưu Hồ Sơ ★'}</span>
                </button>
              </div>

              {/* Chat Link Input Bar with Copy & Open */}
              <div className="mt-3 flex items-center gap-1.5 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
                <span className="pl-2 text-slate-400">🔗</span>
                <input
                  type="text"
                  readOnly
                  value={charChatLink}
                  className="bg-transparent flex-1 outline-none text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Sao chép liên kết"
                  className="p-1.5 rounded-xl hover:bg-pink-100 dark:hover:bg-slate-800 text-slate-500 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={charChatLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Mở liên kết trò chuyện"
                  className="p-1.5 rounded-xl hover:bg-pink-100 dark:hover:bg-slate-800 text-slate-500 hover:text-pink-600 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: DETAILED DOSSIER & CONFESSIONS (7 cols) ================= */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Header: Name, Age, Prison Code & Tags */}
            <div className="space-y-3 pb-3 border-b border-pink-100 dark:border-slate-800">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    {charName}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300/40">
                    {charAge}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    MÃ QUẢN LÝ TÙ
                  </p>
                  <p className="text-lg sm:text-xl font-black font-mono text-rose-500">
                    {charPrisonId}
                  </p>
                </div>
              </div>

              {/* Sub-info: Identity & Crime */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {charOrigin}
              </p>

              {/* Tags Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {character.genres.map((genre, idx) => {
                  const colors = [
                    'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border-rose-200/50',
                    'bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-300 border-pink-200/50',
                    'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 border-sky-200/50',
                    'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border-purple-200/50',
                    'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/50',
                  ];
                  const colorClass = colors[idx % colors.length];
                  return (
                    <span
                      key={genre}
                      className={`px-3 py-1 rounded-2xl text-[11px] font-extrabold border ${colorClass}`}
                    >
                      #{genre}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* SECTION 1: BIÊN BẢN THÚ TỘI & CỐT TRUYỆN GIAM CẦM */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border transition-all relative overflow-hidden space-y-4 ${
                darkMode
                  ? 'bg-slate-900/75 border-slate-800'
                  : 'bg-white border-pink-100 shadow-sm shadow-pink-100/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">📖</span>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Biên Bản Thú Tội & Cốt Truyện Giam Cầm
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  HỒ SƠ PHẠM TỘI
                </span>
              </div>

              {/* Story Narrative */}
              <div className="text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 space-y-3 whitespace-pre-line font-medium">
                {character.backstory}
              </div>

              {/* Quotation Callout Box with Lock Watermark */}
              <div
                className={`p-4 rounded-2xl border relative overflow-hidden italic text-xs sm:text-sm font-serif ${
                  darkMode
                    ? 'bg-slate-950/60 border-slate-800 text-rose-300/90'
                    : 'bg-pink-50/60 border-pink-200/60 text-slate-700'
                }`}
              >
                {/* Watermark Lock */}
                <div className="absolute right-2 bottom-1 opacity-10 pointer-events-none">
                  <Lock className="w-16 h-16 text-rose-500" />
                </div>
                <p className="relative z-10 leading-relaxed font-medium">
                  {charQuote}
                </p>
              </div>
            </div>

            {/* SECTION 2: LỜI NHẮN ĐẦU TIÊN (FIRST MESSAGE) */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border transition-all relative overflow-hidden space-y-4 ${
                darkMode
                  ? 'bg-slate-900/75 border-slate-800'
                  : 'bg-white border-pink-100 shadow-sm shadow-pink-100/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">💬</span>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Lời Nhắn Đầu Tiên (First Message)
                  </h4>
                </div>

                {/* Voice button with interactive playback */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isPlayingVoice
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-400/20'
                  }`}
                >
                  {isPlayingVoice ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isPlayingVoice ? 'Dừng Giọng Nói' : `Nghe Giọng Nói (${character.voiceDuration || '0:14'})`}</span>
                </button>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed italic relative ${
                  darkMode
                    ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                    : 'bg-[#fffafb] border-pink-100 text-slate-800'
                }`}
              >
                <span className="text-pink-500 font-serif text-lg leading-none absolute -top-1 left-2">“</span>
                <p className="pl-3 pr-2 font-serif font-medium">
                  "{character.firstMessage}"
                </p>
              </div>

              {/* Audio visualizer / soundwave strip */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1 h-3 rounded-full bg-rose-400 ${isPlayingVoice ? 'animate-bounce' : ''}`} />
                  <span className={`w-1 h-5 rounded-full bg-pink-500 ${isPlayingVoice ? 'animate-pulse' : ''}`} />
                  <span className={`w-1 h-2 rounded-full bg-sky-400 ${isPlayingVoice ? 'animate-bounce' : ''}`} />
                  <span className={`w-1 h-6 rounded-full bg-rose-500 ${isPlayingVoice ? 'animate-pulse' : ''}`} />
                  <span className={`w-1 h-4 rounded-full bg-indigo-400 ${isPlayingVoice ? 'animate-bounce' : ''}`} />
                  <span className={`w-1 h-3 rounded-full bg-pink-400 ${isPlayingVoice ? 'animate-pulse' : ''}`} />
                  <span className={`w-1 h-5 rounded-full bg-rose-400 ${isPlayingVoice ? 'animate-bounce' : ''}`} />
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-medium">
                    Diễn đọc lồng tiếng: <strong className="text-slate-600 dark:text-slate-300">{charVoiceActor}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: BOTTOM PRIMARY ACTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={charChatLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#7a1b38] via-[#a8224b] to-[#c23661] hover:opacity-95 shadow-lg shadow-rose-950/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>💬</span>
                <span>Vào Nhắn Riêng 1:1 Ngay</span>
                <span>💬</span>
              </a>

              <button
                type="button"
                onClick={() => setShowLoveLetter(!showLoveLetter)}
                className="py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-300/60 dark:border-rose-800/60 shadow-md shadow-rose-200/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>💌</span>
                <span>{showLoveLetter ? 'Đóng Thư Thăm Nuôi' : 'Gửi Thư Tình Thăm Nuôi 💌'}</span>
              </button>
            </div>

            {/* Quick Instant Delete Action */}
            {onDeleteCharacter && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCharacter(character.id);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl font-black text-xs text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-2xs"
                  title="Xóa phạm nhân này khỏi danh sách (Bấm xóa luôn)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Hồ Sơ Phạm Nhân Này (Bấm Xóa Luôn)</span>
                </button>
              </div>
            )}

            {/* EXPANDABLE LOVE LETTER FORM ("Gửi lời yêu đến chồng nhỏ") */}
            {showLoveLetter && (
              <div className="p-5 rounded-3xl border border-pink-300/80 bg-pink-50/50 dark:bg-slate-900/90 dark:border-pink-500/30 space-y-4 animate-scale-up">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                      💌 Viết Thư Gửi Vào Buồng Giam {charName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Lời nhắn này sẽ được niêm phong hoa hồng chuyển đến tận tay chồng nhỏ.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLoveLetter(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {sentSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center space-y-1">
                    <p className="text-lg">💌</p>
                    <p>Đã niêm phong và gửi thư tình đến {charName} thành công!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendLoveSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Danh xưng của nàng:
                      </label>
                      <input
                        type="text"
                        value={loveSender}
                        onChange={(e) => setLoveSender(e.target.value)}
                        placeholder="VD: Nàng Quản Ngục Nhỏ..."
                        className="w-full px-3.5 py-2 rounded-xl text-xs border border-pink-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                        Gợi ý lời nhắn ngọt ngào:
                      </label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {SWEET_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setLoveMessage(preset)}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-pink-400 cursor-pointer text-left"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={3}
                        value={loveMessage}
                        onChange={(e) => setLoveMessage(e.target.value)}
                        placeholder={`Viết đôi dòng nhắn gửi yêu thương đến ${charName}...`}
                        required
                        className="w-full p-3 rounded-xl text-xs border border-pink-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-pink-500 resize-none font-serif"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowLoveLetter(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 shadow-md shadow-pink-500/30 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dán Niêm Phong Thư</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Love message history if any */}
                {character.loveMessages && character.loveMessages.length > 0 && (
                  <div className="pt-2 border-t border-pink-100 dark:border-slate-800 space-y-2 max-h-32 overflow-y-auto">
                    <span className="text-[10px] font-black uppercase text-pink-500">
                      Hộp thư thăm nuôi ({character.loveMessages.length}):
                    </span>
                    {character.loveMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-pink-100 dark:border-slate-700"
                      >
                        <span className="font-bold text-pink-600 mr-1.5">{msg.senderName}:</span>
                        <span className="text-slate-600 dark:text-slate-300">"{msg.message}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
