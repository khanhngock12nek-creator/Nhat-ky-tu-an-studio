import React, { useState } from 'react';
import { Heart, MessageSquare, ExternalLink, Sparkles, BookOpen, Send, X, Smile, Trash2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenDetail: (character: Character) => void;
  onSendLove?: (characterId: string, senderName: string, message: string) => void;
  darkMode: boolean;
  isDeleteMode?: boolean;
  isSelectedForDelete?: boolean;
  onToggleSelectForDelete?: (id: string) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

const SWEET_PRESETS = [
  'Ngoan ngoãn trong phòng giam đợi em nhé! 💕',
  'Hôm nay em ghé thăm chồng nhỏ đây, nhớ anh lắm! ✨',
  'Chồng nhỏ cố gắng thụ án tốt nha, em sẽ sớm đón anh về! 🌸',
  'Dù anh có mang tội gì thì em cũng rước anh về nuôi! 💖',
  'Đừng buồn nha, em luôn ở bên cạnh anh! 🧸',
];

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onSendLove,
  darkMode,
  isDeleteMode = false,
  isSelectedForDelete = false,
  onToggleSelectForDelete,
  onDelete,
}) => {
  const [showLoveModal, setShowLoveModal] = useState(false);
  const [loveSender, setLoveSender] = useState('');
  const [loveMessage, setLoveMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleCardClick = () => {
    if (isDeleteMode && onToggleSelectForDelete) {
      onToggleSelectForDelete(character.id);
    } else {
      onOpenDetail(character);
    }
  };

  const handleOpenLove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLoveModal(true);
    setSentSuccess(false);
  };

  const handleSendLoveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loveMessage.trim()) return;

    if (onSendLove) {
      onSendLove(character.id, loveSender, loveMessage);
    }

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fde047'],
      });
    } catch {
      // ignore
    }

    setSentSuccess(true);
    setTimeout(() => {
      setShowLoveModal(false);
      setLoveMessage('');
      setSentSuccess(false);
    }, 1500);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col overflow-hidden ${
          isSelectedForDelete
            ? 'ring-4 ring-rose-500 border-rose-500 shadow-xl shadow-rose-500/20 bg-rose-50/10'
            : darkMode
            ? 'bg-slate-900/80 border-slate-800 hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-950/40 text-slate-100'
            : 'bg-sky-50/90 border-sky-200 hover:border-sky-200 hover:shadow-xl hover:shadow-pink-200/50 text-slate-900'
        }`}
      >
        {/* Top Avatar Banner */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {character.avatarUrl ? (
            <img
              src={character.avatarUrl}
              alt={character.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${
                character.avatarGradient || 'from-pink-400 via-rose-300 to-sky-300'
              } flex items-center justify-center relative p-6`}
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-sky-50/30 backdrop-blur-md border border-white/40 flex items-center justify-center text-2xl font-black text-white shadow-lg mb-2">
                  {character.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-white/90 tracking-widest uppercase">
                  {character.prisonId || '#000'}
                </span>
              </div>
            </div>
          )}

          {/* Prison ID & Zone Tag */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap max-w-[70%]">
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-black tracking-wider bg-slate-900/75 text-white backdrop-blur-md border border-white/20 shadow-sm">
              {character.prisonId || '#000'}
            </span>
            {character.zone && (
              <span className={`px-2 py-0.5 rounded-xl text-[10px] font-bold backdrop-blur-md shadow-sm border ${
                character.zone === 'Phòng Giam Lạnh'
                  ? 'bg-sky-950/80 text-sky-200 border-sky-400/40'
                  : character.zone === 'Phòng Giam Ấm'
                  ? 'bg-amber-950/80 text-amber-200 border-amber-400/40'
                  : 'bg-emerald-950/80 text-emerald-200 border-emerald-400/40'
              }`}>
                {character.zone}
              </span>
            )}
          </div>

          {/* Select Mode Checkbox Indicator */}
          {isDeleteMode ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleSelectForDelete) onToggleSelectForDelete(character.id);
              }}
              className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-2xl flex items-center justify-center font-black transition-all shadow-md cursor-pointer ${
                isSelectedForDelete
                  ? 'bg-rose-600 text-white scale-110 shadow-rose-500/50 ring-2 ring-white'
                  : 'bg-sky-50/90 dark:bg-slate-900/90 text-slate-400 border border-sky-200 dark:border-slate-700 hover:text-rose-500'
              }`}
              title={isSelectedForDelete ? 'Bỏ chọn' : 'Chọn nhân vật này để xóa'}
            >
              {isSelectedForDelete ? (
                <Check className="w-5 h-5 stroke-[3]" />
              ) : (
                <span className="w-4 h-4 rounded-md border-2 border-slate-400 dark:border-slate-500" />
              )}
            </div>
          ) : (
            /* Action Buttons (Favorite & Quick Delete) */
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(character.id, e);
                  }}
                  title="Xóa nhân vật (Bấm xóa luôn)"
                  className="p-2.5 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer bg-sky-50/80 dark:bg-slate-900/80 text-slate-400 hover:text-white hover:bg-rose-600 hover:scale-105 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Favorite Heart Button */}
              <button
                type="button"
                onClick={(e) => onToggleFavorite(character.id, e)}
                title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500 text-white scale-110 shadow-rose-500/40'
                    : 'bg-sky-50/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500 hover:scale-105'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          )}

          {/* Status Badge */}
          {character.status && (
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <span className="inline-block max-w-full truncate text-[11px] font-medium px-2.5 py-1 rounded-lg bg-black/50 text-white backdrop-blur-md border border-white/10">
                🔒 {character.status}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Tên nhân vật & Likes */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold tracking-tight truncate group-hover:text-pink-500 transition-colors">
              {character.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-rose-500 shrink-0">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>{character.likes} tim</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {character.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                  darkMode
                    ? 'bg-slate-800 text-pink-300'
                    : 'bg-pink-50 text-pink-700 border border-sky-200'
                }`}
              >
                #{genre}
              </span>
            ))}
          </div>

          {/* Backstory (Cốt truyện) */}
          <div className="mb-2 flex-1">
            <p
              className={`text-xs line-clamp-3 leading-relaxed ${
                darkMode ? 'text-slate-300' : 'text-slate-900'
              }`}
            >
              {character.backstory}
            </p>
          </div>

          {/* Chỉ số thụ án & trói buộc xuống dưới */}
          <div className="grid grid-cols-2 gap-1.5 mb-2.5 pt-2 border-t border-sky-200 dark:border-slate-800/80 text-[10px] font-bold">
            <span className="truncate px-2 py-1 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-sky-200 dark:border-rose-900/40" title={character.possession || 'Chiếm Hữu Tuyệt Đối'}>
              🔒 {character.possession || 'Chiếm Hữu Tuyệt Đối'}
            </span>
            <span className="truncate px-2 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-300 border border-sky-200 dark:border-slate-700" title={character.sentenceTerm || character.crime || 'Án Chung Thân'}>
              ⛓️ {character.sentenceTerm || character.crime || 'Án Chung Thân'}
            </span>
            <div className="flex items-center justify-between px-2 py-0.5 rounded-lg bg-pink-50/60 dark:bg-slate-800/60 text-pink-600 dark:text-pink-400">
              <span>🛡️ TT:</span>
              <span className="font-black">{character.loyalty ?? 99}%</span>
            </div>
            <div className="flex items-center justify-between px-2 py-0.5 rounded-lg bg-amber-50/60 dark:bg-slate-800/60 text-amber-600 dark:text-amber-400">
              <span>⚠️ NH:</span>
              <span className="font-black">{character.danger ?? 50}%</span>
            </div>
          </div>

          {/* Button "Xem chi tiết về nhân vật" */}
          <div className="pt-2 border-t border-sky-200 dark:border-slate-800/80 flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(character);
              }}
              className="flex-1 text-xs font-bold py-2 px-3 rounded-xl bg-pink-100/70 hover:bg-pink-200/80 dark:bg-pink-950/60 dark:hover:bg-pink-900/60 text-pink-700 dark:text-pink-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Xem chi tiết nhân vật</span>
            </button>

            {character.chatLink && (
              <a
                href={character.chatLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-bold py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Vào trò chuyện"
              >
                <span>Trò chuyện</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* =========================================================================
              DƯỚI MỖI THẺ: GỬI LỜI YÊU ĐẾN CHỒNG NHỎ (CORE USER REQUIREMENT)
              "và dưới mỗi thẻ là gửi lời yêu đến chồng nhỏ"
              ========================================================================= */}
          <div className="pt-2 border-t border-dashed border-sky-200/80 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={handleOpenLove}
              className="w-full py-2.5 px-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 hover:opacity-95 shadow-md shadow-pink-400/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Gửi lời yêu đến chồng nhỏ</span>
              {(character.loveCount || 0) > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-50/30 text-white font-extrabold">
                  {character.loveCount}
                </span>
              )}
            </button>

            {/* Quick Delete button when in delete mode */}
            {isDeleteMode && onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(character.id, e);
                }}
                className="w-full py-2 px-3 rounded-2xl font-black text-xs text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                title="Bấm là xóa luôn ngay lập tức"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>🗑️ Bấm Xóa Luôn Nhân Vật Này</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* POPUP / MODAL: GỬI LỜI YÊU ĐẾN CHỒNG NHỎ */}
      {showLoveModal && (
        <div
          onClick={() => setShowLoveModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-sky-200 dark:border-pink-500/30 bg-gradient-to-b from-pink-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 relative overflow-hidden"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowLoveModal(false)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer absolute top-4 right-4"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-500/30">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest block">
                  LỜI YÊU THƯƠNG DÀNH RIÊNG CHO
                </span>
                <h3 className="text-xl font-black tracking-tight font-['Quicksand',sans-serif]">
                  Chồng Nhỏ {character.name} ({character.prisonId})
                </h3>
              </div>
            </div>

            {sentSuccess ? (
              <div className="py-8 text-center space-y-2 animate-paper-unfold">
                <div className="text-4xl">💌✨</div>
                <h4 className="text-base font-bold text-pink-500">
                  Đã gửi lời yêu đến {character.name}!
                </h4>
                <p className="text-xs text-slate-900 dark:text-slate-400">
                  Lời yêu thương ngọt ngào của nàng đã được chuyển vào phòng giam của chàng 💕
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendLoveSubmit} className="space-y-4">
                {/* Sender Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-400">
                    Tên người gửi (Nàng xưng là):
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Bé Cưng, Tiểu Thư, Người Thương..."
                    value={loveSender}
                    onChange={(e) => setLoveSender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-pink-500"
                  />
                </div>

                {/* Sweet Preset Suggestions */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Chọn nhanh lời nhắn ngọt ngào:
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {SWEET_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLoveMessage(preset)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-pink-100/70 dark:bg-slate-800 hover:bg-pink-200 text-pink-800 dark:text-pink-300 transition-colors cursor-pointer text-left"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Love Message Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-slate-400">
                    Lời yêu thương nàng muốn gửi gắm:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={`Gửi đôi lời ngọt ngào đến ${character.name}, dặn chàng ngoan ngoãn đợi nàng ghé thăm...`}
                    value={loveMessage}
                    onChange={(e) => setLoveMessage(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-sky-200 dark:border-slate-700 bg-sky-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-pink-500 shadow-inner leading-relaxed"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowLoveModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-900 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-95 shadow-md shadow-pink-400/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi lời yêu ngay</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
