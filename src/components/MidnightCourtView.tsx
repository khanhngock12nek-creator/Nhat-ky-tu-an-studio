import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Scale,
  Sparkles,
  Clock,
  Shield,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Download,
  Users,
  Star,
  Check,
  Flame,
  Stamp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import lucCanhTieuImg from '../assets/images/luc_canh_tieu_avatar_1791553296431.jpg';
import kaelenImg from '../assets/images/kaelen_valerius_avatar_1791553317474.jpg';
import renImg from '../assets/images/ren_amamiya_avatar_1791553338831.jpg';
import { Character, ActiveTab } from '../types';

interface MidnightCourtViewProps {
  characters: Character[];
  darkMode: boolean;
  onOpenAdmin: () => void;
  onTabChange?: (tab: ActiveTab) => void;
}

interface VerdictOption {
  id: string;
  title: string;
  desc: string;
  effect: string;
}

const DEFENDANTS = [
  {
    id: '07',
    code: '#07 Lục Cảnh Tiêu',
    shortName: '#07 Tiêu',
    alias: 'Bướm Đêm',
    status: 'Hiện tại',
    heartbeat: '138 bpm',
    resistance: '0.0%',
    image: lucCanhTieuImg,
    mentalStatus:
      'Cúi đầu tuyệt đối phục tùng, ánh mắt đong đầy si mê không giấu giếm nhìn thẳng lên bục Thẩm phán tôn kính.',
    confession:
      '“Thưa Thẩm phán tối cao... nếu yêu người là một trọng tội không thể dung thứ, tôi xin nhận trọn bản án chung thân không bao giờ xin ân xá, vĩnh viễn giam mình trong vòng tay người.”',
    confessionTime: 'Khai tại vành móng 00:05',
    counts: [
      {
        roman: 'I',
        title: 'Tội Danh Thứ Nhất',
        quote: '“Cướp đoạt toàn bộ thời gian và tâm trí của Quản Ngục suốt 24/7 không ngừng nghỉ.”',
        impact: 'Quản ngục mất tập trung khi tuần tra',
        severity: 'Cực Kỳ Nguy Hại',
        severityColor: 'text-rose-500',
      },
      {
        roman: 'II',
        title: 'Tội Danh Thứ Hai',
        quote: '“Cố ý quyến rũ qua vách kính buồng giam và thì thầm những lời dụ dỗ vào canh ba.”',
        impact: 'Tang chứng: Mẩu giấy thơm kẹp kẽ khóa',
        severity: 'Mức Độ Nghiêm Trọng',
        severityColor: 'text-purple-500',
      },
      {
        roman: 'III',
        title: 'Tội Danh Thứ Ba',
        quote: '“Mưu toan cướp chìa khóa phòng giam để đảo ngược vị trí quản thúc đối với Thẩm phán.”',
        impact: 'Ý đồ: Yandere chiếm đoạt vĩnh viễn',
        severity: 'Tối Mật Cảnh Báo',
        severityColor: 'text-rose-600 font-black',
      },
    ],
  },
  {
    id: '03',
    code: '#03 Tạ Lân',
    shortName: '#03 Tạ Lân',
    alias: 'Băng Đế Thủy Tinh',
    status: 'Chờ lệnh',
    heartbeat: '54 bpm',
    resistance: '1.2%',
    image: kaelenImg,
    mentalStatus:
      'Lạnh lùng kiêu hãnh nhưng khi chạm ánh mắt Thẩm phán liền rủ mi, ngón tay khẽ run run kiềm chế si tình.',
    confession:
      '“Băng giá ngàn năm của tôi chỉ có thể bị nung chảy bởi hơi thở của Thẩm phán. Xin hãy kết án giam tôi bên cạnh người.”',
    confessionTime: 'Khai tại vành móng 00:12',
    counts: [
      {
        roman: 'I',
        title: 'Tội Danh Thứ Nhất',
        quote: '“Dùng ánh mắt băng lãnh mê hoặc người gác cổng để tự ý tiếp cận buồng thẩm vấn.”',
        impact: 'Gây tê liệt ý chí của lính gác',
        severity: 'Cực Kỳ Nguy Hại',
        severityColor: 'text-rose-500',
      },
      {
        roman: 'II',
        title: 'Tội Danh Thứ Hai',
        quote: '“Lén giấu dải ruy băng nhung của Quản Ngục vào trong gối ngủ suốt 30 ngày.”',
        impact: 'Chiếm đoạt tư trang trái phép',
        severity: 'Mức Độ Nghiêm Trọng',
        severityColor: 'text-purple-500',
      },
      {
        roman: 'III',
        title: 'Tội Danh Thứ Ba',
        quote: '“Đòi hỏi Thẩm phán phải tự tay đeo còng tay mỗi đêm mới chịu ngoan ngoãn ngủ.”',
        impact: 'Lũng đoạn quyền lực tư pháp',
        severity: 'Tối Mật Cảnh Báo',
        severityColor: 'text-rose-600 font-black',
      },
    ],
  },
  {
    id: '11',
    code: '#11 Ngôn Dục',
    shortName: '#11 Ngôn Dục',
    alias: 'Bá Đạo Hắc Miêu',
    status: 'Chờ lệnh',
    heartbeat: '142 bpm',
    resistance: '0.5%',
    image: renImg,
    mentalStatus:
      'Cuồng nhiệt hung bạo với cả thế giới, nhưng chỉ cần Thẩm phán bước vào liền ngoan ngoãn quỳ rạp dưới chân bục.',
    confession:
      '“Xiềng xích của người là món trang sức lộng lẫy nhất tôi từng mang. Đừng bao giờ tháo nó ra khỏi cổ tôi...”',
    confessionTime: 'Khai tại vành móng 00:18',
    counts: [
      {
        roman: 'I',
        title: 'Tội Danh Thứ Nhất',
        quote: '“Gầm gừ đe dọa bất kỳ phạm nhân nào dám liếc nhìn bóng lưng của Quản Ngục.”',
        impact: 'Gây náo loạn an ninh ngục thất',
        severity: 'Cực Kỳ Nguy Hại',
        severityColor: 'text-rose-500',
      },
      {
        roman: 'II',
        title: 'Tội Danh Thứ Hai',
        quote: '“Cắn rách găng tay thẩm vấn của Quản Ngục để lưu lại dấu vết sở hữu.”',
        impact: 'Hành vi cuồng si vượt tầm kiểm soát',
        severity: 'Mức Độ Nghiêm Trọng',
        severityColor: 'text-purple-500',
      },
      {
        roman: 'III',
        title: 'Tội Danh Thứ Ba',
        quote: '“Công khai tuyên bố phòng giam này là cung điện tân hôn giữa hắn và Thẩm phán.”',
        impact: 'Ảo tưởng si tình cấp độ tối cao',
        severity: 'Tối Mật Cảnh Báo',
        severityColor: 'text-rose-600 font-black',
      },
    ],
  },
];

