import React, { useState } from 'react';
import {
  Gamepad2,
  Lock,
  AlertCircle,
  Sparkles,
  Users,
  ArrowLeft,
  Dices,
  Swords,
  HeartCrack,
  Clock,
  ShieldAlert,
  Flame,
  Briefcase,
  Activity,
  Gift,
  HelpCircle,
  Play,
} from 'lucide-react';
import { ActiveTab, Character } from '../types';
import { CaroGame } from './games/CaroGame';
import { TarotGame } from './games/TarotGame';
import { WheelGame } from './games/WheelGame';
import { TruthGame } from './games/TruthGame';
import { SuitcaseGame } from './games/SuitcaseGame';
import { ClawMachineGame } from './games/ClawMachineGame';

interface MinigameViewProps {
  characters?: Character[];
  darkMode: boolean;
  onTabChange?: (tab: ActiveTab) => void;
  onOpenAdmin?: () => void;
}

export type SelectedGameId = 'caro' | 'tarot' | 'wheel' | 'truth' | 'suitcase' | 'claw' | null;

interface GameModeItem {
  id: 'caro' | 'tarot' | 'wheel' | 'truth' | 'suitcase' | 'claw';
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  description: string;
  emoji: string;
}

const GAME_MODES: GameModeItem[] = [
  {
    id: 'caro',
    title: 'Cờ Caro Như Mẫu',
    subtitle: 'Đấu trí 5 nước thắng trên bàn cờ ngục tối',
    tag: 'Đấu Trí • 1v1',
    color: 'from-amber-500 to-rose-600',
    description: 'Bàn cờ caro 12x12 kinh điển, chuẩn luật 5 quân thẳng hàng. Chơi luyện tập một mình hoặc đấu bot tạm thời.',
    emoji: '#',
  },
  {
    id: 'tarot',
    title: 'Bói Bài Tarot',
    subtitle: '22 lá Major Arcana tiên tri vận mệnh ngục tối',
    tag: 'Huyền Bí • Tiên Tri',
    color: 'from-purple-600 to-indigo-600',
    description: 'Rút bài 1 lá hoặc trải bài 3 lá Quá khứ - Hiện tại - Tương lai để giải mã vận mệnh và tâm lý bí ẩn.',
    emoji: '🔮',
  },
  {
    id: 'wheel',
    title: 'Vòng Quay Thử Thách',
    subtitle: 'Bánh xe số phận Truth or Dare buồng giam',
    tag: 'May Rủi • Tương Tác',
    color: 'from-pink-500 to-rose-600',
    description: 'Quay vòng quay để nhận các mệnh lệnh thử thách độc đáo, hát tình ca, chống đẩy hoặc thú nhận bí mật thầm kín.',
    emoji: '🎡',
  },
  {
    id: 'truth',
    title: 'Nói Thật (Máy Phát Hiện Nói Dối)',
    subtitle: 'Polygraph đo sóng điện não & nhịp tim thẩm vấn',
    tag: 'Tâm Lý • Thẩm Vấn',
    color: 'from-cyan-500 to-blue-600',
    description: 'Thử nghiệm máy quét đa nghiệm để kiểm tra sự thật, phát hiện nhịp tim tăng vọt và vạch trần lời nói dối.',
    emoji: '📊',
  },
  {
    id: 'suitcase',
    title: 'Vụ Án Vali (Deal or No Deal)',
    subtitle: '16 vali bí ẩn & đàm phán với Công Tố Viên',
    tag: 'Hồi Hộp • Đấu Trí',
    color: 'from-amber-500 to-yellow-600',
    description: 'Chọn 1 chiếc vali may mắn, mở loại trừ 15 vali còn lại và trả lời cuộc gọi mua lại vali từ Công Tố Viên.',
    emoji: '💼',
  },
  {
    id: 'claw',
    title: 'Máy Gắp (Claw Machine Arcade)',
    subtitle: 'Gắp thú bông & bảo vật định ước hoàng gia',
    tag: 'Kỹ Năng • Bộ Sưu Tập',
    color: 'from-pink-500 to-amber-500',
    description: 'Điều khiển cần gạt Joystick, căn chỉnh tọa độ và thả càng gắp các kỷ vật hiếm để lưu vào Tủ Quà.',
    emoji: '🕹️',
  },
];

