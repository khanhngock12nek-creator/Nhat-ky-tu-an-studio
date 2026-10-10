/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FloatingHearts } from './components/FloatingHearts';
import { GateModal } from './components/GateModal';
import { HomeView } from './components/HomeView';
import { CharacterList } from './components/CharacterList';
import { Leaderboard } from './components/Leaderboard';
import { GachaWheel } from './components/GachaWheel';
import { LetterBox } from './components/LetterBox';
import { GenreView } from './components/GenreView';
import { MidnightCourtView } from './components/MidnightCourtView';
import { PsychWardView } from './components/PsychWardView';
import { MinigameView } from './components/MinigameView';
import { UserProfileView } from './components/UserProfileView';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { AdminModal } from './components/AdminModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { NotificationToast } from './components/NotificationToast';
import { MusicPlayer } from './components/MusicPlayer';
import bannerImgDefault from './assets/images/prison_diary_hero_banner_1791465806036.jpg';
import {
  Character,
  Letter,
  ActiveTab,
  SystemNotification,
  GoogleUser,
  WardenProfile,
} from './types';
import {
  getStoredCharacters,
  saveCharacters,
  getStoredFavorites,
  saveFavorites,
  getStoredLetters,
  saveLetters,
  isGatePassed,
  setGatePassed,
  getStoredTheme,
  saveTheme,
  getStoredGoogleUser,
  saveGoogleUser,
  getStoredGenres,
  saveGenres,
  getStoredWardenProfile,
  saveWardenProfile,
} from './utils/storage';
import { 
  db, 
  charactersCollection, 
  lettersCollection, 
  initializeFirestoreData,
  sanitizeForFirestore,
  handleFirestoreError,
  OperationType,
} from './utils/firebase';
import { compressBase64Image } from './utils/imageUtils';
import { onSnapshot, setDoc, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import {
  ShieldCheck,
  ArrowUp,
} from 'lucide-react';

export default function App() {
  // Gate check
  const [hasEntered, setHasEntered] = useState<boolean>(() => isGatePassed());

  // Dark/Light mode
  const [darkMode, setDarkMode] = useState<boolean>(() => getStoredTheme() === 'dark');

  // Navigation tab ('home' as default)
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [secretWardMode, setSecretWardMode] = useState<'midnightCourt' | 'psychWard'>('midnightCourt');

  // Google User auth state
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => getStoredGoogleUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleGoogleLogin = (user: GoogleUser) => {
    setGoogleUser(user);
    saveGoogleUser(user);
    setCurrentNotification({
      id: `login-${Date.now()}`,
      title: 'Đăng Nhập Google Thành Công! ✨',
      message: `Chào mừng ${user.name} đến với Ward No. 07. Toàn bộ 5 đặc quyền Quản Ngục đã được kích hoạt!`,
      timestamp: Date.now(),
    });
  };

  const handleGoogleLogout = () => {
    setGoogleUser(null);
    saveGoogleUser(null);
    setCurrentNotification({
      id: `logout-${Date.now()}`,
      title: 'Đã Đăng Xuất Google',
      message: 'Đã chuyển về chế độ tham quan Khách.',
      timestamp: Date.now(),
    });
  };

  // Stored state
  const [characters, setCharacters] = useState<Character[]>(() => getStoredCharacters());
  const [favorites, setFavorites] = useState<string[]>(() => getStoredFavorites());
  const [letters, setLetters] = useState<Letter[]>(() => getStoredLetters());
  const [allGenres, setAllGenres] = useState<string[]>(() => getStoredGenres());
  const [bannerBg, setBannerBg] = useState<string>(() => {
    return localStorage.getItem('nhat_ky_tu_an_banner_bg') || bannerImgDefault;
  });

  // Firestore real-time synchronization
  useEffect(() => {
    initializeFirestoreData();

    // 1. Initial eager fetch to ensure instant display for any user opening the app
    getDocs(charactersCollection).then((snapshot) => {
      if (!snapshot.empty) {
        const initialChars: Character[] = [];
        snapshot.forEach((docSnap) => {
          const char = docSnap.data() as Character;
          initialChars.push({ ...char, id: docSnap.id });
        });
        initialChars.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setCharacters(initialChars);
        saveCharacters(initialChars);
      }
    }).catch((err) => {
      console.warn("Initial characters fetch note:", err);
    });

    // 2. Real-time subscription to characters collection for all users
    const unsubscribeChars = onSnapshot(charactersCollection, (snapshot) => {
      const chars: Character[] = [];
      snapshot.forEach((docSnap) => {
        const char = docSnap.data() as Character;
        chars.push({ ...char, id: docSnap.id });
      });
      // Sort newest first
      chars.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      // Always sync state and local storage with real-time Firestore across all clients
      setCharacters(chars);
      saveCharacters(chars);
    }, (error) => {
      console.warn("Real-time characters listener notice:", error);
    });

    const unsubscribeLetters = onSnapshot(lettersCollection, (snapshot) => {
      const ltrs: Letter[] = [];
      snapshot.forEach((docSnap) => {
        ltrs.push({ ...(docSnap.data() as Letter), id: docSnap.id });
      });
      setLetters(ltrs);
      saveLetters(ltrs);
    }, (error) => {
      console.warn("Real-time letters listener notice:", error);
    });

    return () => {
      unsubscribeChars();
      unsubscribeLetters();
    };
  }, []);

  const handleAddGlobalGenre = (newGenre: string) => {
    const trimmed = newGenre.trim();
    if (trimmed && !allGenres.includes(trimmed)) {
      const updated = [...allGenres, trimmed];
      setAllGenres(updated);
      saveGenres(updated);
    }
  };

  const handleUpdateBannerBg = (newBg: string) => {
    setBannerBg(newBg);
    localStorage.setItem('nhat_ky_tu_an_banner_bg', newBg);
  };

  // Stored main website background
  const [siteBg, setSiteBg] = useState<string>(() => {
    return localStorage.getItem('nhat_ky_tu_an_site_bg') || '';
  });

  const handleUpdateSiteBg = (newBg: string) => {
    setSiteBg(newBg);
    localStorage.setItem('nhat_ky_tu_an_site_bg', newBg);
  };

  // Filter state
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Warden Profile State (Matching User Profile Design)
  const [wardenProfile, setWardenProfile] = useState<WardenProfile>(() => getStoredWardenProfile());

  useEffect(() => {
    saveWardenProfile(wardenProfile);
  }, [wardenProfile]);

  // Modals & Popups
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<SystemNotification | null>(null);

  // Sync theme with DOM root class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      saveTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      saveTheme('light');
    }
  }, [darkMode]);

  // Persist favorites
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Handle Gate Enter
  const handleGateEnter = () => {
    setGatePassed(true);
    setHasEntered(true);
  };

  const handleToggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Add / Edit / Delete Characters
  const handleAddCharacter = async (newChar: Character) => {
    let safeChar = { ...newChar };
    if (safeChar.avatarUrl?.startsWith('data:image/') && safeChar.avatarUrl.length > 150000) {
      try {
        safeChar.avatarUrl = await compressBase64Image(safeChar.avatarUrl, 640, 640, 0.7);
      } catch (err) {
        console.warn('Avatar compression fallback:', err);
      }
    }
    const payload = sanitizeForFirestore(safeChar);

    // Optimistic state and storage update
    setCharacters((prev) => {
      const next = [safeChar, ...prev.filter((c) => c.id !== safeChar.id)];
      saveCharacters(next);
      return next;
    });

    try {
      await setDoc(doc(db, 'characters', safeChar.id), payload);
    } catch (e) {
      console.error("Error adding character to Firestore:", e);
      handleFirestoreError(e, OperationType.WRITE, `characters/${safeChar.id}`);
    }

    // Show system notification
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title: 'Phạm nhân mới đã nhập trại!',
      message: `${safeChar.name} (${safeChar.prisonId}) đã được tiếp nhận và đồng bộ trực tuyến.`,
      characterId: safeChar.id,
      timestamp: Date.now(),
    };
    setCurrentNotification(notif);
  };

  const handleUpdateCharacter = async (updatedChar: Character) => {
    let safeChar = { ...updatedChar };
    if (safeChar.avatarUrl?.startsWith('data:image/') && safeChar.avatarUrl.length > 150000) {
      try {
        safeChar.avatarUrl = await compressBase64Image(safeChar.avatarUrl, 640, 640, 0.7);
      } catch (err) {
        console.warn('Avatar compression fallback:', err);
      }
    }
    const payload = sanitizeForFirestore(safeChar);

    // Optimistic state and storage update
    setCharacters((prev) => {
      const next = prev.map((c) => (c.id === safeChar.id ? safeChar : c));
      saveCharacters(next);
      return next;
    });
    if (selectedCharacter?.id === safeChar.id) {
      setSelectedCharacter(safeChar);
    }

    try {
      await setDoc(doc(db, 'characters', safeChar.id), payload, { merge: true });
    } catch (e) {
      console.error("Error updating character in Firestore:", e);
      handleFirestoreError(e, OperationType.UPDATE, `characters/${safeChar.id}`);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    const charToDelete = characters.find((c) => c.id === id);

    // 1. Immediate optimistic removal from state & storage
    setCharacters((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCharacters(next);
      return next;
    });
    setFavorites((prev) => {
      const next = prev.filter((favId) => favId !== id);
      saveFavorites(next);
      return next;
    });
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(null);
    }

    // 2. Delete from Firestore cloud database
    try {
      await deleteDoc(doc(db, 'characters', id));
    } catch (e) {
      console.error("Error deleting character from Firestore:", e);
      handleFirestoreError(e, OperationType.DELETE, `characters/${id}`);
    }

    if (charToDelete) {
      setCurrentNotification({
        id: `del-${Date.now()}`,
        title: 'Đã xóa phạm nhân thành công! 🗑️',
        message: `Đã xóa hồ sơ "${charToDelete.name}" (${charToDelete.prisonId}) khỏi danh sách buồng giam.`,
        timestamp: Date.now(),
      });
    }
  };

  const handleDeleteMultipleCharacters = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const count = ids.length;

    // 1. Immediate optimistic removal from state & storage
    setCharacters((prev) => {
      const next = prev.filter((c) => !idSet.has(c.id));
      saveCharacters(next);
      return next;
    });
    setFavorites((prev) => {
      const next = prev.filter((favId) => !idSet.has(favId));
      saveFavorites(next);
      return next;
    });
    if (selectedCharacter && idSet.has(selectedCharacter.id)) {
      setSelectedCharacter(null);
    }

    // 2. Delete from Firestore cloud database
    try {
      for (const id of ids) {
        await deleteDoc(doc(db, 'characters', id));
      }
    } catch (e) {
      console.error("Error deleting multiple characters from Firestore:", e);
      handleFirestoreError(e, OperationType.DELETE, 'characters');
    }

    setCurrentNotification({
      id: `del-bulk-${Date.now()}`,
      title: 'Đã xóa hàng loạt thành công! 🗑️',
      message: `Đã xóa ${count} phạm nhân đã chọn khỏi danh sách thành công.`,
      timestamp: Date.now(),
    });
  };

  // Toggle favorite for a character
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Increase likes for a character
  const handleLikeCharacter = async (id: string) => {
    const target = characters.find(c => c.id === id);
    if (!target) return;
    const newLikes = target.likes + 1;
    try {
      await updateDoc(doc(db, 'characters', id), { likes: newLikes });
    } catch (e) {
      console.error("Error updating likes:", e);
      setCharacters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, likes: newLikes } : c))
      );
    }
    if (selectedCharacter?.id === id) {
      setSelectedCharacter((prev) => (prev ? { ...prev, likes: newLikes } : null));
    }
  };

  // Send love message to a character ("dưới mỗi thẻ là gửi lời yêu đến chồng nhỏ")
  const handleSendLoveToCharacter = async (characterId: string, senderName: string, message: string) => {
    const target = characters.find(c => c.id === characterId);
    if (!target) return;
    const newMsg = {
      id: `love-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderName: senderName.trim() || 'Nàng Thơ Dịu Dàng',
      message: message.trim(),
      createdAt: Date.now(),
    };

    const currentMsgs = target.loveMessages || [];
    const currentCount = target.loveCount || 0;
    const updatedLoveCount = currentCount + 1;
    const updatedLoveMessages = [newMsg, ...currentMsgs];

    try {
      await updateDoc(doc(db, 'characters', characterId), {
        loveCount: updatedLoveCount,
        loveMessages: updatedLoveMessages,
      });
    } catch (e) {
      console.error("Error sending love message:", e);
    }

    if (selectedCharacter?.id === characterId) {
      setSelectedCharacter((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          loveCount: updatedLoveCount,
          loveMessages: updatedLoveMessages,
        };
      });
    }
  };

  // Letters actions (Website Reviews & Ideas)
  const handleAddLetter = async (letter: Letter) => {
    try {
      await setDoc(doc(db, 'letters', letter.id), letter);
    } catch (e) {
      console.error("Error adding letter to Firestore:", e);
      setLetters([letter, ...letters]);
    }
  };

  const handleLikeLetter = async (id: string) => {
    const target = letters.find(l => l.id === id);
    if (!target) return;
    const newLikes = target.likes + 1;
    try {
      await updateDoc(doc(db, 'letters', id), { likes: newLikes });
    } catch (e) {
      console.error("Error updating letter likes:", e);
    }
  };

  // Tab change handler
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'psychWard') {
      setSecretWardMode('psychWard');
    } else if (tab === 'midnightCourt') {
      setSecretWardMode('midnightCourt');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to cards tab with genre filter
  const handleSelectGenreFromView = (genre: string) => {
    setSelectedGenreFilter(genre);
    handleTabChange('cards');
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col font-['Quicksand',sans-serif] transition-colors duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100'
          : 'bg-gradient-to-br from-pink-100 via-rose-50 to-sky-100 text-slate-900'
      }`}
    >
      {/* Full-screen Custom Site Background */}
      {siteBg && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <img
            src={siteBg}
            alt="Site Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle translucent veil so text and cards remain crystal clear */}
          <div
            className={`absolute inset-0 ${
              darkMode ? 'bg-slate-950/80 backdrop-blur-[1px]' : 'bg-pink-50/75 via-rose-50/60 to-sky-50/75 backdrop-blur-[1px]'
            }`}
          />
        </div>
      )}

      {/* Floating Animated Hearts across background */}
      <FloatingHearts darkMode={darkMode} onToggleTheme={handleToggleTheme} />

      {/* Rotating Vinyl Music Player on the Right ("thanh xoay ở bên phảii") */}
      <MusicPlayer darkMode={darkMode} />

      {/* Entry Gate Modal (on first visit or test) */}
      {!hasEntered && <GateModal onEnter={handleGateEnter} darkMode={darkMode} />}

      {/* Toast Notification System */}
      <NotificationToast
        notification={currentNotification}
        onClose={() => setCurrentNotification(null)}
        onSelectCharacter={(charId) => {
          const char = characters.find((c) => c.id === charId);
          if (char) {
            setSelectedCharacter(char);
            setActiveTab('cards');
          }
        }}
        darkMode={darkMode}
      />

      {/* Main Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        totalCharacters={characters.length}
        totalFavorites={favorites.length}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavoriteFilter={() => setShowOnlyFavorites((prev) => !prev)}
        googleUser={googleUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container Content */}
      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        <div className="space-y-6">
            {activeTab === 'home' && (
              <HomeView
                characters={characters}
                letters={letters}
                favorites={favorites}
                bannerBg={bannerBg}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetail={setSelectedCharacter}
                onNavigate={handleTabChange}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onSendLove={handleSendLoveToCharacter}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'profile' && (
              <UserProfileView
                profile={wardenProfile}
                onUpdateProfile={setWardenProfile}
                characters={characters}
                googleUser={googleUser}
                onLogoutGoogle={handleGoogleLogout}
                onOpenDetail={setSelectedCharacter}
                onSendLove={handleSendLoveToCharacter}
                letters={letters}
                darkMode={darkMode}
                onTabChange={handleTabChange}
              />
            )}

            {activeTab === 'cards' && (
              <CharacterList
                characters={characters}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetail={setSelectedCharacter}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onSendLove={handleSendLoveToCharacter}
                onDeleteCharacter={isAdminLoggedIn ? handleDeleteCharacter : undefined}
                onDeleteMultipleCharacters={isAdminLoggedIn ? handleDeleteMultipleCharacters : undefined}
                showOnlyFavorites={showOnlyFavorites}
                onToggleFavoriteFilter={() => setShowOnlyFavorites((prev) => !prev)}
                selectedGenreFilter={selectedGenreFilter}
                onSelectGenreFilter={setSelectedGenreFilter}
                darkMode={darkMode}
                allGenres={allGenres}
              />
            )}


            {activeTab === 'ranking' && (
              <Leaderboard
                characters={characters}
                onOpenDetail={setSelectedCharacter}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onLikeCharacter={handleLikeCharacter}
                onSendLove={handleSendLoveToCharacter}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'gacha' && (
              <GachaWheel
                characters={characters}
                onOpenDetail={setSelectedCharacter}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onSendLove={handleSendLoveToCharacter}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'letters' && (
              <LetterBox
                letters={letters}
                onAddLetter={handleAddLetter}
                onLikeLetter={handleLikeLetter}
                characters={characters}
                onSelectCharacter={setSelectedCharacter}
                darkMode={darkMode}
                isAdmin={isAdminLoggedIn}
                onOpenAdmin={() => setIsAdminOpen(true)}
                allGenres={allGenres}
              />
            )}

            {activeTab === 'genres' && (
              <GenreView
                characters={characters}
                onSelectGenre={handleSelectGenreFromView}
                darkMode={darkMode}
                allGenres={allGenres}
              />
            )}

            {activeTab === 'midnightCourt' && (
              <MidnightCourtView
                characters={characters}
                darkMode={darkMode}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onTabChange={handleTabChange}
              />
            )}

            {activeTab === 'psychWard' && (
              <PsychWardView
                characters={characters}
                darkMode={darkMode}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onTabChange={handleTabChange}
              />
            )}

            {activeTab === 'minigame' && (
              <MinigameView
                characters={characters}
                darkMode={darkMode}
                onTabChange={handleTabChange}
                onOpenAdmin={() => setIsAdminOpen(true)}
              />
            )}
        </div>
      </main>

      {/* Floating Corner Actions: Scroll To Top & Admin */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Lên đầu trang"
          className="p-3 rounded-2xl bg-sky-50/90 dark:bg-slate-800/90 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 shadow-lg border border-sky-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 text-rose-500" />
        </button>

        <button
          type="button"
          onClick={() => setIsAdminOpen(true)}
          title="Quản trị viên trại giam"
          className="group relative p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 text-white shadow-xl shadow-pink-400/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 group-hover:ml-2 text-xs font-bold">
            Quản Trị Viên
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-300 rounded-full animate-ping pointer-events-none" />
        </button>
      </div>

      {/* Modals */}
      <CharacterDetailModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        isFavorite={selectedCharacter ? favorites.includes(selectedCharacter.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onLikeCharacter={handleLikeCharacter}
        onSendLove={handleSendLoveToCharacter}
        onSelectCharacter={setSelectedCharacter}
        onDeleteCharacter={isAdminLoggedIn ? handleDeleteCharacter : undefined}
        allCharacters={characters}
        darkMode={darkMode}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        characters={characters}
        onAddCharacter={handleAddCharacter}
        onUpdateCharacter={handleUpdateCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        bannerBg={bannerBg}
        onUpdateBannerBg={handleUpdateBannerBg}
        siteBg={siteBg}
        onUpdateSiteBg={handleUpdateSiteBg}
        isLoggedIn={isAdminLoggedIn}
        setIsLoggedIn={setIsAdminLoggedIn}
        darkMode={darkMode}
        letters={letters}
        allGenres={allGenres}
        onAddGlobalGenre={handleAddGlobalGenre}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={googleUser}
        onLogin={handleGoogleLogin}
        onLogout={handleGoogleLogout}
        darkMode={darkMode}
      />

      {/* Footer (Matches Design in User Screenshot) */}
      <footer
        className={`py-6 border-t text-center transition-colors relative z-10 ${
          darkMode
            ? 'border-slate-800 text-slate-400 bg-slate-950/60'
            : 'border-sky-200 text-slate-900 bg-sky-50/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>🗝</span>
            <span className="font-extrabold bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 bg-clip-text text-transparent">
              Nhật Ký Tù Án © 2024
            </span>
            <span>•</span>
            <span>Velvet Isolation Ward No.07</span>
            <span>•</span>
            <span className="text-rose-500 font-bold">Thẩm Quyền Tối Cao</span>
          </div>

          <div className="flex items-center gap-3 text-xs flex-wrap justify-center sm:justify-end text-slate-400 dark:text-slate-900">
            <span className="hover:text-rose-500 transition-colors cursor-pointer" onClick={() => setActiveTab('cards')}>
              Lệnh Giữ Người
            </span>
            <span>·</span>
            <span className="hover:text-rose-500 transition-colors cursor-pointer" onClick={() => setActiveTab('psychWard')}>
              Nhật Ký Tâm Lý
            </span>
            <span>·</span>
            <span className="hover:text-rose-500 transition-colors cursor-pointer" onClick={() => setActiveTab('midnightCourt')}>
              Bảo Mật Án Từ
            </span>
            <span>·</span>
            <span className="hover:text-rose-500 transition-colors cursor-pointer" onClick={() => setActiveTab('profile')}>
              Quy Tắc Buồng Giam
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="text-rose-500 hover:underline font-bold cursor-pointer"
            >
              Hồ Sơ Quản Ngục
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
