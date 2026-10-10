import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Activity,
  FileHeart,
  Thermometer,
  ShieldAlert,
  Clock,
  Heart,
  CheckCircle2,
  Lock,
  Pill,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Stamp,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import lucCanhTieuImg from '../assets/images/luc_canh_tieu_avatar_1791553296431.jpg';
import kaelenImg from '../assets/images/kaelen_valerius_avatar_1791553317474.jpg';
import renImg from '../assets/images/ren_amamiya_avatar_1791553338831.jpg';
import bannerImg from '../assets/images/prison_diary_hero_banner_1791465806036.jpg';
import { Character, ActiveTab } from '../types';

interface PsychWardViewProps {
  characters: Character[];
  darkMode: boolean;
  onOpenAdmin: () => void;
  onTabChange?: (tab: ActiveTab) => void;
}

interface PatientRecord {
  id: string;
  code: string;
  name: string;
  avatar: string;
  bpm: number;
  room: string;
  diagnosisShort: string;
  height: string;
  weight: string;
  temp: string;
  evalMental: string;
  obedienceRate: number;
  dangerLevel: string;
  dangerRate: number;
  ecgBeat: number;
  ecgWave: string;
  wristInjury: string;
  collarInjury: string;
  doctorNotes: string;
}

export const PsychWardView: React.FC<PsychWardViewProps> = ({
  characters,
  darkMode,
  onOpenAdmin,
  onTabChange,
}) => {
  const PATIENTS: PatientRecord[] = characters.map((c, idx) => ({
    id: c.id,
    code: c.prisonId || `#0${idx + 1} ${c.name}`,
    name: c.name,
    avatar: c.avatarUrl || '',
    bpm: 120 + (idx * 7) % 30,
    room: c.zone || `Buồng ${String.fromCharCode(65 + (idx % 4))}-${String(idx + 1).padStart(2, '0')}`,
    diagnosisShort: c.crime || 'Cuồng si hoang tưởng cấp độ cao',
    height: '185 cm',
    weight: '75 kg',
    temp: '37.5 °C',
    evalMental: 'Bệnh nhân biểu hiện trạng thái tâm thần quá tải dopamine khi ở gần Bác sĩ/Quản ngục. Tiêu cự ánh mắt luôn hướng về một điểm duy nhất, từ chối giao tiếp với thế giới bên ngoài và chỉ đáp lời khi nghe giọng nói của người cai quản.',
    obedienceRate: 95,
    dangerLevel: c.rarity ? `Cấp Độ ${c.rarity} (Tuyệt đối cấm lơ là)` : 'Cấp Độ S+',
    dangerRate: 90,
    ecgBeat: 130,
    ecgWave: 'Loạn Nhịp Si Tình',
    wristInjury: 'Trầy xước mô mềm do cố tình giật mạnh dây xích phòng giam.',
    collarInjury: 'Dấu tích trừng phạt kỷ luật trước. Phạm nhân chỉ cho phép quản ngục chạm vào trị liệu.',
    doctorNotes: c.quote || 'Bệnh nhân hoàn toàn khao khát được tăng thêm thời hạn giam giữ vô thời hạn.',
  }));

  const [selectedPatientId, setSelectedPatientId] = useState(characters[0]?.id || '');

  useEffect(() => {
    if (characters.length > 0 && !characters.some(c => c.id === selectedPatientId)) {
      setSelectedPatientId(characters[0].id);
    }
  }, [characters, selectedPatientId]);

  const [isSigned, setIsSigned] = useState(false);
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [prescribedDrugs, setPrescribedDrugs] = useState<Record<string, boolean>>({
    syrup: false,
    incense: false,
    consultation: false,
  });

  const patient =
    PATIENTS.find((p) => p.id === selectedPatientId) || PATIENTS[0];

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleTogglePrescription = (key: string) => {
    setPrescribedDrugs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignTreatment = () => {
    setIsSigned(true);
    showToast('Đã đóng dấu phê duyệt đặc cách y lệnh điều trị!');
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#a855f7'],
      });
    } catch {
      // ignore
    }
  };

  const handleToggleLockdown = () => {
    setIsLockdownActive(!isLockdownActive);
    if (!isLockdownActive) {
      showToast('⚠️ ĐÃ KÍCH HOẠT HẠ CHẮN SONG SẮT KHẨN CẤP! TẤT CẢ BUỒNG BIỆT GIAM ĐÃ NIÊM PHONG.');
    } else {
      showToast('Đã dỡ bỏ trạng thái báo động khẩn cấp.');
    }
  };

  // ===================================================================
  // TRẠNG THÁI TRỐNG: KHI CHƯA CÓ BỆNH NHÂN / TÙ NHÂN NÀO
  // ===================================================================
  if (characters.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-3 sm:space-y-4 animate-fade-in font-sans">
        {/* Section Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-[9px] font-black tracking-wide border border-sky-200/60 dark:border-rose-900/40">
            <HeartPulse className="w-2.5 h-2.5 text-rose-500 animate-pulse" />
            <span>KHU BIỆT LẬP HOA HỒNG • PHÒNG KHÁM ĐANG TRỐNG</span>
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 bg-clip-text text-transparent font-serif">
            Phòng Giám Sát Tâm Lý & Y Án Mật
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-900 dark:text-slate-400 max-w-md mx-auto">
            Hồ sơ thần kinh cấp cứu • Nơi theo dõi nhịp tim loạn nhịp si tình, giám sát vết tích còng xích và kê đơn tình dược xoa dịu buồng giam.
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
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-sky-400/10 blur-3xl pointer-events-none" />

          {/* Animated Medical Icon */}
          <div className="relative mx-auto w-12 h-12 mb-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 blur-md opacity-40 animate-pulse" />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-400/30">
              <HeartPulse className="w-6 h-6 animate-bounce-short" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold mb-1.5 bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 border border-sky-200/60 dark:border-slate-700">
            <Stethoscope className="w-2.5 h-2.5" />
            <span>0 BỆNH NHÂN CHỜ KHÁM • BUỒNG TRỰC YÊN TĨNH</span>
          </div>

          <h2 className="text-base sm:text-lg font-black mb-1 font-serif">
            Hiện Chưa Có Tù Nhân Nào Trong Danh Sách Giám Sát Tâm Lý
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-900 dark:text-slate-400 max-w-md mx-auto mb-3.5 leading-relaxed">
            Tất cả các buồng biệt giam hiện đang hoàn toàn yên tĩnh và không có bệnh nhân thần kinh cấp cứu.
            Chưa có phạm nhân nào có dấu hiệu loạn nhịp si tình hay chấn thương do giật xích phòng giam.
            Khi Quản Trị Viên khởi tạo phạm nhân mới, bệnh án và máy đo điện tâm đồ ECG sẽ tự động kích hoạt!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:opacity-95 shadow-md shadow-rose-400/25 transition-all cursor-pointer hover:scale-101 active:scale-95"
            >
              <ShieldAlert className="w-3 h-3" />
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
            🩺 Các Hạng Mục Giám Sát Y Khoa Bí Mật
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/80 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-1.5">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Điện Tâm Đồ & Sóng Não
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Máy đo ECG Lead II 135 BPM thời gian thực, đo xung thần kinh hưng phấn và trạng thái loạn nhịp si tình.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/80 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-1.5">
                <Thermometer className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Bản Đồ Thân Thể Vết Tích
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Theo dõi 3 điểm chấn thương: trầy xước cổ tay do giật xích buồng giam và vết bầm xương quai xanh.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/80 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-1.5">
                <Pill className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Kê Đơn Tình Dược & Liệu Pháp
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Phác đồ điều trị: Siro an thần cánh hồng, Trầm hương hoa chuông xông phòng và tham vấn kín 1:1.
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border transition-all ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/80 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-1.5">
                <Stamp className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-bold text-[11px] sm:text-xs mb-0.5 text-slate-900 dark:text-white">
                Đóng Dấu Y Lệnh Đặc Cách
              </h4>
              <p className="text-[10px] sm:text-[10.5px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Chữ ký điện tử Velvet Warden cùng con dấu đỏ niêm phong hồ sơ bệnh án tối mật buồng giam.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-500 flex items-center justify-center shadow-xs">
                <FileHeart className="w-4 h-4 text-rose-500" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-serif text-slate-900 dark:text-white">
                Phòng Giám Sát Tâm Lý & Y Án Mật
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300">
                KHU BIỆT LẬP HOA HỒNG
              </span>
            </div>

            <p className="text-xs text-slate-900 dark:text-slate-400">
              Hồ sơ thần kinh cấp cứu • Mã phân loại: Velvet-Psyche #094-S
            </p>
          </div>

          {/* Right Metrics Pills */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
                darkMode ? 'bg-slate-800/80 border-slate-700 text-rose-300' : 'bg-rose-50 border-sky-200 text-rose-600'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>4 Bệnh Nhân Chờ Khám</span>
            </div>

            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
                darkMode ? 'bg-slate-800/80 border-slate-700 text-sky-300' : 'bg-sky-50 border-sky-100 text-sky-600'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Ca Trực Đêm: 01:45 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THREE-COLUMN MEDICAL DASHBOARD                        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ====================================================== */}
        {/* COLUMN 1: DANH SÁCH BỆNH ÁN & HỒ SƠ BỆNH NHÂN          */}
        {/* ====================================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1A: Danh Sách Bệnh Án Khẩn */}
          <div
            className={`p-5 rounded-3xl border space-y-3.5 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-sky-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white font-serif">
                  Danh Sách Bệnh Án Khẩn
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">4 HỒ SƠ</span>
            </div>

            <div className="space-y-2">
              {PATIENTS.map((p) => {
                const isSelected = p.id === selectedPatientId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? darkMode
                          ? 'bg-slate-800 border-rose-500 shadow-md shadow-rose-950/40'
                          : 'bg-rose-50/70 border-sky-200 shadow-sm'
                        : darkMode
                        ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                        : 'bg-sky-50 border-sky-200 hover:bg-rose-50/30 text-slate-900'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 border border-sky-200 shadow-2xs">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs truncate text-slate-900 dark:text-white">
                          {p.code}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-rose-500 shrink-0">
                          {p.bpm} BPM
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate">{p.diagnosisShort}</span>
                        <span className="shrink-0 text-[10px]">{p.room}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 1B: Hồ Sơ Chi Tiết Bệnh Nhân Đang Chọn */}
          <div
            className={`p-5 rounded-3xl border space-y-4 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            {/* Avatar & Patient Name */}
            <div className="text-center space-y-2">
              <div className="relative mx-auto w-24 h-24">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-rose-400 p-0.5 shadow-md">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white shadow-xs whitespace-nowrap">
                  ÁN BIỆT GIAM
                </span>
              </div>

              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white font-serif">
                  {patient.name}
                </h3>
                <span className="text-xs text-slate-400">
                  Số tù: #{patient.id}-VELVET • Buồng Biệt Giam A-{patient.id}
                </span>
              </div>
            </div>

            {/* Vital Stats (Height, Weight, Temp) */}
            <div className="grid grid-cols-3 gap-2">
              <div
                className={`p-2.5 rounded-2xl border text-center ${
                  darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-sky-200'
                }`}
              >
                <span className="text-[9px] font-black uppercase text-slate-400 block">CHIỀU CAO</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white">{patient.height}</span>
              </div>
              <div
                className={`p-2.5 rounded-2xl border text-center ${
                  darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-sky-200'
                }`}
              >
                <span className="text-[9px] font-black uppercase text-slate-400 block">CÂN NẶNG</span>
                <span className="font-bold text-xs text-slate-900 dark:text-white">{patient.weight}</span>
              </div>
              <div
                className={`p-2.5 rounded-2xl border text-center ${
                  darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-sky-200'
                }`}
              >
                <span className="text-[9px] font-black uppercase text-slate-400 block">THÂN NHIỆT</span>
                <span className="font-bold text-xs text-rose-500">{patient.temp}</span>
              </div>
            </div>

            {/* Đánh Giá Trạng Thái Tâm Thần */}
            <div
              className={`p-3.5 rounded-2xl border space-y-1.5 ${
                darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-rose-50/50 border-sky-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs">
                <span>🩺</span>
                <span>Đánh Giá Trạng Thái Tâm Thần</span>
              </div>
              <p className="text-xs text-slate-900 dark:text-slate-300 italic leading-relaxed">
                &ldquo;{patient.evalMental}&rdquo;
              </p>
            </div>

            {/* Progress Bars: Chỉ Số Ngoan Ngoãn & Độ Nguy Hiểm */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-300">CHỈ SỐ NGOAN NGOÃN</span>
                  <span className="text-rose-500">{patient.obedienceRate}% (Chỉ trước mặt bạn)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${patient.obedienceRate}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-300">ĐỘ NGUY HIỂM ĐỐI VỚI NGƯỜI KHÁC</span>
                  <span className="text-rose-600 dark:text-rose-400">{patient.dangerLevel}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-600 to-red-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${patient.dangerRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* COLUMN 2: ĐIỆN TÂM ĐỒ & BẢN ĐỒ THÂN THỂ VẾT TÍCH        */}
        {/* ====================================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 2A: Điện Tâm Đồ & Xung Điện Não */}
          <div
            className={`p-5 rounded-3xl border space-y-3.5 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-sky-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white font-serif">
                  Điện Tâm Đồ & Xung Điện Não
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300">
                {patient.ecgWave}
              </span>
            </div>

            {/* ECG Graphic / Animated Wave Display */}
            <div
              className={`p-3 rounded-2xl border overflow-hidden relative ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-rose-50/50 border-sky-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>ECG Lead II • 25mm/s</span>
                <span className="text-rose-500 font-bold">{patient.bpm} BPM • R-R: 440ms</span>
              </div>

              {/* Animated ECG SVG */}
              <div className="h-16 w-full flex items-center">
                <svg viewBox="0 0 400 60" className="w-full h-full stroke-rose-500 fill-none stroke-[2]">
                  <path
                    d="M 0 30 L 40 30 L 48 30 L 52 10 L 58 50 L 64 20 L 70 30 L 100 30 L 140 30 L 148 30 L 152 10 L 158 50 L 164 20 L 170 30 L 200 30 L 240 30 L 248 30 L 252 10 L 258 50 L 264 20 L 270 30 L 300 30 L 340 30 L 348 30 L 352 10 L 358 50 L 364 20 L 370 30 L 400 30"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-900 dark:text-slate-400 pt-1 border-t border-sky-200 dark:border-slate-800">
                <span>Thùy Trán (Sóng Beta): Hưng Phấn</span>
                <span>Đồng Tử Co Giãn: 5.8mm</span>
              </div>
            </div>
          </div>

          {/* Card 2B: Bản Đồ Thân Thể & Vết Tích Giam Cầm */}
          <div
            className={`p-5 rounded-3xl border space-y-4 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-sky-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white font-serif">
                  Bản Đồ Thân Thể & Vết Tích Giam Cầm
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">3 Điểm Chấn Thương</span>
            </div>

            {/* Silhouette Figure with Interactive Nodes */}
            <div
              className={`py-6 px-4 rounded-2xl border relative flex justify-center items-center min-h-[220px] ${
                darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50/70 border-sky-200'
              }`}
            >
              {/* Silhouette Body SVG */}
              <svg viewBox="0 0 160 220" className="h-48 w-36 opacity-30 dark:opacity-20 fill-slate-500">
                <circle cx="80" cy="25" r="16" />
                <path d="M 60 50 Q 80 46 100 50 L 115 110 L 100 110 L 96 160 L 98 210 L 84 210 L 80 150 L 76 210 L 62 210 L 64 160 L 60 110 L 45 110 Z" />
              </svg>

              {/* Point 1: Xương Quai Xanh */}
              <div className="absolute top-10 right-14 sm:right-20">
                <div className="group relative">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                  </span>
                  <div className="absolute -top-1 left-4 whitespace-nowrap px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-[10px] font-bold text-rose-600 dark:text-rose-300">
                    Xương Quai Xanh
                  </div>
                </div>
              </div>

              {/* Point 2: Nhịp Đập 135 BPM (Heart) */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-md shadow-rose-400/40 animate-bounce-short">
                  <Heart className="w-2.5 h-2.5 fill-white" />
                  <span>Nhịp Đập {patient.bpm} BPM</span>
                </div>
              </div>

              {/* Point 3: Cổ Tay Trầy Xước */}
              <div className="absolute bottom-14 left-10 sm:left-14">
                <div className="group relative">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                  </span>
                  <div className="absolute -top-1 left-4 whitespace-nowrap px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    Cổ Tay Trầy Xước
                  </div>
                </div>
              </div>
            </div>

            {/* Injury Cards */}
            <div className="space-y-2.5">
              <div
                className={`p-3 rounded-2xl border space-y-1 ${
                  darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-slate-50 border-sky-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-slate-200">
                    🔗 Vết Xích Cổ Tay • Khớp Tay Phải
                  </span>
                  <span className="text-[10px] text-slate-900 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                    Băng Gạc Tơ Tằm
                  </span>
                </div>
                <p className="text-[11px] text-slate-900 dark:text-slate-400 leading-relaxed">
                  {patient.wristInjury}
                </p>
              </div>

              <div
                className={`p-3 rounded-2xl border space-y-1 ${
                  darkMode ? 'bg-slate-800/40 border-slate-700/80' : 'bg-rose-50/50 border-sky-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-600 dark:text-rose-400">
                    🌹 Vết Bầm Xương Quai Xanh
                  </span>
                  <span className="text-[10px] text-rose-600 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-md font-bold">
                    Thoa Thuốc Hoa Hồng
                  </span>
                </div>
                <p className="text-[11px] text-slate-900 dark:text-slate-400 leading-relaxed">
                  {patient.collarInjury}
                </p>
              </div>

              {/* Bút Ký Bác Sĩ Tâm Lý Trực Ban */}
              <div
                className={`p-3.5 rounded-2xl border space-y-1.5 ${
                  darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-pink-50/60 border-sky-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black text-rose-500">
                  <span>BÚT KÝ BÁC SĨ TÂM LÝ TRỰC BAN</span>
                  <span className="text-[10px] font-mono text-slate-400">02:15 AM</span>
                </div>
                <p className="text-xs text-slate-900 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{patient.doctorNotes}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* COLUMN 3: KÊ ĐƠN TÌNH DƯỢC & PHÊ DUYỆT ĐÓNG DẤU        */}
        {/* ====================================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 3A: Kê Đơn Tình Dược & Liệu Pháp */}
          <div
            className={`p-5 rounded-3xl border space-y-4 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-sky-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white font-serif">
                  Kê Đơn Tình Dược & Liệu Pháp
                </h3>
              </div>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Item 1: Siro An Thần Cánh Hồng */}
            <div
              className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-sky-50 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Siro An Thần Cánh Hồng
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950/70 text-pink-600">
                  Uống Đêm
                </span>
              </div>
              <p className="text-[11px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Chiết xuất hoa hồng nhung giảm trầm cảm. Tác dụng giảm 20% kích động ban đêm, mô phỏng cảm giác được người thương ôm ấp.
              </p>
              <div className="pt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Liều lượng: 10ml</span>
                <button
                  type="button"
                  onClick={() => handleTogglePrescription('syrup')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    prescribedDrugs.syrup
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-rose-500 text-white hover:opacity-90 shadow-xs'
                  }`}
                >
                  {prescribedDrugs.syrup ? '✓ Đã Kê Đơn' : 'Kê Đơn 2 Thìa/Đêm'}
                </button>
              </div>
            </div>

            {/* Item 2: Trầm Hương Hoa Chuông */}
            <div
              className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-sky-50 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Trầm Hương Hoa Chuông
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-600">
                  Xông Phòng
                </span>
              </div>
              <p className="text-[11px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Xua tan ác mộng và ảo giác bị bỏ rơi. Đốt tại buồng biệt giam đúng 02:00 AM mỗi ngày để ổn định sóng não.
              </p>
              <div className="pt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Thời gian: 45 Phút</span>
                <button
                  type="button"
                  onClick={() => handleTogglePrescription('incense')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    prescribedDrugs.incense
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-indigo-600 text-white hover:opacity-90 shadow-xs'
                  }`}
                >
                  {prescribedDrugs.incense ? '✓ Đã Lên Lịch' : 'Lên Lịch Xông'}
                </button>
              </div>
            </div>

            {/* Item 3: Tham Vấn Kín 1:1 Có Rèm Nhung */}
            <div
              className={`p-3.5 rounded-2xl border space-y-2 transition-all ${
                darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-sky-50 border-sky-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Tham Vấn Kín 1:1 Có Rèm Nhung
                </h4>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-600">
                  ĐẶC CÁCH
                </span>
              </div>
              <p className="text-[11px] text-slate-900 dark:text-slate-400 leading-relaxed">
                Chỉ thị cho phép Quản Ngục Trưởng trực tiếp ngồi đối diện cách 30cm, nắm tay phạm nhân để xoa dịu phản xạ co thắt lồng ngực.
              </p>
              <div className="pt-1.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Thời hạn: 30 Phút/Tuần</span>
                <button
                  type="button"
                  onClick={() => handleTogglePrescription('consultation')}
                  className="p-1 rounded-lg text-rose-500 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3B: Phê Duyệt & Đóng Dấu Y Lệnh */}
          <div
            className={`p-5 rounded-3xl border space-y-4 shadow-sm ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50 border-sky-200 shadow-pink-100/30'
            }`}
          >
            <div className="flex items-center gap-2 pb-2 border-b border-sky-200 dark:border-slate-800">
              <Stamp className="w-4 h-4 text-rose-500" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white font-serif">
                Phê Duyệt & Đóng Dấu Y Lệnh
              </h3>
            </div>

            <p className="text-xs text-slate-900 dark:text-slate-400 leading-relaxed">
              Y lệnh điều trị tâm thần đặc cấp bắt buộc phải có chữ ký xác nhận số hóa của Bác Sĩ Trưởng cùng Quản Ngục Phụ Trách.
            </p>

            {/* Signature Box */}
            <div
              className={`p-3 rounded-2xl border text-center space-y-1 ${
                darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-rose-50/40 border-sky-200'
              }`}
            >
              <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">
                CHỮ KÝ QUẢN NGỤC TRƯỞNG
              </span>
              <span className="text-xl sm:text-2xl font-serif italic font-black text-rose-600 dark:text-rose-400 block tracking-wide">
                Velvet Warden ✒️
              </span>
            </div>

            {/* Signature & Seal Action Button */}
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-2xl border text-center shrink-0 ${
                  isSigned
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 border-sky-200'
                }`}
              >
                <Stamp className="w-4 h-4 mx-auto mb-0.5" />
                <span className="text-[8px] font-black block leading-tight">
                  ĐÃ PHÊ DUYỆT<br />ĐẶC CÁCH
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignTreatment}
                className="flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 shadow-md shadow-rose-400/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSigned ? 'Y Lệnh Đã Ký Số Hóa' : 'Ký Tên Xác Nhận Điều Trị'}</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-400 text-center block">
              🛡️ Bảo mật y tế cấp độ tối mật • Không thể sao chép
            </span>

            {/* Bottom Emergency Lockdown */}
            <div className="pt-2 border-t border-sky-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Mã Khẩn Cấp Báo Động...</span>
              </span>

              <button
                type="button"
                onClick={handleToggleLockdown}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isLockdownActive
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 hover:bg-rose-200'
                }`}
              >
                {isLockdownActive ? 'ĐANG KHÓA SONG SẮT' : 'HẠ CHẮN SONG SẮT'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-900/95 text-white border border-rose-500/40 shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{toastNotice}</span>
        </div>
      )}
    </div>
  );
};
