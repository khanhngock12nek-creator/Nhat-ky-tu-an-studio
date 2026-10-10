import React, { useMemo, useState, useEffect } from 'react';
import { Sparkles, Heart, Sliders, X, Check, Sun, Moon } from 'lucide-react';

export type FloatTheme = 'prison_love' | 'pastel_hearts' | 'sakura_dream' | 'crystal_bubbles';

interface FloatingHeartsProps {
  darkMode: boolean;
  onToggleTheme?: () => void;
}

interface FloatingItem {
  id: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
  size: string;
  opacity: string;
  symbol: string;
  animType: 'hover-bob-smooth' | 'float-sway-slow';
  blur?: boolean;
}

interface StreamItem {
  id: number;
  left: string;
  duration: string;
  delay: string;
  size: string;
  color: string;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ darkMode, onToggleTheme }) => {
  // Saved or active theme
  const [theme, setTheme] = useState<FloatTheme>(() => {
    const pt = localStorage.getItem('nhat_ky_tu_an_particles_type');
    if (pt === 'petals') return 'sakura_dream';
    if (pt === 'stars') return 'crystal_bubbles';
    if (pt === 'rain') return 'crystal_bubbles';
    return (localStorage.getItem('nhat_ky_tu_an_float_theme') as FloatTheme) || 'prison_love';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const pt = localStorage.getItem('nhat_ky_tu_an_particles_type');
      if (pt === 'petals') setTheme('sakura_dream');
      else if (pt === 'stars' || pt === 'rain') setTheme('crystal_bubbles');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [intensity, setIntensity] = useState<'gentle' | 'normal' | 'vibrant'>(() => {
    return (localStorage.getItem('nhat_ky_tu_an_float_intensity') as any) || 'normal';
  });

  const [showConfig, setShowConfig] = useState(false);

  const handleSetTheme = (newTheme: FloatTheme) => {
    setTheme(newTheme);
    localStorage.setItem('nhat_ky_tu_an_float_theme', newTheme);
  };

  const handleSetIntensity = (newIntensity: 'gentle' | 'normal' | 'vibrant') => {
    setIntensity(newIntensity);
    localStorage.setItem('nhat_ky_tu_an_float_intensity', newIntensity);
  };

  // Symbols mapping for different theme aesthetics
  const symbols = useMemo(() => {
    switch (theme) {
      case 'prison_love':
        // Themed to "Nhật Ký Tù Án" sweet prison aesthetic
        return ['💖', '🗝️', '🔒', '💌', '✨', '🎀', '💕', '🗝️', '💖', '🌸'];
      case 'sakura_dream':
        return ['🌸', '💮', '✨', '💫', '💖', '🌸', '🎀', '✨'];
      case 'crystal_bubbles':
        return ['🫧', '✨', '💎', '🤍', '🫧', '💫', '🔮'];
      case 'pastel_hearts':
      default:
        return ['💖', '💕', '💗', '💓', '✨', '💝', '💖'];
    }
  }, [theme]);

  // Determine count based on intensity
  const count = intensity === 'gentle' ? 14 : intensity === 'vibrant' ? 28 : 20;

  // Generate scattered bobbing items across the whole viewport (rải rác khắp web bay lên xuống)
  const scatteredItems: FloatingItem[] = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Deterministic layout with pseudo-random distribution
      const col = (i % 6) * 16 + ((i * 13) % 10) + 2;
      const row = Math.floor(i / 6) * 22 + ((i * 17) % 15) + 5;
      const symbolIndex = i % symbols.length;

      return {
        id: i,
        top: `${Math.min(92, Math.max(4, row))}%`,
        left: `${Math.min(95, Math.max(3, col))}%`,
        duration: `${3.8 + (i % 5) * 1.1}s`,
        delay: `${(i * 0.45) % 4}s`,
        size: `${14 + (i % 4) * 6}px`,
        opacity: darkMode
          ? (i % 3 === 0 ? 'opacity-40' : i % 3 === 1 ? 'opacity-55' : 'opacity-30')
          : (i % 3 === 0 ? 'opacity-50' : i % 3 === 1 ? 'opacity-70' : 'opacity-40'),
        symbol: symbols[symbolIndex],
        animType: i % 2 === 0 ? 'hover-bob-smooth' : 'float-sway-slow',
        blur: i % 5 === 0,
      };
    });
  }, [count, symbols, darkMode]);

  // Generate gentle vertical rising particles from bottom
  const streamHearts: StreamItem[] = useMemo(() => {
    return Array.from({ length: intensity === 'gentle' ? 8 : 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + 4) % 96}%`,
      duration: `${7 + (i % 5) * 1.5}s`,
      delay: `${(i * 0.9) % 8}s`,
      size: `${12 + (i % 4) * 5}px`,
      color:
        i % 3 === 0
          ? darkMode
            ? 'text-pink-400/35'
            : 'text-pink-400/45'
          : i % 3 === 1
          ? darkMode
            ? 'text-sky-400/35'
            : 'text-sky-400/40'
          : darkMode
          ? 'text-rose-300/35'
          : 'text-rose-400/45',
    }));
  }, [intensity, darkMode]);

  // Subtle mouse cursor trail effect
  const [trail, setTrail] = useState<Array<{ id: number; x: number; y: number; symbol: string }>>([]);

  useEffect(() => {
    let lastTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 140) return; // throttle
      lastTime = now;

      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const newDot = {
        id: now + Math.random(),
        x: e.clientX,
        y: e.clientY,
        symbol: randomSymbol,
      };

      setTrail((prev) => [...prev.slice(-6), newDot]);

      setTimeout(() => {
        setTrail((prev) => prev.filter((p) => p.id !== newDot.id));
      }, 900);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [symbols]);

  return (
    <>
      {/* 1. SCATTERED ITEMS BOBBING UP AND DOWN (Rải rác khắp web bay lên xuống) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {scatteredItems.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.opacity} transition-opacity duration-700 ${
              item.blur ? 'blur-[0.5px]' : ''
            }`}
            style={{
              top: item.top,
              left: item.left,
              fontSize: item.size,
              animation: `${item.animType} ${item.duration} ease-in-out infinite`,
              animationDelay: item.delay,
              willChange: 'transform',
            }}
          >
            {item.symbol}
          </div>
        ))}

        {/* 2. RISING VERTICAL PARTICLES FROM BOTTOM */}
        {streamHearts.map((h) => (
          <div
            key={h.id}
            className={`absolute bottom-[-40px] ${h.color} select-none`}
            style={{
              left: h.left,
              fontSize: h.size,
              animation: `float-heart ${h.duration} ease-in-out infinite`,
              animationDelay: h.delay,
              willChange: 'transform',
            }}
          >
            ❤
          </div>
        ))}

        {/* 3. CURSOR SPARKLES TRAIL */}
        {trail.map((t) => (
          <div
            key={t.id}
            className="fixed pointer-events-none text-xs transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-75"
            style={{
              left: `${t.x}px`,
              top: `${t.y}px`,
            }}
          >
            {t.symbol}
          </div>
        ))}
      </div>

      {/* 4. QUICK TOGGLE / EFFECT CUSTOMIZER BUTTON & THEME TOGGLE (Chuyển đổi giao diện sáng tối chuyển xuống trên mục hiệu ứng bay) */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2">
        {/* Nút chuyển đổi Giao diện Sáng / Tối */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Chuyển chế độ sáng tối"
            title={darkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-2xl shadow-lg border transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md group hover:scale-105 active:scale-95 ${
              darkMode
                ? 'bg-slate-900/95 border-slate-700 text-amber-300 hover:border-amber-400 hover:text-amber-200'
                : 'bg-white/95 border-pink-200 text-slate-700 hover:text-pink-600 hover:border-pink-300'
            }`}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform" />
            )}
            <span className="text-xs font-bold">
              {darkMode ? 'Giao Diện Sáng' : 'Giao Diện Tối'}
            </span>
          </button>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            title="Tùy chỉnh hiệu ứng bay lên xuống khắp web"
            className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl shadow-lg border transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95 ${
              darkMode
                ? 'bg-slate-900/95 border-slate-700 text-pink-400 hover:border-pink-500'
                : 'bg-white/95 border-pink-200 text-pink-600 hover:border-pink-400'
            }`}
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span className="text-xs font-bold">Hiệu Ứng Bay</span>
          </button>

          {/* Popover configuration menu */}
          {showConfig && (
            <div
              className={`absolute bottom-full mb-3 left-0 w-72 sm:w-80 p-4 rounded-3xl shadow-2xl border backdrop-blur-md animate-fade-in z-50 ${
                darkMode
                  ? 'bg-slate-900/95 border-slate-700 text-slate-100 shadow-slate-950/80'
                  : 'bg-white/95 border-pink-200 text-slate-800 shadow-pink-200/60'
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-pink-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">Hiệu Ứng Bay Lên Xuống</h4>
                    <p className="text-[10px] text-slate-400">Rải rác khắp toàn bộ trang web</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfig(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Theme Choice */}
              <div className="space-y-1.5 mb-3">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  1. Kiểu biểu tượng bay:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    {
                      id: 'prison_love' as FloatTheme,
                      name: 'Trại Giam Tình Yêu',
                      sub: '🗝️ 🔒 💖 💌 ✨',
                    },
                    {
                      id: 'pastel_hearts' as FloatTheme,
                      name: 'Trái Tim Pastel',
                      sub: '💖 💕 💗 💓 ✨',
                    },
                    {
                      id: 'sakura_dream' as FloatTheme,
                      name: 'Hoa Anh Đào',
                      sub: '🌸 💮 ✨ 💫 🎀',
                    },
                    {
                      id: 'crystal_bubbles' as FloatTheme,
                      name: 'Bong Bóng Pha Lê',
                      sub: '🫧 💎 ✨ 🤍 🔮',
                    },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSetTheme(t.id)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                        theme === t.id
                          ? 'bg-pink-500 text-white font-bold border-pink-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-pink-300'
                      }`}
                    >
                      <div className="truncate font-semibold">{t.name}</div>
                      <div className="text-[10px] mt-0.5 opacity-85">{t.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Choice */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  2. Mật độ rải rác:
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: 'gentle', label: 'Dịu mắt (14)' },
                    { id: 'normal', label: 'Chuẩn đẹp (20)' },
                    { id: 'vibrant', label: 'Lãng mạn (28)' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleSetIntensity(lvl.id as any)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        intensity === lvl.id
                          ? 'bg-gradient-to-r from-pink-500 to-sky-400 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
                ✨ Di chuyển chuột để thả thêm vệt tim lấp lánh
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
