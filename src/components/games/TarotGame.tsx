import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  Moon,
  Sun,
  Eye,
  Flame,
  Shield,
  Heart,
  Crown,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../../types';

interface TarotGameProps {
  darkMode: boolean;
  onBack: () => void;
  character?: Character | null;
}

interface TarotCard {
  id: number;
  name: string;
  nameVi: string;
  element: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  advice: string;
  icon: string;
}

const TAROT_CARDS: TarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    nameVi: 'Kẻ Khờ Khạo',
    element: 'Khí',
    keywords: ['Khởi đầu mới', 'Phiêu lưu', 'Ngây thơ', 'Tự do'],
    uprightMeaning: 'Một chương mới đầy bất ngờ đang mở ra. Đừng sợ hãi bước vào vùng đất chưa biết.',
    reversedMeaning: 'Hành động liều lĩnh, thiếu cẩn trọng trong các quyết định ngục tù.',
    advice: 'Hãy giữ trái tim rộng mở nhưng mắt luôn quan sát xung quanh.',
    icon: '🎭',
  },
  {
    id: 1,
    name: 'The Magician',
    nameVi: 'Nhà Ảo Thuật',
    element: 'Khí',
    keywords: ['Kỹ năng', 'Ý chí', 'Thao túng', 'Hiện thực hóa'],
    uprightMeaning: 'Bạn nắm trong tay mọi công cụ để kiểm soát tình hình và cảm xúc đối phương.',
    reversedMeaning: 'Cạm bẫy, sự dối trá hoặc việc lạm dụng quyền lực quản ngục.',
    advice: 'Tập trung sức mạnh nội tại để định đoạt kết quả mong muốn.',
    icon: '✨',
  },
  {
    id: 2,
    name: 'The High Priestess',
    nameVi: 'Nữ Tư Tế',
    element: 'Nước',
    keywords: ['Trực giác', 'Bí mật', 'Tâm linh', 'Nội tâm'],
    uprightMeaning: 'Bí mật ẩn giấu sau vách tường ngục sắp hé lộ. Tin tưởng vào giác quan thứ sáu của bạn.',
    reversedMeaning: 'Che giấu sự thật, cảm xúc bị đè nén hoặc ảo tưởng.',
    advice: 'Lắng nghe tiếng nói tĩnh lặng bên trong thay vì phán xét bên ngoài.',
    icon: '🔮',
  },
  {
    id: 3,
    name: 'The Empress',
    nameVi: 'Nữ Hoàng',
    element: 'Đất',
    keywords: ['Nuôi dưỡng', 'Sự dồi dào', 'Tình mẫu tử', 'Duyên dáng'],
    uprightMeaning: 'Sự ấm áp và dịu dàng có thể thuần hóa cả những tù nhân bướng bỉnh nhất.',
    reversedMeaning: 'Kiểm soát ngột ngạt hoặc thiếu thốn tình cảm.',
    advice: 'Dùng lòng trắc ẩn để hóa giải căng thẳng trong buồng giam.',
    icon: '👑',
  },
  {
    id: 4,
    name: 'The Emperor',
    nameVi: 'Hoàng Đế',
    element: 'Lửa',
    keywords: ['Quyền uy', 'Kỷ luật', 'Trật tự', 'Sự bảo hộ'],
    uprightMeaning: 'Cần sự cứng rắn và kỷ cương tuyệt đối để duy trì trật tự nhà tù số 07.',
    reversedMeaning: 'Chuyên quyền độc đoán, sự áp chế quá mức gây phản tác dụng.',
    advice: 'Hãy công bằng và nghiêm minh trong mọi phán quyết.',
    icon: '⚔️',
  },
  {
    id: 6,
    name: 'The Lovers',
    nameVi: 'Đôi Tình Nhân',
    element: 'Khí',
    keywords: ['Mối liên kết', 'Lựa chọn', 'Rung động', 'Đồng điệu'],
    uprightMeaning: 'Sợi dây liên kết đặc biệt, một sự rung động không ngờ giữa Quản Ngục và số phận.',
    reversedMeaning: 'Mâu thuẫn nội tâm, chia rẽ hoặc sự phản bội ngấm ngầm.',
    advice: 'Lựa chọn theo nhịp đập trái tim nhưng đừng đánh mất lý trí.',
    icon: '💖',
  },
  {
    id: 8,
    name: 'Strength',
    nameVi: 'Sức Mạnh Nội Tại',
    element: 'Lửa',
    keywords: ['Dũng cảm', 'Kiên nhẫn', 'Thuần hóa', 'Bao dung'],
    uprightMeaning: 'Sức mạnh lớn nhất không phải vũ lực, mà là sự kiên định thuần phục được dã thú.',
    reversedMeaning: 'Tự ti, mất kiểm soát cơn giận hoặc bất lực.',
    advice: 'Tiếp cận vấn đề bằng sự thấu hiểu mềm mỏng nhưng kiên định.',
    icon: '🦁',
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    nameVi: 'Vòng Quay Số Phận',
    element: 'Lửa',
    keywords: ['Định mệnh', 'Chuyển biến', 'Cơ hội', 'Chu kỳ'],
    uprightMeaning: 'Bánh xe định mệnh đang xoay vần. Vận may bất ngờ sẽ gõ cửa buồng giam.',
    reversedMeaning: 'Vận rủi tạm thời hoặc sự kháng cự vô ích trước dòng chảy thời gian.',
    advice: 'Mọi thứ đều có chu kỳ của nó, hãy kiên nhẫn đón nhận đổi thay.',
    icon: '🎡',
  },
  {
    id: 13,
    name: 'Death',
    nameVi: 'Cái Chết & Tái Sinh',
    element: 'Nước',
    keywords: ['Kết thúc', 'Tái sinh', 'Buông bỏ', 'Lột xác'],
    uprightMeaning: 'Kết thúc một giai đoạn cũ tăm tối để mở ra một khởi đầu hoàn toàn mới.',
    reversedMeaning: 'Bấu víu quá khứ, sợ hãi thay đổi khiến bạn kẹt trong ngục tối tâm tưởng.',
    advice: 'Hãy can đảm để những thứ đã cũ ra đi.',
    icon: '🥀',
  },
  {
    id: 15,
    name: 'The Devil',
    nameVi: 'Ác Quỷ Quyến Rũ',
    element: 'Đất',
    keywords: ['Cám dỗ', 'Ám ảnh', 'Xiềng xích', 'Bản năng'],
    uprightMeaning: 'Một sức hút khó cưỡng hoặc sự trói buộc tâm lý mãnh liệt. Cẩn thận chiếc bẫy ngọt ngào.',
    reversedMeaning: 'Tự giải thoát khỏi xiềng xích, nhìn thấu những cám dỗ ảo ảnh.',
    advice: 'Nhận diện điểm yếu của bản thân trước khi bị đối phương khai thác.',
    icon: '⛓️',
  },
  {
    id: 16,
    name: 'The Tower',
    nameVi: 'Tòa Tháp Đổ',
    element: 'Lửa',
    keywords: ['Biến động bất ngờ', 'Sụp đổ', 'Thức tỉnh', 'Giải phóng'],
    uprightMeaning: 'Một cú sốc hoặc sự thật phơi bày làm sụp đổ bức tường ngăn cách bấy lâu.',
    reversedMeaning: 'Tránh né sự thật không thể tránh, thảm họa bị trì hoãn.',
    advice: 'Chấp nhận đổ vỡ để xây dựng lại một nền móng chân thật hơn.',
    icon: '⚡',
  },
  {
    id: 17,
    name: 'The Star',
    nameVi: 'Ngôi Sao Hi Vọng',
    element: 'Khí',
    keywords: ['Hi vọng', 'Chữa lành', 'Ánh sáng', 'Bình yên'],
    uprightMeaning: 'Ánh sáng le lói dẫn lối qua đêm đen ngục tù. Sự bình an và chữa lành tâm hồn.',
    reversedMeaning: 'Tuyệt vọng tạm thời, mất niềm tin vào tương lai.',
    advice: 'Hãy giữ vững niềm tin, những điều kỳ diệu sắp xuất hiện.',
    icon: '⭐',
  },
  {
    id: 18,
    name: 'The Moon',
    nameVi: 'Mặt Trăng Huyền Bí',
    element: 'Nước',
    keywords: ['Ảo ảnh', 'Nỗi sợ', 'Bất an', 'Mặt khuất'],
    uprightMeaning: 'Cảm giác mông lung, những hoài nghi chưa có lời giải đáp trong buồng giam.',
    reversedMeaning: 'Bức màn bí mật dần vén lên, giải tỏa nỗi sợ hãi vô căn cứ.',
    advice: 'Đừng vội tin vào những gì mắt thấy trong bóng tối, hãy chờ ánh bình minh.',
    icon: '🌙',
  },
  {
    id: 19,
    name: 'The Sun',
    nameVi: 'Mặt Trời Rực Rỡ',
    element: 'Lửa',
    keywords: ['Thành công', 'Niềm vui', 'Rõ ràng', 'Năng lượng tích cực'],
    uprightMeaning: 'Ánh hào quang xua tan mọi u ám. Niềm vui và tự do tràn ngập không gian.',
    reversedMeaning: 'Niềm vui bị trì hoãn một chút hoặc sự lạc quan quá trớn.',
    advice: 'Tận hưởng khoảnh khắc ấm áp và tỏa sáng rực rỡ.',
    icon: '☀️',
  },
];

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionName: string;
  isFlipped: boolean;
}

