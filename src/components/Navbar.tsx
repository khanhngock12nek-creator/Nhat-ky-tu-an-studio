import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Trophy,
  Sparkles,
  Mail,
  Tags,
  Users,
  Sun,
  Moon,
  ShieldCheck,
  Heart,
  MessageCircleHeart,
  MoreVertical,
  Gavel,
  HeartPulse,
  User,
  Gamepad2,
} from 'lucide-react';
import { ActiveTab, GoogleUser } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  totalCharacters: number;
  totalFavorites: number;
  showOnlyFavorites: boolean;
  onToggleFavoriteFilter: () => void;
  googleUser?: GoogleUser | null;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  darkMode,
  onToggleTheme,
  onOpenAdmin,
  isAdminLoggedIn,
  totalCharacters,
  totalFavorites,
  showOnlyFavorites,
  onToggleFavoriteFilter,
  googleUser,
  onOpenAuthModal,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navTabs = [
    {
      id: 'home' as ActiveTab,
      label: 'CỬA NHÀ GIAM',
      icon: Home,
    },
    {
      id: 'profile' as ActiveTab,
      label: 'HỒ SƠ QUẢN NGỤC',
      icon: User,
    },
    {
      id: 'cards' as ActiveTab,
      label: 'THẺ NHÂN VẬT',
      icon: Users,
      badge: totalCharacters > 0 ? totalCharacters : undefined,
    },
    {
      id: 'chat' as ActiveTab,
      label: 'NHẮN TIN RIÊNG',
      icon: MessageCircleHeart,
    },
    {
      id: 'ranking' as ActiveTab,
      label: 'BXH',
      icon: Trophy,
    },
    {
      id: 'gacha' as ActiveTab,
      label: 'QUAY GACHA',
      icon: Sparkles,
    },
    {
      id: 'letters' as ActiveTab,
      label: 'ĐÁNH GIÁ & IDEA',
      icon: Mail,
    },
    {
      id: 'genres' as ActiveTab,
      label: 'THỂ LOẠI',
      icon: Tags,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-colors backdrop-blur-md border-b ${
        darkMode
          ? 'bg-slate-900/85 border-slate-800/80 text-slate-100'
          : 'bg-white/80 border-pink-100/80 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand & Subtitle Zone */}
          <div
            onClick={() => onTabChange('home')}
            className="flex flex-col cursor-pointer group shrink-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                Nhật Ký Tù Án
              </span>
              <span className="text-base group-hover:rotate-12 transition-transform select-none">
                ⛓️💖
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wide italic leading-none ${
                darkMode ? 'text-pink-300/80' : 'text-pink-600/90'
              }`}
            >
              nơi lưu giữ các phạm nhân nhỏ
            </span>
          </div>

          {/* 5 Main Section Nav Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-pink-50/60 dark:bg-slate-800/60 border border-pink-100/50 dark:border-slate-700/50">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-sm scale-[1.01]'
                      : darkMode
                      ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-pink-100/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-pink-200/70 dark:bg-slate-700 text-pink-700 dark:text-pink-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: 3-Dots Vertical Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 3-Dots Vertical Menu (Yêu thích, Phiên Tòa Nửa Đêm, Phòng Giám Sát, Quản Ngục & Quản Trị) */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                aria-label="Tính năng mở rộng"
                title="Tính năng & Tùy chọn"
                className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                  isMoreOpen || activeTab === 'midnightCourt' || activeTab === 'psychWard' || showOnlyFavorites
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-white border-pink-200 text-slate-700 hover:text-pink-600 shadow-2xs'
                }`}
              >
                <MoreVertical className="w-3.5 h-3.5" />
                {(activeTab === 'midnightCourt' || activeTab === 'psychWard' || showOnlyFavorites) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-300 rounded-full animate-ping pointer-events-none" />
                )}
              </button>

              {/* Dropdown Menu */}
              {isMoreOpen && (
                <div
                  className={`absolute right-0 top-12 z-50 w-64 p-2 rounded-2xl border shadow-2xl transition-all ${
                    darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/80'
                      : 'bg-white border-pink-100 text-slate-800 shadow-pink-200/60'
                  }`}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      ★ TIỆN ÍCH & CƠ MẬT
                    </span>
                    {totalFavorites > 0 && (
                      <span className="text-[10px] text-pink-500 font-bold flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5 fill-pink-500" />
                        {totalFavorites}
                      </span>
                    )}
                  </div>

                  {/* 1. Nhân Vật Yêu Thích */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!showOnlyFavorites && activeTab !== 'cards') {
                        onTabChange('cards');
                      }
                      onToggleFavoriteFilter();
                      setIsMoreOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                      showOnlyFavorites
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : darkMode
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-rose-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        showOnlyFavorites
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-pink-500'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${showOnlyFavorites ? 'fill-white text-white' : 'fill-pink-500 text-pink-500'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs flex items-center justify-between">
                        <span>Nhân Vật Yêu Thích</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                            showOnlyFavorites
                              ? 'bg-white/20 text-white'
                              : 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300'
                          }`}
                        >
                          {totalFavorites}
                        </span>
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        {showOnlyFavorites ? 'Đang bật bộ lọc • Bấm để tắt' : 'Lọc & xem danh sách đã thích'}
                      </div>
                    </div>
                  </button>

                  {/* 2. Trò Chơi (Chưa có nhân vật nào để chơi) */}
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('minigame');
                      setIsMoreOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer mt-1 ${
                      activeTab === 'minigame'
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : darkMode
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-rose-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        activeTab === 'minigame'
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-500'
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs flex items-center justify-between">
                        <span>Trò Chơi</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
                            activeTab === 'minigame'
                              ? 'bg-white/20 text-white'
                              : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          Chưa có NV
                        </span>
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        Chưa có nhân vật nào để chơi
                      </div>
                    </div>
                  </button>

                  {/* 3. Phiên Tòa Nửa Đêm */}
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('midnightCourt');
                      setIsMoreOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                      activeTab === 'midnightCourt'
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : darkMode
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-rose-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        activeTab === 'midnightCourt'
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-100 dark:bg-rose-950/70 text-rose-500'
                      }`}
                    >
                      <Gavel className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs">Phiên Tòa Nửa Đêm</div>
                      <div className="text-[10px] opacity-75 truncate">
                        Tối cao 00:00 • Tuyên án bổ sung
                      </div>
                    </div>
                  </button>

                  {/* 2. Ở DƯỚI PHIÊN TÒA NỬA ĐÊM: Phòng Giám Sát Tâm Lý */}
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('psychWard');
                      setIsMoreOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer mt-1 ${
                      activeTab === 'psychWard'
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : darkMode
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-rose-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        activeTab === 'psychWard'
                          ? 'bg-white/20 text-white'
                          : 'bg-pink-100 dark:bg-pink-950/70 text-pink-500'
                      }`}
                    >
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs">Phòng Giám Sát Tâm Lý</div>
                      <div className="text-[10px] opacity-75 truncate">
                        Y án mật • Hồ sơ thần kinh khẩn
                      </div>
                    </div>
                  </button>

                  {/* 3. Tài Khoản Quản Ngục Google */}
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange('profile');
                      if (!googleUser) {
                        onOpenAuthModal?.();
                      }
                      setIsMoreOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer mt-1 border-t border-slate-100 dark:border-slate-800 ${
                      activeTab === 'profile'
                        ? 'bg-rose-500 text-white font-bold shadow-xs'
                        : darkMode
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-rose-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs flex items-center gap-1.5">
                        <span>Tài Khoản Quản Ngục</span>
                        {googleUser && <span className="text-[9px] text-emerald-500 font-bold">✓ Đã kích hoạt</span>}
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        {googleUser ? googleUser.email : 'Đăng nhập Google • Hồ sơ & Đặc quyền'}
                      </div>
                    </div>
                  </button>

                  {/* 4. Cổng Quản Trị Viên (Admin Portal) */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAdmin();
                      setIsMoreOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer mt-1 border-t border-slate-100 dark:border-slate-800 ${
                      isAdminLoggedIn
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                        : darkMode
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-rose-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isAdminLoggedIn
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-pink-500'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs flex items-center gap-1.5">
                        <span>Cổng Quản Trị Viên</span>
                        {isAdminLoggedIn && (
                          <span className="text-[9px] text-emerald-500 font-bold">✓ Đã đăng nhập</span>
                        )}
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        {isAdminLoggedIn ? 'Bảng quản lý nhân vật & nội dung' : 'Đăng nhập bảo mật hệ thống'}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-pink-100/50 dark:border-slate-800">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-sm'
                    : darkMode
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-pink-100/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="text-[10px] opacity-80">({tab.badge})</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
