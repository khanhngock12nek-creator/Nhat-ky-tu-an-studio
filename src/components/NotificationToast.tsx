import React from 'react';
import { Sparkles, X, Heart } from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationToastProps {
  notification: SystemNotification | null;
  onClose: () => void;
  onSelectCharacter?: (charId: string) => void;
  darkMode: boolean;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onSelectCharacter,
  darkMode,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] animate-bounce-short">
      <div
        className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md transition-all ${
          darkMode
            ? 'bg-slate-900/95 border-pink-500/40 text-slate-100 shadow-pink-950/40'
            : 'bg-white/95 border-pink-200 text-slate-800 shadow-pink-200/50'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-pink-400/30">
          <Heart className="w-5 h-5 fill-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-500 mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{notification.title}</span>
          </div>
          <p className="text-sm font-semibold truncate leading-tight">
            {notification.message}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {notification.characterId && onSelectCharacter && (
              <button
                type="button"
                onClick={() => {
                  onSelectCharacter(notification.characterId!);
                  onClose();
                }}
                className="text-xs px-2.5 py-1 rounded-lg font-medium bg-pink-500 text-white hover:bg-pink-600 transition-colors cursor-pointer"
              >
                Vào thăm ngay
              </button>
            )}
            <span className="text-[10px] text-slate-400">Vừa xong</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
