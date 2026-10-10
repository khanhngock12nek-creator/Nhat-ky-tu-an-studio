import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircleHeart,
  Heart,
  Send,
  Sparkles,
  Gift,
  Smile,
  Volume2,
  Lock,
  ArrowRight,
  Shield,
  Search,
  ExternalLink,
  RotateCcw,
  VolumeX,
} from 'lucide-react';
import { Character, ChatMessage, ActiveTab } from '../types';

interface PrivateChatViewProps {
  characters: Character[];
  onOpenDetail: (character: Character) => void;
  onOpenAdmin: () => void;
  darkMode: boolean;
  isAdmin: boolean;
  onTabChange?: (tab: ActiveTab) => void;
}

const QUICK_GIFTS = [
  { id: 'sweets', name: 'Đồ Ngọt Thăm Nuôi', icon: '🍱', heartBonus: 10, quote: 'Nàng mang đồ ngọt cho ta sao? Nhưng với ta, nàng mới là thứ ngọt ngào nhất...' },
  { id: 'rose', name: 'Hoa Hồng Nhung', icon: '🌹', heartBonus: 15, quote: 'Hoa hồng đẹp thật, nhưng gai của nó chẳng đau bằng nỗi nhớ nàng mỗi đêm trong buồng giam.' },
  { id: 'ring', name: 'Nhẫn Định Ước', icon: '💍', heartBonus: 30, quote: 'Đeo thứ này vào rồi, nàng cả đời cũng đừng hòng trốn khỏi vòng tay của ta.' },
  { id: 'letter', name: 'Thư Tay Bí Mật', icon: '💌', heartBonus: 20, quote: 'Từng nét chữ của nàng, ta sẽ giấu sát ngực áo để mỗi nhịp đập đều khắc tên nàng.' },
];

const QUICK_STICKERS = ['💖', '🌹', '🥺', '⛓️', '💌', '💋', '✨', '🍷', '💍', '🌸'];

