import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, this would be hashed
  role: 'admin' | 'user';
}

export interface Client {
  id: string;
  userId: string; // The user who owns this client
  name: string; // Client company name
  contactEmail: string;
  contactPhone?: string;
  // You can add more fields here like address, industry, etc.
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description: string; // Adicionado
  coverImageUrl?: string; // Adicionado, opcional
  style: string; // e.g., 'lo-fi', 'pop', 'electronic', 'jazz', 'bossa'
  mood: string; // e.g., 'calm', 'energetic', 'focused'
  bpm: number; // Beats per minute
  schedule: {
    days: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
    startTime: string; // HH:mm (e.g., "09:00")
    endTime: string; // HH:mm (e.g., "20:00")
  };
  scheduleText?: string; // Adicionado para o 'Horário Ideal'
  adIntervalMinutes?: number; // Adicionado para 'Tocar locução a cada (minutos)'
  songs: Song[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  fileUrl: string; // URL for playback (e.g., data URL or object URL)
  isAd?: boolean; // True if it's a voiceover/ad
  // Fields specific to ads/voiceovers
  adType?: 'propaganda' | 'aviso' | 'promocao' | 'institucional';
  adDescription?: string;
  // Fields specific to music
  mood?: string; // e.g., 'calm', 'energetic'
  genre?: string; // e.g., 'lo-fi', 'pop'
}

export interface PlaybackLog {
  id: string;
  playlistId: string;
  songId: string;
  timestamp: string; // ISO string
  type: 'song' | 'ad';
}

// --- Mock Data ---

const mockUsers: User[] = [
  { id: uuidv4(), email: 'user@example.com', passwordHash: 'password123', role: 'user' },
  { id: uuidv4(), email: 'admin@example.com', passwordHash: 'admin123', role: 'admin' },
];

const mockClients: Client[] = [
  {
    id: uuidv4(),
    userId: mockUsers[0].id,
    name: 'Café Central Ltda.',
    contactEmail: 'contato@cafecentral.com.br',
    contactPhone: '(11) 98765-4321',
  },
  {
    id: uuidv4(),
    userId: mockUsers[0].id,
    name: 'Boutique Fashion',
    contactEmail: 'fashion@boutique.com',
  },
];

const mockSongs: Song[] = [
  { id: uuidv4(), title: 'Morning Chill', artist: 'Lo-fi Beats', duration: 180, fileUrl: '/audio/morning-chill.mp3', mood: 'calm', genre: 'lo-fi' },
  { id: uuidv4(), title: 'Coffee Shop Jazz', artist: 'Smooth Tunes', duration: 240, fileUrl: '/audio/coffee-shop-jazz.mp3', mood: 'relaxed', genre: 'jazz' },
  { id: uuidv4(), title: 'Upbeat Pop Anthem', artist: 'Energetic Crew', duration: 210, fileUrl: '/audio/upbeat-pop.mp3', mood: 'energetic', genre: 'pop' },
  { id: uuidv4(), title: 'Deep Focus Electronic', artist: 'Synthwave Master', duration: 300, fileUrl: '/audio/deep-focus.mp3', mood: 'focused', genre: 'electronic' },
  { id: uuidv4(), title: 'Bossa Nova Sunset', artist: 'Rio Rhythms', duration: 270, fileUrl: '/audio/bossa-nova.mp3', mood: 'relaxed', genre: 'bossa' },
  { id: uuidv4(), title: 'Ad: Myuze Promo', artist: 'Myuze Team', duration: 30, isAd: true, fileUrl: '/audio/myuze-promo.mp3', adType: 'propaganda', adDescription: 'Promoção geral da Myuze' },
  { id: uuidv4(), title: 'Ad: New Product Launch', artist: 'Brand X', duration: 30, isAd: true, fileUrl: '/audio/new-product-ad.mp3', adType: 'promocao', adDescription: 'Lançamento de novo produto da Brand X' },
];

const mockPlaylists: Playlist[] = [
  {
    id: uuidv4(),
    userId: mockUsers[0].id,
    name: 'Morning Vibes',
    description: 'Músicas calmas para começar o dia.',
    style: 'lo-fi',
    mood: 'calm',
    bpm: 80,
    schedule: { days: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '12:00' },
    scheduleText: 'Manhã (09:00 - 12:00)',
    adIntervalMinutes: 30,
    songs: [mockSongs[0], mockSongs[1], mockSongs[5], mockSongs[0]],
  },
  {
    id: uuidv4(),
    userId: mockUsers[0].id,
    name: 'Afternoon Boost',
    description: 'Músicas energéticas para a tarde.',
    style: 'pop',
    mood: 'energetic',
    bpm: 120,
    schedule: { days: [1, 2, 3, 4, 5], startTime: '12:00', endTime: '17:00' },
    scheduleText: 'Tarde (12:00 - 17:00)',
    adIntervalMinutes: 20,
    songs: [mockSongs[2], mockSongs[3], mockSongs[6], mockSongs[2]],
  },
  {
    id: uuidv4(),
    userId: mockUsers[0].id,
    name: 'Evening Jazz',
    description: 'Jazz suave para o fim do dia.',
    style: 'jazz',
    mood: 'relaxed',
    bpm: 90,
    schedule: { days: [1, 2, 3, 4, 5], startTime: '17:00', endTime: '20:00' },
    scheduleText: 'Noite (17:00 - 20:00)',
    adIntervalMinutes: 15,
    songs: [mockSongs[1], mockSongs[4], mockSongs[5], mockSongs[1]],
  },
];

export const initialMyuzeState = {
  users: mockUsers,
  clients: mockClients, // Added clients to initial state
  playlists: mockPlaylists,
  songs: mockSongs, // All available songs, including ads
  playbackLogs: [] as PlaybackLog[],
  currentUser: null as User | null,
};