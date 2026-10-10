import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Star,
  Send,
  Lock,
  Shield,
  Gift,
  Key,
  Globe,
  Check,
  Clock,
  Feather,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Share2,
  ChevronRight,
  Flame,
  Award,
  Users,
  KeyRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Letter, Character } from '../types';
import { PRISON_ZONES, OFFICIAL_GENRES } from '../data/constants';

interface LetterBoxProps {
  letters: Letter[];
  onAddLetter: (letter: Letter) => void;
  onLikeLetter: (id: string) => void;
  characters?: Character[];
  onSelectCharacter?: (character: Character) => void;
  darkMode: boolean;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  allGenres?: string[];
}

type MainTab = 'review' | 'idea' | 'love';

const WAX_STAMPS = [
  {
    id: 'rose',
    icon: '💮',
    title: 'Hoa Hồng Đỏ',
    subtitle: 'Niêm phong Ái Tình',
    color: 'from-rose-500 to-pink-600',
    border: 'border-rose-300 dark:border-rose-800',
  },
  {
    id: 'heart_lock',
    icon: '🗝️',
    title: 'Khóa Trái Tim',
    subtitle: 'Không ai xem trộm được',
    color: 'from-amber-500 to-yellow-600',
    border: 'border-amber-300 dark:border-amber-800',
  },
  {
    id: 'butterfly',
    icon: '🕊️',
    title: 'Cánh Bướm Dạ Lam',
    subtitle: 'Lời thì thầm cơ mật',
    color: 'from-sky-500 to-indigo-600',
    border: 'border-sky-300 dark:border-sky-800',
  },
];

const ASPECT_OPTIONS = [
  'Giao diện & Cảm xúc lãng mạn',
  'Âm thanh & Giọng lồng tiếng ASMR',
  'Vòng quay Gacha Ảo Tà',
  'Cốt truyện & Đa nếp dẫn tù nhân',
  'Tốc độ tải buồng giam & Độ mượt',
];

const RATING_LABELS: Record<number, string> = {
  5: '5/5 - Say Đắm Tuyệt Đỉnh! 💕',
  4: '4/5 - Rất Thích & Rung Động ✨',
  3: '3/5 - Khá Ổn & Đang Khám Phá 🌸',
  2: '2/5 - Cần Cải Thiện Thêm 🌿',
  1: '1/5 - Chưa Như Kỳ Vọng ❄️',
};

const SWEET_LOVE_PRESETS = [
  'Chồng nhỏ ngoan ngoãn chờ em ở buồng giam nhé, tối nay em lại ghé thăm! 💕',
  'Hôm nay em mang kẹo ngọt và trà ấm đến cho anh nè, có nhớ em không? ☕',
  'Đừng có liếc mắt nhìn quản ngục khác đấy nhé, anh là của riêng em rồi! 🗝️',
  'Cố gắng thụ án cho tốt nha, rồi em sẽ đặc xá đón anh về nhà! ✨',
];