const VERDICTS: VerdictOption[] = [
  {
    id: '1',
    title: 'Gia Hạn Biệt Giam 100 Đêm Muộn',
    desc: 'Phạm nhân thỏa mãn mỉm cười vì không bị trục xuất khỏi ngục thất của Thẩm phán.',
    effect: 'Tăng 25 điểm Giam Cầm Ái Mộ',
  },
  {
    id: '2',
    title: 'Khóa Xiềng Xích Chuông Bạc',
    desc: 'Mỗi bước chân cử động đều rung lên tiếng ngân vang nhắc nhở sự hiện diện của chàng.',
    effect: 'Mở khóa âm thanh đặc biệt phòng giam',
  },
  {
    id: '3',
    title: 'Đặc Xá 1 Giờ Dạo Vườn Hoa Hồng',
    desc: 'Cùng Thẩm phán tản bộ dưới ánh trăng rằm đẫm sương đêm trong sự giám sát cận kề.',
    effect: 'Kích hoạt CG Lãng Mạn Đêm Trăng',
  },
  {
    id: '4',
    title: 'Trừng Phạt: Tước Quyền Thăm Nuôi 3 Ngày',
    desc: 'Phạm nhân hoảng sợ van nài, hứa sẽ tuyệt đối ngoan ngoãn chỉ để được gặp người.',
    effect: 'Kích hoạt giọng nói độc quyền van xin',
  },
];

