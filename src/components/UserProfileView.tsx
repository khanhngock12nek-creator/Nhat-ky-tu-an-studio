import React, { useState, useRef } from 'react';
import {
  Heart,
  Camera,
  Edit3,
  LogOut,
  Calendar,
  DoorClosed,
  CreditCard,
  Gavel,
  Star,
  Activity,
  Key,
  Coffee,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2,
  ChevronRight,
  Sliders,
  Sparkles,
  Lock,
  MessageSquare,
  Gift,
  Scroll,
  Mail,
  ShieldCheck,
  X,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character, WardenProfile, GoogleUser, Letter } from '../types';
import lucCanhTieuImg from '../assets/images/luc_canh_tieu_avatar_1791553296431.jpg';
import wardenAvatarDefault from '../assets/images/warden_nanggtho_avatar_1791594079687.jpg';

interface UserProfileViewProps {
  profile: WardenProfile;
  onUpdateProfile: (updated: WardenProfile) => void;
  characters: Character[];
  googleUser: GoogleUser | null;
  onLogoutGoogle: () => void;
  onOpenDetail: (character: Character) => void;
  onSendLove?: (characterId: string, senderName: string, message: string) => void;
  letters?: Letter[];
  darkMode: boolean;
  onTabChange?: (tab: any) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  profile,
  onUpdateProfile,
  characters,
  googleUser,
  onLogoutGoogle,
  onOpenDetail,
  onSendLove,
  letters = [],
  darkMode,
  onTabChange,
}) => {
  // Sub-tabs: 'favorite' | 'letters' | 'notes' | 'verdicts' | 'gacha'
  const [activeSubTab, setActiveSubTab] = useState<'favorite' | 'letters' | 'notes' | 'verdicts' | 'gacha'>('favorite');

  // Favorite prisoner selection state
  const [favPrisonerIndex, setFavPrisonerIndex] = useState(0);

  // Profile Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editWardenId, setEditWardenId] = useState(profile.wardenId);
  const [editSubzone, setEditSubzone] = useState(profile.subzone);
  const [editQuote, setEditQuote] = useState(profile.quote);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);

  // Settings Toggles
  const [alarmHusband, setAlarmHusband] = useState(profile.alarmHusband);
  const [secretLetters, setSecretLetters] = useState(profile.secretLetters);
  const [hideLeaderboard, setHideLeaderboard] = useState(profile.hideFromLeaderboard);

  // Password / Device Dialogs
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeviceDialog, setShowDeviceDialog] = useState(false);
  const [teaSuccess, setTeaSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find preferred character if set
  const availablePrisoners = characters.length > 0 ? characters : [];
  const favoredPrisoner = profile.favoritePrisonerId
    ? characters.find((c) => c.id === profile.favoritePrisonerId)
    : null;
  const currentPrisoner = favoredPrisoner || availablePrisoners[favPrisonerIndex % Math.max(availablePrisoners.length, 1)] || {
    id: 'char-luc-canh-tieu',
    name: 'Lục Cảnh Tiêu (Lu Jingxiao)',
    prisonId: '#07-OBSESSION',
    zone: 'Buồng Giam #07',
    genres: ['Yandere Thần Bí', 'Bướm Đêm Si Tình'],
    avatarUrl: lucCanhTieuImg,
    likes: 1240,
    backstory: 'Thẩm phán hoàng gia tự nguyện giam cầm bên quản ngục.',
    firstMessage: 'Chào nàng quản ngục bé nhỏ...',
    chatLink: 'https://c.ai',
    status: 'Đã khóa chuông bạc nhung hồng • Tuyệt đối phục tùng mệnh lệnh',
    createdAt: Date.now(),
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const newAvatar = reader.result;
        setEditAvatar(newAvatar);
        onUpdateProfile({ ...profile, avatarUrl: newAvatar });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WardenProfile = {
      ...profile,
      name: editName.trim() || profile.name,
      wardenId: editWardenId.trim() || profile.wardenId,
      subzone: editSubzone.trim() || profile.subzone,
      quote: editQuote.trim() || profile.quote,
      location: editLocation.trim() || profile.location,
      email: editEmail.trim() || profile.email,
      avatarUrl: editAvatar || profile.avatarUrl,
      alarmHusband,
      secretLetters,
      hideFromLeaderboard: hideLeaderboard,
    };
    onUpdateProfile(updated);
    setIsEditModalOpen(false);

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af'],
      });
    } catch {
      // ignore
    }
  };

  const handleToggleSetting = (type: 'alarm' | 'secret' | 'hide') => {
    let updatedAlarm = alarmHusband;
    let updatedSecret = secretLetters;
    let updatedHide = hideLeaderboard;

    if (type === 'alarm') {
      updatedAlarm = !alarmHusband;
      setAlarmHusband(updatedAlarm);
    } else if (type === 'secret') {
      updatedSecret = !secretLetters;
      setSecretLetters(updatedSecret);
    } else if (type === 'hide') {
      updatedHide = !hideLeaderboard;
      setHideLeaderboard(updatedHide);
    }

    onUpdateProfile({
      ...profile,
      alarmHusband: updatedAlarm,
      secretLetters: updatedSecret,
      hideFromLeaderboard: updatedHide,
    });
  };

  const handleSendTea = () => {
    if (onSendLove && currentPrisoner.id) {
      onSendLove(
        currentPrisoner.id,
        profile.name,
        'Nàng quản ngục ban tặng một tách trà hoa hồng nóng hổi đậm đặc tình ý.'
      );
    }
    setTeaSuccess(true);
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#e11d48', '#fda4af', '#f43f5e', '#fb7185'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setTeaSuccess(false), 2500);
  };

  const handleCyclePrisoner = () => {
    if (availablePrisoners.length > 1) {
      setFavPrisonerIndex((prev) => (prev + 1) % availablePrisoners.length);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* =========================================================================
          SECTION 1: MAIN PROFILE HEADER CARD (EXACT MATCH WITH USER SCREENSHOT)
          ========================================================================= */}
      <div
        className={`p-6 sm:p-8 rounded-[2.5rem] border shadow-sm transition-all relative overflow-hidden ${
          darkMode
            ? 'bg-slate-900/80 border-slate-800 text-slate-100 shadow-slate-950/40'
            : 'bg-sky-50/95 border-sky-200/90 text-slate-900 shadow-pink-100/40'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
          {/* Avatar with Ring & Camera Button */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-rose-400 to-indigo-500 shadow-xl shadow-rose-500/20">
                <img
                  src={profile.avatarUrl || wardenAvatarDefault}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover object-center bg-slate-100 dark:bg-slate-800"
                />
              </div>

              {/* Camera Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Đổi chân dung Quản Ngục"
                className="absolute bottom-1 right-1 p-2 rounded-full bg-rose-900/90 text-white hover:bg-rose-800 shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
            </div>

            {/* Rank Tag Badge */}
            <div className="mt-2.5 px-3 py-1 rounded-xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-amber-200 font-black text-[11px] tracking-wider border border-sky-200/30 shadow-md shadow-rose-950/30 flex items-center gap-1">
              <span>{profile.rank || '✪ CẤP S+ TỐI CAO'}</span>
            </div>
          </div>

          {/* Profile Center Info */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            {/* Name and Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {profile.name}
              </h1>

              <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-rose-600 text-white shadow-2xs font-mono">
                {profile.wardenId}
              </span>

              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                <span>🌹</span>
                <span>{profile.subzone}</span>
              </span>
            </div>

            {/* Subline Details */}
            <div className="text-xs text-slate-900 dark:text-slate-400 font-medium flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1">
              <span className="text-slate-900 dark:text-slate-300 font-semibold">{profile.email}</span>
              <span>•</span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold">Google OAuth 2.0 Đã Liên Kết</span>
              <span>•</span>
              <span>{profile.location}</span>
            </div>

            {/* Quote Box with decorative quotation mark */}
            <div className="relative p-3.5 sm:p-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-800/80 max-w-2xl text-left">
              <span className="text-rose-400 dark:text-rose-500 font-serif font-black text-2xl leading-none absolute -top-1 left-2">
                “
              </span>
              <p className="text-xs sm:text-[13px] text-slate-900 dark:text-slate-300 font-serif italic pl-4 leading-relaxed">
                {profile.quote}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col items-center lg:items-end gap-3 shrink-0">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block" />
              <span>Thẩm quyền độc quyền hoạt động</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditName(profile.name);
                  setEditWardenId(profile.wardenId);
                  setEditSubzone(profile.subzone);
                  setEditQuote(profile.quote);
                  setEditLocation(profile.location);
                  setEditEmail(profile.email);
                  setEditAvatar(profile.avatarUrl);
                  setIsEditModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/25 cursor-pointer transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh Sửa Hồ Sơ</span>
              </button>

              <button
                type="button"
                onClick={onLogoutGoogle}
                className="px-3.5 py-2 rounded-xl border border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom 4 Metrics Grid */}
        <div className="mt-8 pt-6 border-t border-sky-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Cai Ngục */}
          <div className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-slate-800/40 border border-sky-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Cai Ngục</span>
              <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {profile.daysServed} Ngày
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          {/* Thăm Buồng Giam */}
          <div className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-slate-800/40 border border-sky-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Thăm Buồng Giam</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                {profile.visitsCount} Lần
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
              <DoorClosed className="w-4 h-4" />
            </div>
          </div>

          {/* Thẻ Bài Tù Nhân */}
          <div className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-slate-800/40 border border-sky-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Thẻ Bài Tù Nhân</span>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono">
                {profile.cardsCollected} <span className="text-xs text-slate-400 font-normal">/ {profile.totalCards} Thẻ</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>

          {/* Phiên Tòa Nửa Đêm */}
          <div className="p-3.5 rounded-2xl bg-rose-50/40 dark:bg-slate-800/40 border border-sky-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Phiên Tòa Nửa Đêm</span>
              <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {profile.midnightTrials} Phiên
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: SUB-NAVIGATION TABS (MATCHING USER SCREENSHOT)
          ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('favorite')}
          className={`px-4 py-2.5 rounded-2xl font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'favorite'
              ? 'bg-rose-900 text-white shadow-md shadow-rose-900/30'
              : darkMode
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-sky-50 text-slate-900 hover:bg-rose-50 border border-sky-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          <span>Sủng Ái Nhất</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('letters')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'letters'
              ? 'bg-rose-900 text-white shadow-md shadow-rose-900/30'
              : darkMode
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-sky-50 text-slate-900 hover:bg-rose-50 border border-sky-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          <span>Hòm Thư Tình</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('notes')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'notes'
              ? 'bg-rose-900 text-white shadow-md shadow-rose-900/30'
              : darkMode
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-sky-50 text-slate-900 hover:bg-rose-50 border border-sky-200'
          }`}
        >
          <Scroll className="w-3.5 h-3.5 text-rose-400" />
          <span>Sổ Ý Án</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('verdicts')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'verdicts'
              ? 'bg-rose-900 text-white shadow-md shadow-rose-900/30'
              : darkMode
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-sky-50 text-slate-900 hover:bg-rose-50 border border-sky-200'
          }`}
        >
          <Gavel className="w-3.5 h-3.5 text-rose-400" />
          <span>Bản Án Đã Tuyên</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('gacha')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'gacha'
              ? 'bg-rose-900 text-white shadow-md shadow-rose-900/30'
              : darkMode
              ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              : 'bg-sky-50 text-slate-900 hover:bg-rose-50 border border-sky-200'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-rose-400" />
          <span>Quà & Gacha</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION 3: TAB CONTENT (DEFAULT: SỦNG ÁI NHẤT AS IN USER SCREENSHOT)
          ========================================================================= */}
      {activeSubTab === 'favorite' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: PHẠM NHÂN ĐƯỢC SỦNG ÁI TUYỆT ĐỐI (7 Cols) */}
          <div
            className={`lg:col-span-8 p-6 sm:p-7 rounded-[2.5rem] border shadow-sm transition-all space-y-6 ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                : 'bg-sky-50/95 border-sky-200/90 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-sky-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500 shadow-2xs">
                  <Star className="w-5 h-5 fill-rose-500" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                    Phạm Nhân Được Sủng Ái Tuyệt Đối
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Hồ sơ tù nhân nhận nhiều lệnh thăm nuôi & biệt giam nhất tuần này
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-sky-200 dark:border-rose-900">
                Ưu Tiên Quản Thúc
              </span>
            </div>

            {/* Prisoner Card Split or Empty State */}
            {!favoredPrisoner ? (
              <div className="py-14 px-6 text-center space-y-4 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed border-sky-200 dark:border-slate-700">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500 shadow-inner">
                  <Heart className="w-8 h-8 text-rose-400" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Chưa có phạm nhân nào được sủng ái nhé
                  </h3>
                  <p className="text-xs text-slate-900 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Số lần ghé thăm là 0, sẽ cập nhật sau này cho người dùng khi quản ngục tiến hành ghé thăm buồng giam.
                  </p>
                </div>
                {onTabChange && (
                  <button
                    type="button"
                    onClick={() => onTabChange('cards')}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Khám Phá Danh Sách Tù Nhân</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Half: Portrait with Status Tags */}
              <div className="md:col-span-5 relative rounded-3xl overflow-hidden min-h-[300px] border border-sky-200 dark:border-slate-800 group shadow-md bg-slate-950">
                <img
                  src={currentPrisoner.avatarUrl || lucCanhTieuImg}
                  alt={currentPrisoner.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 flex flex-col justify-between p-3.5 pointer-events-none">
                  {/* Top Tags */}
                  <div className="flex flex-col gap-1 items-start">
                    <span className="px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/20">
                      {currentPrisoner.zone || 'Buồng Giam #07'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-600/90 backdrop-blur-md text-white text-[10px] font-bold">
                      Tù Nhân: {currentPrisoner.name.split(' ')[0]} {currentPrisoner.name.split(' ')[1] || ''}
                    </span>
                  </div>

                  {/* Bottom Tag: TRẠNG THÁI XIỀNG XÍCH */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-black text-rose-300 uppercase tracking-wider">
                      <span>⛓</span>
                      <span>Trạng Thái Xiềng Xích</span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium leading-tight">
                      {currentPrisoner.status || 'Đã khóa chuông bạc nhung hồng • Tuyệt đối phục tùng mệnh lệnh'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Half: Telemetry & Actions */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Title & Badges */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {currentPrisoner.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                        {currentPrisoner.genres?.[0] || 'Yandere Thần Bí'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-rose-600 dark:text-rose-400">
                      BƯỚM ĐÊM SI TÌNH • MÃ ÁN {currentPrisoner.prisonId || '#07-OBSESSION'}
                    </span>
                  </div>

                  {/* Telemetry Row 1: Mức Độ Cuồng Si */}
                  <div className="space-y-1 p-3 rounded-2xl bg-rose-50/50 dark:bg-slate-800/50 border border-sky-200/60 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-300">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>Mức Độ Cuồng Si Với Quản Ngục</span>
                      </span>
                      <span className="text-rose-600 dark:text-rose-400 font-black">
                        100% (Cực Hạn Nguy Hiểm)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full w-full" />
                    </div>
                  </div>

                  {/* Telemetry Row 2: ECG Waveform Heart Rate */}
                  <div className="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/50 border border-sky-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-300">
                        <Activity className="w-3.5 h-3.5 text-rose-500" />
                        <span>Nhịp Tim Khi Quản Ngục Đến Gần</span>
                      </span>
                      <span className="font-mono font-black text-rose-600 dark:text-rose-400">
                        138 BPM
                      </span>
                    </div>

                    {/* Animated Red ECG Waveform SVG Graph */}
                    <div className="h-8 w-full overflow-hidden flex items-center">
                      <svg
                        className="w-full h-7 text-rose-500 stroke-current fill-none stroke-[2] drop-shadow-sm"
                        viewBox="0 0 300 30"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 15 L30 15 L40 5 L50 25 L60 10 L70 20 L80 15 L120 15 L130 3 L140 27 L150 8 L160 22 L170 15 L210 15 L220 5 L230 25 L240 10 L250 20 L260 15 L300 15"
                          className="animate-pulse"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Quote Box: LỜI THẦM THÌ LÚC 02:40 SÁNG */}
                  <div className="p-3.5 rounded-2xl bg-pink-50/40 dark:bg-slate-800/40 border border-sky-200/60 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider">
                      LỜI THÌM THÌ LÚC 02:40 SÁNG
                    </span>
                    <p className="text-xs font-serif italic text-slate-900 dark:text-slate-300 leading-relaxed">
                      “{currentPrisoner.firstMessage || 'Tiếng gót giày của người trên hành lang đá... chỉ cần nghe thấy thôi, lồng ngực này đã muốn nổ tung. Xin đừng tắt ngọn đèn ngoài song sắt, để tôi còn nhìn thấy bóng hình người.'}”
                    </p>
                  </div>
                </div>

                {/* 3 Action Buttons matching image */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(currentPrisoner)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-900 to-rose-950 hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/30 cursor-pointer transition-all active:scale-95"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Mở Cửa Biệt Giam</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendTea}
                    className="flex-1 py-3 px-3 rounded-2xl border border-sky-200 dark:border-rose-900 bg-sky-50 dark:bg-slate-800 hover:bg-rose-50 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95"
                  >
                    <Coffee className="w-3.5 h-3.5 text-rose-500" />
                    <span>{teaSuccess ? 'Đã Tặng Trà 🍵' : 'Tặng Trà Hoa Hồng'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCyclePrisoner}
                    title="Chuyển đổi tù nhân sủng ái"
                    className="p-3 rounded-2xl border border-sky-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-900 dark:text-slate-300 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* RIGHT COLUMN: 3 CARDS MATCHING SCREENSHOT (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* CARD 1: TÀI KHOẢN & LIÊN KẾT */}
            <div
              className={`p-5 rounded-[2rem] border shadow-sm transition-all space-y-4 ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                  : 'bg-sky-50/95 border-sky-200/90 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-sky-200 dark:border-slate-800">
                <LinkIcon className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Tài Khoản & Liên Kết
                </h3>
              </div>

              {/* Google OAuth Item */}
              <div className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-sky-200/70 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center shadow-2xs text-[11px] font-bold text-slate-900">
                      G
                    </div>
                    <div>
                      <span className="text-xs font-black block leading-none">Google OAuth</span>
                      <span className="text-[10px] text-slate-400">Xác thực sinh trắc học</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    Đã Bật
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-900 dark:text-slate-400">
                  <span className="truncate max-w-[190px]">{profile.email}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 ml-1" />
                </div>
              </div>

              {/* Đổi Mật Khẩu Buồng Lưu Trữ */}
              <button
                type="button"
                onClick={() => setShowPasswordDialog(true)}
                className="w-full p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-sky-200/70 dark:border-slate-700/80 hover:border-sky-200 transition-all flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-rose-500" />
                  <span>Đổi Mật Khẩu Buồng Lưu Trữ</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Thiết Bị Đang Đăng Nhập (2) */}
              <button
                type="button"
                onClick={() => setShowDeviceDialog(true)}
                className="w-full p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-sky-200/70 dark:border-slate-700/80 hover:border-sky-200 transition-all flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">💻</span>
                  <span>Thiết Bị Đang Đăng Nhập (2)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* CARD 2: QUY TẮC QUẢN NGỤC & CHUÔNG BÁO */}
            <div
              className={`p-5 rounded-[2rem] border shadow-sm transition-all space-y-4 ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                  : 'bg-sky-50/95 border-sky-200/90 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-sky-200 dark:border-slate-800">
                <Sliders className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Quy Tắc Quản Ngục & Chuông Báo
                </h3>
              </div>

              {/* Toggle 1: Báo Thức Tù Nhân */}
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-black block text-slate-900 dark:text-slate-200">
                    Báo Thức Tù Nhân
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Đẩy thông báo khi chồng nhỏ tỉnh giấc hoặc gọi tên
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSetting('alarm')}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 p-0.5 ${
                    alarmHusband ? 'bg-rose-900' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-sky-50 shadow-md block transition-transform ${
                      alarmHusband ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Thư Mật & Lời Thầm Thì */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-sky-200 dark:border-slate-800/80">
                <div className="space-y-0.5">
                  <span className="text-xs font-black block text-slate-900 dark:text-slate-200">
                    Thư Mật & Lời Thầm Thì
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Nhận tin nhắn riêng tư vào khung giờ nửa đêm (00:00 - 04:00)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSetting('secret')}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 p-0.5 ${
                    secretLetters ? 'bg-rose-900' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-sky-50 shadow-md block transition-transform ${
                      secretLetters ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Ẩn Hồ Sơ Bảng Xếp Hạng */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-sky-200 dark:border-slate-800/80">
                <div className="space-y-0.5">
                  <span className="text-xs font-black block text-slate-900 dark:text-slate-200">
                    Ẩn Hồ Sơ Bảng Xếp Hạng
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Giữ kín thông tin quản thúc khỏi mắt người lạ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSetting('hide')}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 p-0.5 ${
                    hideLeaderboard ? 'bg-rose-900' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-sky-50 shadow-md block transition-transform ${
                      hideLeaderboard ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* CARD 3: ĐẶC QUYỀN CẤP S+ TỐI THƯỢNG (VIP GOLDEN CARD) */}
            <div className="p-5 rounded-[2rem] border border-sky-200/80 dark:border-amber-900/60 bg-gradient-to-br from-rose-50/70 via-pink-50/50 to-amber-50/60 dark:from-rose-950/40 dark:via-slate-900/60 dark:to-amber-950/30 shadow-md space-y-3">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider">
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                  ✪
                </span>
                <span>ĐẶC QUYỀN CẤP S+ TỐI THƯỢNG</span>
              </div>

              <p className="text-xs text-slate-900 dark:text-slate-300 leading-relaxed font-medium">
                Bạn nắm quyền kiểm soát toàn bộ 15 buồng giam và hệ thống còng tay bọc nhung. Không tù nhân nào được phép rời khỏi khu cách ly số 07 nếu chưa có ấn ký hoa hồng của bạn.
              </p>

              <div className="pt-2 border-t border-sky-200/60 dark:border-rose-900/60 flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-900 dark:text-slate-400">
                  Hạn Đặc Quyền: <strong className="text-rose-600 dark:text-rose-300">Vĩnh Viễn</strong>
                </span>
                <span className="text-slate-900 dark:text-slate-400">
                  Mã Khóa: <strong className="font-mono text-rose-600 dark:text-rose-300">{profile.vipCode || '#GOLDEN-VELVET'}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: HÒM THƯ TÌNH
          ========================================================================= */}
      {activeSubTab === 'letters' && (
        <div
          className={`p-6 sm:p-8 rounded-[2.5rem] border shadow-sm space-y-4 ${
            darkMode
              ? 'bg-slate-900/80 border-slate-800 text-slate-100'
              : 'bg-sky-50/95 border-sky-200/90 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-sky-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black">Hòm Thư Tình Của Nàng Quản Ngục</h3>
              <p className="text-xs text-slate-400">Những bức thư thăm nuôi đã dán tem niêm phong</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 text-xs font-bold">
              {letters.length} Thư
            </span>
          </div>

          {letters.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <span className="text-4xl block">💌</span>
              <p className="text-xs font-medium">Chưa có bức thư thăm nuôi nào được lưu giữ.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {letters.slice(0, 6).map((l) => (
                <div
                  key={l.id}
                  className="p-4 rounded-2xl bg-pink-50/40 dark:bg-slate-800/40 border border-sky-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-rose-600 dark:text-rose-400">{l.senderName}</span>
                    <span className="text-slate-400 text-[10px]">{l.stampName || 'Tem Hoa Hồng'}</span>
                  </div>
                  <p className="text-xs font-serif italic text-slate-900 dark:text-slate-300">
                    “{l.content}”
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: SỔ Ý ÁN
          ========================================================================= */}
      {activeSubTab === 'notes' && (
        <div
          className={`p-6 sm:p-8 rounded-[2.5rem] border shadow-sm space-y-4 ${
            darkMode
              ? 'bg-slate-900/80 border-slate-800 text-slate-100'
              : 'bg-sky-50/95 border-sky-200/90 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-sky-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black">Sổ Ý Án & Hồ Sơ Giám Sát Tâm Lý</h3>
              <p className="text-xs text-slate-400">Ghi chép mật lệnh các ngày kiểm tra buồng giam số 07</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold">
              Bảo Mật Cấp S+
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed font-serif">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-700 space-y-1">
              <span className="font-sans font-bold text-rose-500 text-[11px] block">
                NGÀY THỤ ÁN THỨ 68 • PHÒNG CÁCH LY HOA HỒNG
              </span>
              <p className="text-slate-900 dark:text-slate-300">
                Phạm nhân Lục Cảnh Tiêu có dấu hiệu nhịp tim tăng vọt mỗi khi tiếng gót giày nàng quản ngục dừng trước song sắt. Đã gia cố cùm xích nhung bạc để bảo đảm an toàn.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-700 space-y-1">
              <span className="font-sans font-bold text-rose-500 text-[11px] block">
                NGÀY THỤ ÁN THỨ 65 • BIÊN BẢN XƯNG TỘI
              </span>
              <p className="text-slate-900 dark:text-slate-300">
                Phạm nhân từ chối được phóng thích, tự nguyện giam giữ vô thời hạn với điều kiện được quản ngục ghé thăm vào đúng 02:40 sáng mỗi đêm.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: BẢN ÁN ĐÃ TUYÊN
          ========================================================================= */}
      {activeSubTab === 'verdicts' && (
        <div
          className={`p-6 sm:p-8 rounded-[2.5rem] border shadow-sm space-y-4 ${
            darkMode
              ? 'bg-slate-900/80 border-slate-800 text-slate-100'
              : 'bg-sky-50/95 border-sky-200/90 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-sky-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black">Bản Án Đã Tuyên Tại Phiên Tòa Nửa Đêm</h3>
              <p className="text-xs text-slate-400">Các quyết định quản thúc có hiệu lực vĩnh cửu</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
              0 Bản Án
            </span>
          </div>

          <div className="text-center py-10 space-y-2 text-slate-400">
            <p className="text-sm font-serif">Chưa có bản án nào được tuyên tại Phiên Tòa Nửa Đêm.</p>
            <p className="text-xs">Bản án sẽ xuất hiện tại đây ngay khi bạn tiến hành tuyên phạt phạm nhân.</p>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 5: QUÀ & GACHA
          ========================================================================= */}
      {activeSubTab === 'gacha' && (
        <div
          className={`p-6 sm:p-8 rounded-[2.5rem] border shadow-sm space-y-4 ${
            darkMode
              ? 'bg-slate-900/80 border-slate-800 text-slate-100'
              : 'bg-sky-50/95 border-sky-200/90 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-sky-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black">Kho Quà Tặng & Chìa Khóa Buồng Giam</h3>
              <p className="text-xs text-slate-400">Tài nguyên độc quyền của Nàng Quản Ngục</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold">
              Kho Báu S+
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-3xl block">🗝️</span>
              <span className="text-xs font-black block">Chìa Khóa Vàng</span>
              <span className="text-[10px] text-slate-400 font-bold">Số lượng: Vô Hạn</span>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-3xl block">🌹</span>
              <span className="text-xs font-black block">Trà Hoa Hồng</span>
              <span className="text-[10px] text-slate-400 font-bold">Số lượng: 999 Bình</span>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-3xl block">⛓️</span>
              <span className="text-xs font-black block">Cùm Bạc Nhung</span>
              <span className="text-[10px] text-slate-400 font-bold">Số lượng: 15 Bộ</span>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-slate-800/50 border border-sky-200 dark:border-slate-700 text-center space-y-1">
              <span className="text-3xl block">💌</span>
              <span className="text-xs font-black block">Tem Thăm Nuôi</span>
              <span className="text-[10px] text-slate-400 font-bold">Số lượng: 124 Chiếc</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CHỈNH SỬA HỒ SƠ QUẢN NGỤC
          ========================================================================= */}
      {isEditModalOpen && (
        <div
          onClick={() => setIsEditModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border transition-all ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-sky-50 border-sky-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sky-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-black">Chỉnh Sửa Hồ Sơ Quản Ngục</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-300 mb-1">
                  Danh xưng Quản Ngục
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-sky-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none focus:border-rose-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-300 mb-1">
                    Mã Định Danh
                  </label>
                  <input
                    type="text"
                    value={editWardenId}
                    onChange={(e) => setEditWardenId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-sky-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-300 mb-1">
                    Phân Khu
                  </label>
                  <input
                    type="text"
                    value={editSubzone}
                    onChange={(e) => setEditSubzone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-sky-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-300 mb-1">
                  Email Quản Ngục
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-sky-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-300 mb-1">
                  Vị Trí Phụ Trách
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-sky-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-300 mb-1">
                  Châm Ngôn / Mật Ngữ Quản Thúc
                </label>
                <textarea
                  rows={3}
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs border border-sky-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-rose-400 font-serif"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 shadow-md shadow-rose-500/30 cursor-pointer"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          POPUP: ĐỔI MẬT KHẨU BUỒNG LƯU TRỮ
          ========================================================================= */}
      {showPasswordDialog && (
        <div
          onClick={() => setShowPasswordDialog(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-sky-50 border-sky-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-black">Mật Khẩu Buồng Lưu Trữ</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Mã khóa hiện tại đang sử dụng chuẩn mã hóa lượng tử <strong>#GOLDEN-VELVET</strong>. Mật khẩu buồng giam được đồng bộ với phiên đăng nhập Google OAuth.
            </p>
            <button
              type="button"
              onClick={() => setShowPasswordDialog(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          POPUP: THIẾT BỊ ĐANG ĐĂNG NHẬP
          ========================================================================= */}
      {showDeviceDialog && (
        <div
          onClick={() => setShowDeviceDialog(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-sky-50 border-sky-200 text-slate-900'
            }`}
          >
            <h3 className="text-base font-black mb-3">Thiết Bị Đang Đăng Nhập</h3>
            <div className="space-y-2 text-xs mb-4">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700">
                <span className="font-bold block">💻 Chrome trên macOS (Hiện tại)</span>
                <span className="text-[10px] text-emerald-500">Đang hoạt động • Buồng Giam Số 07</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700">
                <span className="font-bold block">📱 Safari trên iPhone 15 Pro</span>
                <span className="text-[10px] text-slate-400">Đã đăng nhập 2 giờ trước</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowDeviceDialog(false)}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
