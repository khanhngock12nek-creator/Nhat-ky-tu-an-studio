import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Sparkles,
  KeyRound,
  LogOut,
  Palette,
  Upload,
  RotateCcw,
  Users,
  Image as ImageIcon,
  Volume2,
  Mic,
  Play,
  Square,
  Heart,
  Mail,
  CheckCheck,
  Folder,
  Send,
  Layers,
  PlusCircle,
  Eye,
  Sliders,
  ExternalLink,
  Tag,
  MessageSquare,
  Link as LinkIcon,
  Search,
  Shield,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character, PrisonZone, Letter } from '../types';
import { compressImageFile, compressBase64Image } from '../utils/imageUtils';
import {
  ADMIN_PASSWORD,
  OFFICIAL_GENRES,
  ADMIN_PRESETS,
  AVATAR_GRADIENTS,
  PRISON_ZONES,
  POPULAR_VOICE_ACTORS,
} from '../data/constants';
import bannerImgDefault from '../assets/images/prison_diary_hero_banner_1791465806036.jpg';
import bannerImgMoonlit from '../assets/images/banner_moonlit_rose_palace_1791467212504.jpg';
import bannerImgSakura from '../assets/images/banner_crystal_sakura_garden_1791467236669.jpg';
import bannerImgVioletBlue from '../assets/images/banner_violet_blue_celestial_1791468303038.jpg';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onAddCharacter: (character: Character) => void;
  onUpdateCharacter: (character: Character) => void;
  onDeleteCharacter: (id: string) => void;
  bannerBg: string;
  onUpdateBannerBg: (bg: string) => void;
  siteBg: string;
  onUpdateSiteBg: (bg: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  darkMode: boolean;
  letters?: Letter[];
  allGenres?: string[];
  onAddGlobalGenre?: (genre: string) => void;
}

export const PRESET_THEMES = [
  {
    id: 'mist',
    title: 'Sương Mù Buồng Giam',
    subtitle: 'Mặc định hoa hồng',
    src: bannerImgDefault,
  },
  {
    id: 'rose_prison',
    title: 'Ngục Tối Hoa Hồng',
    subtitle: 'Deep Velvet',
    src: bannerImgMoonlit,
  },
  {
    id: 'crescent',
    title: 'Đêm Trăng Khuyết',
    subtitle: 'Midnight Glamour',
    src: bannerImgVioletBlue,
  },
  {
    id: 'confession',
    title: 'Phòng Xưng Tội',
    subtitle: 'Crystal Sanctuary',
    src: bannerImgSakura,
  },
];