export const MidnightCourtView: React.FC<MidnightCourtViewProps> = ({
  characters,
  darkMode,
  onOpenAdmin,
  onTabChange,
}) => {
  const [selectedDefendantId, setSelectedDefendantId] = useState('07');
  const [selectedVerdict, setSelectedVerdict] = useState('1');
  const [obsessionRatio, setObsessionRatio] = useState(88); // 88% Cuồng Si vs 12% Ăn Năn
  const [isGavelStriking, setIsGavelStriking] = useState(false);
  const [isVerdictSealed, setIsVerdictSealed] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };
  const [verdictHistory, setVerdictHistory] = useState([
    {
      id: 'h1',
      title: 'Đeo lắc chuông mắt cá chân',
      time: 'Đêm qua 00:00 • Đã thi hành',
    },
    {
      id: 'h2',
      title: 'Cấm đọc thư tay 24 giờ',
      time: '3 đêm trước • Hoàn tất',
    },
  ]);

  // Live timer countdown simulation: 00:23:55
  const [secondsRemaining, setSecondsRemaining] = useState(1435);
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Strike gavel action
  const handleStrikeGavel = () => {
    setIsGavelStriking(true);
    setIsVerdictSealed(true);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fb7185', '#f43f5e', '#ffd700'],
      });
    } catch {
      // ignore
    }

    const currentVerdictObj = VERDICTS.find((v) => v.id === selectedVerdict);
    if (currentVerdictObj) {
      setVerdictHistory((prev) => [
        {
          id: `h-${Date.now()}`,
          title: currentVerdictObj.title,
          time: 'Vừa tuyên án • Đang áp giải',
        },
        ...prev,
      ]);
    }

    setTimeout(() => {
      setIsGavelStriking(false);
    }, 1200);
  };

  // ===================================================================
  // TRẠNG THÁI TRỐNG: KHI CHƯA CÓ PHẠM NHÂN / TÙ NHÂN NÀO
  // ===================================================================
  if (characters.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-3 sm:space-y-4 animate-fade-in font-sans">
        {/* Section Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-[9px] font-black tracking-wide border border-rose-200/60 dark:border-rose-900/40">
            <Gavel className="w-2.5 h-2.5 text-rose-500 animate-pulse" />
            <span>PHIÊN TÒA TỐI CAO 00:00 • VÀNH MÓNG NGỰA TRỐNG</span>
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 bg-clip-text text-transparent font-serif">
            Phiên Tòa Nửa Đêm & Tuyên Án Bổ Sung
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Nơi quyền lực Thẩm phán quy phục những trái tim cuồng nhiệt. Mọi ánh mắt, hơi thở và lời khẩn cầu đều được cân đo bởi cán cân công lý đẫm hương hoa hồng nhung.
          </p>
        </div>

        {/* Empty State Hero Card */}
        <div
          className={`p-4 sm:p-6 text-center rounded-2xl sm:rounded-3xl border border-dashed relative overflow-hidden transition-all shadow-md ${
            darkMode
              ? 'bg-slate-900/80 border-rose-900/50 text-slate-100 shadow-rose-950/20'
              : 'bg-white/90 border-rose-200 text-slate-800 shadow-pink-100/40'
          }`}
        >
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-rose-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-400/10 blur-3xl pointer-events-none" />

          {/* Animated Gavel Icon */}
          <div className="relative mx-auto w-12 h-12 mb-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-indigo-600 blur-md opacity-40 animate-pulse" />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-rose-500/30">
              <Gavel className="w-6 h-6 animate-bounce-short" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold mb-1.5 bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 border border-pink-200/60 dark:border-slate-700">
            <Scale className="w-2.5 h-2.5" />
            <span>VÀNH MÓNG NGỰA CHƯA CÓ BỊ CÁO</span>
          </div>

          <h2 className="text-base sm:text-lg font-black mb-1 font-serif">
            Hiện Chưa Có Tù Nhân Nào Cần Triệu Tập Xét Xử Nửa Đêm
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-3.5 leading-relaxed">
            Vành móng ngựa dát vàng và bục thẩm phán hiện đang hoàn toàn yên tĩnh.
            Trại giam chưa có phạm nhân nào vi phạm kỷ luật si tình hay cần tuyên án bổ sung.
            Khi Quản Trị Viên khởi tạo phạm nhân mới, phiên tòa nửa đêm sẽ bắt đầu mở phiên xét xử!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs text-white bg-gradient-to-r from-rose-600 via-pink-500 to-indigo-600 hover:opacity-95 shadow-md shadow-rose-500/25 transition-all cursor-pointer hover:scale-101 active:scale-95"
            >
              <Shield className="w-3 h-3" />
              <span>Mở Bảng Quản Trị (Thêm Tù Nhân Mới)</span>
            </button>

            {onTabChange && (
              <button
                type="button"
                onClick={() => onTabChange('home')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-white border-pink-200 text-slate-700 hover:bg-pink-50 shadow-2xs'
                }`}
              >
                <span>Quay Về Cửa Nhà Giam</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="space-y-2">
          <h3 className="text-center text-[9px] font-extrabold tracking-wider text-slate-400 uppercase">
            ⚖️ Đặc Quyền Xét Xử Tại Phiên Tòa Nửa Đêm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-pink-100 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-1.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Bản Cáo Trạng Tình Ái
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Xét xử các tội danh: cướp đoạt thời gian 24/7, quyến rũ qua vách kính buồng giam và mưu toan đảo ngược vị trí quản thúc.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-pink-100 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-1.5">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Cán Cân Công Lý Tình Ái
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Đo lường mức độ tương tác giữa Cuồng Si Chiếm Hữu và Ăn Năn Phục Tùng với mô hình cân tiểu ly động.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-pink-100 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-1.5">
                <Gavel className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Bảng Phán Quyết Tối Cao
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Tuyên các bản án sủng ái: gia hạn biệt giam 100 đêm, khóa xiềng chuông bạc, đặc xá dạo vườn hoa hồng hoặc tước quyền thăm nuôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const defendant =
    DEFENDANTS.find((d) => d.id === selectedDefendantId) || DEFENDANTS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-3.5">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & METRICS                                  */}
      {/* ======================================================== */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all relative overflow-hidden shadow-sm ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800 text-slate-100'
            : 'bg-white/95 border-pink-100 text-slate-800 shadow-pink-100/30'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Title Area */}
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                <Gavel className="w-3 h-3" />
                PHIÊN TÒA TỐI CAO 00:00
              </span>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                • Phòng Xử Nguyệt Cung Hoàng Gia
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight font-serif text-slate-900 dark:text-white">
              Phiên Tòa Nửa Đêm & Tuyên Án Bổ Sung
            </h1>

            <div className="space-y-0.5">
              <span className="text-[11px] font-black text-rose-500 dark:text-rose-400 block tracking-wide">
                Mật Hiệu Án Tình #{defendant.id}/HC
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Nơi quyền lực Thẩm phán quy phục những trái tim cuồng nhiệt. Mọi ánh mắt, hơi thở và lời khẩn cầu đều được cân đo bởi cán cân công lý đẫm hương hoa hồng nhung.
              </p>
            </div>
          </div>

          {/* Right Metrics Box */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border text-center min-w-[130px] ${
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-50/50 border-rose-100'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                Thời Gian Phiên Xử
              </span>
              <span className="text-lg sm:text-xl font-mono font-black text-rose-600 dark:text-rose-400">
                {formatTimer(secondsRemaining)}
              </span>
            </div>

            <div
              className={`p-3.5 sm:p-4 rounded-2xl border text-center min-w-[130px] ${
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-50/50 border-rose-100'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                Quyền Uy Thẩm Phán
              </span>
              <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text text-transparent font-serif">
                Cấp S+
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THREE-COLUMN MAIN TRIAL LAYOUT                        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ====================================================== */}
        {/* COLUMN 1: VÀNH MÓNG NGỰA DÁT VÀNG (BỊ CÁO)             */}
        {/* ====================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className={`p-5 rounded-3xl border space-y-4 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-pink-100 shadow-pink-100/30'
            }`}
          >
            {/* Header Col 1 */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center font-bold text-xs">
                  ⚖️
                </span>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white font-serif">
                    Vành Móng Ngựa Dát Vàng
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {defendant.code} • Biệt Danh: {defendant.alias}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300">
                Đang Thẩm Vấn
              </span>
            </div>

            {/* Large Portrait Box */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-inner border border-rose-200/50 group">
              <img
                src={defendant.image}
                alt={defendant.code}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Overlay: Tình Trạng Tâm Thần Bị Cáo */}
              <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white space-y-1.5 shadow-xl">
                <span className="text-[10px] font-black uppercase text-pink-300 block tracking-wider flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                  Tình Trạng Tâm Thần Bị Cáo
                </span>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  {defendant.mentalStatus}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-pink-200/80 font-mono">
                  <span>Nhịp tim: {defendant.heartbeat}</span>
                  <span>Mức độ kháng cự: {defendant.resistance}</span>
                </div>
              </div>
            </div>

            {/* Lời Tự Thú Mở Màn */}
            <div
              className={`p-4 rounded-2xl border space-y-2 ${
                darkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-rose-50/60 border-rose-100'
              }`}
            >
              <div className="flex items-center gap-1.5 text-rose-500 font-black text-xs">
                <span>💬</span>
                <span>LỜI TỰ THÚ MỞ MÀN CỦA BỊ CÁO</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                {defendant.confession}
              </p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-bold">
                <span>{defendant.confessionTime}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
            </div>

            {/* Chọn Bị Cáo Khác Triệu Tập */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                CHỌN BỊ CÁO KHÁC TRIỆU TẬP
              </span>
              <div className="grid grid-cols-3 gap-2">
                {DEFENDANTS.map((d) => {
                  const isActive = d.id === selectedDefendantId;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDefendantId(d.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-400/30'
                          : darkMode
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                          : 'bg-white border-pink-100 text-slate-700 hover:bg-rose-50'
                      }`}
                    >
                      <span className="block font-black text-xs">{d.shortName}</span>
                      <span className="text-[9px] opacity-80">{d.status}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* COLUMN 2: BẢN CÁO TRẠNG TÌNH ÁI NỬA ĐÊM                */}
        {/* ====================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className={`p-5 rounded-3xl border space-y-4 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-pink-100 shadow-pink-100/30'
            }`}
          >
            {/* Header Col 2 */}
            <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                TÒA ÁN TRỌNG ÁN TÌNH CẢM
              </span>
              <h3 className="font-black text-base text-slate-900 dark:text-white font-serif">
                BẢN CÁO TRẠNG TÌNH ÁI NỬA ĐÊM
              </h3>
              <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-pink-100 dark:bg-slate-800 text-pink-600 dark:text-pink-300">
                HỒ SƠ SỐ: {defendant.id}/HC-VELVET
              </span>
            </div>

            {/* Counts of Indictment */}
            <div className="space-y-3">
              {defendant.counts.map((c, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border space-y-2 transition-all ${
                    darkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-white border-pink-100 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[11px] flex items-center justify-center">
                        {c.roman}
                      </span>
                      <h4 className="font-black text-xs text-slate-900 dark:text-white">
                        {c.title}
                      </h4>
                    </div>
                    {/* 5-star rating */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    {c.quote}
                  </p>

                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">{c.impact}</span>
                    <span className={`font-bold ${c.severityColor}`}>{c.severity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cán Cân Công Lý Tình Ái (Interactive Scale) */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-rose-50/40 border-rose-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-rose-500" />
                  <span className="font-black text-xs text-slate-900 dark:text-white">
                    Cán Cân Công Lý Tình Ái
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-md">
                  INTERACTIVE
                </span>
              </div>

              {/* Balance bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-500 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-500" />
                    Cuồng Si Chiếm Hữu ({obsessionRatio}%)
                  </span>
                  <span className="text-sky-500">
                    Ăn Năn Phục Tùng ({100 - obsessionRatio}%)
                  </span>
                </div>

                {/* Interactive slider for scale */}
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={obsessionRatio}
                  onChange={(e) => setObsessionRatio(Number(e.target.value))}
                  className="w-full accent-rose-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Dynamic SVG Balance Scale Visualization */}
              <div className="py-2 flex justify-center">
                <svg
                  viewBox="0 0 200 80"
                  className="w-48 h-20 transition-transform duration-500"
                  style={{
                    transform: `rotate(${(obsessionRatio - 50) * 0.3}deg)`,
                  }}
                >
                  {/* Base & Stand */}
                  <line x1="100" y1="10" x2="100" y2="70" stroke="#f43f5e" strokeWidth="3" />
                  <polygon points="80,75 120,75 100,65" fill="#f43f5e" />
                  {/* Beam */}
                  <line x1="30" y1="20" x2="170" y2="20" stroke="#f43f5e" strokeWidth="4" />
                  <circle cx="100" cy="20" r="5" fill="#e11d48" />
                  {/* Left Pan (Cuồng si) */}
                  <line x1="30" y1="20" x2="15" y2="50" stroke="#fda4af" strokeWidth="1.5" />
                  <line x1="30" y1="20" x2="45" y2="50" stroke="#fda4af" strokeWidth="1.5" />
                  <ellipse cx="30" cy="52" rx="20" ry="5" fill="#f43f5e" />
                  {/* Right Pan (Ăn năn) */}
                  <line x1="170" y1="20" x2="155" y2="50" stroke="#fda4af" strokeWidth="1.5" />
                  <line x1="170" y1="20" x2="185" y2="50" stroke="#fda4af" strokeWidth="1.5" />
                  <ellipse cx="170" cy="52" rx="20" ry="5" fill="#38bdf8" />
                </svg>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center italic">
                Cán cân lệch hẳn về phía &ldquo;Cuồng si&rdquo;. Phạm nhân hoàn toàn không có ý định hối cải.
              </p>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* COLUMN 3: BẢNG PHÁN QUYẾT TỐI CAO (TUYÊN ÁN)           */}
        {/* ====================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className={`p-5 rounded-3xl border space-y-4 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-pink-100 shadow-pink-100/30'
            }`}
          >
            {/* Header Col 3 */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white font-serif">
                  Bảng Phán Quyết Tối Cao
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">4 Bản Án</span>
            </div>

            {/* 4 Verdict Choices */}
            <div className="space-y-2.5">
              {VERDICTS.map((v) => {
                const isSelected = selectedVerdict === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVerdict(v.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? darkMode
                          ? 'bg-slate-800/90 border-rose-500 shadow-sm'
                          : 'bg-rose-50/70 border-rose-400 shadow-xs'
                        : darkMode
                        ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                        : 'bg-white border-pink-100 hover:bg-pink-50/40'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {v.desc}
                      </p>
                      <span className="inline-block text-[10px] font-bold text-rose-500 dark:text-rose-400">
                        Hiệu ứng: {v.effect}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grand Action Button: GÕ BÚA TUYÊN ÁN */}
            <button
              type="button"
              onClick={handleStrikeGavel}
              disabled={isGavelStriking}
              className={`w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 hover:opacity-95 shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isGavelStriking ? 'scale-95 animate-ping-short' : 'hover:scale-[1.02] active:scale-95'
              }`}
            >
              <Gavel className={`w-5 h-5 ${isGavelStriking ? 'rotate-45' : ''}`} />
              <span>GÕ BÚA TUYÊN ÁN & ĐÓNG DẤU SÁP HOÀNG GIA</span>
            </button>

            {/* Lịch Sử Phán Quyết Trước Đó */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  LỊCH SỬ PHÁN QUYẾT TRƯỚC ĐÓ
                </span>
                <span className="text-rose-500 text-[11px] font-bold cursor-pointer hover:underline">
                  Xem tất cả
                </span>
              </div>

              <div className="space-y-2">
                {verdictHistory.map((h) => (
                  <div
                    key={h.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                      darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <div>
                        <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">
                          {h.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{h.time}</span>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-black bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300">
                      ÁN
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. BOTTOM BANNER: CHẾ ĐỘ GIÁM SÁT SAU BẢN ÁN              */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-rose-50/60 border-rose-200/80 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shadow-xs shrink-0">
            <Stamp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm text-slate-900 dark:text-white font-serif">
              Chế Độ Giám Sát Sau Bản Án
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phạm nhân #{defendant.id} sẽ được dẫn độ về Buồng Giam Nhung Đỏ lúc 01:00 AM cùng biên bản phán quyết.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => showToast(`Đã trích xuất biên bản cáo trạng hồ sơ #${defendant.id}/HC-VELVET`)}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              darkMode
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-white border-pink-200 text-slate-700 hover:bg-pink-50'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Bản Cáo Trạng PDF</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Đã phát tín hiệu triệu tập đội Quản Ngục Hộ Tống đặc vụ.')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 shadow-md shadow-rose-400/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Triệu Tập Quản Ngục Hộ Tống</span>
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-900/95 text-white border border-rose-500/40 shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}
    </div>
  );
};
