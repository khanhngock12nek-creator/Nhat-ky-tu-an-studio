import React, { useState } from 'react';
import {
  Users,
  Trophy,
  Sparkles,
  Mail,
  Heart,
  ArrowRight,
  BookOpen,
  Shield,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character, Letter, ActiveTab } from '../types';

interface HomeViewProps {
  characters: Character[];
  letters: Letter[];
  favorites: string[];
  bannerBg: string;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenDetail: (character: Character) => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenAdmin: () => void;
  onSendLove?: (characterId: string, senderName: string, message: string) => void;
  onAddLetter?: (letter: Letter) => void;
  onOpenAuthModal?: () => void;
  hideFooter?: boolean;
  darkMode: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  characters,
  letters,
  onOpenDetail,
  onNavigate,
  onOpenAdmin,
  onAddLetter,
  onOpenAuthModal,
  hideFooter = false,
  darkMode,
}) => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [heartCount, setHeartCount] = useState<number>(() => {
    const saved = localStorage.getItem('nhat_ky_tu_an_heart_count');
    return saved ? parseInt(saved, 10) : 9420;
  });
  const [quickMessage, setQuickMessage] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleHeartClick = () => {
    const updated = heartCount + 1;
    setHeartCount(updated);
    localStorage.setItem('nhat_ky_tu_an_heart_count', updated.toString());

    try {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fb7185'],
      });
    } catch {
      // ignore
    }
  };

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;

    if (onAddLetter) {
      const newLetter: Letter = {
        id: `letter-quick-${Date.now()}`,
        senderName: 'Quản Ngục Ngọt Ngào',
        senderId: 'QN',
        category: 'love',
        categoryTitle: 'Thư Thăm Nuôi Mật',
        title: 'Lời nhắn gửi khe cửa buồng giam',
        content: quickMessage.trim(),
        rating: 5,
        stamp: '💌',
        stampName: 'Thư Tay Hoa Hồng',
        themeColor: 'pink',
        createdAt: Date.now(),
        likes: 1,
      };
      onAddLetter(newLetter);
    }

    setQuickMessage('');
    setSendSuccess(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#ec4899', '#a855f7'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setSendSuccess(false), 3500);
  };

  // 4 shortcut cards (Removed "Cổng Quản Trị" as explicitly requested)
  const quickShortcuts = [
    {
      num: '01',
      sub: 'Danh Sách Buồng',
      title: 'Thẻ Nhân Vật',
      desc: 'Danh sách buồng giam, trích lục hồ sơ chi tiết các phạm nhân...',
      footer: `${characters.length} Buồng giam`,
      icon: Users,
      color: 'bg-rose-500',
      action: () => onNavigate('cards'),
    },
    {
      num: '02',
      sub: 'Đua Top Thả Tim',
      title: 'Bảng Xếp Hạng',
      desc: 'Top phạm nhân được sủng ái nhất tuần, mức độ si tình & thả tim...',
      footer: characters.length > 0 ? `Top 1: ${characters[0].name}` : 'Xem xếp hạng',
      icon: Trophy,
      color: 'bg-sky-500',
      action: () => onNavigate('ranking'),
    },
    {
      num: '03',
      sub: 'Nhân Duyên Định Đoạt',
      title: 'Quay Gacha Án Tù',
      desc: 'Vòng quay triệu hồi phạm nhân định mệnh ngẫu nhiên, mở khóa ngoại truyện...',
      footer: 'Tặng 1 lượt/ngày',
      icon: Sparkles,
      color: 'bg-indigo-500',
      action: () => onNavigate('gacha'),
    },
    {
      num: '04',
      sub: 'Hòm Thư Thăm Nuôi',
      title: 'Nơi Gửi Thư',
      desc: 'Gửi lời nhắn thì thầm vào khe cửa, tiếp tế đồ ngọt & nhận hồi âm...',
      footer: 'Thư hồi âm sẵn',
      icon: Mail,
      color: 'bg-pink-500',
      action: () => onNavigate('letters'),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 font-sans">
      {/* 1. TOP ANNOUNCEMENT TICKER BANNER */}
      {showAnnouncement && (
        <div className="rounded-2xl px-3.5 py-2 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 dark:from-pink-950/70 dark:via-rose-950/70 dark:to-pink-950/70 border border-pink-200 dark:border-pink-900/60 flex items-center justify-between gap-2.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-xs shrink-0">🌸</span>
            <span className="truncate">
              <strong>Hồ Sơ Mới:</strong> Cánh Cổng Trại Giam vừa mở ra chào đón Quản Ngục ghé thăm Khu Giam Hoa Hồng!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAnnouncement(false)}
            className="p-1 rounded-lg hover:bg-pink-200/60 dark:hover:bg-pink-900/60 text-rose-500 cursor-pointer shrink-0 transition-colors"
            title="Đóng thông báo"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 2. PRISON SIGNAL SUB-BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 px-1 text-[10px] sm:text-[11px]">
        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
          <span>🔴 TÍN HIỆU BUỒNG GIAM:</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Xung nhịp rung động 135 BPM khi nghe tiếng bước chân nàng...
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onOpenAuthModal && (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-pink-100/70 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 hover:bg-pink-200/70 dark:hover:bg-rose-900/70 transition-colors border border-pink-200/80 dark:border-rose-900 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-2.5 h-2.5 text-rose-500" />
              <span>5 Đặc Quyền Quản Ngục Google</span>
              <span>➔</span>
            </button>
          )}
          <div className="hidden md:flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
            <span>🗝️ Chìa Khóa Vàng:</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Cấm Quyền Tuyệt Đối</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN GATE CARD (Khu Biệt Giam Trái Tim Mộng Mơ) */}
      <div
        className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border shadow-lg relative overflow-hidden text-center transition-all ${
          darkMode
            ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-pink-950/20'
            : 'bg-white border-pink-100/80 text-slate-800 shadow-pink-100/50'
        }`}
      >
        {/* Soft Decorative Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-b from-pink-100/40 via-rose-50/20 to-transparent dark:from-pink-950/20 pointer-events-none rounded-full blur-2xl" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/80 text-rose-600 dark:text-rose-300 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs">
            <span>🌸 KHU BIỆT GIAM TRÁI TIM MỘNG MƠ · NƠI GIAO THƯƠNG LINH HỒN 🤍</span>
          </div>

          {/* Big Title & Subtitle */}
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-rose-950 dark:text-white tracking-tight leading-none font-serif">
              Nhật Ký Tù Án
            </h1>
            <p className="text-[10px] sm:text-[11px] font-black text-rose-700 dark:text-rose-300 tracking-wide flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>Nơi Lưu Giữ Các Phạm Nhân Nhỏ</span>
              <span>🔒</span>
            </p>
            <p className="text-[10px] sm:text-[11px] italic font-serif text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed pt-0.5">
              &ldquo;Khi tình yêu trở thành một bản án vô hạn, chiếc chìa khóa vạn năng chỉ thuộc về người duy nhất.&rdquo;
            </p>
          </div>

          {/* Lore Scroll Box */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-pink-50/40 dark:bg-slate-800/50 border border-pink-100 dark:border-slate-800 text-left space-y-1">
            <div className="flex items-center justify-between text-[9.5px] font-black text-rose-600 dark:text-rose-400">
              <span className="flex items-center gap-1 uppercase tracking-wider">
                <BookOpen className="w-3 h-3" />
                <span>CỐT TRUYỆN GIAM CẦM • PRISON LORE</span>
              </span>
              <span className="text-[8.5px] text-slate-400 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-slate-400" />
                <span>LỆNH TÌM KIẾM ÁI TÌNH</span>
              </span>
            </div>
            <p className="text-[10.5px] sm:text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 font-serif italic">
              Chào mừng Quản Ngục nhỏ đã đến với Khu Biệt Giam Tình Ái. Nơi đây không có song sắt lạnh lẽo hay tội đồ thế tục, chỉ có những linh hồn cuồng si cam tâm tình nguyện bị giam cầm trong ánh mắt của nàng. Mỗi buồng giam là một trái tim mang án chung thân, mỗi xiềng xích là một lời ước hẹn ngọt ngào không thể buông lơi. Chìa khóa vàng đang nằm trong tay nàng — nàng sẽ bước tới thăm nuôi hay để họ khắc khoải trong đêm muộn?
            </p>
          </div>

          {/* Action Center: Circular Button & Heart Pill */}
          <div className="pt-0.5 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5">
            {/* Big Round Button */}
            <button
              type="button"
              onClick={() => onNavigate('cards')}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-800 via-rose-700 to-indigo-950 text-white flex flex-col items-center justify-center shadow-md shadow-rose-900/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group border-2 border-rose-300/30"
              title="Bắt đầu vào buồng giam thăm nuôi"
            >
              <span className="text-[8.5px] sm:text-[9.5px] font-bold text-rose-200">Bắt Đầu</span>
              <span className="text-[10px] sm:text-[11px] font-black flex items-center gap-0.5 my-0.2 group-hover:scale-110 transition-transform">
                🤍 Thăm ➔
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] font-bold text-rose-200 leading-none">Nuôi Ngay</span>
            </button>

            {/* Heart Pill Button */}
            <button
              type="button"
              onClick={handleHeartClick}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-800/90 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700/80 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 text-[11px] sm:text-xs font-bold"
            >
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>Thả Tim Giữ Chân ({heartCount.toLocaleString('vi-VN')})</span>
            </button>
          </div>

          {/* 4 Stat Metric Cards (Updated: 0 Linh Hồn as requested) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
            {/* Card 1: 0 Linh Hồn */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50/50 dark:bg-slate-800/60 border border-rose-100 dark:border-slate-700/80 text-center space-y-0.5">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                PHẠM NHÂN CHỜ GẶP
              </span>
              <p className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400">
                {characters.length === 0 ? '0 Linh Hồn' : `${characters.length} Linh Hồn`}
              </p>
              <p className="text-[8.5px] text-slate-400">
                {characters.length === 0 ? 'Toàn bộ đã cung khai' : 'Đang ngóng đợi nàng'}
              </p>
            </div>

            {/* Card 2: 100% Tuyệt Đối */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-pink-50/50 dark:bg-slate-800/60 border border-pink-100 dark:border-slate-700/80 text-center space-y-0.5">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                ĐỘ SI MÊ TOÀN VIỆN
              </span>
              <p className="text-sm sm:text-base font-black text-pink-600 dark:text-pink-400">
                100% Tuyệt Đối
              </p>
              <p className="text-[8.5px] text-slate-400">Chỉ hướng về nàng</p>
            </div>

            {/* Card 3: Ngoan Ngoãn */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700/80 text-center space-y-0.5">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                TRẠNG THÁI AN NINH
              </span>
              <p className="text-sm sm:text-base font-black text-purple-600 dark:text-purple-400">
                • Ngoan Ngoãn
              </p>
              <p className="text-[8.5px] text-slate-400">Quản Ngục kiểm soát</p>
            </div>

            {/* Card 4: Thư chứa hồi âm */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-sky-50/50 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/80 text-center space-y-0.5">
              <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                THƯ CHỨA HỒI ÂM
              </span>
              <p className="text-sm sm:text-base font-black text-sky-600 dark:text-sky-400">
                {letters.length < 10 ? `0${letters.length}` : letters.length} Phong Bì
              </p>
              <p className="text-[8.5px] text-slate-400">Nồng nàn hương hoa</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. KHU VỰC PHÂN LUỒNG & LỐI TẮT NHANH */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-rose-500 rounded-full inline-block" />
              <span>Khu Vực Phân Luồng & Lối Tắt Nhanh</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-3">
              CÁNH CỬA MỞ KHÓA TỪNG TẦNG BIỆT GIAM
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            👆 Chạm nhẹ để ghé thăm
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {quickShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                onClick={item.action}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex flex-col justify-between group ${
                  darkMode
                    ? 'bg-slate-900/80 border-slate-800 hover:border-pink-500/50 text-slate-100 shadow-sm'
                    : 'bg-white border-pink-100/90 hover:border-pink-300 text-slate-800 shadow-xs'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-black text-slate-400 group-hover:text-rose-500 transition-colors">
                      {item.num} • {item.sub}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-lg ${item.color} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[9.5px] sm:text-[10px] text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-rose-500">
                  <span>{item.footer}</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TIÊU ĐIỂM TUẦN NÀY - PHẠM NHÂN CHỜ ĐÓN QUẢN NGỤC GHÉ THĂM (Trống khi chưa có phạm nhân) */}
      <div className="space-y-2.5 pt-1.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[9.5px] font-black uppercase tracking-wider text-rose-500 block">
              ✨ TIÊU ĐIỂM TUẦN NÀY
            </span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Phạm Nhân Chờ Đón Quản Ngục Ghé Thăm
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('cards')}
            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả ({characters.length} buồng giam)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Empty State: TRỐNG as requested when characters.length === 0 */}
        {characters.length === 0 ? (
          <div
            className={`py-8 sm:py-10 px-4 text-center rounded-2xl sm:rounded-3xl border border-dashed transition-all ${
              darkMode
                ? 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                : 'bg-rose-50/30 border-rose-200/80 text-slate-700'
            }`}
          >
            <div className="w-11 h-11 mx-auto mb-2.5 rounded-2xl bg-rose-100/70 dark:bg-slate-800 flex items-center justify-center text-xl shadow-xs">
              🗝️
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mb-0.5">
              Hiện Chưa Có Phạm Nhân Nào Chờ Đón Quản Ngục Ghé Thăm
            </h3>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
              Các buồng giam hiện đang hoàn toàn yên ắng và trống trải. Chưa có phạm nhân nào thụ án đang chờ đón Quản Ngục ghé thăm...
            </p>
          </div>
        ) : (
          /* Actual characters if created by admin */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {characters.slice(0, 3).map((char) => (
              <div
                key={char.id}
                onClick={() => onOpenDetail(char)}
                className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group ${
                  darkMode
                    ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                    : 'bg-white border-pink-100 text-slate-800'
                }`}
              >
                {/* Header Tag */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    <span>Buồng {char.prisonId} · {char.zone || 'Khu Giam Hoa Hồng'}</span>
                  </span>
                </div>

                {/* Avatar with crime badge */}
                <div className="h-64 sm:h-72 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                  {char.avatarUrl ? (
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        char.avatarGradient || 'from-rose-400 to-indigo-500'
                      } flex items-center justify-center text-4xl text-white font-black`}
                    >
                      {char.name.charAt(0)}
                    </div>
                  )}

                  {/* Crime Overlay Tag */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    <p className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">
                      BẢN ÁN: VÔ TẬN TƯƠNG TƯ
                    </p>
                    <h4 className="text-sm font-black truncate">{char.name}</h4>
                  </div>
                </div>

                {/* Body Meta */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        Si Tình 100%
                      </span>
                      {char.genres?.[0] && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Hệ {char.genres[0]}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-serif italic line-clamp-2">
                      "{char.firstMessage || char.backstory}"
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-2xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>🗝️ Thăm Buồng Giới Hạn</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. HÒM THƯ THĂM NUÔI MẬT (Quick message send) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-pink-50/90 via-rose-50/70 to-purple-50/80 dark:from-slate-900 dark:via-slate-900/80 dark:to-rose-950/30 border border-pink-200/80 dark:border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-pink-300/40">
            <Mail className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">
              HÒM THƯ THĂM NUÔI MẬT
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              Nàng Có Muốn Để Lại Lời Nhắn Nhủ?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
              Một lá thư tay tẩm hương hoa hồng sẽ xoa dịu nỗi khắc khoải của những tù nhân trong đêm tĩnh lặng. Họ sẽ lập tức hồi âm vào sáng mai!
            </p>
          </div>
        </div>

        <form
          onSubmit={handleQuickSend}
          className="w-full lg:w-auto flex-1 max-w-md flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Viết vài dòng nhắn gửi ngọt ngào..."
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:border-rose-400 outline-none shadow-xs text-slate-800 dark:text-slate-200"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-rose-900 hover:bg-rose-800 shadow-md shadow-rose-950/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Gửi Đi</span>
            <span>➢</span>
          </button>
        </form>
      </div>

      {sendSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center">
          💌 Đã gửi lời nhắn nhủ ngọt ngào vào hòm thư trại giam thành công!
        </div>
      )}

      {/* 7. FOOTER BAR */}
      {!hideFooter && (
        <footer className="pt-6 pb-4 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">Nhật Ký Tù Án</span>
            <span>·</span>
            <span>Cánh cổng giam giữ những rung động ngọt ngào nhất</span>
          </div>
          <p className="text-[11px] text-center sm:text-right">
            © 2024 Nhật Ký Tù Án. Bản quyền giam cầm thuộc về tình yêu thuần khiết.
          </p>
        </footer>
      )}
    </div>
  );
};
