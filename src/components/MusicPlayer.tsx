import React, { useState, useEffect } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Disc3,
  Repeat,
  Radio,
  Tv,
} from 'lucide-react';

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  youtubeUrl: string;
  duration?: string;
  tag?: string;
}

export const PLAYLIST: Song[] = [
  {
    id: 'song-1',
    title: 'Đắm chìm',
    artist: 'Trâu Bái Bái / Pank',
    youtubeId: 'j2ua5ZbfMfk',
    youtubeUrl: 'https://youtu.be/j2ua5ZbfMfk?si=aY6W19WC9jqEXL8m',
    duration: '03:15',
    tag: 'Trending',
  },
  {
    id: 'song-2',
    title: 'Đắm chìm',
    artist: 'JuggShots',
    youtubeId: '7gk97aoyrDM',
    youtubeUrl: 'https://youtu.be/7gk97aoyrDM?si=DIIgZwi4rd4WPRAo',
    duration: '03:42',
    tag: 'Acoustic / Chill',
  },
  {
    id: 'song-3',
    title: 'For ya',
    artist: 'Tưởng Tiểu Ni',
    youtubeId: 'qz495ltcbaU',
    youtubeUrl: 'https://youtu.be/qz495ltcbaU?si=ySiiL7vS4Mf7PVY0',
    duration: '03:28',
    tag: 'Sweet Melody',
  },
  {
    id: 'song-4',
    title: '7 Years',
    artist: 'Lukas Graham',
    youtubeId: 'kqFLQG484pg',
    youtubeUrl: 'https://youtu.be/kqFLQG484pg?si=gGzKvfLsLr--EmN6',
    duration: '03:59',
    tag: 'Nostalgic Hit',
  },
  {
    id: 'song-5',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    youtubeId: 'liTfD88dbCo',
    youtubeUrl: 'https://youtu.be/liTfD88dbCo?si=hQo3kMyMpzqID8wr',
    duration: '04:23',
    tag: 'Global Classic',
  },
];

interface MusicPlayerProps {
  darkMode: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentSong = PLAYLIST[currentSongIndex];