export const TarotGame: React.FC<TarotGameProps> = ({ darkMode, onBack }) => {
  const [spreadMode, setSpreadMode] = useState<'single' | 'three'>('three');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const drawSpread = () => {
    setIsShuffling(true);
    setDrawnCards([]);
    setActiveCardIndex(null);

    setTimeout(() => {
      // Pick random cards
      const count = spreadMode === 'single' ? 1 : 3;
      const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      const positions =
        count === 1
          ? ['Thông Điệp Vận Mệnh Hôm Nay']
          : ['Quá Khứ (Gốc Rễ Vụ Án)', 'Hiện Tại (Tâm Lý Đối Đầu)', 'Tương Lai (Kết Cục Ngục Tối)'];

      const cards: DrawnCard[] = selected.map((card, idx) => ({
        card,
        isReversed: Math.random() < 0.25, // 25% chance of reversed
        positionName: positions[idx],
        isFlipped: false,
      }));

      setDrawnCards(cards);
      setIsShuffling(false);
    }, 600);
  };

  const flipCard = (index: number) => {
    setDrawnCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c))
    );
    setActiveCardIndex(index);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              : 'bg-white border-rose-200 text-slate-700 hover:bg-rose-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-rose-500" />
          <span>Về Khu Trò Chơi</span>
        </button>

        <div className="px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Chưa có nhân vật nào để bói cùng • Bói quẻ vận mệnh Quản Ngục & Nhà Tù</span>
        </div>
      </div>

      {/* Main Banner */}
      <div
        className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
          darkMode
            ? 'bg-slate-900/95 border-purple-900/50'
            : 'bg-gradient-to-br from-purple-50/70 via-white to-pink-50/70 border-purple-100'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-purple-500/30">
              🔮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  BÓI BÀI TAROT NGỤC TỐI
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-500">
                  Huyền Bí • Tiên Tri
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lật mở các lá bài định mệnh để dự đoán số phận, tâm lý và những bí ẩn chưa hé lộ
              </p>
            </div>
          </div>

          {/* Spread selector & Shuffle button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSpreadMode('three');
                  setDrawnCards([]);
                }}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  spreadMode === 'three'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Trải 3 Lá (Quá Khứ - Hiện Tại - Tương Lai)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpreadMode('single');
                  setDrawnCards([]);
                }}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  spreadMode === 'single'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1 Lá Vận Mệnh
              </button>
            </div>

            <button
              type="button"
              onClick={drawSpread}
              disabled={isShuffling}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black shadow-lg shadow-purple-500/25 hover:from-purple-700 hover:to-indigo-700 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isShuffling ? 'Đang Xáo Bài...' : 'Rút Thẻ Bài Định Mệnh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards Table Area */}
      {drawnCards.length === 0 ? (
        <div
          className={`p-12 rounded-3xl border text-center shadow-lg flex flex-col items-center justify-center space-y-4 ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-purple-100'
          }`}
        >
          <div className="w-20 h-28 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 border-2 border-purple-500/40 flex items-center justify-center shadow-xl rotate-3 hover:rotate-0 transition-transform">
            <span className="text-3xl">✨</span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              BỘ BÀI TAROT ĐÃ ĐƯỢC THANH TẨY
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              Bấm nút <strong>"Rút Thẻ Bài Định Mệnh"</strong> ở trên để xáo bài và lật mở quẻ bói số phận ngục tối.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 justify-center">
            {drawnCards.map((drawn, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-3">
                <span className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  {drawn.positionName}
                </span>

                {/* Card Container with Flip */}
                <div
                  onClick={() => !drawn.isFlipped && flipCard(idx)}
                  className={`w-48 h-72 rounded-2xl cursor-pointer transition-all duration-500 relative select-none transform hover:-translate-y-2 ${
                    drawn.isFlipped ? 'shadow-2xl shadow-purple-500/20' : 'hover:shadow-lg'
                  }`}
                  style={{ perspective: '1000px' }}
                >
                  {/* Card Back (Unflipped) */}
                  {!drawn.isFlipped ? (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-400/40 p-3 flex flex-col items-center justify-between shadow-xl">
                      <div className="w-full flex justify-between text-purple-300/40 text-[10px]">
                        <span>✦</span>
                        <span>✦</span>
                      </div>
                      <div className="w-20 h-20 rounded-full border border-dashed border-purple-400/50 flex flex-col items-center justify-center text-purple-300">
                        <Moon className="w-7 h-7 text-purple-400 animate-pulse" />
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-widest">
                          CHẠM ĐỂ MỞ
                        </span>
                      </div>
                      <div className="w-full flex justify-between text-purple-300/40 text-[10px]">
                        <span>✦</span>
                        <span>✦</span>
                      </div>
                    </div>
                  ) : (
                    /* Card Front (Flipped) */
                    <div
                      onClick={() => setActiveCardIndex(idx)}
                      className={`w-full h-full rounded-2xl border-2 p-3.5 flex flex-col justify-between transition-all ${
                        activeCardIndex === idx
                          ? 'border-purple-500 ring-2 ring-purple-500/30'
                          : 'border-slate-300 dark:border-purple-800'
                      } ${
                        darkMode
                          ? 'bg-gradient-to-b from-slate-900 to-purple-950/80 text-white'
                          : 'bg-gradient-to-b from-white to-purple-50/80 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[10px] text-purple-500 font-bold">
                          NO. {drawn.card.id}
                        </span>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            drawn.isReversed
                              ? 'bg-rose-500/20 text-rose-500'
                              : 'bg-emerald-500/20 text-emerald-500'
                          }`}
                        >
                          {drawn.isReversed ? 'Lá Ngược' : 'Lá Xuôi'}
                        </span>
                      </div>

                      <div className="flex flex-col items-center text-center my-auto">
                        <div className="text-4xl mb-2">{drawn.card.icon}</div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                          {drawn.card.nameVi}
                        </h4>
                        <div className="text-[10px] text-purple-500 font-bold uppercase tracking-wider">
                          {drawn.card.name}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-center pt-2 border-t border-purple-500/20">
                        {drawn.card.keywords.slice(0, 2).map((kw, k) => (
                          <span
                            key={k}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!drawn.isFlipped && (
                  <button
                    type="button"
                    onClick={() => flipCard(idx)}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lật bài</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active Card Interpretation Box */}
          {activeCardIndex !== null && drawnCards[activeCardIndex]?.isFlipped && (
            <div
              className={`p-6 rounded-3xl border shadow-xl space-y-3 animate-fadeIn ${
                darkMode
                  ? 'bg-slate-900/90 border-purple-900/60'
                  : 'bg-white border-purple-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{drawnCards[activeCardIndex].card.icon}</span>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{drawnCards[activeCardIndex].card.nameVi}</span>
                    <span className="text-xs font-normal text-slate-400">
                      ({drawnCards[activeCardIndex].card.name})
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        drawnCards[activeCardIndex].isReversed
                          ? 'bg-rose-500/20 text-rose-500'
                          : 'bg-emerald-500/20 text-emerald-500'
                      }`}
                    >
                      {drawnCards[activeCardIndex].isReversed ? 'Ý Nghĩa Ngược' : 'Ý Nghĩa Xuôi'}
                    </span>
                  </h4>
                  <div className="text-xs text-purple-500 font-medium">
                    Vị Trí: {drawnCards[activeCardIndex].positionName}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/15 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {drawnCards[activeCardIndex].isReversed
                  ? drawnCards[activeCardIndex].card.reversedMeaning
                  : drawnCards[activeCardIndex].card.uprightMeaning}
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Lời khuyên dành cho Quản Ngục:</strong>{' '}
                  {drawnCards[activeCardIndex].card.advice}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