export const LetterBox: React.FC<LetterBoxProps> = ({
  letters,
  onAddLetter,
  onLikeLetter,
  characters = [],
  darkMode,
  isAdmin = false,
  onOpenAdmin,
  allGenres = OFFICIAL_GENRES as unknown as string[],
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('review');
  const formRef = useRef<HTMLDivElement | null>(null);

  // Form states - Review
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([
    'Giao diện & Cảm xúc lãng mạn',
    'Âm thanh & Giọng lồng tiếng ASMR',
  ]);
  const [reviewTargetPrisoner, setReviewTargetPrisoner] = useState('Toàn Bộ Trại Giam');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [senderName, setSenderName] = useState('Quản Ngục Tiểu Nguyệt #809');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState(WAX_STAMPS[0]);

  // Form states - Idea
  const [ideaCharName, setIdeaCharName] = useState('');
  const [ideaZone, setIdeaZone] = useState('Phòng Giam Lạnh');
  const [ideaGenres, setIdeaGenres] = useState<string[]>(['Văn nhã bại hoại', 'Chiếm hữu']);
  const [ideaBackstory, setIdeaBackstory] = useState('');
  const [ideaFirstMessage, setIdeaFirstMessage] = useState('');

  // Form states - Love
  const [targetPrisonerName, setTargetPrisonerName] = useState(
    characters.length > 0 ? characters[0].name : ''
  );
  const [loveGift, setLoveGift] = useState('🍬 Hộp Kẹo Trái Tim');
  const [loveContent, setLoveContent] = useState('');

  // Synchronize target prisoner name when characters list changes
  useEffect(() => {
    if (characters.length > 0) {
      if (!targetPrisonerName || !characters.some((c) => c.name === targetPrisonerName)) {
        setTargetPrisonerName(characters[0].name);
      }
    } else {
      setTargetPrisonerName('');
    }
  }, [characters, targetPrisonerName]);

  // UI state
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [letterFilter, setLetterFilter] = useState<'all' | 'review' | 'idea' | 'love'>('all');

  const toggleAspect = (aspect: string) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect) ? prev.filter((a) => a !== aspect) : [...prev, aspect]
    );
  };

  const toggleIdeaGenre = (genre: string) => {
    setIdeaGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047', '#38bdf8'],
      });
    } catch {
      // ignore
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'review') {
      if (!reviewContent.trim()) return;
      const newLetter: Letter = {
        id: `letter-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderName: isAnonymous ? 'Quản Ngục Ẩn Danh' : senderName.trim() || 'Quản Ngục Nhỏ',
        senderId: isAnonymous ? '??' : senderName.trim().slice(0, 2).toUpperCase() || 'QN',
        isAnonymous,
        category: 'review',
        categoryTitle: 'Đánh Giá Web & Cảm Nhận',
        title: reviewTitle.trim() || 'Cảm nhận trải nghiệm tuyệt vời...',
        content: reviewContent.trim(),
        rating,
        aspects: selectedAspects,
        stamp: selectedStamp.icon,
        stampName: selectedStamp.title,
        zoneName: 'Khu Giam Hoa Hồng',
        badgeText: '🌸 Trân Trọng',
        themeColor: 'pink',
        createdAt: Date.now(),
        likes: 1,
        adminReply: {
          author: 'Ban Quản Trị Trại Giam',
          timeText: 'Vừa xong',
          message:
            'Cảm ơn nàng đã gửi gắm cảm nhận ngọt ngào! Ban Quản Trị đã nhận được và chuẩn bị quà bí mật cho nàng rồi nhé! 💕',
        },
      };
      onAddLetter(newLetter);
      setReviewContent('');
      setReviewTitle('');
    } else if (activeTab === 'idea') {
      if (!ideaBackstory.trim()) return;
      const newLetter: Letter = {
        id: `letter-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderName: isAnonymous ? 'Quản Ngục Ẩn Danh' : senderName.trim() || 'Quản Ngục Mới',
        senderId: isAnonymous ? '💡' : senderName.trim().slice(0, 2).toUpperCase() || 'MU',
        isAnonymous,
        category: 'idea',
        categoryTitle: 'Gửi Ý Tưởng Nhân Vật Mới',
        title: 'Ý TƯỞNG NHÂN VẬT:',
        subtitle: ideaCharName.trim()
          ? `${ideaCharName.trim()} (${ideaGenres.join(', ')})`
          : 'Một phạm nhân mới đầy bí ẩn',
        content: `Cốt truyện đề xuất: ${ideaBackstory.trim()}${
          ideaFirstMessage.trim() ? `\n\nLời thoại mở đầu: "${ideaFirstMessage.trim()}"` : ''
        }`,
        rating: 5,
        aspects: ideaGenres,
        zoneName: ideaZone,
        badgeText: '💡 Đề Xuất Idea',
        statusBadge: '★ Đang Xét Duyệt',
        stamp: selectedStamp.icon,
        stampName: selectedStamp.title,
        themeColor: 'blue',
        createdAt: Date.now(),
        likes: 1,
        commentsCount: 0,
      };
      onAddLetter(newLetter);
      setIdeaCharName('');
      setIdeaBackstory('');
      setIdeaFirstMessage('');
    } else {
      // Love letter
      if (!loveContent.trim()) return;
      if (characters.length === 0) return;
      const newLetter: Letter = {
        id: `letter-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        senderName: isAnonymous ? 'Nàng Quản Ngục Giấu Tên' : senderName.trim() || 'Nàng Quản Ngục Nhỏ',
        senderId: isAnonymous ? '💌' : senderName.trim().slice(0, 2).toUpperCase() || 'TL',
        isAnonymous,
        category: 'love',
        categoryTitle: 'Thư Thăm Nuôi & Lời Nhắn',
        title: targetPrisonerName ? `Thư gửi chàng: ${targetPrisonerName}` : 'Thư thăm nuôi buồng giam',
        subtitle: `Kèm quà tặng: ${loveGift}`,
        content: loveContent.trim(),
        targetPrisoner: targetPrisonerName,
        rating: 5,
        zoneName: 'Buồng Giam Si Tình',
        badgeText: '💌 Thư Tình Thăm Nuôi',
        stamp: selectedStamp.icon,
        stampName: selectedStamp.title,
        themeColor: 'pink',
        createdAt: Date.now(),
        likes: 1,
      };
      onAddLetter(newLetter);
      setLoveContent('');
    }

    triggerConfetti();
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4500);
  };

  const filteredLetters = letters.filter((l) => {
    if (letterFilter === 'all') return true;
    return l.category === letterFilter;
  });

  // Dynamic stats calculation (Starts at 0 / 5.0 and calculates real values from submitted letters)
  const reviewLetters = letters.filter(
    (l) => l.category === 'review' && typeof l.rating === 'number'
  );
  const totalReviews = reviewLetters.length;

  const avgRatingNum =
    totalReviews > 0
      ? reviewLetters.reduce((sum, l) => sum + (l.rating || 0), 0) / totalReviews
      : 0;
  const avgRatingDisplay = totalReviews > 0 ? avgRatingNum.toFixed(1) : '0';

  const fiveStarCount = reviewLetters.filter((l) => l.rating === 5).length;
  const fourStarCount = reviewLetters.filter((l) => l.rating === 4).length;
  const threeStarCount = reviewLetters.filter((l) => (l.rating || 0) <= 3).length;

  const fiveStarPct = totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 0;
  const fourStarPct = totalReviews > 0 ? Math.round((fourStarCount / totalReviews) * 100) : 0;
  const threeStarPct = totalReviews > 0 ? Math.round((threeStarCount / totalReviews) * 100) : 0;

  const positiveReviews = reviewLetters.filter((l) => (l.rating || 0) >= 4).length;
  const satisfactionRate =
    totalReviews > 0 ? `${Math.round((positiveReviews / totalReviews) * 100)}%` : '0%';

  const ideaLettersCount = letters.filter((l) => l.category === 'idea').length;

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* ================= HEADER SECTION ================= */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
          🏠 Trang Chủ / ✉️ Nơi Gửi Thư & Đóng Góp Ý Kiến
        </p>

        {/* Highlight pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-black uppercase tracking-wider shadow-xs">
          <span>💖 HÒM THƯ BỒ CÂU & TRẠM GÓP Ý NGỌT NGÀO 🪄</span>
        </div>

        {/* Big Page Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Trao Gửi Mật Ngọt, Góp Ý Buồng Giam & Thả Ý Tưởng Tù Nhân
        </h1>

        {/* Page Subtitle */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          Mỗi cánh thư gửi đến là một chiếc chìa khóa hoa hồng mở rộng thế giới giam giữ si mê. Hãy
          giãi bày cảm xúc thực thụ hoặc cùng chúng mình chấp bút dựng nên những số phận tù nhân mới!
        </p>

        {/* 3 Main Tabs Center Navigation */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('review')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'review'
                ? 'bg-rose-900 text-white shadow-md shadow-rose-900/30 ring-2 ring-rose-400/40'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-rose-200 dark:border-slate-700 hover:border-rose-400'
            }`}
          >
            <span>🌸</span>
            <span>Đánh Giá Web & Cảm Nhận</span>
            <span className="text-[10px] opacity-80 font-normal hidden sm:inline">(Công khai)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('idea')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'idea'
                ? 'bg-rose-900 text-white shadow-md shadow-rose-900/30 ring-2 ring-rose-400/40'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-rose-200 dark:border-slate-700 hover:border-rose-400'
            }`}
          >
            <span>🔒</span>
            <span>Gửi Ý Tưởng Phạm Nhân Mới</span>
            <span className="text-[10px] text-amber-300 font-normal hidden sm:inline">(Chỉ Quản Trị Viên)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('love')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'love'
                ? 'bg-rose-900 text-white shadow-md shadow-rose-900/30 ring-2 ring-rose-400/40'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-rose-200 dark:border-slate-700 hover:border-rose-400'
            }`}
          >
            <span>💌</span>
            <span>Thư Thăm Nuôi & Lời Nhắn</span>
            <span className="text-[10px] opacity-80 font-normal hidden sm:inline">(Công khai)</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-pink-500/10 to-sky-500/10 border border-emerald-300 dark:border-emerald-700 text-center space-y-1 animate-fadeIn">
          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Đã đóng dấu sáp & trao gửi lá thư thành công!
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'idea'
              ? 'Ý tưởng phạm nhân đã được niêm phong cơ mật và gửi riêng cho Quản Trị Viên xem xét.'
              : 'Lá thư của nàng đã được dán lên Bức Tường Thư và chuyển tới Ban Quản Trị Trại Giam.'}
          </p>
        </div>
      )}

      {/* ================= TWO COLUMN PRIMARY LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* ================= LEFT COLUMN: FORM (7 COLS) ================= */}
        <div
          ref={formRef}
          className={`lg:col-span-7 rounded-3xl p-5 sm:p-7 border shadow-xl relative overflow-hidden transition-all ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 text-slate-100'
              : 'bg-white/95 border-rose-100 shadow-rose-100/40 text-slate-800'
          }`}
        >
          {/* Form Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-300/40 shrink-0">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-rose-500">
                  {activeTab === 'review'
                    ? 'PHIẾU CẢM NHẬN TRẠI GIAM'
                    : activeTab === 'idea'
                    ? 'BẢN ĐỀ XUẤT PHẠM NHÂN MỚI'
                    : 'BẢN THƯ THĂM NUÔI NỒNG NÀN'}
                </p>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {activeTab === 'review'
                    ? 'Đánh Giá Trải Nghiệm Của Nàng'
                    : activeTab === 'idea'
                    ? 'Thả Ý Tưởng Phạm Nhân Mới'
                    : 'Gửi Thư Thăm Nuôi & Lời Nhắn'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeTab === 'idea' ? (
                <div className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chỉ Quản Trị Viên Đọc Được</span>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Mọi Người Đều Đọc Được</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleFormSubmit} className="pt-5 space-y-5">
            {/* ================= TAB 1: REVIEW WEB & FEELINGS ================= */}
            {activeTab === 'review' && (
              <>
                {/* 1. Mức Độ Si Mê Đối Với Web (Stars) */}
                <div className="space-y-1.5 p-4 rounded-2xl bg-rose-50/40 dark:bg-slate-800/40 border border-rose-100 dark:border-slate-800">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                        Mức Độ Si Mê Đối Với Web
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Chọn mức độ rung động trái tim của Quản Ngục
                      </p>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 text-rose-500 dark:text-rose-400 text-xs font-black shadow-xs">
                      {RATING_LABELS[hoverRating ?? rating]}
                    </div>
                  </div>

                  {/* Star row */}
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating ?? rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                              isFilled
                                ? 'fill-rose-500 text-rose-500 drop-shadow-sm'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Khía Cạnh Nàng Muốn Khen Ngợi / Góp Ý */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                    Khía Cạnh Nàng Muốn Khen Ngợi / Góp Ý
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_OPTIONS.map((aspect) => {
                      const isSelected = selectedAspects.includes(aspect);
                      return (
                        <button
                          key={aspect}
                          type="button"
                          onClick={() => toggleAspect(aspect)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                              isSelected
                                ? 'bg-white text-rose-900 font-black'
                                : 'border border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected ? '✓' : ''}
                          </span>
                          <span>{aspect}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Phạm Nhân Nhận Đánh Giá */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                    Phạm Nhân Nhận Đánh Giá
                  </label>
                  <select
                    value={reviewTargetPrisoner}
                    onChange={(e) => setReviewTargetPrisoner(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:border-rose-500 outline-none text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="Toàn Bộ Trại Giam">Toàn Bộ Trại Giam & Hệ Thống</option>
                    {characters.length > 0 ? (
                      characters.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.prisonId})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        (Chưa có phạm nhân nào trong trại giam)
                      </option>
                    )}
                  </select>
                  {characters.length === 0 && (
                    <p className="text-[11px] text-slate-400">
                      Trại giam hiện chưa có phạm nhân nào. Đánh giá sẽ được tính chung cho toàn bộ trại giam.
                    </p>
                  )}
                </div>

                {/* 3. Tiêu Đề Thư Cảm Nhận */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                    Tiêu Đề Bức Thư Cảm Nhận
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ví dụ: Không gian và âm thanh trại giam khiến đêm của tôi xao xuyến..."
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm focus:border-rose-500 outline-none transition-colors"
                    />
                    <Feather className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Nội Dung Thư Đóng Góp Chi Tiết */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                      Nội Dung Thư Đóng Góp Chi Tiết *
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Khung thư trong chế độ phong cách Vintage
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Gửi những lời nhắn nhủ thân thương tới Đội Ngũ Quản Ngục... Tính năng nào nàng muốn mở rộng thêm? Hay có cảnh trớ trêu nào khiến em phải quay trở chuyện cùng tù nhân của nàng không?"
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-[#fffafb] dark:bg-slate-900 text-xs sm:text-sm leading-relaxed focus:border-rose-500 outline-none transition-colors resize-y font-serif italic text-slate-800 dark:text-slate-200"
                  />
                </div>
              </>
            )}

            {/* ================= TAB 2: IDEA PROPOSAL ================= */}
            {activeTab === 'idea' && (
              <>
                {/* Confidential Security Banner for Idea proposals */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-black text-amber-800 dark:text-amber-200 flex items-center gap-1.5 flex-wrap">
                      <span>CHẾ ĐỘ CƠ MẬT: CHỈ QUẢN TRỊ VIÊN ĐỌC ĐƯỢC</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-200/70 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold">
                        Bảo Vệ Kịch Bản
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      Ý tưởng phạm nhân nàng gửi sẽ được niêm phong cơ mật, <strong>chỉ Quản Trị Viên mới có quyền đọc</strong> để xét duyệt và hiện thực hóa thành nhân vật chính thức trong trại giam. Người xem thông thường sẽ không đọc được.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                      Tên Nhân Vật Ý Tưởng *
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Cố Tử Thần, Thẩm Dạ..."
                      value={ideaCharName}
                      onChange={(e) => setIdeaCharName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                      Phân Khu Nhà Giam Phù Hợp
                    </label>
                    <select
                      value={ideaZone}
                      onChange={(e) => setIdeaZone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:border-rose-500 outline-none"
                    >
                      {PRISON_ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Genre selection chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                    Thiết Lập Hình Tượng & Thể Loại (chọn nhiều):
                  </label>
                  <div className="max-h-28 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap gap-1.5">
                    {allGenres.map((g) => {
                      const isSel = ideaGenres.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleIdeaGenre(g)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            isSel
                              ? 'bg-rose-900 text-white font-bold'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-rose-400'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cốt truyện đề xuất */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                    Tội Danh Ngọt Ngào & Cốt Truyện Giam Cầm *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Mô tả lý do vì sao chàng bị bắt giam, xuất thân và sự cuồng si đối với nàng quản ngục..."
                    value={ideaBackstory}
                    onChange={(e) => setIdeaBackstory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-[#fffafb] dark:bg-slate-900 text-xs sm:text-sm leading-relaxed focus:border-rose-500 outline-none italic font-serif"
                  />
                </div>

                {/* Câu thoại mở đầu */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                    Lời Thoại Mở Đầu Khi Nàng Bước Vào (First Message)
                  </label>
                  <textarea
                    rows={2}
                    placeholder='VD: "Chị ơi... buồng giam này lạnh lắm, ôm em một chút được không?"'
                    value={ideaFirstMessage}
                    onChange={(e) => setIdeaFirstMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs focus:border-rose-500 outline-none italic font-serif"
                  />
                </div>
              </>
            )}

            {/* ================= TAB 3: LOVE LETTER TO PRISONERS ================= */}
            {activeTab === 'love' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                      Chọn Phạm Nhân Nhận Thư Thăm Nuôi
                    </label>
                    <select
                      value={targetPrisonerName}
                      onChange={(e) => setTargetPrisonerName(e.target.value)}
                      disabled={characters.length === 0}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:border-rose-500 outline-none font-bold text-rose-600 dark:text-rose-400 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {characters.length > 0 ? (
                        characters.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.prisonId})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          (Chưa có phạm nhân nào trong trại giam)
                        </option>
                      )}
                    </select>
                    {characters.length === 0 && (
                      <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                        ⚠️ Chưa có phạm nhân nào trong trại giam. Quản trị viên cần thêm phạm nhân mới trước.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                      Quà Tặng Thăm Nuôi Kèm Theo
                    </label>
                    <select
                      value={loveGift}
                      onChange={(e) => setLoveGift(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:border-rose-500 outline-none"
                    >
                      <option value="🍬 Hộp Kẹo Trái Tim">🍬 Hộp Kẹo Trái Tim</option>
                      <option value="🌹 Nhành Hoa Hồng Gai">🌹 Nhành Hoa Hồng Gai</option>
                      <option value="🧣 Khăn Tay Ấm Áp">🧣 Khăn Tay Ấm Áp</option>
                      <option value="🗝️ Chìa Khóa Vàng Bí Mật">🗝️ Chìa Khóa Vàng Bí Mật</option>
                    </select>
                  </div>
                </div>

                {/* Sweet Presets Quick-Picks */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 block">
                    Gợi ý lời nhắn ngọt ngào (bấm để chọn nhanh):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SWEET_LOVE_PRESETS.map((pst, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLoveContent(pst)}
                        className="px-2.5 py-1 rounded-xl text-xs bg-rose-50 dark:bg-slate-800 border border-rose-200 dark:border-slate-700 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer text-slate-700 dark:text-slate-300 truncate max-w-full"
                      >
                        {pst}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nội dung thư thăm nuôi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                    Lời Nhắn Nhủ Thăm Nuôi Gửi Chàng *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Viết những lời dỗ dành, trêu chọc hoặc nhắc nhở chàng cải tạo thật tốt..."
                    value={loveContent}
                    onChange={(e) => setLoveContent(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-[#fffafb] dark:bg-slate-900 text-xs sm:text-sm leading-relaxed focus:border-rose-500 outline-none font-serif italic text-slate-800 dark:text-slate-200"
                  />
                </div>
              </>
            )}

            {/* ================= COMMON FIELDS: SENDER & ANONYMOUS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                  Danh Xưng Cai Ngục Của Nàng
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  disabled={isAnonymous}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm outline-none transition-colors ${
                    isAnonymous
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:border-rose-500'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 accent-rose-500 cursor-pointer"
                  />
                  <span>Gửi dưới chế độ Ẩn Danh (Giấu ID và số buồng giam trên Bức Tường Thư)</span>
                </label>
              </div>
            </div>

            {/* ================= COMMON FIELDS: WAX SEAL STAMP SELECTOR ================= */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                Chọn Con Dấu Sáp Niêm Phong Bức Thư!
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {WAX_STAMPS.map((stamp) => {
                  const isSelected = selectedStamp.id === stamp.id;
                  return (
                    <button
                      key={stamp.id}
                      type="button"
                      onClick={() => setSelectedStamp(stamp)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-400/30 shadow-sm'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stamp.color} text-white text-lg flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        {stamp.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                          {stamp.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{stamp.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================= FORM FOOTER & CTA BUTTON ================= */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 text-center sm:text-left">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Thư gửi đi sẽ được duyệt xuất hiện trong 15 phút</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-rose-900 via-rose-800 to-indigo-900 hover:opacity-95 shadow-lg shadow-rose-950/30 transition-all flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <span>⚔️</span>
                <span>
                  {activeTab === 'review'
                    ? 'Đóng Dấu Sáp & Gửi Đánh Giá ✨'
                    : activeTab === 'idea'
                    ? 'Đóng Dấu Sáp & Gửi Ý Tưởng Nhân Vật ✨'
                    : 'Dán Niêm Phong & Gửi Vào Buồng Giam ✨'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* ================= RIGHT COLUMN: STATS & LETTER WALL (5 COLS) ================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* TOP CARD: ĐỘ HÀI LÒNG QUẢN NGỤC */}
          <div
            className={`p-6 rounded-3xl border shadow-lg space-y-5 transition-all ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                : 'bg-white border-rose-100/80 shadow-rose-100/30 text-slate-800'
            }`}
          >
            {/* Top Tag & Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                ĐỘ HÀI LÒNG QUẢN NGỤC
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-500">
                ⭐ Xu Hướng Yêu Thích
              </span>
            </div>

            {/* Score & Stars */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {avgRatingDisplay}
              </span>
              <span className="text-lg font-bold text-slate-400">/ 5.0</span>
              <div className="flex items-center gap-1 pl-2">
                {[1, 2, 3, 4, 5].map((s) => {
                  const isFilled = avgRatingNum >= s;
                  return (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        isFilled
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 -mt-3">
              {totalReviews === 0
                ? 'Chưa có đánh giá nào (0 lượt thư gửi về)'
                : `Dựa trên ${totalReviews.toLocaleString('vi-VN')} lượt thư đánh giá`}
            </p>

            {/* Breakdown bars */}
            <div className="space-y-2 pt-1 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-5 text-right text-[11px]">5★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-900 transition-all duration-500"
                    style={{ width: `${fiveStarPct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px]">{fiveStarPct}%</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 text-right text-[11px]">4★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-400 transition-all duration-500"
                    style={{ width: `${fourStarPct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px]">{fourStarPct}%</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 text-right text-[11px]">3★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-200 transition-all duration-500"
                    style={{ width: `${threeStarPct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px]">{threeStarPct}%</span>
              </div>
            </div>

            {/* 2 Bottom Stat Metric Cards */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-slate-800/50 border border-rose-100 dark:border-slate-700 text-center">
                <p className="text-xl font-black text-rose-600 dark:text-rose-400">
                  {satisfactionRate}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Muốn ở lại Ngục hơn</p>
              </div>

              <div className="p-3 rounded-2xl bg-sky-50/50 dark:bg-slate-800/50 border border-sky-100 dark:border-slate-700 text-center">
                <p className="text-xl font-black text-sky-600 dark:text-sky-400">
                  {ideaLettersCount}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Ý tưởng đã đóng góp</p>
              </div>
            </div>
          </div>

          {/* BOTTOM CARD: BỨC TƯỜNG THƯ MỚI NHẤT */}
          <div
            className={`p-6 rounded-3xl border shadow-lg space-y-4 transition-all ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                : 'bg-white border-rose-100/80 shadow-rose-100/30 text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Bức Tường Thư Mới Nhất
                </h3>
              </div>
              <span className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer">
                Xem tất cả ({letters.length})
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 pb-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setLetterFilter('all')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  letterFilter === 'all'
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                Tất cả ({letters.length})
              </button>
              <button
                type="button"
                onClick={() => setLetterFilter('review')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  letterFilter === 'review'
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                ⭐ Đánh giá ({letters.filter((l) => l.category === 'review').length})
              </button>
              <button
                type="button"
                onClick={() => setLetterFilter('idea')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  letterFilter === 'idea'
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                💡 Ý tưởng ({letters.filter((l) => l.category === 'idea').length})
              </button>
              <button
                type="button"
                onClick={() => setLetterFilter('love')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  letterFilter === 'love'
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                💌 Thư tình ({letters.filter((l) => l.category === 'love').length})
              </button>
            </div>

            {/* Letters list stream */}
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              {filteredLetters.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-rose-200 dark:border-slate-800 bg-rose-50/20 dark:bg-slate-800/20 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-400 text-2xl shadow-xs">
                    📭
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                      Bức tường thư hiện đang trống
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Chưa có lá thư nào được gửi lên tường thư. Hãy là Quản Ngục đầu tiên gửi gắm đánh giá, ý tưởng hoặc thư thăm nuôi!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-900 hover:bg-rose-800 shadow-sm transition-all cursor-pointer"
                  >
                    <Feather className="w-3.5 h-3.5" />
                    <span>Viết bức thư đầu tiên</span>
                  </button>
                </div>
              ) : (
                filteredLetters.map((letter) => {
                const isReview = letter.category === 'review';
                const isIdea = letter.category === 'idea';
                const isLove = letter.category === 'love';

                return (
                  <div
                    key={letter.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 relative overflow-hidden transition-all hover:border-rose-300"
                  >
                    {/* Header: Avatar, Name, Badge, Time */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-200 font-black text-xs flex items-center justify-center shrink-0">
                          {letter.senderId || letter.senderName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                              {letter.senderName}
                            </span>
                            <span className="text-emerald-500 text-xs">✓</span>
                            {letter.badgeText && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                {letter.badgeText}
                              </span>
                            )}
                            {letter.statusBadge && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                {letter.statusBadge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {formatTimeAgo(letter.createdAt)} • {letter.zoneName || 'Khu Giam Hoa Hồng'}
                          </p>
                        </div>
                      </div>

                      {/* Wax Stamp & Rating */}
                      <div className="text-right shrink-0">
                        {letter.rating ? (
                          <div className="flex items-center gap-0.5 justify-end">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${
                                  s <= (letter.rating || 5)
                                    ? 'fill-rose-500 text-rose-500'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-base">{letter.stamp || '💮'}</span>
                        )}
                      </div>
                    </div>

                    {/* ACCESS CONTROL & CONTENT DISPLAY */}
                    {isIdea && !isAdmin ? (
                      /* LOCKED STATE FOR NON-ADMIN: Only Admin can read ideas */
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200 dark:border-amber-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400">
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>Ý TƯỞNG CƠ MẬT (CHỈ QUẢN TRỊ VIÊN ĐỌC ĐƯỢC)</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            Bảo mật kịch bản
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          Nội dung kịch bản và lời thoại đề xuất của phạm nhân mới này đã được niêm phong cơ mật. Chỉ Quản Trị Viên mới có quyền xem để xét duyệt đưa vào trại giam.
                        </p>
                        {onOpenAdmin && (
                          <button
                            type="button"
                            onClick={onOpenAdmin}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] shadow-xs cursor-pointer transition-colors"
                          >
                            <KeyRound className="w-3 h-3" />
                            <span>Đăng nhập Quản Trị Viên để đọc nội dung</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Idea Title & Subtitle for Admin */}
                        {isIdea && (
                          <div className="space-y-0.5 pt-0.5">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                <span>Ý TƯỞNG NHÂN VẬT CƠ MẬT</span>
                              </p>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                👑 Quản Trị Viên đang xem
                              </span>
                            </div>
                            {letter.subtitle && (
                              <p className="text-xs font-black text-slate-900 dark:text-white">
                                “{letter.subtitle}”
                              </p>
                            )}
                          </div>
                        )}

                        {/* Thư thăm nuôi header info */}
                        {isLove && (
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                              <span>💌 Thư gửi chàng: {letter.targetPrisoner || 'Phạm nhân buồng giam'}</span>
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                              🌐 Công khai (Mọi người đều đọc được)
                            </span>
                          </div>
                        )}

                        {/* Đánh giá web header info */}
                        {isReview && (
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                              <span>🌸 {letter.targetPrisoner ? `Đánh giá cho: ${letter.targetPrisoner}` : 'Đánh giá Web & Cảm nhận'}</span>
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              🌐 Công khai (Mọi người đều đọc được)
                            </span>
                          </div>
                        )}

                        {/* Content Quote */}
                        <div
                          className={`text-xs leading-relaxed font-serif italic whitespace-pre-line pl-2 border-l-2 ${
                            isIdea
                              ? 'text-amber-900 dark:text-amber-100 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-r-xl'
                              : 'text-slate-700 dark:text-slate-300 border-rose-200 dark:border-rose-900'
                          }`}
                        >
                          “{letter.content}”
                        </div>
                      </>
                    )}

                    {/* Aspects tags if available */}
                    {letter.aspects && letter.aspects.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {letter.aspects.map((asp, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                          >
                            #{asp}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Admin Reply Bubble if present */}
                    {letter.adminReply && (
                      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-700 text-xs space-y-1 mt-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span>{letter.adminReply.author}</span>
                          </span>
                          <span>{letter.adminReply.timeText}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                          {letter.adminReply.message}
                        </p>
                      </div>
                    )}

                    {/* Action footer: Like, comments, share */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => onLikeLetter(letter.id)}
                        className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>{letter.likes} Nàng thả tim</span>
                      </button>

                      <div className="flex items-center gap-3 text-slate-400">
                        {letter.commentsCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{letter.commentsCount} bình luận</span>
                          </span>
                        )}
                        <span className="text-[10px]">{letter.stampName || 'Hoa Hồng Đỏ'}</span>
                      </div>
                    </div>
                  </div>
                );
              }))}
            </div>

            {/* Bottom Invitation Callout */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <span>📖</span>
                <span>Nàng đã viết bức thư của riêng mình chưa?</span>
              </span>
              <button
                type="button"
                onClick={scrollToForm}
                className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
              >
                Viết ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM FEATURE HIGHLIGHT CARDS ================= */}
      <div className="space-y-4 pt-4">
        {/* ROW 1: 2 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Bảo Mật Thư Từ */}
          <div
            className={`p-5 rounded-3xl border flex items-start gap-4 transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                : 'bg-white border-rose-100 shadow-sm text-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black">Bảo Mật Thư Từ</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Tùy chọn ẩn danh 100%, bảo vệ quyền riêng tư tuyệt đối của Quản Ngục.
              </p>
            </div>
          </div>

          {/* Card 2: Đặc Quyền Quà Tặng */}
          <div
            className={`p-5 rounded-3xl border flex items-start gap-4 transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                : 'bg-white border-sky-100 shadow-sm text-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-500 flex items-center justify-center shrink-0 border border-sky-200 dark:border-sky-800">
              <Gift className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black">Đặc Quyền Quà Tặng</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Mỗi góp ý mang tính xây dựng sẽ được tặng mã Quà VIP mở khóa ngoại truyện.
              </p>
            </div>
          </div>
        </div>

        {/* ROW 2: 3 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 3: Thưởng Chìa Khóa Vàng */}
          <div
            className={`p-5 rounded-3xl border flex items-start gap-3.5 transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                : 'bg-rose-50/50 border-rose-100 text-slate-800'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-500 flex items-center justify-center shrink-0 border border-pink-200 dark:border-pink-800">
              <Key className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black">Thưởng Chìa Khóa Vàng</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Tặng ngay 10 Chìa Khóa Bạc khi hoàn tất đóng dấu lá thư đánh giá đầu tiên.
              </p>
            </div>
          </div>

          {/* Card 4: Bảo Mật Buồng Thăm */}
          <div
            className={`p-5 rounded-3xl border flex items-start gap-3.5 transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                : 'bg-sky-50/50 border-sky-100 text-slate-800'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-500 flex items-center justify-center shrink-0 border border-sky-200 dark:border-sky-800">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black">Bảo Mật Buồng Thăm</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Thư thăm nuôi được mã hóa chỉ duy nhất bạn và nhân vật đó đọc được.
              </p>
            </div>
          </div>

          {/* Card 5: Đồng Sáng Tạo Thế Giới */}
          <div
            className={`p-5 rounded-3xl border flex items-start gap-3.5 transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                : 'bg-purple-50/50 border-purple-100 text-slate-800'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-500 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <Globe className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black">Đồng Sáng Tạo Thế Giới</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Mọi ý tưởng được duyệt sẽ được ghi danh Quản Ngục vĩnh viễn trên Thẻ Nhân Vật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for formatting time
function formatTimeAgo(timestamp: number): string {
  const diffSecs = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSecs < 60) return 'Vừa xong';
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins} phút trước`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}
