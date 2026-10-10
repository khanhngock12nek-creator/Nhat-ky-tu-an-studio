export const ADMIN_PASSWORD = '5512';

export const PRISON_ZONES = [
  'Phòng Giam Lạnh',
  'Phòng Giam Ấm',
  'Phòng Giam Chữa Lành',
] as const;

export type PrisonZone = typeof PRISON_ZONES[number];

export const OFFICIAL_GENRES = [
  'Thanh mai trúc mã',
  'Thanh xuân vườn trường',
  'Văn nhã bại hoại',
  'R18',
  'R21',
  'Ngụy côn trùng',
  'Oan gia',
  'Vừa hận phải yêu',
  'Ngược luyến tàn tâm',
  'cổ trang',
  'Game thủ',
  'Ngoài lạnh trong nóng',
  'Chữa lành',
  'Nuông chiều',
  'Ngọt sủng',
  'Boy phố',
  'Tổng tài',
  'Cún con nuôi vợ từ bé',
  'Chiếm hữu',
  'hài hước',
  'hiện đại',
] as const;

export const AVATAR_GRADIENTS = [
  'from-pink-400 via-rose-300 to-sky-300',
  'from-sky-400 via-indigo-300 to-pink-300',
  'from-purple-400 via-pink-400 to-rose-300',
  'from-blue-400 via-cyan-300 to-pink-300',
  'from-rose-400 via-pink-300 to-amber-200',
  'from-violet-500 via-purple-400 to-pink-400',
  'from-teal-400 via-sky-300 to-pink-300',
  'from-amber-400 via-rose-300 to-purple-400',
];

export interface CharacterPreset {
  title: string;
  name: string;
  prisonId: string;
  zone?: string;
  genres: string[];
  backstory: string;
  firstMessage: string;
  chatLink: string;
  avatarUrl?: string;
  status: string;
  voiceActor?: string;
  voiceLine?: string;
  voiceDuration?: string;
  danger?: number;
  loyalty?: number;
  sentenceTerm?: string;
  possession?: string;
}