interface AdminInboxMessage {
  id: string;
  senderName: string;
  senderAvatarText: string;
  senderAvatarBg: string;
  timeAgo: string;
  category: 'love' | 'idea' | 'review' | 'sound';
  categoryLabel: string;
  hasRedDot?: boolean;
  content: string;
  statusTag: string;
  badgeTag?: string;
  badgeColor?: string;
  isLiked?: boolean;
  fullLetter?: Letter;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  bannerBg,
  onUpdateBannerBg,
  siteBg,
  onUpdateSiteBg,
  isLoggedIn,
  setIsLoggedIn,
  darkMode,
  letters = [],
  allGenres = OFFICIAL_GENRES as unknown as string[],
  onAddGlobalGenre,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // View switch: 'all' | 'create' | 'inbox' | 'theme' | 'charactersList'
  const [viewMode, setViewMode] = useState<'all' | 'create' | 'inbox' | 'theme' | 'charactersList'>('all');
  const [charSearchQuery, setCharSearchQuery] = useState('');
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);

  // Form mode for character management
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [editingCharId, setEditingCharId] = useState<string | null>(null);
  const [showCharacterListDrawer, setShowCharacterListDrawer] = useState(false);

  // Character Form state
  const [name, setName] = useState('Lục Cảnh Tiêu');
  const [prisonId, setPrisonId] = useState('#007');
  const [zone, setZone] = useState<PrisonZone>('Phòng Giam Lạnh');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    'Yandere',
    'Chiếm Hữu Tuyệt Đối',
    'Bác Sĩ Tà Mị',
    'Tù Nhân Thao Túng',
  ]);
  const [newGenreInput, setNewGenreInput] = useState('');
  const [backstory, setBackstory] = useState(
    'Từng là vị thẩm phán trẻ tuổi nhất hoàng gia, tự nguyện mang cùm xích bằng bạc đính hoa hồng chỉ để giam cầm chính mình bên cạnh quản ngục. Mỗi khi nghe tiếng chân nàng bước qua phòng giam số 07, ánh mắt chàng lại bừng lên ngọn lửa chiếm hữu điên cuồng.'
  );
  const [firstMessage, setFirstMessage] = useState(
    'Chào nàng quản ngục bé nhỏ, lại tới giờ kiểm tra buồng giam của anh rồi sao? Lại gần đây một chút, đừng đứng xa như thế...'
  );
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarGradient, setAvatarGradient] = useState(AVATAR_GRADIENTS[0]);
  const [status, setStatus] = useState('Đã khoá buồng giam');
  const [chatLink, setChatLink] = useState('https://c.ai');
  const [danger, setDanger] = useState<number>(50);
  const [loyalty, setLoyalty] = useState<number>(99);
  const [sentenceTerm, setSentenceTerm] = useState('Án Chung Thân');
  const [possession, setPossession] = useState('Chiếm Hữu Tuyệt Đối');

  // Voice & Audio Dubbing states
  const [showVoiceSection, setShowVoiceSection] = useState(false);
  const [voiceActor, setVoiceActor] = useState('Haruto K. [Độc quyền AI]');
  const [voiceAudioUrl, setVoiceAudioUrl] = useState('');
  const [voiceLine, setVoiceLine] = useState('');
  const [voiceDuration, setVoiceDuration] = useState('0:14');
  const [voicePitch, setVoicePitch] = useState(0.85);
  const [voiceRate, setVoiceRate] = useState(0.95);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState(false);

  // Column 2: Inbox states
  const [inboxFilter, setInboxFilter] = useState<'all' | 'love' | 'idea' | 'review'>('all');
  const [replyTarget, setReplyTarget] = useState('Yuki_Amane');
  const [replyContent, setReplyContent] = useState(
    'Gửi nàng thiếu nữ ngoài song sắt, tiếng lòng của nàng đã được gửi tới tận buồng giam số 07. Phạm nhân Lục Cảnh Tiêu đã mỉm cười khi nghe những dòng này...'
  );
  const [likedMessages, setLikedMessages] = useState<string[]>(['msg-1']);
  const [deletedMsgIds, setDeletedMsgIds] = useState<string[]>([]);

  // Column 3: Theme states
  const [wallpaperTarget, setWallpaperTarget] = useState<'banner' | 'site'>('banner');
  const [isVibrantMode, setIsVibrantMode] = useState(true);
  const [glassBlur, setGlassBlur] = useState<number>(() => {
    const saved = localStorage.getItem('nhat_ky_tu_an_glass_blur');
    return saved ? parseInt(saved, 10) : 16;
  });
  const [overlayDarkness, setOverlayDarkness] = useState<number>(() => {
    const saved = localStorage.getItem('nhat_ky_tu_an_overlay_darkness');
    return saved ? parseInt(saved, 10) : 25;
  });
  const [particleType, setParticleType] = useState<string>(() => {
    return localStorage.getItem('nhat_ky_tu_an_particles_type') || 'petals';
  });
  const [customBgUrlInput, setCustomBgUrlInput] = useState('');

  // Refs & Notification
  const charFileInputRef = useRef<HTMLInputElement | null>(null);
  const wallpaperFileInputRef = useRef<HTMLInputElement | null>(null);
  const voiceFileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('nhat_ky_tu_an_glass_blur', glassBlur.toString());
    localStorage.setItem('nhat_ky_tu_an_overlay_darkness', overlayDarkness.toString());
    localStorage.setItem('nhat_ky_tu_an_particles_type', particleType);
  }, [glassBlur, overlayDarkness, particleType]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setPasswordError(false);
      setPasswordInput('');
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#f43f5e', '#ec4899', '#fda4af'],
        });
      } catch {
        // ignore
      }
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewMode('all');
  };

  // Helper: Demo + Stored Letters for Column 2
  const demoInboxLetters: AdminInboxMessage[] = [
    {
      id: 'msg-1',
      senderName: 'Yuki_Amane',
      senderAvatarText: 'Y',
      senderAvatarBg: 'bg-rose-500 text-white',
      timeAgo: '10 phút trước',
      category: 'love',
      categoryLabel: 'Lời tỏ tình',
      hasRedDot: true,
      content:
        '“Trời ơi Lục Cảnh Tiêu làm tim em vỡ vụn! Giọng thì thầm nghe nổi da gà luôn á Quản Ngục ơi...”',
      statusTag: '↩ Đang soạn phúc đáp',
      badgeTag: 'Ưu tiên cao',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200',
    },
    {
      id: 'msg-2',
      senderName: 'KuroNeko99',
      senderAvatarText: 'K',
      senderAvatarBg: 'bg-sky-500 text-white',
      timeAgo: 'Hôm nay, 08:30',
      category: 'idea',
      categoryLabel: 'Đề xuất nhân vật',
      content:
        '“Mình đề xuất thêm nhân vật Bác sĩ Pháp Y hai mặt: ban ngày dịu dàng tiêm thuốc, đêm đến giam cầm quản ngục trong phòng xét nghiệm...”',
      statusTag: '↩ Trả lời thư này',
      badgeTag: 'Ý tưởng thú vị',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200',
    },
    {
      id: 'msg-3',
      senderName: 'HoaHongGai',
      senderAvatarText: 'H',
      senderAvatarBg: 'bg-purple-500 text-white',
      timeAgo: 'Hôm qua, 22:15',
      category: 'sound',
      categoryLabel: 'Góp ý âm thanh',
      content:
        '“Hiệu ứng lắc xích buồng giam lúc quay gacha hơi nhỏ một xíu, nếu quản ngục cho tiếng xích kêu giòn giã hơn thì mê ly luôn ạ!”',
      statusTag: '↩ Trả lời thư này',
      badgeTag: 'Âm thanh',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200',
    },
  ];

  // Map real letters into inbox format
  const mappedUserLetters: AdminInboxMessage[] = letters.map((l) => ({
    id: l.id,
    senderName: l.senderName || 'Nàng Quản Ngục',
    senderAvatarText: l.senderName ? l.senderName.charAt(0).toUpperCase() : 'Q',
    senderAvatarBg: 'bg-pink-500 text-white',
    timeAgo: 'Vừa gửi',
    category: l.category === 'idea' ? 'idea' : l.category === 'love' ? 'love' : 'review',
    categoryLabel: l.category === 'idea' ? 'Ý tưởng mới' : l.category === 'love' ? 'Thư tình' : 'Đánh giá web',
    content: `“${l.content}”`,
    statusTag: '↩ Trả lời thư này',
    badgeTag: l.category === 'idea' ? 'Ý tưởng mới' : 'Thư tay',
    badgeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300 border-pink-200',
    fullLetter: l,
  }));

  const combinedInbox = [...mappedUserLetters, ...demoInboxLetters].filter(
    (m) => !deletedMsgIds.includes(m.id)
  );

  const filteredInbox = combinedInbox.filter((item) => {
    if (inboxFilter === 'all') return true;
    if (inboxFilter === 'love') return item.category === 'love';
    if (inboxFilter === 'idea') return item.category === 'idea';
    if (inboxFilter === 'review') return item.category === 'review' || item.category === 'sound';
    return true;
  });

  // Handle Genre tag remove & add
  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
  };

  const handleAddGenre = () => {
    const trimmed = newGenreInput.trim();
    if (trimmed && !selectedGenres.includes(trimmed)) {
      setSelectedGenres((prev) => [...prev, trimmed]);
      if (onAddGlobalGenre) {
        onAddGlobalGenre(trimmed);
      }
      setNewGenreInput('');
      showToast(`Đã thêm thể loại "${trimmed}" thành công!`);
    }
  };

  // Avatar upload with automatic compression to fit within Firestore 1MB limits
  const handleCharAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Đang tối ưu hóa và nén chân dung áp giải...');
      const compressed = await compressImageFile(file, 640, 0.7);
      setAvatarUrl(compressed);
      showToast('Đã tải lên và nén tối ưu chân dung áp giải thành công! ✨');
    } catch (err) {
      console.error('Lỗi khi nén ảnh:', err);
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          try {
            const compressedFallback = await compressBase64Image(reader.result, 640, 640, 0.7);
            setAvatarUrl(compressedFallback);
          } catch {
            setAvatarUrl(reader.result.slice(0, 200000));
          }
          showToast('Đã tải lên chân dung áp giải!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice file upload
  const handleVoiceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: prevent exceeding Firestore limits (max 800KB for audio)
    if (file.size > 800 * 1024) {
      showToast('Tệp âm thanh quá lớn (>800KB). Vui lòng chọn tệp ngắn hoặc sử dụng tính năng ghi âm mic trực tiếp!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setVoiceAudioUrl(reader.result);
        const tempAudio = new Audio(reader.result);
        tempAudio.onloadedmetadata = () => {
          const secs = Math.round(tempAudio.duration);
          if (!isNaN(secs) && secs > 0) {
            const m = Math.floor(secs / 60);
            const s = secs % 60;
            setVoiceDuration(`${m}:${s < 10 ? '0' : ''}${s}`);
          }
        };
        showToast('Đã tải lên tệp âm thanh giọng nói!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Voice recording
  const handleStartRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Trình duyệt không hỗ trợ micro thu âm!');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setVoiceAudioUrl(reader.result);
            showToast('Đã lưu bản ghi âm giọng nói thành công!');
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            handleStopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      alert('Không thể truy cập microphone!');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setVoiceDuration(`0:${recordingTime < 10 ? '0' : ''}${recordingTime}`);
    }
  };

  // Voice playback preview
  const handlePlayVoicePreview = () => {
    if (isPlayingAudioPreview) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudioPreview(false);
      return;
    }

    setIsPlayingAudioPreview(true);

    if (voiceAudioUrl) {
      try {
        const audio = new Audio(voiceAudioUrl);
        previewAudioRef.current = audio;
        audio.onended = () => setIsPlayingAudioPreview(false);
        audio.onerror = () => setIsPlayingAudioPreview(false);
        audio.play().catch(() => setIsPlayingAudioPreview(false));
      } catch {
        setIsPlayingAudioPreview(false);
      }
    } else {
      const textToSpeak = voiceLine.trim() || firstMessage.trim() || 'Chào nàng quản ngục, hôm nay nàng lại đến thăm ta sao?';
      if ('speechSynthesis' in window && textToSpeak) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.lang = 'vi-VN';
          utterance.pitch = voicePitch;
          utterance.rate = voiceRate;
          utterance.onend = () => setIsPlayingAudioPreview(false);
          utterance.onerror = () => setIsPlayingAudioPreview(false);
          window.speechSynthesis.speak(utterance);
        } catch {
          setIsPlayingAudioPreview(false);
        }
      } else {
        setTimeout(() => setIsPlayingAudioPreview(false), 1500);
      }
    }
  };

  const resetForm = () => {
    setIsEditingExisting(false);
    setEditingCharId(null);
    setName('');
    setPrisonId('');
    setZone('Phòng Giam Lạnh');
    setSelectedGenres(['Chiếm hữu', 'Ngọt sủng']);
    setBackstory('');
    setFirstMessage('');
    setChatLink('');
    setAvatarUrl('');
    setAvatarGradient(AVATAR_GRADIENTS[0]);
    setStatus('Đang thụ án');
    setDanger(50);
    setLoyalty(99);
    setSentenceTerm('Án Chung Thân');
    setPossession('Chiếm Hữu Tuyệt Đối');
    setVoiceActor('Haruto K. [Độc quyền AI]');
    setVoiceAudioUrl('');
    setVoiceLine('');
    setVoiceDuration('0:14');
  };

  const handleLoadPreset = (preset: typeof ADMIN_PRESETS[number]) => {
    setIsEditingExisting(false);
    setEditingCharId(null);
    setName(preset.name);
    setPrisonId(preset.prisonId);
    if (preset.zone) setZone(preset.zone as PrisonZone);
    setSelectedGenres([...preset.genres]);
    setBackstory(preset.backstory);
    setFirstMessage(preset.firstMessage);
    setChatLink(preset.chatLink || 'https://c.ai');
    setAvatarUrl(preset.avatarUrl || '');
    setStatus(preset.status);
    if (preset.danger !== undefined) setDanger(preset.danger);
    if (preset.loyalty !== undefined) setLoyalty(preset.loyalty);
    if (preset.sentenceTerm) setSentenceTerm(preset.sentenceTerm);
    if (preset.possession) setPossession(preset.possession);
    if (preset.voiceActor) setVoiceActor(preset.voiceActor);
    if (preset.voiceDuration) setVoiceDuration(preset.voiceDuration);
    showToast(`Đã áp dụng mẫu: ${preset.name}`);
  };

  // Character Submit Handler
  const handleSaveCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Vui lòng nhập họ & tên phạm nhân!');
      return;
    }

    try {
      if (isEditingExisting && editingCharId) {
        const existing = characters.find((c) => c.id === editingCharId);
        const updated: Character = {
          id: editingCharId,
          name: name.trim(),
          prisonId: prisonId.trim() || existing?.prisonId || '#001',
          zone,
          genres: selectedGenres.length > 0 ? selectedGenres : ['Ngọt sủng'],
          backstory: backstory.trim(),
          firstMessage: firstMessage.trim(),
          chatLink: chatLink.trim(),
          avatarUrl: avatarUrl.trim(),
          avatarGradient,
          status: status.trim() || 'Đang thụ án',
          likes: existing?.likes || 0,
          danger,
          loyalty,
          sentenceTerm: sentenceTerm.trim() || 'Án Chung Thân',
          possession: possession.trim() || 'Chiếm Hữu Tuyệt Đối',
          voiceActor: voiceActor.trim(),
          voiceAudioUrl: voiceAudioUrl.trim(),
          voiceLine: voiceLine.trim(),
          voiceDuration: voiceDuration.trim() || '0:14',
          voicePitch,
          voiceRate,
          createdAt: existing?.createdAt || Date.now(),
        };
        await onUpdateCharacter(updated);
        showToast(`Đã cập nhật thành công hồ sơ của "${name}"!`);
        setIsEditingExisting(false);
        setEditingCharId(null);
      } else {
        const newChar: Character = {
          id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: name.trim(),
          prisonId: prisonId.trim() || `#00${characters.length + 1}`,
          zone,
          genres: selectedGenres.length > 0 ? selectedGenres : ['Chiếm hữu'],
          backstory: backstory.trim() || 'Hồ sơ phạm nhân bảo mật.',
          firstMessage: firstMessage.trim() || 'Chào nàng quản ngục bé nhỏ...',
          chatLink: chatLink.trim() || 'https://c.ai',
          avatarUrl: avatarUrl.trim(),
          avatarGradient,
          status: status.trim() || 'Đang thụ án',
          likes: 0,
          danger,
          loyalty,
          sentenceTerm: sentenceTerm.trim() || 'Án Chung Thân',
          possession: possession.trim() || 'Chiếm Hữu Tuyệt Đối',
          voiceActor: voiceActor.trim(),
          voiceAudioUrl: voiceAudioUrl.trim(),
          voiceLine: voiceLine.trim(),
          voiceDuration: voiceDuration.trim() || '0:14',
          voicePitch,
          voiceRate,
          createdAt: Date.now(),
        };
        await onAddCharacter(newChar);
        showToast(`Đã lưu "${name}"! Hồ sơ đã được đồng bộ lên máy chủ để tất cả người dùng khác cùng thấy.`);
        resetForm();
      }
    } catch (err) {
      console.error("Lỗi khi lưu nhân vật:", err);
      showToast(`Đã lưu cục bộ hồ sơ của "${name}". Đang tiếp tục đồng bộ máy chủ.`);
    }

    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#a855f7'],
      });
    } catch {
      // ignore
    }
  };

  const handleEditCharacter = (char: Character) => {
    setIsEditingExisting(true);
    setEditingCharId(char.id);
    setName(char.name);
    setPrisonId(char.prisonId);
    if (char.zone) setZone(char.zone as PrisonZone);
    setSelectedGenres(char.genres || []);
    setBackstory(char.backstory);
    setFirstMessage(char.firstMessage);
    setChatLink(char.chatLink || '');
    setAvatarUrl(char.avatarUrl || '');
    setAvatarGradient(char.avatarGradient || AVATAR_GRADIENTS[0]);
    setStatus(char.status || 'Đã khoá buồng giam');
    setDanger(char.danger !== undefined ? char.danger : 50);
    setLoyalty(char.loyalty !== undefined ? char.loyalty : 99);
    setSentenceTerm(char.sentenceTerm || char.crime || 'Án Chung Thân');
    setPossession(char.possession || 'Chiếm Hữu Tuyệt Đối');
    setVoiceActor(char.voiceActor || 'Haruto K. [Độc quyền AI]');
    setVoiceAudioUrl(char.voiceAudioUrl || '');
    setVoiceLine(char.voiceLine || '');
    setVoiceDuration(char.voiceDuration || '0:14');
    setShowCharacterListDrawer(false);
    showToast(`Đang chỉnh sửa hồ sơ của "${char.name}"`);
  };

  // Reply submit in Column 2
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    showToast(`Đã gửi mật ấn phúc đáp tới nàng ${replyTarget}!`);
    setReplyContent('');
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#ec4899', '#f43f5e', '#38bdf8'],
      });
    } catch {
      // ignore
    }
  };

  // 1-Click Adopt Idea from Column 2 into Column 1
  const handleAdoptIdea = (msg: AdminInboxMessage) => {
    setName(msg.senderName.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9 ]/g, '') + ' [Phạm Nhân]');
    setBackstory(msg.content.replace(/[“”]/g, ''));
    setSelectedGenres(['Chiếm hữu', 'Ý tưởng mới']);
    setZone('Phòng Giam Lạnh');
    showToast(`Đã đưa ý tưởng từ "${msg.senderName}" vào biểu mẫu Khởi Tạo!`);
  };

  // Wallpaper Handlers
  const handleSelectWallpaperTheme = (src: string, title: string) => {
    if (wallpaperTarget === 'banner') {
      onUpdateBannerBg(src);
      showToast(`Đã chọn nền Cửa Nhà Giam: ${title}`);
    } else {
      onUpdateSiteBg(src);
      showToast(`Đã chọn nền Toàn Bộ Trang Web: ${title}`);
    }
  };

  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (wallpaperTarget === 'banner') {
          onUpdateBannerBg(reader.result);
        } else {
          onUpdateSiteBg(reader.result);
        }
        showToast('Đã áp dụng ảnh nền cá nhân thành công!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomBgUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBgUrlInput.trim()) return;
    if (wallpaperTarget === 'banner') {
      onUpdateBannerBg(customBgUrlInput.trim());
    } else {
      onUpdateSiteBg(customBgUrlInput.trim());
    }
    showToast('Đã áp dụng ảnh nền từ đường dẫn!');
    setCustomBgUrlInput('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-7xl rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all my-auto max-h-[94vh] flex flex-col relative ${
          darkMode
            ? 'bg-slate-950/95 border-pink-900/40 text-slate-100 shadow-pink-950/40'
            : 'bg-[#fffafd] border-pink-200/90 text-slate-800 shadow-pink-200/50'
        }`}
      >
        {/* Soft Ambient Rose Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-300/15 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-300/15 dark:bg-rose-950/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP HEADER (Exactly like user screenshot) */}
        <div
          className={`px-5 sm:px-8 py-5 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 relative z-10 ${
            darkMode ? 'border-slate-800/80 bg-slate-900/60' : 'border-pink-100 bg-white/70'
          }`}
        >
          {/* Left Title Zone */}
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-[11px] font-black text-rose-600 dark:text-rose-300 uppercase tracking-wider shadow-2xs">
              <span>★ PHÂN KHU THẨM QUYỀN QUẢN NGỤC • Phiên Bản 2.4 Rose–Gold</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-serif flex items-center gap-2">
              <span>Bảng Điều Khiển & Sáng Tạo Tù Án</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Nơi quản ngục dệt nên những xiềng xích ái tình, hồi đáp những bức thư thì thầm từ người hâm mộ và kiến tạo bầu không khí mê hoặc cho toàn bộ ngục thất.
            </p>
          </div>

          {/* Right Header Navigation Pills & Status */}
          <div className="flex items-center gap-2.5 flex-wrap self-end md:self-auto">
            {isLoggedIn && (
              <>
                {/* Switcher Pills */}
                <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1 shadow-inner text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setViewMode('all')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'all'
                        ? 'bg-rose-500 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Toàn Cảnh 3 Cột</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('create')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'create'
                        ? 'bg-rose-500 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Khởi Tạo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('charactersList')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'charactersList'
                        ? 'bg-rose-500 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Danh Sách ({characters.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('inbox')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'inbox'
                        ? 'bg-rose-500 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Hòm Thư ({combinedInbox.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('theme')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'theme'
                        ? 'bg-rose-500 text-white shadow-xs font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Giao Diện</span>
                  </button>
                </div>

                {/* Status Pill: Buồng giam: 12 Đang hoạt động */}
                <div className="px-3.5 py-1.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/70 border border-rose-200/80 dark:border-rose-900/60 flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>
                    Buồng giam: <strong>{characters.length} Đang hoạt động</strong>
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                  title="Đăng xuất quản trị viên"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}
        {notificationMsg && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 animate-bounce-short">
            <Check className="w-4 h-4" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* BODY AREA */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 relative z-10">
          {!isLoggedIn ? (
            /* LOGIN SCREEN */
            <form onSubmit={handleLogin} className="max-w-md mx-auto py-12 text-center space-y-5">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-xl shadow-pink-300/40">
                <Lock className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
                  Xác Thực Quản Trị Viên
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Nhập mật mã quản trị cơ mật để mở Bảng Điều Khiển & Sáng Tạo Tù Án.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Nhập mật mã bảo mật..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(false);
                  }}
                  autoFocus
                  className={`w-full px-4 py-3 rounded-2xl border text-center text-xl tracking-widest font-mono outline-none transition-all shadow-xs ${
                    passwordError
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-500'
                      : darkMode
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-rose-500'
                      : 'bg-white border-pink-200 text-slate-800 focus:border-rose-500'
                  }`}
                />
                {passwordError && (
                  <p className="text-xs text-rose-500 flex items-center justify-center gap-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" /> Mật mã không chính xác!
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-rose-400/30 transition-all cursor-pointer"
              >
                Mở Khoá Bảng Điều Khiển
              </button>
            </form>
          ) : (
            <>
              {viewMode === 'charactersList' && (
                <div
                  className={`rounded-3xl border p-5 sm:p-6 space-y-5 transition-all shadow-sm max-w-4xl mx-auto w-full ${
                    darkMode
                      ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                      : 'bg-white/90 border-pink-100/90 text-slate-800 shadow-pink-100/30'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500 shadow-2xs">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                          QUẢN LÝ & PHÓNG THÍCH • Danh Sách Phạm Nhân Hiện Có
                        </h2>
                        <p className="text-[11px] text-slate-400">
                          Quản lý toàn bộ hồ sơ giam cầm & xóa nhân vật
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                      Đang giam giữ: {characters.length}
                    </span>
                  </div>

                  {/* Search and Bulk Delete Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm phạm nhân, buồng giam..."
                        value={charSearchQuery}
                        onChange={(e) => setCharSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-rose-400 shadow-2xs"
                      />
                    </div>

                    {/* Quick Select All */}
                    {characters.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedCharIds.length === characters.length) {
                            setSelectedCharIds([]);
                          } else {
                            setSelectedCharIds(characters.map((c) => c.id));
                          }
                        }}
                        className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        {selectedCharIds.length === characters.length
                          ? '✓ Bỏ chọn'
                          : `Chọn tất cả (${characters.length})`}
                      </button>
                    )}

                                    {selectedCharIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const count = selectedCharIds.length;
                          selectedCharIds.forEach((id) => {
                            onDeleteCharacter(id);
                            if (editingCharId === id) {
                              setIsEditingExisting(false);
                              setEditingCharId(null);
                            }
                          });
                          setSelectedCharIds([]);
                          showToast(`Đã xóa luôn ${count} phạm nhân đã chọn!`);
                        }}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/25 transition-all active:scale-95"
                        title="Bấm là xóa luôn ngay lập tức"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>🗑️ Xoá Đã Chọn ({selectedCharIds.length}) • Bấm Xóa Luôn</span>
                      </button>
                    )}
                  </div>

                  {/* Character Cards List */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {characters
                      .filter(
                        (c) =>
                          c.name.toLowerCase().includes(charSearchQuery.toLowerCase()) ||
                          c.prisonId.toLowerCase().includes(charSearchQuery.toLowerCase()) ||
                          (c.zone && c.zone.toLowerCase().includes(charSearchQuery.toLowerCase())) ||
                          (c.genres && c.genres.some((g) => g.toLowerCase().includes(charSearchQuery.toLowerCase())))
                      )
                      .map((c) => {
                        const isChecked = selectedCharIds.includes(c.id);
                        const createdDateStr = c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString('vi-VN')
                          : '12/10/2024';

                        return (
                          <div
                            key={c.id}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              darkMode
                                ? 'bg-slate-800/60 border-slate-700 hover:border-rose-500'
                                : 'bg-white border-slate-200/90 hover:border-rose-300 shadow-xs'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCharIds((prev) => [...prev, c.id]);
                                  } else {
                                    setSelectedCharIds((prev) => prev.filter((id) => id !== c.id));
                                  }
                                }}
                                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                              />

                              <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-900">
                                {c.avatarUrl ? (
                                  <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className={`w-full h-full bg-gradient-to-tr ${c.avatarGradient || 'from-rose-500 to-pink-500'} flex items-center justify-center text-white font-black`}>
                                    {c.name.charAt(0)}
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-rose-500 font-mono">{c.prisonId}</span>
                                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{c.name}</h4>
                                </div>

                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300">
                                    {c.zone || 'Khu Hoa Hổn #07'}
                                  </span>

                                  {c.genres && c.genres[0] && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white">
                                      {c.genres[0]}
                                    </span>
                                  )}

                                  <span className="text-[10px] text-slate-400">
                                    Tag: {c.genres ? c.genres.join(', ') : 'Yandere'} • Tạo: {createdDateStr}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons matching screenshot exactly */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  handleEditCharacter(c);
                                  setViewMode('create');
                                }}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                                title="Sửa hồ sơ"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Prominent red/pink Delete button as requested - instant click delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteCharacter(c.id);
                                  setSelectedCharIds((prev) => prev.filter((id) => id !== c.id));
                                  if (editingCharId === c.id) {
                                    setIsEditingExisting(false);
                                    setEditingCharId(null);
                                  }
                                  showToast(`Đã xóa luôn phạm nhân "${c.name}"!`);
                                }}
                                className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                                title="Bấm là xóa luôn ngay lập tức"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xoá Ngay</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* 3-COLUMN DASHBOARD (Matching User Screenshot) */}
              {viewMode !== 'charactersList' && (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'all'
                      ? 'grid-cols-1 lg:grid-cols-3'
                      : 'grid-cols-1 max-w-4xl mx-auto'
                  }`}
                >
              {/* ======================================================== */}
              {/* COLUMN 1: KHỞI TẠO PHẠM NHÂN                             */}
              {/* ======================================================== */}
              {(viewMode === 'all' || viewMode === 'create') && (
                <div
                  className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm ${
                    darkMode
                      ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                      : 'bg-white/90 border-pink-100/90 text-slate-800 shadow-pink-100/30'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Col 1 */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-500 shadow-2xs">
                          <Heart className="w-5 h-5 fill-rose-500" />
                        </div>
                        <div>
                          <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            Khởi Tạo Phạm Nhân
                          </h2>
                          <p className="text-[11px] text-slate-400">
                            Lập hồ sơ giam cầm & trói buộc linh hồn
                          </p>
                        </div>
                      </div>

                      {/* Top-Right Badge: Khu A-07 */}
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        {zone === 'Phòng Giam Lạnh'
                          ? 'Khu A-07'
                          : zone === 'Phòng Giam Ấm'
                          ? 'Khu B-06'
                          : 'Khu C-01'}
                      </span>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSaveCharacter} className="space-y-4">
                      {/* Quick preset templates */}
                      <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Gợi ý hồ sơ mẫu nhanh:
                          </span>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="text-[10px] font-bold text-slate-500 hover:text-rose-600 underline cursor-pointer"
                          >
                            Xóa trắng form
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {ADMIN_PRESETS.map((p, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleLoadPreset(p)}
                              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-slate-700 text-[10px] font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              + {p.name} ({p.prisonId})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 1. Họ & Tên Phạm Nhân & Mã Số Lồng Giam (Quản Trị Viên Tự Viết) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Họ & Tên */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <span>Họ & Tên Phạm Nhân *</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm opacity-60">
                              📇
                            </span>
                            <input
                              type="text"
                              placeholder="Lục Cảnh Tiêu"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:border-rose-400 outline-none shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* Mã Số Lồng Giam (Quản trị viên tự viết) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <span>Mã Số Lồng Giam *</span>
                              <span className="text-[10px] text-rose-500 font-bold">(Tự viết)</span>
                            </label>
                            <span className="text-[10px] font-mono text-slate-400">
                              {prisonId || 'Chưa đặt'}
                            </span>
                          </div>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm opacity-60">
                              🗝️
                            </span>
                            <input
                              type="text"
                              placeholder="Nhập mã lồng (vd: #007, #LỒNG-01)"
                              value={prisonId}
                              onChange={(e) => setPrisonId(e.target.value)}
                              required
                              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white focus:border-rose-400 outline-none shadow-2xs"
                            />
                          </div>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {['#001', '#007', '#013', '#LỒNG-01', '#LỒNG-07', '#PRISON-99'].map((chip) => (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => setPrisonId(chip)}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 2. Chân Dung Áp Giải (1:1 hoặc 3:4) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                          Chân Dung Áp Giải (1:1 hoặc 3:4)
                        </label>

                        {/* Image Preview Card Container */}
                        <div className="relative h-48 sm:h-52 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-inner group">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-white font-black text-4xl`}
                            >
                              {name ? name.charAt(0).toUpperCase() : '🌸'}
                            </div>
                          )}

                          {/* Scrim Overlay & Mockup Badges */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-3 pointer-events-none">
                            <div className="flex justify-between items-center text-[10px] font-bold text-white/90">
                              <span>MÃ ÁN: {prisonId}</span>
                              <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md">
                                {zone}
                              </span>
                            </div>

                            <div className="flex justify-between items-end">
                              {/* Bottom-left tag: Hồ Sơ: Rose Velvet */}
                              <span className="px-2.5 py-1 rounded-xl bg-rose-600/90 text-white font-black text-[10px] shadow-sm backdrop-blur-md">
                                Hồ Sơ: {name || 'Rose Velvet'}
                              </span>

                              {/* Bottom-right tag: 🔒 Đã khoá buồng */}
                              <span className="px-2.5 py-1 rounded-xl bg-black/60 text-slate-200 font-bold text-[10px] border border-white/20 backdrop-blur-md flex items-center gap-1">
                                <span>🔒</span>
                                <span>{status || 'Đã khoá buồng'}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Image URL input & upload triggers */}
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => charFileInputRef.current?.click()}
                              className="flex-1 py-2.5 px-3 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-slate-800/80 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                            >
                              <span>🌸 Tải ảnh từ thiết bị (Tự động nén siêu nhẹ &lt;80KB)</span>
                            </button>
                            {avatarUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAvatarUrl('');
                                  showToast('Đã xóa ảnh chân dung, chuyển về gradient mặc định');
                                }}
                                className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                                title="Xóa ảnh chân dung"
                              >
                                ✕ Bỏ ảnh
                              </button>
                            )}
                          </div>

                          {/* Dán liên kết ảnh trực tuyến (URL) */}
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                              <span>🔗 Hoặc dán liên kết ảnh trực tuyến (URL):</span>
                              <span className="text-[10px] text-rose-500">Khuyên dùng cho ảnh HD</span>
                            </label>
                            <div className="relative">
                              <input
                                type="url"
                                placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                                value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value.trim())}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-rose-400 font-mono shadow-2xs"
                              />
                            </div>
                            {avatarUrl.startsWith('data:') && (
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                ✓ Đang dùng ảnh tải lên đã nén an toàn cho Firestore ({Math.round(avatarUrl.length / 1024)} KB)
                              </p>
                            )}
                          </div>

                          <input
                            ref={charFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCharAvatarUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {/* 3. Bản Án (Án Gì), Mức Độ Chiếm Hữu, Độ Nguy Hiểm & Độ Trung Thành */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/70 via-pink-50/40 to-amber-50/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border border-rose-200/80 dark:border-slate-700 space-y-3.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-rose-500" />
                            <span>Bản Án & Mức Độ Nguy Hiểm / Trung Thành</span>
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            Quản trị viên thiết lập
                          </span>
                        </div>

                        {/* Mục chọn Án Gì */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <span>Án Gì (Bản Án / Thời Hạn Thụ Án) *</span>
                            </label>
                            <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400">
                              {sentenceTerm || 'Án Chung Thân'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              'Án Chung Thân',
                              'Tử Hình Ái Tình',
                              'Biệt Giam Vĩnh Viễn',
                              'Thụ Án 100 Đêm',
                              'Giam Cầm Vô Hạn',
                              'Đặc Xá Có Điều Kiện',
                            ].map((term) => (
                              <button
                                key={term}
                                type="button"
                                onClick={() => setSentenceTerm(term)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                  sentenceTerm === term
                                    ? 'bg-rose-500 text-white shadow-xs'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-300'
                                }`}
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Hoặc tự viết bản án khác (vd: Án Chung Thân Trong Tim Quản Ngục...)"
                            value={sentenceTerm}
                            onChange={(e) => setSentenceTerm(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-rose-400"
                          />
                        </div>

                        {/* Mức Độ Chiếm Hữu */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <span>Mức Độ Chiếm Hữu</span>
                            </label>
                            <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400">
                              {possession || 'Chiếm Hữu Tuyệt Đối'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              'Chiếm Hữu Tuyệt Đối',
                              'Độc Chiếm Cuồng Si',
                              'Bảo Vệ Ngầm',
                              'Phục Tùng Vô Điều Kiện',
                              'Thao Túng Dịu Dàng',
                            ].map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setPossession(p)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                  possession === p
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-300'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Hoặc tự viết đặc tính chiếm hữu..."
                            value={possession}
                            onChange={(e) => setPossession(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-rose-400"
                          />
                        </div>

                        {/* Sliders chọn Độ Nguy Hiểm & Độ Trung Thành */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {/* Độ Nguy Hiểm */}
                          <div className="p-3 rounded-2xl bg-white/95 dark:bg-slate-800/95 border border-amber-200/70 dark:border-slate-700 space-y-2">
                            <div className="flex items-center justify-between text-xs font-black">
                              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 text-[11px]">
                                ⚠️ Độ Nguy Hiểm:
                              </span>
                              <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black ${
                                danger >= 80
                                  ? 'bg-red-500 text-white'
                                  : danger >= 50
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-emerald-500 text-white'
                              }`}>
                                {danger}% {danger >= 80 ? '• Cực Nguy Hiểm' : danger >= 50 ? '• Thận Trọng' : '• An Toàn'}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={danger}
                              onChange={(e) => setDanger(Number(e.target.value))}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                              <span>0% Lành tính</span>
                              <span>50%</span>
                              <span>100% Cuồng loạn</span>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {[
                                { label: 'An Toàn', val: 15 },
                                { label: 'Thận Trọng', val: 40 },
                                { label: 'Nguy Hiểm', val: 65 },
                                { label: 'Cuồng Nộ', val: 95 },
                              ].map((lvl) => (
                                <button
                                  key={lvl.label}
                                  type="button"
                                  onClick={() => setDanger(lvl.val)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                    danger === lvl.val
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-100'
                                  }`}
                                >
                                  {lvl.label} ({lvl.val}%)
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Độ Trung Thành */}
                          <div className="p-3 rounded-2xl bg-white/95 dark:bg-slate-800/95 border border-pink-200/70 dark:border-slate-700 space-y-2">
                            <div className="flex items-center justify-between text-xs font-black">
                              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 text-[11px]">
                                🛡️ Độ Trung Thành:
                              </span>
                              <span className="px-2 py-0.5 rounded-lg text-[11px] font-black bg-rose-500 text-white">
                                {loyalty}% {loyalty >= 95 ? '• Tuyệt Đối' : loyalty >= 75 ? '• Rất Cao' : '• Thăm Dò'}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={loyalty}
                              onChange={(e) => setLoyalty(Number(e.target.value))}
                              className="w-full accent-rose-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                              <span>0% Bất định</span>
                              <span>50%</span>
                              <span>100% Tuyệt đối</span>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {[
                                { label: 'Thăm Dò', val: 50 },
                                { label: 'Trung Thành', val: 80 },
                                { label: 'Tận Tụy', val: 95 },
                                { label: 'Tuyệt Đối', val: 100 },
                              ].map((lvl) => (
                                <button
                                  key={lvl.label}
                                  type="button"
                                  onClick={() => setLoyalty(lvl.val)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                                    loyalty === lvl.val
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-100'
                                  }`}
                                >
                                  {lvl.label} ({lvl.val}%)
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. Thể Loại & Dấu Ấn Chiếm Hữu */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                            Thể Loại & Dấu Ấn Chiếm Hữu
                          </label>
                          <span className="text-[10px] font-bold text-slate-400">
                            {selectedGenres.length} đã chọn
                          </span>
                        </div>

                        {/* Tag Chips with Remove (×) */}
                        <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 min-h-[44px]">
                          {selectedGenres.map((genre) => (
                            <span
                              key={genre}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs"
                            >
                              <span>{genre}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveGenre(genre)}
                                className="text-rose-400 hover:text-rose-600 ml-0.5 cursor-pointer font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Add new characteristic input */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              placeholder="Thêm đặc tính mới..."
                              value={newGenreInput}
                              onChange={(e) => setNewGenreInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddGenre();
                                }
                              }}
                              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs outline-none focus:border-rose-400"
                            />
                            <button
                              type="button"
                              onClick={handleAddGenre}
                              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                            >
                              + Thêm
                            </button>
                          </div>

                          {/* Quick 21 official genres selector chips */}
                          <div className="max-h-24 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap gap-1">
                            {allGenres.map((g) => {
                              const isSel = selectedGenres.includes(g);
                              return (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => {
                                    if (isSel) {
                                      handleRemoveGenre(g);
                                    } else {
                                      setSelectedGenres((prev) => [...prev, g]);
                                    }
                                  }}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                                    isSel
                                      ? 'bg-rose-500 text-white font-bold'
                                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-rose-400'
                                  }`}
                                >
                                  {isSel ? '✓ ' : '+ '}{g}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Tin Nhắn Đầu (First Message) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                          <span>Tin Nhắn Đầu (First Message) *</span>
                        </label>
                        <textarea
                          rows={2}
                          value={firstMessage}
                          onChange={(e) => setFirstMessage(e.target.value)}
                          placeholder="Chào nàng quản ngục bé nhỏ, lại tới giờ kiểm tra buồng giam..."
                          className="w-full p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-rose-400 shadow-2xs resize-none"
                        />
                      </div>

                      {/* Chỗ để link nhân vật (Chat Link) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <LinkIcon className="w-3.5 h-3.5 text-rose-500" />
                          <span>Chỗ Để Link Nhân Vật (Chat / Web Link)</span>
                        </label>
                        <input
                          type="url"
                          value={chatLink}
                          onChange={(e) => setChatLink(e.target.value)}
                          placeholder="https://c.ai/... hoặc link trò chuyện"
                          className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-rose-400 shadow-2xs font-mono"
                        />
                      </div>

                      {/* 4. Án Tích & Tội Danh Giam Cầm */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                          Án Tích & Tội Danh Giam Cầm
                        </label>
                        <textarea
                          rows={3}
                          value={backstory}
                          onChange={(e) => setBackstory(e.target.value)}
                          placeholder="Từng là vị thẩm phán trẻ tuổi nhất hoàng gia, tự nguyện mang cùm xích bằng bạc đính hoa hồng..."
                          className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 font-serif leading-relaxed outline-none focus:border-rose-400 shadow-2xs resize-none"
                        />
                      </div>

                      {/* 5. Voice & Audio Dubbing Section (Collapsible Accordion) */}
                      <div className="rounded-2xl border border-pink-200/80 dark:border-slate-800 bg-pink-50/30 dark:bg-slate-800/30 p-3 space-y-3">
                        <div
                          onClick={() => setShowVoiceSection((prev) => !prev)}
                          className="flex items-center justify-between cursor-pointer select-none"
                        >
                          <span className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Giọng Nói Nhân Vật & Audio ({voiceDuration})</span>
                          </span>
                          <span className="text-xs text-rose-400 font-bold">
                            {showVoiceSection ? '▲ Thu gọn' : '▼ Mở rộng'}
                          </span>
                        </div>

                        {showVoiceSection && (
                          <div className="space-y-3 pt-2 text-xs">
                            {/* Voice actor select */}
                            <div>
                              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                                Diễn viên lồng tiếng mẫu:
                              </label>
                              <select
                                value={voiceActor}
                                onChange={(e) => setVoiceActor(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                              >
                                {POPULAR_VOICE_ACTORS.map((va) => (
                                  <option key={va.name} value={va.name}>
                                    {va.name} — {va.tone}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Voice Line Quote */}
                            <div>
                              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                                Lời thoại giọng nói:
                              </label>
                              <input
                                type="text"
                                placeholder="Nhập câu thoại riêng cho giọng nói..."
                                value={voiceLine}
                                onChange={(e) => setVoiceLine(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                              />
                            </div>

                            {/* Audio upload & Record Controls */}
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => voiceFileInputRef.current?.click()}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Tải tệp âm thanh</span>
                              </button>
                              <input
                                ref={voiceFileInputRef}
                                type="file"
                                accept="audio/*"
                                onChange={handleVoiceFileUpload}
                                className="hidden"
                              />

                              <button
                                type="button"
                                onClick={isRecording ? handleStopRecording : handleStartRecording}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  isRecording
                                    ? 'bg-rose-600 text-white animate-pulse'
                                    : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300'
                                }`}
                              >
                                <Mic className="w-3 h-3" />
                                <span>{isRecording ? `Dừng (${recordingTime}s)` : 'Ghi âm mic'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={handlePlayVoicePreview}
                                className="ml-auto px-3 py-1.5 rounded-xl bg-pink-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                {isPlayingAudioPreview ? (
                                  <>
                                    <Square className="w-3 h-3 fill-white" />
                                    <span>Dừng</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 fill-white" />
                                    <span>Nghe thử</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit / Action buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:opacity-95 shadow-lg shadow-rose-400/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{isEditingExisting ? 'Cập Nhật Hồ Sơ' : 'Lưu & Tiếp Nhận Vào Ngục Thất'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowCharacterListDrawer((prev) => !prev)}
                          className="py-3 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                          title="Xem danh sách phạm nhân"
                        >
                          📋 ({characters.length})
                        </button>
                      </div>
                    </form>

                    {/* Character list drawer if toggled */}
                    {showCharacterListDrawer && (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 mt-3 animate-fadeIn">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span>Danh Sách Phạm Nhân Hiện Tại</span>
                          <span className="text-slate-400">{characters.length} buồng</span>
                        </div>
                        {characters.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-2">
                            Chưa có phạm nhân nào trong ngục.
                          </p>
                        ) : (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {characters.map((c) => (
                              <div
                                key={c.id}
                                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600 text-xs"
                              >
                                <span className="font-bold truncate max-w-[140px]">{c.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleEditCharacter(c)}
                                    className="p-1 text-sky-500 hover:bg-sky-50 rounded-lg cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onDeleteCharacter(c.id);
                                      if (editingCharId === c.id) {
                                        setIsEditingExisting(false);
                                        setEditingCharId(null);
                                      }
                                      showToast(`Đã xóa luôn phạm nhân "${c.name}"!`);
                                    }}
                                    className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg cursor-pointer transition-colors active:scale-95"
                                    title="Bấm là xóa luôn ngay lập tức"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* COLUMN 2: HÒM THƯ TÙ ÁN                                  */}
              {/* ======================================================== */}
              {(viewMode === 'all' || viewMode === 'inbox') && (
                <div
                  className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm ${
                    darkMode
                      ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                      : 'bg-white/90 border-pink-100/90 text-slate-800 shadow-pink-100/30'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Col 2 */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-500 shadow-2xs">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            Hòm Thư Tù Án
                          </h2>
                          <p className="text-[11px] text-slate-400">
                            {combinedInbox.length} thư chưa đọc gửi tới Cai Ngục
                          </p>
                        </div>
                      </div>

                      <span className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <CheckCheck className="w-4 h-4 text-sky-500" />
                      </span>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setInboxFilter('all')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          inboxFilter === 'all'
                            ? 'bg-rose-900 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Tất cả ({combinedInbox.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setInboxFilter('love')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          inboxFilter === 'love'
                            ? 'bg-rose-900 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Lời Tỏ Tình
                      </button>

                      <button
                        type="button"
                        onClick={() => setInboxFilter('idea')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          inboxFilter === 'idea'
                            ? 'bg-rose-900 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Ý Tưởng Mới
                      </button>

                      <button
                        type="button"
                        onClick={() => setInboxFilter('review')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                          inboxFilter === 'review'
                            ? 'bg-rose-900 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Góp Ý
                      </button>
                    </div>

                    {/* Letter Stream List */}
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {filteredInbox.map((msg) => {
                        const isLiked = likedMessages.includes(msg.id);
                        return (
                          <div
                            key={msg.id}
                            className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 transition-all hover:border-pink-300"
                          >
                            {/* Card Top: Avatar, Name, Dot, Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${msg.senderAvatarBg}`}
                                >
                                  {msg.senderAvatarText}
                                </div>
                                <div className="leading-tight">
                                  <div className="flex items-center gap-1 text-xs font-black text-slate-900 dark:text-white">
                                    <span>{msg.senderName}</span>
                                    {msg.hasRedDot && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    {msg.timeAgo} • {msg.categoryLabel}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLikedMessages((prev) =>
                                      prev.includes(msg.id)
                                        ? prev.filter((id) => id !== msg.id)
                                        : [...prev, msg.id]
                                    );
                                  }}
                                  className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                >
                                  <Heart
                                    className={`w-3.5 h-3.5 ${
                                      isLiked ? 'fill-rose-500 text-rose-500' : ''
                                    }`}
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletedMsgIds((prev) => [...prev, msg.id])}
                                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Letter Content Quote */}
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-serif leading-relaxed italic">
                              {msg.content}
                            </p>

                            {/* Card Bottom Meta & Reply Trigger */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyTarget(msg.senderName);
                                  showToast(`Đang soạn phúc đáp cho ${msg.senderName}`);
                                }}
                                className="text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <span>{msg.statusTag}</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                {msg.category === 'idea' && (
                                  <button
                                    type="button"
                                    onClick={() => handleAdoptIdea(msg)}
                                    className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-500 text-white shadow-2xs hover:opacity-90 cursor-pointer"
                                  >
                                    Đưa Vào Hồ Sơ
                                  </button>
                                )}
                                {msg.badgeTag && (
                                  <span
                                    className={`px-2 py-0.5 rounded-full font-black border ${
                                      msg.badgeColor || 'bg-rose-50 text-rose-600 border-rose-200'
                                    }`}
                                  >
                                    {msg.badgeTag}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Reply Box (Phúc Đáp Tới Yuki_Amane) */}
                    <form
                      onSubmit={handleSendReply}
                      className="p-3.5 rounded-2xl border border-rose-200/90 dark:border-rose-900/60 bg-rose-50/40 dark:bg-slate-800/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black">
                        <span className="text-rose-700 dark:text-rose-300">
                          Phúc Đáp Tới: <strong>{replyTarget}</strong>
                        </span>
                        <span className="text-[10px] text-slate-400">Mật ấn Hoàng Gia</span>
                      </div>

                      <textarea
                        rows={2}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Nhập nội dung phúc đáp gửi tới nàng..."
                        className="w-full p-2.5 rounded-xl border border-rose-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-rose-400 resize-none font-serif leading-relaxed"
                      />

                      <button
                        type="submit"
                        className="w-full py-2 px-3 rounded-xl bg-rose-900 text-white hover:bg-rose-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi Phúc Đáp Tới Nàng 💌</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* COLUMN 3: ĐỔI NỀN & GIAO DIỆN                            */}
              {/* ======================================================== */}
              {(viewMode === 'all' || viewMode === 'theme') && (
                <div
                  className={`rounded-3xl border p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all shadow-sm ${
                    darkMode
                      ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                      : 'bg-white/90 border-pink-100/90 text-slate-800 shadow-pink-100/30'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Col 3 */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-500 shadow-2xs">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            Đổi Nền & Giao Diện
                          </h2>
                          <p className="text-[11px] text-slate-400">
                            Bầu không khí giam cầm huyền ảo
                          </p>
                        </div>
                      </div>

                      {/* Right toggle: Sống Động */}
                      <button
                        type="button"
                        onClick={() => setIsVibrantMode((prev) => !prev)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          isVibrantMode
                            ? 'bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 border border-pink-200'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        Sống Động
                      </button>
                    </div>

                    {/* Scope Switcher: Cửa Nhà Giam vs Toàn Bộ Web */}
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setWallpaperTarget('banner')}
                        className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                          wallpaperTarget === 'banner'
                            ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 shadow-xs'
                            : 'text-slate-500'
                        }`}
                      >
                        Khung Cửa Nhà Giam
                      </button>
                      <button
                        type="button"
                        onClick={() => setWallpaperTarget('site')}
                        className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                          wallpaperTarget === 'site'
                            ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 shadow-xs'
                            : 'text-slate-500'
                        }`}
                      >
                        Toàn Bộ Trang Web
                      </button>
                    </div>

                    {/* Chủ Đề Phòng Nền Có Sẵn (4 Cards Grid in Screenshot) */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                        Chủ Đề Phòng Nền Có Sẵn
                      </label>

                      <div className="grid grid-cols-2 gap-2.5">
                        {PRESET_THEMES.map((theme) => {
                          const currentBg = wallpaperTarget === 'banner' ? bannerBg : siteBg;
                          const isSelected = currentBg === theme.src;

                          return (
                            <div
                              key={theme.id}
                              onClick={() => handleSelectWallpaperTheme(theme.src, theme.title)}
                              className={`rounded-2xl border p-2 space-y-1.5 cursor-pointer transition-all relative overflow-hidden group ${
                                isSelected
                                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 shadow-xs'
                                  : 'border-slate-200 dark:border-slate-800 hover:border-pink-300 bg-white dark:bg-slate-800/60'
                              }`}
                            >
                              <div className="h-20 w-full rounded-xl overflow-hidden relative">
                                <img
                                  src={theme.src}
                                  alt={theme.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              <div className="flex items-center justify-between pt-0.5">
                                <div className="leading-tight truncate pr-1">
                                  <h4 className="text-[11px] font-black text-slate-900 dark:text-white truncate">
                                    {theme.title}
                                  </h4>
                                  <p className="text-[9px] text-slate-400 truncate">
                                    {theme.subtitle}
                                  </p>
                                </div>

                                <div
                                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'border-rose-500 bg-rose-500 text-white'
                                      : 'border-slate-300'
                                  }`}
                                >
                                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hoặc Tải Nền Cá Nhân (1920x1080) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                        Hoặc Tải Nền Cá Nhân (1920x1080)
                      </label>

                      <div
                        onClick={() => wallpaperFileInputRef.current?.click()}
                        className="p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-rose-50/50 dark:hover:bg-slate-800 hover:border-rose-300 text-center cursor-pointer transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 text-left">
                          <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-slate-700 flex items-center justify-center text-rose-500">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                              Tải ảnh nền (.png, .webp, .jpg)
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Kéo thả ảnh hoặc chọn từ máy
                            </p>
                          </div>
                        </div>

                        <Folder className="w-4 h-4 text-slate-400" />
                      </div>
                      <input
                        ref={wallpaperFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCustomWallpaperUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Sliders in Mockup */}
                    <div className="space-y-3 pt-1">
                      {/* 1. Độ Mờ Kính (Glass Blur) */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <span>✨</span>
                            <span>Độ Mờ Kính (Glass Blur)</span>
                          </span>
                          <span className="text-rose-500 font-mono text-[11px]">{glassBlur}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={32}
                          value={glassBlur}
                          onChange={(e) => setGlassBlur(Number(e.target.value))}
                          className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                        />
                      </div>

                      {/* 2. Độ Tối Phủ Nền (Overlay) */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <span>🌙</span>
                            <span>Độ Tối Phủ Nền (Overlay)</span>
                          </span>
                          <span className="text-rose-500 font-mono text-[11px]">{overlayDarkness}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={85}
                          value={overlayDarkness}
                          onChange={(e) => setOverlayDarkness(Number(e.target.value))}
                          className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Hiệu Ứng Hạt Không Gian (Particles in Mockup) */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                        Hiệu Ứng Hạt Không Gian (Particles)
                      </label>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setParticleType('petals');
                            showToast('Đã bật hiệu ứng Cánh Hoa');
                          }}
                          className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                            particleType === 'petals'
                              ? 'border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-bold shadow-2xs'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="block text-sm mb-0.5">🌸</span>
                          <span className="text-[10px] block truncate font-bold">Cánh Hoa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setParticleType('stars');
                            showToast('Đã bật hiệu ứng Bụi Sao & Kim Cương');
                          }}
                          className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                            particleType === 'stars'
                              ? 'border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-bold shadow-2xs'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="block text-sm mb-0.5">✨</span>
                          <span className="text-[10px] block truncate font-bold">Bụi Sao</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setParticleType('rain');
                            showToast('Đã bật hiệu ứng Mưa Kính Mờ');
                          }}
                          className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                            particleType === 'rain'
                              ? 'border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 font-bold shadow-2xs'
                              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="block text-sm mb-0.5">🌧️</span>
                          <span className="text-[10px] block truncate font-bold">Mưa Kính Mờ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
