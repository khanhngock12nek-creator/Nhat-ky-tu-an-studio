import React from 'react';
import { Tags, ArrowRight, Sparkles } from 'lucide-react';
import { OFFICIAL_GENRES } from '../data/constants';
import { Character } from '../types';

interface GenreViewProps {
  characters: Character[];
  onSelectGenre: (genre: string) => void;
  darkMode: boolean;
  allGenres?: string[];
}

// Creative descriptions for each genre to make the browse experience delightful
const GENRE_DESCRIPTIONS: Record<string, { desc: string; icon: string }> = {
  'Thanh mai trúc mã': { desc: 'Bên nhau từ thuở ngây ngô, tình cảm ăn sâu vào từng hơi thở.', icon: '🌱' },
  'Thanh xuân vườn trường': { desc: 'Áo trắng sân trường, nụ cười dưới tàng cây và những lời thì thầm e ấp.', icon: '🏫' },
  'Văn nhã bại hoại': { desc: 'Kính gọng vàng nho nhã, cử chỉ lễ độ nhưng ánh mắt chứa đầy dục vọng giam cầm.', icon: '👓' },
  'R18': { desc: 'Tình cảm nồng cháy, tiếp xúc da thịt mê hoặc và những nhịp thở gấp gáp.', icon: '🔥' },
  'R21': { desc: 'Quyến rũ tột đỉnh, ranh giới cấm kỵ và sự chiếm đoạt nghẹt thở.', icon: '💋' },
  'Ngụy côn trùng': { desc: 'Bản năng dã tính, xúc tu mê hoặc cùng sự quấn quýt không rời.', icon: '🦋' },
  'Oan gia': { desc: 'Gặp là cãi cọ, xa là nhớ nhung, miệng chê nhưng lòng sớm đã rung động.', icon: '⚡' },
  'Vừa hận phải yêu': { desc: 'Dằn vặt giữa thù hận và khát khao, muốn đẩy ra nhưng lại siết chặt hơn.', icon: '🥀' },
  'Ngược luyến tàn tâm': { desc: 'Nước mắt rơi trong mưa, đau đớn khắc cốt nhưng không nỡ buông tay.', icon: '💔' },
  'cổ trang': { desc: 'Áo gấm lụa là, giang sơn cẩm tú, hẹn ước ba kiếp dưới trăng hoa.', icon: '🏮' },
  'Game thủ': { desc: 'Đôi bàn tay gõ phím thoăn thoắt, bỏ cả giải đấu thế giới chỉ để dỗ dành nàng.', icon: '🎮' },
  'Ngoài lạnh trong nóng': { desc: 'Khuôn mặt lạnh như băng tuyết nhưng trong tim luôn sôi sục ngọn lửa vì nàng.', icon: '❄️' },
  'Chữa lành': { desc: 'Dịu dàng vỗ về những vết thương lòng, biến mùa đông thành ngày nắng ấm.', icon: '☕' },
  'Nuông chiều': { desc: 'Nâng niu trong lòng bàn tay, muốn sao được trăng, sủng đến tận mây xanh.', icon: '🍬' },
  'Ngọt sủng': { desc: 'Mật ngọt từng câu chữ, ngọt hơn kẹo bông và ngập tràn tình yêu dịu dàng.', icon: '🧁' },
  'Boy phố': { desc: 'Đầu gấu ngổ ngáo, phóng xe bạt mạng nhưng đứng trước mặt nàng liền ngoan như cún.', icon: '🏍️' },
  'Tổng tài': { desc: 'Quyền lực tuyệt đối, vung tiền không tiếc chỉ để đổi lấy một nụ cười của nàng.', icon: '💼' },
  'Cún con nuôi vợ từ bé': { desc: 'Nhỏ thì bám đuôi gọi chị ơi, lớn lên lén khóa cửa phòng giam giữ chị vào lòng.', icon: '🐶' },
  'Chiếm hữu': { desc: 'Ánh mắt nàng chỉ được nhìn tôi, hơi thở của nàng chỉ thuộc về riêng tôi.', icon: '⛓️' },
  'hài hước': { desc: 'Những pha dở khóc dở cười, tình yêu ngập tràn tiếng cười và sự ngốc nghếch đáng yêu.', icon: '😹' },
  'hiện đại': { desc: 'Nhịp sống đô thị, công sở, quán cà phê và những mối tình chân thực sâu lắng.', icon: '🏙️' },
};