export const MinigameView: React.FC<MinigameViewProps> = ({
  characters = [],
  darkMode,
  onTabChange,
}) => {
  const [selectedGame, setSelectedGame] = useState<SelectedGameId>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // If a game is active, render that game component
  if (selectedGame === 'caro') {
    return <CaroGame darkMode={darkMode} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'tarot') {
    return <TarotGame darkMode={darkMode} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'wheel') {
    return <WheelGame darkMode={darkMode} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'truth') {
    return <TruthGame darkMode={darkMode} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'suitcase') {
    return <SuitcaseGame darkMode={darkMode} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === 'claw') {
    return <ClawMachineGame darkMode={darkMode} onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onTabChange?.('cards')}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 text-xs font-bold ${
              darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-rose-100 text-slate-700 hover:bg-rose-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-rose-500" />
            <span>Thẻ Nhân Vật</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Ward No.07</span>
            <span>/</span>
            <span className="text-rose-500 font-bold">Khu Vực Trò Chơi</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Trạng thái: Chưa có nhân vật tham gia
          </span>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xl ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-gradient-to-br from-rose-50/80 via-white to-pink-50/80 border-rose-100'
        }`}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 p-0.5 shadow-xl shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
              <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400 animate-pulse" />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Sàn Đấu Giải Trí Tù Nhân • 6 Trò Chơi
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Khu Cách Ly Số 07
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              KHU VỰC TRÒ CHƠI & ĐẤU TRÍ
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Tập hợp đầy đủ 6 minigame: <strong>Cờ Caro</strong>, <strong>Bói Bài Tarot</strong>, <strong>Vòng Quay Thử Thách</strong>, <strong>Nói Thật</strong>, <strong>Vụ Án Vali</strong> và <strong>Máy Gắp Thú</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Empty Character Notice (CHƯA CÓ NHÂN VẬT NÀO ĐỂ CHƠI) */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border text-center shadow-lg relative overflow-hidden ${
          darkMode
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-white border-amber-200'
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/70 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md text-xs font-bold">
              0
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              THÔNG BÁO TỪ BAN QUẢN NGỤC
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              CHƯA CÓ NHÂN VẬT NÀO ĐỂ CHƠI
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Hiện tại sàn đấu chưa có nhân vật tù nhân nào được chỉ định để thách đấu trực tiếp. Tuy nhiên, bạn hoàn toàn có thể nhấn vào từng trò chơi bên dưới để <strong>trải nghiệm ở chế độ Thử Nghiệm / Đấu với Bot Tạm Thời / Luyện Tập Đơn</strong>!
            </p>
          </div>

          {/* Quick Counter */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 text-center">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Nhân Vật Sẵn Sàng</div>
              <div className="text-base font-black text-rose-500">0 / 0</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Minigame Tích Hợp</div>
              <div className="text-base font-black text-indigo-500">6 Trò Chơi</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Chế Độ Chơi</div>
              <div className="text-base font-black text-amber-500">Thử Nghiệm Sẵn Sàng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 6 Games */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Danh Sách 6 Trò Chơi</span>
            </h3>
            <p className="text-xs text-slate-400">
              Bấm vào trò chơi để mở giao diện và trải nghiệm ngay
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            6/6 Chế độ sẵn sàng
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAME_MODES.map((mode) => {
            return (
              <div
                key={mode.id}
                onClick={() => setSelectedGame(mode.id)}
                className={`p-5 rounded-3xl border transition-all relative overflow-hidden group cursor-pointer hover:scale-102 hover:shadow-xl ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mode.color} text-white flex items-center justify-center shrink-0 shadow-md text-2xl font-black`}
                  >
                    {mode.emoji}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {mode.title}
                      </h4>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                        {mode.tag}
                      </span>
                    </div>

                    <div className="text-xs text-rose-500 font-semibold truncate">
                      {mode.subtitle}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 pt-1 leading-relaxed">
                      {mode.description}
                    </p>

                    <div className="pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        <Lock className="w-3 h-3" />
                        <span>Chưa có NV (Chơi Thử)</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGame(mode.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-black shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-pink-700 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Chơi Thử</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