export const ADMIN_PRESETS: CharacterPreset[] = [
  {
    title: 'Gợi ý 1: Cún con nuôi vợ từ bé',
    name: 'Lục Diệp Thần',
    prisonId: '#007',
    zone: 'Phòng Giam Ấm',
    genres: ['Cún con nuôi vợ từ bé', 'Ngọt sủng', 'Nuông chiều', 'Chiếm hữu'],
    backstory: 'Từ năm 5 tuổi đã bám đuôi theo chị nhỏ. Bị giam vì tội "ghen tuông vô cớ, lén cất giữ mọi món quà của người khác tặng chị nhỏ vào két sắt riêng".',
    firstMessage: 'Chị ơi... chị đến thăm em thật rồi! Phòng giam này lạnh lắm, chỉ khi được chị ôm em mới hết run thôi...',
    chatLink: 'https://c.ai',
    avatarUrl: '',
    status: 'Ngoan ngoãn chờ chị xoa đầu',
    voiceActor: 'Bạch Duật [Ôn Nhu]',
    voiceDuration: '0:12',
  },
  {
    title: 'Gợi ý 2: Văn nhã bại hoại & Chiếm hữu',
    name: 'Thẩm Vấn Ngôn',
    prisonId: '#013',
    zone: 'Phòng Giam Lạnh',
    genres: ['Văn nhã bại hoại', 'Chiếm hữu', 'Ngoài lạnh trong nóng', 'Hiện đại'],
    backstory: 'Vị giáo sư mang kính gọng vàng nho nhã nhưng bên trong điên cuồng vì nàng. Bị giam vì tội "giam lỏng ánh mắt của đối phương suốt 24 giờ".',
    firstMessage: 'Cách một lớp kính dày thế này, em nghĩ tôi không thể chạm vào em sao? Đến gần đây một chút, đừng để tôi phải phá xích.',
    chatLink: 'https://c.ai',
    avatarUrl: '',
    status: 'Trầm ngâm lau mắt kính',
    voiceActor: 'Haruto K. [Độc quyền AI]',
    voiceDuration: '0:15',
  },
  {
    title: 'Gợi ý 3: Boy phố nghịch ngợm & Oan gia',
    name: 'Trần Khang Khôi',
    prisonId: '#021',
    zone: 'Phòng Giam Ấm',
    genres: ['Boy phố', 'Oan gia', 'Hài hước', 'Vừa hận phải yêu'],
    backstory: 'Cậu ấm ngổ ngáo của phố cổ, chuyên đua xe lạng lách chỉ để lướt qua ngõ nhà nàng chào một câu. Bị bắt vì tội "náo loạn trái tim thiếu nữ".',
    firstMessage: 'Ơ kìa cô bé, hôm nay cũng biết xách cặp lồng cơm đến thăm anh à? Có nhớ anh không đấy hay lại giả vờ lạnh lùng?',
    chatLink: 'https://c.ai',
    avatarUrl: '',
    status: 'Ngồi vắt chân nhai kẹo cao su',
    voiceActor: 'Khang Khôi [Boy Phố]',
    voiceDuration: '0:11',
  },
  {
    title: 'Gợi ý 4: Vương gia cổ trang si tình',
    name: 'Tiêu Cảnh Duật',
    prisonId: '#099',
    zone: 'Phòng Giam Lạnh',
    genres: ['cổ trang', 'Ngược luyến tàn tâm', 'Chiếm hữu', 'Nuông chiều'],
    backstory: 'Nhiếp chính vương một tay che trời, sẵn sàng buông bỏ giang sơn để nàng không phải rơi lệ. Tự nguyện bước vào ngục tối đợi nàng tha thứ.',
    firstMessage: 'Ái khanh... nàng rốt cuộc cũng chịu bước vào địa lao ẩm thấp này gặp trẫm? Giang sơn vạn dặm không bằng một ánh mắt của nàng.',
    chatLink: 'https://c.ai',
    avatarUrl: '',
    status: 'Thở dài tựa vào song sắt',
    voiceActor: 'Tiêu Cảnh [Cổ Trang]',
    voiceDuration: '0:16',
  },
  {
    title: 'Gợi ý 5: Game thủ thiên tài lạnh lùng',
    name: 'Bạch Duật Hàn',
    prisonId: '#042',
    zone: 'Phòng Giam Chữa Lành',
    genres: ['Game thủ', 'Ngoài lạnh trong nóng', 'Thanh xuân vườn trường', 'Chữa lành'],
    backstory: 'Đội trưởng tuyển Esports lừng danh. Bị "bắt giam" vì dám bỏ cả trận chung kết quốc tế chỉ vì nghe tin nàng khóc ở trạm xe buýt.',
    firstMessage: 'Tôi không cần cúp vô địch... Tôi chỉ cần biết hôm nay ai làm em buồn. Nói cho tôi, rồi tôi sẽ ngoan ngoãn thụ án.',
    chatLink: 'https://c.ai',
    avatarUrl: '',
    status: 'Đeo tai nghe im lặng nhìn nàng',
    voiceActor: 'Kenji S. [Thượng Lưu]',
    voiceDuration: '0:13',
  },
];

export const STAMP_LIST = ['💌', '🌸', '✨', '🎀', '🧸', '💖', '🕊️', '🍰', '🗝️', '🐾'];

export const POPULAR_VOICE_ACTORS = [
  { name: 'Haruto K. [Độc quyền AI]', tone: 'Trầm ấm • Chiếm hữu • Gợi cảm', pitch: 0.85, rate: 0.95 },
  { name: 'Kenji S. [Thượng Lưu]', tone: 'Lạnh lùng • Ma mị • Hắc hóa', pitch: 0.8, rate: 0.9 },
  { name: 'Bạch Duật [Ôn Nhu]', tone: 'Nhẹ nhàng • Dỗ dành • Chữa lành', pitch: 0.95, rate: 0.95 },
  { name: 'Khang Khôi [Boy Phố]', tone: 'Nghịch ngợm • Trêu chọc • Cuốn hút', pitch: 1.05, rate: 1.05 },
  { name: 'Tiêu Cảnh [Cổ Trang]', tone: 'Uy quyền • Thâm tình • Vương gia', pitch: 0.8, rate: 0.9 },
];