export const PrivateChatView: React.FC<PrivateChatViewProps> = ({
  characters,
  onOpenDetail,
  onOpenAdmin,
  darkMode,
  isAdmin,
  onTabChange,
}) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [audioRef] = useState<HTMLAudioElement | null>(() => (typeof Audio !== 'undefined' ? new Audio() : null));

  // Chat messages stored per character
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  // Active selected character
  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId) || characters[0] || null;

  // Initialize selected character when list updates
  useEffect(() => {
    if (characters.length > 0 && !selectedCharacterId) {
      setSelectedCharacterId(characters[0].id);
    }
  }, [characters, selectedCharacterId]);

  // Load chat history from localStorage
  useEffect(() => {
    if (!selectedCharacter) return;
    const storageKey = `husband_chat_${selectedCharacter.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages((prev) => ({ ...prev, [selectedCharacter.id]: JSON.parse(saved) }));
        return;
      } catch (e) {
        console.error('Failed to parse chat messages', e);
      }
    }

    // Default first greeting if empty
    const firstGreeting: ChatMessage = {
      id: `welcome-${selectedCharacter.id}`,
      sender: 'husband',
      text:
        selectedCharacter.firstMessage ||
        selectedCharacter.quote ||
        `Nàng đến thăm ta rồi sao? Trong góc buồng giam lạnh lẽo này, ta đã chờ nàng suốt bao ngày... Hãy lại gần ta một chút.`,
      timestamp: Date.now() - 60000,
      type: 'text',
    };
    setMessages((prev) => ({ ...prev, [selectedCharacter.id]: [firstGreeting] }));
  }, [selectedCharacter?.id]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedCharacterId, isTyping]);

  // Save messages to localStorage
  const saveMessages = (charId: string, newMsgs: ChatMessage[]) => {
    setMessages((prev) => ({ ...prev, [charId]: newMsgs }));
    try {
      localStorage.setItem(`husband_chat_${charId}`, JSON.stringify(newMsgs));
    } catch (e) {
      console.error('Error saving chat', e);
    }
  };

  // Play voice quote
  const handlePlayVoice = (audioUrl?: string, voiceLine?: string) => {
    if (audioUrl && audioRef) {
      if (isPlayingVoice) {
        audioRef.pause();
        setIsPlayingVoice(false);
      } else {
        audioRef.src = audioUrl;
        audioRef.play().catch(console.error);
        setIsPlayingVoice(true);
        audioRef.onended = () => setIsPlayingVoice(false);
      }
    } else if (voiceLine && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voiceLine);
      utterance.lang = 'vi-VN';
      utterance.pitch = selectedCharacter?.voicePitch || 0.9;
      utterance.rate = selectedCharacter?.voiceRate || 0.95;
      setIsPlayingVoice(true);
      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate husband response
  const generateHusbandReply = (userMsg: string, character: Character): string => {
    const text = userMsg.toLowerCase();
    if (text.includes('nhớ') || text.includes('yêu') || text.includes('thương')) {
      return `Nàng nói nhớ ta sao? Có biết rằng vì một câu này của nàng, ta sẵn sàng xé toạc song sắt này để ôm chặt lấy nàng không? Đừng bao giờ rời xa ta...`;
    }
    if (text.includes('lạnh') || text.includes('ăn') || text.includes('ngủ') || text.includes('mệt')) {
      return `Chỉ cần nhìn thấy nàng bình an đến bên ta, mọi đau đớn hay lạnh giá trong ngục tối này đều tan biến hết. Nàng đã nghỉ ngơi chưa, hay lại lo lắng cho ta?`;
    }
    if (text.includes('hôn') || text.includes('ôm') || text.includes('gần')) {
      return `Đưa tay qua song sắt đây... Cho ta chạm vào đầu ngón tay nàng. Trái tim ta đang đập loạn xạ chỉ vì hơi ấm của nàng đấy.`;
    }
    if (text.includes('ngoan') || text.includes('nghe lời') || text.includes('án')) {
      return `Ta ở trong này sẽ ngoan ngoãn thụ án, nhưng với một điều kiện: ngày nào nàng cũng phải đến thăm ta. Nếu nàng dám nhìn người đàn ông khác, ta không chắc mình sẽ làm ra chuyện gì đâu...`;
    }

    // Default romantic response based on character
    const responses = [
      `Ánh mắt nàng nhìn ta khi nói câu đó... làm ta phát điên vì say đắm mất rồi.`,
      `Ở bên nàng, buồng giam này bỗng chốc trở thành thiên đường ấm áp nhất trần gian.`,
      `Mỗi lời nàng nói, ta đều ghi khắc sâu vào tận đáy tim. Nàng muốn ta làm gì cho nàng hôm nay?`,
      `Nếu được ở bên nàng mãi mãi, dẫu bị giam cầm ngàn năm ta cũng tình nguyện cam tâm.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedCharacter) return;

    const userMsgText = inputText.trim();
    setInputText('');
    setShowStickers(false);

    const charId = selectedCharacter.id;
    const currentMsgs = messages[charId] || [];

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: Date.now(),
      type: 'text',
    };

    const updated = [...currentMsgs, userMsg];
    saveMessages(charId, updated);

    // Simulate husband typing and reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyText = generateHusbandReply(userMsgText, selectedCharacter);
      const husbandMsg: ChatMessage = {
        id: `husband-${Date.now()}`,
        sender: 'husband',
        text: replyText,
        timestamp: Date.now(),
        type: 'text',
      };
      saveMessages(charId, [...updated, husbandMsg]);
    }, 1200);
  };

  // Send Gift
  const handleSendGift = (gift: typeof QUICK_GIFTS[0]) => {
    if (!selectedCharacter) return;
    const charId = selectedCharacter.id;
    const currentMsgs = messages[charId] || [];

    const giftMsg: ChatMessage = {
      id: `gift-${Date.now()}`,
      sender: 'user',
      text: `Đã gửi tặng: ${gift.name} ${gift.icon}`,
      timestamp: Date.now(),
      type: 'gift',
      giftName: gift.name,
    };

    const updated = [...currentMsgs, giftMsg];
    saveMessages(charId, updated);

    // Husband reaction
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: ChatMessage = {
        id: `reply-gift-${Date.now()}`,
        sender: 'husband',
        text: gift.quote,
        timestamp: Date.now(),
        type: 'text',
      };
      saveMessages(charId, [...updated, replyMsg]);
    }, 1000);
  };

  // Clear chat
  const handleClearChat = () => {
    if (!selectedCharacter) return;
    saveMessages(selectedCharacter.id, []);
  };

  const currentChatMessages = selectedCharacter ? messages[selectedCharacter.id] || [] : [];
  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.crime && c.crime.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-3 sm:space-y-4">
      {/* SECTION HEADER */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-[10px] font-black tracking-wide border border-rose-200/60 dark:border-rose-900/40">
          <MessageCircleHeart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
          <span>PHÂN KHU TRÒ CHUYỆN RIÊNG TƯ • BIỆT LẬP HOÀNG GIA</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 bg-clip-text text-transparent font-serif">
          Nhắn Tin Riêng Cho Các Chồng
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Phòng giam trái tim độc quyền — Nơi lưu giữ những lời thì thầm tâm sự, món quà thăm nuôi ngọt ngào và từng rung động cơ mật giữa nàng và các chàng.
        </p>
      </div>

      {/* =================================================================== */}
      {/* CONDITION 1: TRỐNG - KHI CHƯA CÓ NHÂN VẬT NÀO (THEO YÊU CẦU CỦA USER) */}
      {/* =================================================================== */}
      {characters.length === 0 ? (
        <div className="space-y-4 sm:space-y-5 animate-fade-in">
          {/* Main Hero Card for Empty Messenger */}
          <div
            className={`p-5 sm:p-7 text-center rounded-2xl sm:rounded-3xl border border-dashed relative overflow-hidden transition-all shadow-md ${
              darkMode
                ? 'bg-slate-900/80 border-rose-900/50 text-slate-100 shadow-rose-950/20'
                : 'bg-white/90 border-rose-200 text-slate-800 shadow-pink-100/40'
            }`}
          >
            {/* Glowing background circles */}
            <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-rose-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

            {/* Animated Large Icon */}
            <div className="relative mx-auto w-14 h-14 mb-3">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-sky-400 blur-md opacity-40 animate-pulse" />
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-400/30">
                <MessageCircleHeart className="w-7 h-7 fill-white animate-bounce-short" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold mb-2 bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 border border-pink-200/60 dark:border-slate-700">
              <Lock className="w-2.5 h-2.5" />
              <span>HỘP THƯ RIÊNG HIỆN ĐANG TRỐNG</span>
            </div>

            <h2 className="text-base sm:text-lg font-black mb-1.5 font-serif">
              Chưa Có Người Chồng Nào Trong Danh Sách Nhắn Tin Riêng
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
              Các buồng giam hiện đang hoàn toàn yên tĩnh và chưa có người chồng nào được đưa vào thụ án.
              Khi Quản Trị Viên khởi tạo phạm nhân mới trong Bảng Điều Khiển, nàng có thể vào đây trò chuyện riêng tư,
              tâm tình 24/7, gửi quà thăm nuôi và lắng nghe từng nhịp thở của chàng!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs text-white bg-gradient-to-r from-pink-500 via-rose-400 to-sky-400 hover:opacity-95 shadow-md shadow-pink-400/25 transition-all cursor-pointer hover:scale-101 active:scale-95"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Mở Bảng Quản Trị (Thêm Chồng Mới)</span>
              </button>

              {onTabChange && (
                <>
                  <button
                    type="button"
                    onClick={() => onTabChange('home')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                        : 'bg-white border-pink-200 text-slate-700 hover:bg-pink-50 shadow-2xs'
                    }`}
                  >
                    <span>Quay Về Cửa Nhà Giam</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onTabChange('letters')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 text-pink-300 hover:bg-slate-700'
                        : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50 shadow-2xs'
                    }`}
                  >
                    <span>Tường Thư & Ý Tưởng Chồng Mới</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Feature Showcase Grid (Previewing what husband chat will offer) */}
          <div className="space-y-4">
            <h3 className="text-center text-xs font-extrabold tracking-wider text-slate-400 uppercase">
              ✨ Khám Phá Đặc Quyền Khi Nhắn Tin Riêng Cùng Các Chồng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-pink-100 shadow-xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center mb-3">
                  <MessageCircleHeart className="w-5 h-5 fill-pink-500" />
                </div>
                <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">
                  Tâm Tình & Đối Thoại 24/7
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Từng người chồng mang tính cách độc bản (chiếm hữu, sủng ái, ngạo kiều, ôn nhu) với những lời đáp đầy rung động.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-pink-100 shadow-xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-3">
                  <Volume2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">
                  Giọng Nói Cơ Mật Thì Thầm
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Lắng nghe voice note chân thực, hơi thở và lời thủ thỉ ấm áp phát trực tiếp từ buồng giam.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-pink-100 shadow-xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3">
                  <Gift className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">
                  Thăm Nuôi & Tặng Quà Bất Ngờ
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Gửi hoa hồng nhung, bánh ngọt, nhẫn định ước để thắp lửa nhịp tim và mở khóa lời thoại cảm kích.
                </p>
              </div>

              <div
                className={`p-5 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-pink-100 shadow-xs'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5 fill-sky-400 text-sky-400" />
                </div>
                <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">
                  Lưu Giữ Kỷ Niệm Tù Án
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Mọi khoảnh khắc rung động và dòng tin nhắn được niêm phong an toàn chỉ dành riêng cho nàng và chàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* CONDITION 2: KHI CÓ NHÂN VẬT - GIAO DIỆN CHAT ĐẦY ĐỦ VÀ SỐNG ĐỘNG */
        /* =================================================================== */
        <div
          className={`rounded-3xl border overflow-hidden shadow-2xl transition-all grid grid-cols-1 lg:grid-cols-12 min-h-[620px] ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 text-slate-100'
              : 'bg-white/95 border-pink-100 text-slate-800 shadow-pink-100/40'
          }`}
        >
          {/* ========================================= */}
          {/* LEFT SIDEBAR: DANH SÁCH CÁC CHỒNG         */}
          {/* ========================================= */}
          <div
            className={`lg:col-span-4 border-b lg:border-b-0 lg:border-r p-4 sm:p-5 flex flex-col space-y-4 ${
              darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-pink-100 bg-rose-50/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">
                  Danh Sách Các Chồng ({characters.length})
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 font-bold">
                Online
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm người chồng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none border transition-all ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-rose-500'
                    : 'bg-white border-pink-200 text-slate-800 placeholder-slate-400 focus:border-rose-400'
                }`}
              />
            </div>

            {/* Characters List */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[480px] pr-1">
              {filteredCharacters.map((char) => {
                const isSelected = char.id === selectedCharacter?.id;
                const charMsgs = messages[char.id] || [];
                const lastMsg = charMsgs[charMsgs.length - 1];

                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setSelectedCharacterId(char.id)}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 cursor-pointer border ${
                      isSelected
                        ? darkMode
                          ? 'bg-slate-800/90 border-rose-500/80 shadow-md shadow-rose-950/50'
                          : 'bg-white border-rose-300 shadow-md shadow-pink-200/50 scale-[1.01]'
                        : darkMode
                        ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-300'
                        : 'bg-white/60 border-pink-100/60 hover:bg-white text-slate-600'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xs border border-pink-200/60">
                        {char.avatarUrl ? (
                          <img
                            src={char.avatarUrl}
                            alt={char.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center font-bold text-white text-base ${
                              char.avatarGradient || 'bg-gradient-to-tr from-pink-500 to-rose-400'
                            }`}
                          >
                            {char.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs truncate text-slate-900 dark:text-white">
                          {char.name}
                        </span>
                        {char.rarity && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md font-black bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300">
                            {char.rarity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {lastMsg ? lastMsg.text : char.quote || 'Đang chờ nàng nhắn tin...'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================= */}
          {/* RIGHT MAIN CHAT AREA                      */}
          {/* ========================================= */}
          {selectedCharacter && (
            <div className="lg:col-span-8 flex flex-col h-[620px] relative">
              {/* Chat Top Header */}
              <div
                className={`p-4 border-b flex items-center justify-between gap-3 shrink-0 ${
                  darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-pink-100 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-xs border border-pink-200 shrink-0">
                    {selectedCharacter.avatarUrl ? (
                      <img
                        src={selectedCharacter.avatarUrl}
                        alt={selectedCharacter.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center font-bold text-white text-base ${
                          selectedCharacter.avatarGradient || 'bg-gradient-to-tr from-pink-500 to-rose-400'
                        }`}
                      >
                        {selectedCharacter.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white font-serif">
                        {selectedCharacter.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-rose-50 dark:bg-slate-800 text-rose-500">
                        {selectedCharacter.zone || 'Phòng Giam Riêng'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Đang đợi nàng • Nhịp tim {selectedCharacter.heartbeat || 120} bpm</span>
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  {(selectedCharacter.voiceAudioUrl || selectedCharacter.voiceLine) && (
                    <button
                      type="button"
                      onClick={() =>
                        handlePlayVoice(selectedCharacter.voiceAudioUrl, selectedCharacter.voiceLine)
                      }
                      title="Lắng nghe giọng nói của chàng"
                      className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isPlayingVoice
                          ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                          : darkMode
                          ? 'bg-slate-800 border-slate-700 text-rose-300 hover:bg-slate-700'
                          : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                      }`}
                    >
                      {isPlayingVoice ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">Giọng Nói</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenDetail(selectedCharacter)}
                    title="Xem hồ sơ chi tiết"
                    className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-white border-pink-200 text-slate-700 hover:bg-pink-50'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hồ Sơ</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="Làm mới cuộc trò chuyện"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Message Feed Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {currentChatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isGift = msg.type === 'gift';

                  if (isGift) {
                    return (
                      <div key={msg.id} className="flex justify-center my-2">
                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/20 to-sky-500/10 border border-pink-300/40 text-pink-600 dark:text-pink-300 text-xs font-bold flex items-center gap-2 shadow-xs">
                          <Gift className="w-3.5 h-3.5 text-rose-500 animate-bounce-short" />
                          <span>{msg.text}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-2xs border border-pink-200">
                          {selectedCharacter.avatarUrl ? (
                            <img
                              src={selectedCharacter.avatarUrl}
                              alt={selectedCharacter.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center font-bold text-white text-xs ${
                                selectedCharacter.avatarGradient || 'bg-gradient-to-tr from-pink-500 to-rose-400'
                              }`}
                            >
                              {selectedCharacter.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
                          isUser
                            ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-br-xs'
                            : darkMode
                            ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-xs'
                            : 'bg-white text-slate-800 border border-pink-200/80 rounded-bl-xs shadow-pink-100/30'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span
                          className={`text-[9px] block text-right mt-1 opacity-70 ${
                            isUser ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-pink-200">
                      {selectedCharacter.avatarUrl ? (
                        <img
                          src={selectedCharacter.avatarUrl}
                          alt={selectedCharacter.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-pink-400 text-white flex items-center justify-center text-xs font-bold">
                          {selectedCharacter.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="px-3 py-2 rounded-2xl bg-pink-100/50 dark:bg-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-1 text-[11px] font-medium text-slate-400">
                        {selectedCharacter.name} đang soạn tin...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions (Gifts & Stickers) */}
              <div
                className={`px-4 py-2 border-t flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 ${
                  darkMode ? 'bg-slate-950/30 border-slate-800' : 'bg-pink-50/40 border-pink-100'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                  Tặng Quà:
                </span>
                {QUICK_GIFTS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSendGift(g)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-1 cursor-pointer ${
                      darkMode
                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                        : 'bg-white border-pink-200 hover:bg-pink-50 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <span>{g.icon}</span>
                    <span className="text-[11px]">{g.name}</span>
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className={`p-3 sm:p-4 border-t flex items-center gap-2 shrink-0 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-pink-100'
                }`}
              >
                {/* Sticker picker toggle */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStickers(!showStickers)}
                    className="p-2 rounded-xl text-slate-400 hover:text-pink-500 cursor-pointer transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  {/* Sticker Popover */}
                  {showStickers && (
                    <div
                      className={`absolute bottom-12 left-0 z-50 p-2 rounded-2xl border shadow-xl flex items-center gap-1.5 ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-pink-200'
                      }`}
                    >
                      {QUICK_STICKERS.map((stk) => (
                        <button
                          key={stk}
                          type="button"
                          onClick={() => {
                            setInputText((prev) => prev + stk);
                            setShowStickers(false);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-lg hover:scale-125 transition-transform cursor-pointer"
                        >
                          {stk}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder={`Gửi lời thì thầm tới ${selectedCharacter.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm outline-none border transition-all ${
                    darkMode
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-rose-500'
                      : 'bg-pink-50/50 border-pink-200 text-slate-800 placeholder-slate-400 focus:border-rose-400'
                  }`}
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs shadow-md shadow-pink-300/40 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Gửi</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