  const handlePlaySong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  // Keyboard shortcut listener: space to pause/play if player is open (optional, carefully avoid inputs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'KeyM' &&
        e.altKey &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* 
        ========================================================================
        FLOATING COLLAPSED VINYL DOCK ON THE LEFT EDGE
        ("thanh xoay ở bên trái" - luôn neo ở mép trái màn hình)
        ========================================================================
      */}
      <aside
        aria-label="Thanh nhạc xoay bên trái"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center select-none"
      >
        {/* Toggle Trigger Tab attached to the left edge - CHỈ ĐỂ HÌNH ĐĨA NHẠC */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group p-2 rounded-r-2xl shadow-xl transition-all duration-300 border-y border-r cursor-pointer flex items-center justify-center ${
            darkMode
              ? 'bg-slate-900/90 border-pink-500/40 text-slate-100 shadow-pink-950/50 hover:bg-slate-800 hover:scale-105'
              : 'bg-sky-50/90 border-sky-200 text-slate-900 shadow-pink-200/60 hover:bg-pink-50 hover:scale-105'
          } ${isOpen ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}
          title={`Âm nhạc: ${currentSong.title} - ${currentSong.artist} (Bấm để mở danh sách)`}
        >
          {/* Animated Turntable Vinyl Record Disc */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Spinning Vinyl Disc */}
            <div
              className={`w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 shadow-lg flex items-center justify-center relative overflow-hidden transition-transform ${
                isPlaying ? 'animate-spin-vinyl' : 'group-hover:rotate-45'
              }`}
              style={{
                background:
                  'radial-gradient(circle, #2d3748 12%, #1a202c 15%, #1a202c 40%, #111827 45%, #0f172a 100%)',
              }}
            >
              {/* Concentric vinyl groove rings */}
              <div className="absolute inset-1 rounded-full border border-slate-600/40 pointer-events-none" />
              <div className="absolute inset-2 rounded-full border border-slate-600/30 pointer-events-none" />
              <div className="absolute inset-3.5 rounded-full border border-slate-500/30 pointer-events-none" />

              {/* Center Vinyl Label with Pink Gradient */}
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center shadow-inner z-10">
                <div className="w-1 h-1 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* Tonearm (Thanh xoay cần gạt đĩa than) */}
            <div
              className={`absolute top-0 right-0 w-4 h-7 pointer-events-none transition-transform duration-500 origin-top-right ${
                isPlaying ? 'rotate-12 scale-100' : '-rotate-25 scale-90 opacity-60'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-pink-400 absolute -top-1 -right-0.5 shadow-sm" />
              <div className="w-0.5 h-5 bg-gradient-to-b from-pink-300 via-slate-300 to-rose-400 mx-auto rounded-full" />
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-xs -ml-0.5" />
            </div>

            {/* Equalizer Wave Bars if playing */}
            {isPlaying && (
              <div className="absolute -bottom-1 -left-1 flex items-end gap-0.5 z-20 bg-pink-500/90 px-1 py-0.5 rounded-full shadow-sm">
                <div className="w-0.5 h-1.5 bg-sky-50 rounded-full animate-music-bar-1" />
                <div className="w-0.5 h-2 bg-sky-50 rounded-full animate-music-bar-2" />
                <div className="w-0.5 h-1 bg-sky-50 rounded-full animate-music-bar-3" />
              </div>
            )}
          </div>
        </button>
      </aside>

      {/* 
        ========================================================================
        EXPANDED MUSIC PLAYER DRAWER / CONSOLE ON THE LEFT SIDE
        ("thanh xoay ở bên trái" - Console phát nhạc cao cấp)
        ========================================================================
      */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <section
        aria-label="Bảng điều khiển máy phát nhạc đĩa than"
        className={`fixed top-0 left-0 h-full w-full sm:w-[380px] z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col border-r ${
          darkMode
            ? 'bg-slate-900/95 border-pink-500/30 text-slate-100 shadow-pink-950/60'
            : 'bg-sky-50/95 border-sky-200 text-slate-900 shadow-pink-200/50'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Top Header of the Player */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-sky-200 bg-pink-50/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/30">
              <Disc3 className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 bg-clip-text text-transparent">
                Thanh Xoay Đĩa Nhạc
              </h3>
              <p className="text-[11px] opacity-65">Nhật Ký Tù Án · 5 Giai Điệu Dịu Êm</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowVideo((prev) => !prev)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showVideo
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                  : darkMode
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-pink-100 text-slate-900'
              }`}
              title={showVideo ? 'Chuyển về giao diện Đĩa Than' : 'Xem Video MV YouTube'}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">{showVideo ? 'Đĩa Than' : 'MV'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-pink-100 text-slate-900'
              }`}
              title="Thu nhỏ thanh xoay"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Player Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main Visual Display: Turntable Vinyl OR YouTube Video */}
          <div
            className={`relative rounded-3xl p-5 overflow-hidden transition-all border shadow-inner flex flex-col items-center justify-center ${
              darkMode
                ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/60 border-slate-800'
                : 'bg-gradient-to-b from-pink-50 via-rose-50/40 to-sky-50 border-sky-200'
            }`}
          >
            {showVideo ? (
              /* YouTube Mini Player Screen */
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-pink-400/30 bg-black relative">
                <iframe
                  title={currentSong.title}
                  src={`https://www.youtube-nocookie.com/embed/${currentSong.youtubeId}?autoplay=${
                    isPlaying ? '1' : '0'
                  }&enablejsapi=1&origin=${window.location.origin}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              /* TURNTABLE (MÁY ĐĨA THAN VỚI THANH XOAY KIM ĐĨA) */
              <div className="relative py-4 flex flex-col items-center">
                {/* Turntable Platter Base */}
                <div
                  className={`relative w-48 h-48 sm:w-52 sm:h-52 rounded-full p-2.5 shadow-2xl transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-4 border-slate-800/80 shadow-pink-950/50'
                      : 'bg-stone-900 border-4 border-stone-700 shadow-stone-800/40'
                  }`}
                >
                  {/* Rotating Vinyl Record */}
                  <div
                    className={`w-full h-full rounded-full relative overflow-hidden shadow-inner flex items-center justify-center ${
                      isPlaying ? 'animate-spin-vinyl' : ''
                    }`}
                    style={{
                      background:
                        'radial-gradient(circle, #334155 0%, #1e293b 15%, #0f172a 35%, #1e293b 50%, #0f172a 70%, #020617 100%)',
                    }}
                  >
                    {/* Vinyl light sheen reflection */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        background:
                          'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)',
                      }}
                    />

                    {/* Concentric groove rings */}
                    <div className="absolute inset-3 rounded-full border border-slate-700/50 pointer-events-none" />
                    <div className="absolute inset-6 rounded-full border border-slate-700/40 pointer-events-none" />
                    <div className="absolute inset-10 rounded-full border border-slate-600/35 pointer-events-none" />
                    <div className="absolute inset-14 rounded-full border border-slate-600/30 pointer-events-none" />

                    {/* Center Vinyl Sticker Label */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-sky-400 p-1 flex flex-col items-center justify-center text-white shadow-lg text-center z-10">
                      <Sparkles className="w-3.5 h-3.5 drop-shadow" />
                      <span className="text-[8px] font-black tracking-widest uppercase truncate max-w-[50px]">
                        TRACK #{currentSongIndex + 1}
                      </span>
                      {/* Spindle hole */}
                      <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700 mt-0.5" />
                    </div>
                  </div>

                  {/* Tonearm (Thanh xoay cần gạt đĩa than) */}
                  <div
                    className="absolute -top-3 -right-2 w-16 h-36 pointer-events-none transition-transform duration-700 origin-top-right z-20"
                    style={{
                      transform: isPlaying ? 'rotate(24deg)' : 'rotate(-10deg)',
                    }}
                  >
                    {/* Pivot base */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-700 to-slate-400 border border-sky-200 shadow-md absolute -top-1 right-2 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-inner" />
                    </div>

                    {/* Metal arm rod */}
                    <div className="w-1.5 h-24 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-full absolute top-4 right-4 shadow-sm" />

                    {/* Headshell & Stylus cartridge */}
                    <div className="absolute top-26 right-2.5 w-4 h-6 bg-gradient-to-b from-pink-500 to-rose-600 rounded shadow-md transform -rotate-12 flex flex-col items-center justify-end pb-0.5">
                      <div className="w-1 h-1.5 bg-yellow-300 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Turntable Status indicator */}
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      isPlaying
                        ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-ping'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-[11px] font-medium opacity-70">
                    {isPlaying ? 'Đang quay phát đĩa than' : 'Đã tạm dừng xoay'}
                  </span>
                </div>
              </div>
            )}

            {/* Hidden Background YouTube Player when in Vinyl mode */}
            {!showVideo && (
              <div className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
                <iframe
                  title="Background YouTube Audio"
                  src={`https://www.youtube-nocookie.com/embed/${currentSong.youtubeId}?autoplay=${
                    isPlaying ? '1' : '0'
                  }&enablejsapi=1&origin=${window.location.origin}`}
                  className="w-1 h-1 border-0"
                  allow="autoplay"
                />
              </div>
            )}

            {/* Song Meta Information */}
            <div className="w-full mt-2 text-center">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500/15 text-pink-500 border border-pink-500/20 mb-1">
                {currentSong.tag || `Bài ${currentSongIndex + 1}/5`}
              </span>
              <h4 className="text-base font-extrabold truncate" title={currentSong.title}>
                {currentSong.title}
              </h4>
              <p className="text-xs opacity-75 truncate" title={currentSong.artist}>
                {currentSong.artist}
              </p>
            </div>

            {/* Playback Controls Bar */}
            <div className="mt-4 flex items-center justify-center gap-3 w-full">
              {/* Loop toggle */}
              <button
                type="button"
                onClick={() => setIsLooping((prev) => !prev)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isLooping
                    ? 'text-pink-500 bg-pink-500/10'
                    : darkMode
                    ? 'text-slate-900 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-900'
                }`}
                title={isLooping ? 'Đang lặp lại bài hát' : 'Tắt lặp lại'}
              >
                <Repeat className="w-4 h-4" />
              </button>

              {/* Prev Song */}
              <button
                type="button"
                onClick={handlePrev}
                className={`p-2.5 rounded-2xl transition-all cursor-pointer active:scale-90 ${
                  darkMode
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-sky-50 text-slate-900 hover:bg-pink-100 shadow-sm'
                }`}
                title="Bài trước đó"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Main Play / Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-sky-400 text-white shadow-xl shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title={isPlaying ? 'Tạm dừng xoay' : 'Bắt đầu xoay phát nhạc'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                )}
              </button>

              {/* Next Song */}
              <button
                type="button"
                onClick={handleNext}
                className={`p-2.5 rounded-2xl transition-all cursor-pointer active:scale-90 ${
                  darkMode
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-sky-50 text-slate-900 hover:bg-pink-100 shadow-sm'
                }`}
                title="Bài kế tiếp"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Mute/Volume toggle */}
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isMuted
                    ? 'text-rose-500 bg-rose-500/10'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-900 hover:text-slate-900'
                }`}
                title={isMuted ? 'Mở lại tiếng' : 'Tắt tiếng'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick Open on YouTube link */}
            <a
              href={currentSong.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${
                darkMode
                  ? 'text-pink-400 hover:text-pink-300'
                  : 'text-pink-600 hover:text-pink-700'
              }`}
            >
              <span>Xem trực tiếp trên YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Playlist Section (5 bài hát được user cung cấp) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-pink-500" />
                <span>Danh Sách 5 Bài Hát</span>
              </span>
              <span className="text-[11px] opacity-60">Chọn bài để phát</span>
            </div>

            <div className="space-y-1.5">
              {PLAYLIST.map((song, index) => {
                const isSelected = currentSongIndex === index;
                return (
                  <div
                    key={song.id}
                    onClick={() => handlePlaySong(index)}
                    className={`group w-full p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left cursor-pointer ${
                      isSelected
                        ? darkMode
                          ? 'bg-pink-950/40 border-pink-500/50 text-white shadow-md shadow-pink-950/30'
                          : 'bg-gradient-to-r from-pink-50 to-rose-50 border-sky-200 text-pink-900 shadow-sm'
                        : darkMode
                        ? 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                        : 'bg-sky-50/80 border-sky-200 text-slate-900 hover:bg-pink-50/50 hover:border-sky-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Mini Rotating Disc or Track Number */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform ${
                          isSelected && isPlaying
                            ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md animate-spin-vinyl'
                            : isSelected
                            ? 'bg-pink-500 text-white'
                            : darkMode
                            ? 'bg-slate-700 text-slate-400 group-hover:bg-pink-500/20 group-hover:text-pink-400'
                            : 'bg-pink-100 text-pink-600 group-hover:bg-pink-200'
                        }`}
                      >
                        {isSelected && isPlaying ? (
                          <Disc3 className="w-4 h-4" />
                        ) : (
                          <span>0{index + 1}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold truncate">{song.title}</p>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
                          )}
                        </div>
                        <p className="text-[11px] opacity-70 truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] opacity-50 hidden sm:inline">
                        {song.duration}
                      </span>
                      <a
                        href={song.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Mở link bài hát"
                        className="p-1 rounded-lg opacity-40 group-hover:opacity-100 hover:text-pink-500 transition-opacity"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div
          className={`p-3 border-t text-center text-[11px] opacity-70 ${
            darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-sky-200 bg-pink-50/40'
          }`}
        >
          <span>🎵 Bấm vào đĩa than để thưởng thức âm nhạc khi dạo chơi trại giam</span>
        </div>
      </section>
    </>
  );
};
