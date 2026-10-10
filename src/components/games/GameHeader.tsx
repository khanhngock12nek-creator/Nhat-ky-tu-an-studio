import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  ChevronDown,
  Users,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Character } from '../../types';

interface GameHeaderProps {
  darkMode: boolean;
  onBack: () => void;
  character?: Character | null;
  characters?: Character[];
  onSelectCharacter?: (char: Character) => void;
  gameTitle?: string;
  badgeText?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  darkMode,
  onBack,
  character,
  characters = [],
  onSelectCharacter,
  badgeText,
}) => {
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-30">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs shrink-0 ${
          darkMode
            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            : 'bg-sky-50 border-sky-200 text-slate-900 hover:bg-rose-50'
        }`}
      >
        <ArrowLeft className="w-4 h-4 text-rose-500" />
        <span>Về Khu Trò Chơi</span>
      </button>

      {/* Current Character Active Pill */}
      {character ? (
        <div className="relative">
          <div
            className={`flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-2xl border transition-all shadow-sm ${
              darkMode
                ? 'bg-slate-900/90 border-rose-900/60 text-white'
                : 'bg-gradient-to-r from-rose-50 via-pink-50 to-white border-sky-200 text-slate-900'
            }`}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-sky-200/60 shadow-xs relative">
              {character.avatarUrl ? (
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center font-black text-white text-xs ${
                    character.avatarGradient || 'bg-gradient-to-tr from-pink-500 to-rose-500'
                  }`}
                >
                  {character.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Character Info */}
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">
                  Đang chơi cùng:
                </span>
                <span className="text-xs font-black text-rose-600 dark:text-rose-400 truncate">
                  {character.name}
                </span>
              </div>
              <div className="text-[10px] text-slate-900 dark:text-slate-400 font-medium truncate mt-0.5">
                {character.prisonId || '#001'} • {character.sentenceTerm || character.possession || character.rarity || 'Tù nhân'}
              </div>
            </div>

            {/* Switch Character Button */}
            {characters.length > 1 && onSelectCharacter && (
              <button
                type="button"
                onClick={() => setShowSwitchMenu((prev) => !prev)}
                className={`ml-1 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                }`}
                title="Đổi sang nhân vật khác"
              >
                <Users className="w-3 h-3" />
                <span>Đổi</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showSwitchMenu ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Quick Dropdown to switch character */}
          {showSwitchMenu && characters.length > 1 && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSwitchMenu(false)}
              />
              <div
                className={`absolute right-0 top-full mt-2 w-72 rounded-2xl p-2 border shadow-2xl z-50 animate-scaleIn space-y-1 ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-sky-50 border-sky-200 text-slate-900'
                }`}
              >
                <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Chọn nhân vật đồng hành:</span>
                  <span className="text-rose-500">{characters.length} nhân vật</span>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {characters.map((c) => {
                    const isSelected = c.id === character.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onSelectCharacter?.(c);
                          setShowSwitchMenu(false);
                        }}
                        className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500 text-white font-bold'
                            : darkMode
                            ? 'hover:bg-slate-800 text-slate-200'
                            : 'hover:bg-rose-50 text-slate-900'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/20">
                          {c.avatarUrl ? (
                            <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center font-bold text-xs ${c.avatarGradient || 'bg-rose-400 text-white'}`}>
                              {c.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs truncate font-bold">{c.name}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {c.prisonId || '#001'} • {c.zone || 'Khu giam'}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{badgeText || 'Chưa chọn nhân vật cụ thể'}</span>
        </div>
      )}
    </div>
  );
};
