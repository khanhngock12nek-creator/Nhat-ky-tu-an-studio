import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Heart,
  PlusCircle,
  X,
  Trash2,
  Check,
  CheckSquare,
} from 'lucide-react';
import { Character, SortOption } from '../types';
import { OFFICIAL_GENRES } from '../data/constants';
import { CharacterCard } from './CharacterCard';

interface CharacterListProps {
  characters: Character[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenDetail: (character: Character) => void;
  onOpenAdmin: () => void;
  onSendLove?: (characterId: string, senderName: string, message: string) => void;
  onDeleteCharacter?: (id: string) => void;
  onDeleteMultipleCharacters?: (ids: string[]) => void;
  showOnlyFavorites: boolean;
  onToggleFavoriteFilter: () => void;
  selectedGenreFilter: string | null;
  onSelectGenreFilter: (genre: string | null) => void;
  darkMode: boolean;
  allGenres?: string[];
}

export const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  favorites,
  onToggleFavorite,
  onOpenDetail,
  onOpenAdmin,
  onSendLove,
  onDeleteCharacter,
  onDeleteMultipleCharacters,
  showOnlyFavorites,
  onToggleFavoriteFilter,
  selectedGenreFilter,
  onSelectGenreFilter,
  darkMode,
  allGenres = OFFICIAL_GENRES as unknown as string[],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);

  // Filtered & Sorted Characters
  const filteredCharacters = useMemo(() => {
    return characters
      .filter((char) => {
        // Name search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = char.name.toLowerCase().includes(query);
          const matchPrisonId = char.prisonId.toLowerCase().includes(query);
          const matchGenre = char.genres.some((g) => g.toLowerCase().includes(query));
          if (!matchName && !matchPrisonId && !matchGenre) return false;
        }

        // Genre filter
        if (selectedGenreFilter) {
          if (!char.genres.includes(selectedGenreFilter)) return false;
        }

        // Favorite filter
        if (showOnlyFavorites) {
          if (!favorites.includes(char.id)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'likes') {
          return b.likes - a.likes;
        }
        if (sortBy === 'newest') {
          return b.createdAt - a.createdAt;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'vi');
        }
        return 0;
      });
  }, [characters, searchQuery, selectedGenreFilter, showOnlyFavorites, favorites, sortBy]);

  const handleToggleSelectForDelete = (id: string) => {
    setSelectedForDelete((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredCharacters.map((c) => c.id);
    if (selectedForDelete.length === visibleIds.length) {
      setSelectedForDelete([]);
    } else {
      setSelectedForDelete(visibleIds);
    }
  };

  const handleExecuteBulkDelete = () => {
    if (selectedForDelete.length === 0) return;
    if (onDeleteMultipleCharacters) {
      onDeleteMultipleCharacters(selectedForDelete);
    } else if (onDeleteCharacter) {
      selectedForDelete.forEach((id) => onDeleteCharacter(id));
    }
    setSelectedForDelete([]);
  };

  const handleExecuteSingleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onDeleteCharacter) {
      onDeleteCharacter(id);
    }
    setSelectedForDelete((prev) => prev.filter((item) => item !== id));
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Filter Controls Header */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          darkMode
            ? 'bg-slate-900/75 border-slate-800'
            : 'bg-white/80 border-pink-100 shadow-sm'
        }`}
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm phạm nhân theo tên, mã số, thể loại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs sm:text-sm border outline-none transition-all ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 focus:border-pink-500'
                  : 'bg-pink-50/50 border-pink-200 text-slate-800 focus:border-pink-400 focus:bg-white'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action Controls: Sort By & Quick Delete Mode */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold border outline-none cursor-pointer ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-white border-pink-200 text-slate-700'
                }`}
              >
                <option value="likes">💖 Yêu thích nhất</option>
                <option value="newest">✨ Mới thụ án</option>
                <option value="name">🔤 Tên (A - Z)</option>
              </select>
            </div>

            {/* Quick Select & Delete Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsDeleteMode((prev) => !prev);
                if (isDeleteMode) setSelectedForDelete([]);
              }}
              className={`px-3 py-2 rounded-2xl text-xs font-black border flex items-center gap-1.5 transition-all cursor-pointer ${
                isDeleteMode
                  ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-600/30'
                  : darkMode
                  ? 'bg-slate-800 border-slate-700 text-rose-300 hover:border-rose-500'
                  : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
              }`}
              title="Bật/Tắt chế độ chọn và xóa nhân vật"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleteMode ? 'Đang chọn xóa' : 'Chọn để xóa'}</span>
              {selectedForDelete.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-rose-600 text-[10px] font-black flex items-center justify-center">
                  {selectedForDelete.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Genre Filter Scroll */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => onSelectGenreFilter(null)}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedGenreFilter === null
                ? 'bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-sm'
                : darkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-pink-50 text-slate-600 hover:bg-pink-100'
            }`}
          >
            Tất cả thể loại ({characters.length})
          </button>

          {allGenres.map((genre) => {
            const isSelected = selectedGenreFilter === genre;
            const count = characters.filter((c) => c.genres.includes(genre)).length;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => onSelectGenreFilter(isSelected ? null : genre)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink-500 text-white font-bold shadow-sm'
                    : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-pink-50 text-slate-600 hover:bg-pink-100'
                }`}
              >
                {genre} {count > 0 && <span className="text-[10px] opacity-75">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delete Mode Action Banner */}
      {isDeleteMode && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-rose-600/15 border-2 border-rose-400 dark:border-rose-500/50 flex flex-wrap items-center justify-between gap-3 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md shadow-rose-600/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  Chế Độ Chọn & Xóa Phạm Nhân
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                  Đã chọn: {selectedForDelete.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tích chọn nhân vật cần xóa rồi bấm nút bên cạnh, hoặc bấm nút thùng rác trên từng thẻ là xóa luôn ngay lập tức!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSelectAllVisible}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-all"
            >
              {selectedForDelete.length === filteredCharacters.length && filteredCharacters.length > 0
                ? '✓ Bỏ chọn tất cả'
                : `Chọn tất cả (${filteredCharacters.length})`}
            </button>

            {selectedForDelete.length > 0 && (
              <button
                type="button"
                onClick={handleExecuteBulkDelete}
                className="px-4 py-2 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                title="Bấm cái là xóa luôn!"
              >
                <Trash2 className="w-4 h-4" />
                <span>🗑️ Xóa ({selectedForDelete.length}) Nhân Vật Đã Chọn (Bấm Xóa Luôn)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsDeleteMode(false);
                setSelectedForDelete([]);
              }}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 cursor-pointer transition-all"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}

      {/* Filter status banner */}
      {(selectedGenreFilter || showOnlyFavorites || searchQuery) && (
        <div className="flex items-center justify-between text-xs px-2 text-slate-500">
          <span>
            Tìm thấy{' '}
            <strong className="text-pink-500 font-bold">{filteredCharacters.length}</strong> phạm
            nhân
            {selectedGenreFilter && ` thuộc thể loại "${selectedGenreFilter}"`}
            {showOnlyFavorites && ' trong danh sách yêu thích'}
            {searchQuery && ` theo từ khóa "${searchQuery}"`}
          </span>

          <button
            type="button"
            onClick={() => {
              onSelectGenreFilter(null);
              if (showOnlyFavorites) onToggleFavoriteFilter();
              setSearchQuery('');
            }}
            className="text-pink-500 hover:underline font-semibold cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Characters Cards Grid */}
      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCharacters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isFavorite={favorites.includes(char.id)}
              onToggleFavorite={onToggleFavorite}
              onOpenDetail={onOpenDetail}
              onSendLove={onSendLove}
              darkMode={darkMode}
              isDeleteMode={isDeleteMode}
              isSelectedForDelete={selectedForDelete.includes(char.id)}
              onToggleSelectForDelete={handleToggleSelectForDelete}
              onDelete={handleExecuteSingleDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          className={`py-16 px-6 text-center rounded-3xl border transition-all ${
            darkMode
              ? 'bg-slate-900/60 border-slate-800 text-slate-300'
              : 'bg-white/80 border-pink-100 text-slate-700 shadow-sm'
          }`}
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center text-3xl mb-4 animate-bob">
            🗝️
          </div>

          {characters.length === 0 ? (
            <>
              <h3 className="text-xl font-bold mb-2">
                Trại giam hiện đang trống trải...
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Chưa có hồ sơ phạm nhân nào được lưu giữ tại đây. Quản trị viên hãy tạo thêm hồ sơ nhân vật mới để các nàng Quản Ngục có thể ghé thăm và tương tác!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 hover:opacity-90 shadow-lg shadow-pink-400/30 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Thêm nhân vật mới (Quản Trị Viên)</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold mb-2">
                Không tìm thấy phạm nhân phù hợp
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Không có nhân vật nào thỏa mãn tiêu chí tìm kiếm hoặc bộ lọc hiện tại của nàng.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSelectGenreFilter(null);
                  if (showOnlyFavorites) onToggleFavoriteFilter();
                }}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors cursor-pointer"
              >
                Xem lại toàn bộ nhân vật
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