export const GenreView: React.FC<GenreViewProps> = ({
  characters,
  onSelectGenre,
  darkMode,
  allGenres = OFFICIAL_GENRES as unknown as string[],
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300">
          <Tags className="w-3.5 h-3.5" />
          <span>DANH MỤC PHÂN LOẠI PHẠM NHÂN</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Các Thể Loại Cốt Truyện
        </h2>
        <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-900'}`}>
          Bấm vào bất kỳ thể loại nào dưới đây để xem ngay danh sách các chàng trai mang thiết lập đó
        </p>
      </div>

      {/* 3 Phân Khu Nhà Giam Showcase */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-400 flex items-center gap-1.5">
          <span>🏛️</span>
          <span>Ba Phân Khu Nhà Giam</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-3xl border transition-all ${
              darkMode
                ? 'bg-sky-950/40 border-sky-800/60 text-slate-100'
                : 'bg-sky-50/90 border-sky-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-300 font-extrabold text-base mb-1.5">
              <span className="text-xl">❄️</span>
              <span>Phòng Giam Lạnh</span>
            </div>
            <p className="text-xs text-slate-900 dark:text-slate-300 leading-relaxed">
              Dành cho những chàng trai mang nét lạnh lùng, kuudere, quý tộc sa ngã, ngoài lạnh trong nóng nhưng si tình sâu sắc.
            </p>
          </div>

          <div
            className={`p-4 rounded-3xl border transition-all ${
              darkMode
                ? 'bg-amber-950/40 border-amber-800/60 text-slate-100'
                : 'bg-amber-50/90 border-sky-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300 font-extrabold text-base mb-1.5">
              <span className="text-xl">☀️</span>
              <span>Phòng Giam Ấm</span>
            </div>
            <p className="text-xs text-slate-900 dark:text-slate-300 leading-relaxed">
              Dành cho những chàng trai ngọt sủng, cún con nuôi vợ từ bé, nuông chiều sủng ái và bám người không rời.
            </p>
          </div>

          <div
            className={`p-4 rounded-3xl border transition-all ${
              darkMode
                ? 'bg-emerald-950/40 border-emerald-800/60 text-slate-100'
                : 'bg-emerald-50/90 border-emerald-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300 font-extrabold text-base mb-1.5">
              <span className="text-xl">🌿</span>
              <span>Phòng Giam Chữa Lành</span>
            </div>
            <p className="text-xs text-slate-900 dark:text-slate-300 leading-relaxed">
              Dành cho những chàng trai dịu dàng, thanh xuân vườn trường, vỗ về mọi vết thương và đem lại sự bình yên trong tim.
            </p>
          </div>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allGenres.map((genre) => {
          const info = GENRE_DESCRIPTIONS[genre] || { desc: 'Thể loại đặc biệt', icon: '✨' };
          const count = characters.filter((c) => c.genres.includes(genre)).length;

          return (
            <div
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`p-5 rounded-3xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col justify-between group ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-pink-500/50 hover:shadow-pink-950/30 text-slate-100'
                  : 'bg-sky-50/80 border-sky-200 hover:border-sky-200 hover:shadow-pink-200/40 text-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 rounded-2xl bg-pink-50 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                    {info.icon}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      count > 0
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count} phạm nhân
                  </span>
                </div>

                <h3 className="text-base font-bold group-hover:text-pink-500 transition-colors mb-1.5">
                  {genre}
                </h3>
                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-slate-900'
                  }`}
                >
                  {info.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-sky-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-pink-500">
                <span>Khám phá thể loại</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
