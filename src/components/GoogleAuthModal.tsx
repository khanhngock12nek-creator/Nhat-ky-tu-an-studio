import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  MessageCircleHeart,
  HeartPulse,
  Scale,
  Gift,
  CheckCircle2,
  LogOut,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleUser } from '../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: GoogleUser | null;
  onLogin: (user: GoogleUser) => void;
  onLogout: () => void;
  darkMode: boolean;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  darkMode,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('khanhlynhnek12@gmail.com');
  const [customName, setCustomName] = useState('Quản Ngục Trưởng Velvet');

  if (!isOpen) return null;

  const handleGoogleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newUser: GoogleUser = {
        id: `google-user-${Date.now()}`,
        name: customName.trim() || 'Quản Ngục Trưởng Velvet',
        email: customEmail.trim() || 'khanhlynhnek12@gmail.com',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        wardNumber: 'Ward No. 07',
        privilegeLevel: 'Quyền Lực Tối Thượng',
        joinedAt: Date.now(),
      };

      onLogin(newUser);
      setIsProcessing(false);

      try {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#f43f5e'],
        });
      } catch {
        // ignore
      }

      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in overflow-y-auto">
      {/* Modal Dialog Box */}
      <div
        className={`w-full max-w-lg rounded-[28px] p-5 sm:p-7 shadow-2xl border transition-all text-center relative overflow-hidden my-auto ${
          darkMode
            ? 'bg-slate-900 border-rose-950/80 text-slate-100 shadow-rose-950/50'
            : 'bg-white border-pink-100 text-slate-800 shadow-pink-200/50'
        } border-t-4 border-t-pink-400 dark:border-t-rose-500`}
      >
        {/* Soft Background Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {currentUser ? (
          /* ======================================================== */
          /* ALREADY LOGGED IN VIEW                                  */
          /* ======================================================== */
          <div className="space-y-4 py-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" />
              <span>ĐÃ ĐĂNG NHẬP GOOGLE • ĐẶC QUYỀN KÍCH HOẠT</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-400 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-xs">
                  {/* Google Mini G */}
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {currentUser.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                    {currentUser.wardNumber}
                  </span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-900">
                    {currentUser.privilegeLevel}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed pt-1">
              Toàn bộ tiến trình trò chuyện, thư từ mật, bệnh án thần kinh và phán quyết đang được đồng bộ và lưu trữ bảo mật vĩnh viễn.
            </p>

            <div className="pt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                Tiếp Tục Quản Lý Trại Giam
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-full font-bold text-xs border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất</span>
              </button>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* DEFAULT MODAL VIEW MATCHING USER SCREENSHOT              */
          /* ======================================================== */
          <>
            {/* 1. TOP HEADER PILL TAG */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-rose-950/60 border border-pink-200/80 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider mb-2.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-rose-500" />
              <span>QUYỀN LỰC TỐI THƯỢNG • WARD NO. 07</span>
            </div>

            {/* 2. MAIN TITLE */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif tracking-tight leading-snug mb-1.5">
              Đăng Nhập Google Để Mở Khóa<br className="hidden sm:inline" /> Trọn Vẹn Đặc Quyền Quản Ngục
            </h2>

            {/* 3. SUBTITLE */}
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-sm sm:max-w-md mx-auto leading-relaxed mb-4">
              Lưu giữ vĩnh viễn tiến trình tương tác, thư từ, bệnh án mật và phán quyết cùng các chồng nhỏ.
            </p>

            {/* 4. GOOGLE LOGIN BUTTON */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={isProcessing}
                className="mx-auto flex items-center justify-center gap-2.5 py-2.5 sm:py-3 px-6 sm:px-7 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer group"
              >
                {/* Official 4-color Google G Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isProcessing ? 'Đang kết nối Google...' : 'Tiếp Tục Với Google'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Optional custom profile edit toggle */}
              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="text-[10px] text-slate-400 hover:text-rose-500 cursor-pointer underline transition-colors"
                >
                  {showCustomInput ? 'Ẩn tùy chỉnh tài khoản Google' : '⚙️ Tùy chỉnh Email & Tên Quản Ngục'}
                </button>
              </div>

              {showCustomInput && (
                <div className="mt-2 p-2.5 rounded-xl border border-pink-200 dark:border-slate-700 bg-pink-50/50 dark:bg-slate-800/60 text-left space-y-1.5 animate-fadeIn text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Email Google:</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Tên hiển thị Quản Ngục:</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. PRIVILEGES SECTION HEADER */}
            <div className="flex items-center gap-1.5 text-left mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-300">
                5 ĐẶC QUYỀN QUẢN NGỤC ĐỘC QUYỀN ĐƯỢC KÍCH HOẠT
              </span>
            </div>

            {/* 6. 5 PRIVILEGE CARDS (Exact match to uploaded design) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left mb-4">
              {/* Card 1: Gửi Thư Góp Ý & Đánh Giá Web */}
              <div
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                  darkMode
                    ? 'bg-slate-800/60 border-slate-700/80'
                    : 'bg-rose-50/40 border-rose-100/80 shadow-2xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-rose-950/80 text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-sm">💌</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Gửi Thư Góp Ý & Đánh Giá Web
                  </h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Gửi tâm thư kín, đóng dấu sáp bí mật
                  </p>
                </div>
              </div>

              {/* Card 2: Trò Chuyện Riêng Tư 1:1 */}
              <div
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                  darkMode
                    ? 'bg-slate-800/60 border-slate-700/80'
                    : 'bg-indigo-50/40 border-indigo-100/80 shadow-2xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-sm">💭</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Trò Chuyện Riêng Tư 1:1
                  </h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Thì thầm nửa đêm, gửi quà thăm nuôi cho phạm nhân
                  </p>
                </div>
              </div>

              {/* Card 3: Phòng Khám Tâm Lý & Y Án Mật */}
              <div
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                  darkMode
                    ? 'bg-slate-800/60 border-slate-700/80'
                    : 'bg-sky-50/40 border-sky-100/80 shadow-2xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-sm">🩺</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Phòng Khám Tâm Lý & Y Án Mật
                  </h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Bắt mạch cuồng si, bản đồ thương tích, kê đơn tình dược
                  </p>
                </div>
              </div>

              {/* Card 4: Phiên Tòa Nửa Đêm */}
              <div
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                  darkMode
                    ? 'bg-slate-800/60 border-slate-700/80'
                    : 'bg-amber-50/40 border-amber-100/80 shadow-2xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-sm">⚖️</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Phiên Tòa Nửa Đêm
                  </h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Thẩm vấn, cân đo cuồng ái, tuyên án giam cầm hoặc đặc xá
                  </p>
                </div>
              </div>

              {/* Card 5 (Full Width): Quay Gacha Tù Nhân */}
              <div
                className={`sm:col-span-2 p-2.5 sm:p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                  darkMode
                    ? 'bg-slate-800/60 border-slate-700/80'
                    : 'bg-purple-50/40 border-purple-100/80 shadow-2xs'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="text-sm">🎴</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100">
                    Quay Gacha Tù Nhân
                  </h4>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Rút duyên phận, sưu tầm thẻ bài SSR và giọng nói mật độc bản của các chàng tù nhân
                  </p>
                </div>
              </div>
            </div>

            {/* 7. FOOTER */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[10.5px]">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Bảo mật an toàn tuyệt đối theo chuẩn Google Auth</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 font-medium cursor-pointer transition-colors"
              >
                Để sau, tiếp tục tham quan với tư cách Khách
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
