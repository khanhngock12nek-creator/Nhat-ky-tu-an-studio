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
  const DEFENDANTS = characters.map((c, idx) => {
    const genreText = c.genres?.join(', ') || 'Si tình';
    const crimeText = c.crime || c.backstory || 'Cố ý gây thương nhớ và chiếm đoạt trái tim Thẩm phán.';

    let trialStyle = 'Phiên xử kín dưới ánh trăng sương mờ';
    let mentalStatus = '';
    let confession = c.quote || '“Thưa Thẩm phán tối cao... nếu yêu người là một trọng tội không thể dung thứ, tôi xin nhận trọn bản án chung thân.”';

    if (c.name.includes('Lục Diệp') || genreText.includes('Cún con')) {
      trialStyle = 'Tội danh: Cố ý bám đuôi, ghen tuông vô cớ & Giấu kín quà tặng tình ái.';
      mentalStatus = 'Hội chứng bám dính cảm xúc cấp độ tối cao: Phạm nhân liên tục hoảng loạn khi cách xa Thẩm phán. Nhịp tim tăng vọt mỗi khi nghe tiếng bước chân ngoài vành móng ngựa.';
    } else if (c.name.includes('Thẩm Vấn') || genreText.includes('Văn nhã bại hoại')) {
      trialStyle = 'Tội danh: Giam lỏng ánh mắt 24/7 & Cố tình phá vỡ vách kính buồng giam.';
      mentalStatus = 'Hội chứng chiếm hữu tri thức: Bệnh nhân giữ thái độ văn nhã đáng sợ, từ chối kháng án và đòi tuyên mức án biệt giam vĩnh viễn bên cạnh Thẩm phán.';
    } else if (c.name.includes('Trần Khang') || genreText.includes('Boy phố')) {
      trialStyle = 'Tội danh: Náo loạn trật tự phố cổ & Lạng lách vượt biên giới cấm.';
      mentalStatus = 'Hội chứng tăng động ái tình: Cố tình ngậm kẹo cao su và huýt sáo trêu chọc thẩm phán giữa phiên tòa trang nghiêm.';
    } else if (c.name.includes('Tiêu Cảnh') || genreText.includes('cổ trang')) {
      trialStyle = 'Tội danh: Phế truất giang sơn vạn dặm để đổi lấy một ánh mắt dung thứ.';
      mentalStatus = 'Hội chứng đế vương si tình: Tự nguyện cởi bỏ hoàng bào, quỳ gối chờ lệnh búa gỗ của Thẩm phán với độ trung thành tuyệt đối 100%.';
    } else if (c.name.includes('Bạch Duật') || genreText.includes('Game thủ')) {
      trialStyle = 'Tội danh: Đào tẩu khỏi giải đấu quốc tế chỉ vì nghe tiếng khóc của nàng.';
      mentalStatus = 'Hội chứng cô lập thần kinh số: Mọi thao tác tư duy đều lập trình sẵn hình bóng của Thẩm phán, từ chối mọi đặc xá tự do.';
    } else {
      trialStyle = `Tội danh đặc biệt #${idx + 1}: ${crimeText.slice(0, 50)}`;
      mentalStatus = `Hội chứng cuồng si biệt giam #${idx + 1}: Bị cáo hiển thị trạng thái lệ thuộc cảm xúc tuyệt đối vào phán quyết của Thẩm phán.`;
    }

    return {
      id: c.id,
      code: c.prisonId || `#0${idx + 1} ${c.name}`,
      shortName: `#0${idx + 1} ${c.name.split(' ').slice(-1)[0]}`,
      alias: c.genres?.[0] || 'Phạm nhân si tình',
      status: idx === 0 ? 'Hiện tại' : 'Chờ lệnh',
      heartbeat: `${120 + (idx * 7) % 30} bpm`,
      resistance: `${(idx * 0.8).toFixed(1)}%`,
      image: c.avatarUrl || '',
      trialStyle,
      mentalStatus,
      confession,
      confessionTime: `Khai tại vành móng 00:${String(idx * 5).padStart(2, '0')}`,
    };
  });

  const [selectedDefendantId, setSelectedDefendantId] = useState(characters[0]?.id || '');
  
  useEffect(() => {
    if (characters.length > 0 && !characters.some(c => c.id === selectedDefendantId)) {
      setSelectedDefendantId(characters[0].id);
    }
  }, [characters, selectedDefendantId]);

  const activeDefendant = DEFENDANTS.find((d) => d.id === selectedDefendantId) || DEFENDANTS[0];
  const [selectedVerdict, setSelectedVerdict] = useState('1');
  const [obsessionRatio, setObsessionRatio] = useState(88); // 88% Cuồng Si vs 12% Ăn Năn
  const [isGavelStriking, setIsGavelStriking] = useState(false);
  const [isVerdictSealed, setIsVerdictSealed] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const [customIndictments, setCustomIndictments] = useState<Record<string, Array<{id: string; title: string; content: string; time: string}>>>({});
  const [newIndictmentTitle, setNewIndictmentTitle] = useState('');
  const [newIndictmentContent, setNewIndictmentContent] = useState('');

  const handleAddIndictment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndictmentTitle.trim() && !newIndictmentContent.trim()) return;
    const newItem = {
      id: `ind-${Date.now()}`,
      title: newIndictmentTitle.trim() || 'Tội danh tư tình mới',
      content: newIndictmentContent.trim() || 'Cố ý làm xao xuyến trái tim Thẩm phán trong phiên tòa nửa đêm.',
      time: 'Vừa lập cáo trạng • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCustomIndictments(prev => ({
      ...prev,
      [selectedDefendantId]: [newItem, ...(prev[selectedDefendantId] || [])]
    }));
    setNewIndictmentTitle('');
    setNewIndictmentContent('');
    showToast('Đã gửi bản cáo trạng tình ái mới thành công!');
  };

  const currentIndictments = customIndictments[selectedDefendantId] || [];
  const [verdictHistory, setVerdictHistory] = useState<Array<{ id: string; title: string; time: string }>>([]);

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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-[9px] font-black tracking-wide border border-sky-200/60 dark:border-rose-900/40">
            <Gavel className="w-2.5 h-2.5 text-rose-500 animate-pulse" />
            <span>PHIÊN TÒA TỐI CAO 00:00 • VÀNH MÓNG NGỰA TRỐNG</span>
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 bg-clip-text text-transparent font-serif">
            Phiên Tòa Nửa Đêm & Tuyên Án Bổ Sung
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-900 dark:text-slate-400 max-w-md mx-auto">
            Nơi quyền lực Thẩm phán quy phục những trái tim cuồng nhiệt. Mọi ánh mắt, hơi thở và lời khẩn cầu đều được cân đo bởi cán cân công lý đẫm hương hoa hồng nhung.
          </p>
        </div>

        {/* Empty State Hero Card */}
        <div
          className={`p-4 sm:p-6 text-center rounded-2xl sm:rounded-3xl border border-dashed relative overflow-hidden transition-all shadow-md ${
            darkMode
              ? 'bg-slate-900/80 border-rose-900/50 text-slate-100 shadow-rose-950/20'
              : 'bg-sky-50/90 border-sky-200 text-slate-900 shadow-pink-100/40'
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

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold mb-1.5 bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 border border-sky-200/60 dark:border-slate-700">
            <Scale className="w-2.5 h-2.5" />
            <span>VÀNH MÓNG NGỰA CHƯA CÓ BỊ CÁO</span>
          </div>

          <h2 className="text-base sm:text-lg font-black mb-1 font-serif">
            Hiện Chưa Có Tù Nhân Nào Cần Triệu Tập Xét Xử Nửa Đêm
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-900 dark:text-slate-400 max-w-md mx-auto mb-3.5 leading-relaxed">
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
                    : 'bg-sky-50 border-sky-200 text-slate-900 hover:bg-pink-50 shadow-2xs'
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
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/80 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-1.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Bản Cáo Trạng Tình Ái
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Xét xử các tội danh: cướp đoạt thời gian 24/7, quyến rũ qua vách kính buồng giam và mưu toan đảo ngược vị trí quản thúc.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/80 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-1.5">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Cán Cân Công Lý Tình Ái
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Đo lường mức độ tương tác giữa Cuồng Si Chiếm Hữu và Ăn Năn Phục Tùng với mô hình cân tiểu ly động.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/80 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-1.5">
                <Gavel className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Bảng Phán Quyết Tối Cao
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-900 dark:text-slate-400 leading-relaxed">
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
            : 'bg-sky-50/95 border-sky-200 text-slate-900 shadow-pink-100/30'
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
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-900">
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
              <p className="text-xs text-slate-900 dark:text-slate-400 leading-relaxed">
                Nơi quyền lực Thẩm phán quy phục những trái tim cuồng nhiệt. Mọi ánh mắt, hơi thở và lời khẩn cầu đều được cân đo bởi cán cân công lý đẫm hương hoa hồng nhung.
              </p>
            </div>
          </div>

          {/* Right Metrics Box */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border text-center min-w-[130px] ${
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-50/50 border-sky-200'
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
                darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-50/50 border-sky-200'
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
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            {/* Header Col 1 */}
            <div className="flex items-center justify-between pb-3 border-b border-sky-200 dark:border-slate-800">
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

            {/* Unique Trial Style / Accusation Banner */}
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 space-y-1">
              <span className="text-[9px] font-black uppercase text-rose-600 dark:text-rose-400 block tracking-wider">
                ⚖️ Kiểu Xét Xử & Cáo Trạng Riêng Biệt
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {defendant.trialStyle}
              </p>
            </div>

            {/* Large Portrait Box */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-inner border border-sky-200/50 group">
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
                darkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-rose-50/60 border-sky-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-rose-500 font-black text-xs">
                <span>💬</span>
                <span>LỜI TỰ THÚ MỞ MÀN CỦA BỊ CÁO</span>
              </div>
              <p className="text-xs text-slate-900 dark:text-slate-300 italic leading-relaxed">
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
                          : 'bg-sky-50 border-sky-200 text-slate-900 hover:bg-rose-50'
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
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            {/* Header Col 2 */}
            <div className="text-center pb-3 border-b border-sky-200 dark:border-slate-800 space-y-0.5">
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

            {/* Thanh ghi / Ô nhập viết và gửi bản cáo trạng mới */}
            <form onSubmit={handleAddIndictment} className={`p-4 rounded-2xl border space-y-3 ${
              darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-rose-50/50 border-sky-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-600 dark:text-rose-400">
                <FileText className="w-4 h-4" />
                <span>Viết & Gửi Bản Cáo Trạng Tình Ái Mới</span>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Tiêu đề tội danh (VD: Tội danh cố ý gây thương nhớ...)"
                  value={newIndictmentTitle}
                  onChange={(e) => setNewIndictmentTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-rose-500'
                      : 'bg-sky-50 border-sky-200 text-slate-900 focus:border-rose-400'
                  }`}
                />
                <textarea
                  rows={2}
                  placeholder="Nội dung chi tiết bản cáo trạng, lời buộc tội hoặc chứng cứ tình ái..."
                  value={newIndictmentContent}
                  onChange={(e) => setNewIndictmentContent(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none resize-none transition-all ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-rose-500'
                      : 'bg-sky-50 border-sky-200 text-slate-900 focus:border-rose-400'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-xs shadow-md shadow-rose-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Stamp className="w-3.5 h-3.5" />
                  <span>Gửi Bản Cáo Trạng</span>
                </button>
              </div>
            </form>

            {/* Danh sách các bản cáo trạng đã lập */}
            <div className="space-y-3">
              {currentIndictments.length === 0 ? (
                <div className="p-6 text-center rounded-2xl border border-dashed border-sky-200 dark:border-slate-800 bg-rose-50/20 dark:bg-slate-900/40 text-slate-400 text-xs italic">
                  Chưa có bản cáo trạng nào được thiết lập. Hãy viết và gửi bản cáo mới ở thanh phía trên để khởi động công tố.
                </div>
              ) : (
                currentIndictments.map((ind, idx) => (
                  <div
                    key={ind.id}
                    className={`p-4 rounded-2xl border space-y-2 transition-all ${
                      darkMode ? 'bg-slate-800/60 border-slate-700/80' : 'bg-sky-50 border-sky-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[11px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white">
                          {ind.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-pink-500 font-bold bg-pink-100 dark:bg-pink-950/60 px-2 py-0.5 rounded-full">
                        Chính Thức
                      </span>
                    </div>

                    <p className="text-xs text-slate-900 dark:text-slate-300 italic leading-relaxed">
                      &ldquo;{ind.content}&rdquo;
                    </p>

                    <div className="pt-1.5 border-t border-sky-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{ind.time}</span>
                      <span className="text-rose-500 font-bold">Mức án: Chung thân si tình</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cán Cân Công Lý Tình Ái (Interactive Scale) */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-rose-50/40 border-sky-200'
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

              <p className="text-[11px] text-slate-900 dark:text-slate-400 text-center italic">
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
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            {/* Header Col 3 */}
            <div className="flex items-center justify-between pb-3 border-b border-sky-200 dark:border-slate-800">
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
                        : 'bg-sky-50 border-sky-200 hover:bg-pink-50/40'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500 text-white'
                            : 'border-sky-200 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-sky-50" />}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-slate-900 dark:text-slate-400 leading-relaxed">
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
            <div className="space-y-2 pt-2 border-t border-sky-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  LỊCH SỬ PHÁN QUYẾT TRƯỚC ĐÓ
                </span>
                <span className="text-rose-500 text-[11px] font-bold cursor-pointer hover:underline">
                  Xem tất cả
                </span>
              </div>

              <div className="space-y-2">
                {verdictHistory.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-sky-200 dark:border-slate-800 text-center text-slate-400 text-xs py-6">
                    Chưa có bản án nào được tuyên trong phiên tòa này. Hãy chọn hình phạt và gõ búa.
                  </div>
                ) : (
                  verdictHistory.map((h) => (
                    <div
                      key={h.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                        darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-sky-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <div>
                          <span className="font-bold text-xs block text-slate-900 dark:text-slate-200">
                            {h.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{h.time}</span>
                        </div>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-black bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300">
                        ÁN
                      </span>
                    </div>
                  ))
                )}
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
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-rose-50/60 border-sky-200/80 shadow-xs'
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
            <p className="text-xs text-slate-900 dark:text-slate-400">
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
                : 'bg-sky-50 border-sky-200 text-slate-900 hover:bg-pink-50'
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
