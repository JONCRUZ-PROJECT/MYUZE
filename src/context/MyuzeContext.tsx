import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialMyuzeState, User, Playlist, Song, PlaybackLog, Client, Store } from '@/lib/data'; // Added Client and Store import
import { saveUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface MyuzeContextType {
  users: User[];
  clients: Client[];
  playlists: Playlist[];
  songs: Song[];
  stores: Store[]; // Added stores
  playbackLogs: PlaybackLog[];
  currentUser: User | null;
  login: (email: string, passwordHash: string) => boolean;
  register: (email: string, passwordHash: string) => boolean;
  logout: () => void;
  addPlaylist: (playlist: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => void;
  updatePlaylist: (id: string, updatedPlaylist: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => void;
  deletePlaylist: (id: string) => void;
  addClient: (client: Omit<Client, 'id' | 'userId'>) => void;
  updateClient: (id: string, updatedClient: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addStore: (store: Omit<Store, 'id' | 'status' | 'currentPlaylistId' | 'lastPlayedSong' | 'playbackStartTime'>) => void; // Added addStore
  updateStore: (id: string, updatedStore: Partial<Store>) => void; // Added updateStore
  deleteStore: (id: string) => void; // Added deleteStore
  getClientById: (id: string) => Client | undefined;
  getPlaylistById: (id: string) => Playlist | undefined;
  getStoreById: (id: string) => Store | undefined; // Added getStoreById
  getSongsByIds: (ids: string[]) => Song[];
  addPlaybackLog: (log: Omit<PlaybackLog, 'id'>) => void;
  addMediaItem: (mediaItem: Omit<Song, 'id' | 'fileUrl'>, file: File) => void;
}

const MyuzeContext = createContext<MyuzeContextType | undefined>(undefined);

export const MyuzeProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialMyuzeState.users);
  const [clients, setClients] = useState<Client[]>(initialMyuzeState.clients);
  const [playlists, setPlaylists] = useState<Playlist[]>(initialMyuzeState.playlists);
  const [songs, setSongs] = useState<Song[]>(initialMyuzeState.songs);
  const [stores, setStores] = useState<Store[]>(initialMyuzeState.stores); // Added stores state
  const [playbackLogs, setPlaybackLogs] = useState<PlaybackLog[]>(initialMyuzeState.playbackLogs);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = (email: string, passwordHash: string): boolean => {
    const user = users.find(u => u.email === email && u.passwordHash === passwordHash);
    if (user) {
      setCurrentUser(user);
      saveUserToLocalStorage(user);
      toast.success(`Welcome back, ${user.email}!`);
      return true;
    }
    toast.error('Invalid credentials.');
    return false;
  };

  const register = (email: string, passwordHash: string): boolean => {
    if (users.some(u => u.email === email)) {
      toast.error('User with this email already exists.');
      return false;
    }
    const newUser: User = { id: uuidv4(), email, passwordHash, role: 'user' };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    saveUserToLocalStorage(newUser);
    toast.success('Registration successful! Welcome to Myuze.');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    removeUserFromLocalStorage();
    toast.info('You have been logged out.');
  };

  const getSongsByIds = (ids: string[]): Song[] => {
    return songs.filter(song => ids.includes(song.id));
  };

  const addPlaylist = (playlistData: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => {
    if (!currentUser) {
      toast.error('You must be logged in to create a playlist.');
      return;
    }
    const newPlaylist: Playlist = {
      ...playlistData,
      id: uuidv4(),
      userId: currentUser.id,
      songs: getSongsByIds(selectedSongIds),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    toast.success(`Playlist "${newPlaylist.name}" created!`);
  };

  const updatePlaylist = (id: string, updatedPlaylistData: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...updatedPlaylistData, songs: getSongsByIds(selectedSongIds) }
          : p
      )
    );
    toast.success(`Playlist updated!`);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    toast.success('Playlist deleted.');
  };

  const addClient = (clientData: Omit<Client, 'id' | 'userId'>) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para adicionar um cliente.');
      return;
    }
    const newClient: Client = {
      ...clientData,
      id: uuidv4(),
      userId: currentUser.id,
    };
    setClients(prev => [...prev, newClient]);
    toast.success(`Cliente "${newClient.name}" adicionado!`);
  };

  const updateClient = (id: string, updatedClientData: Partial<Client>) => {
    setClients(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...updatedClientData }
          : c
      )
    );
    toast.success(`Cliente atualizado!`);
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
    toast.success('Cliente excluído.');
  };

  const addStore = (storeData: Omit<Store, 'id' | 'status' | 'currentPlaylistId' | 'lastPlayedSong' | 'playbackStartTime'>) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para adicionar uma instalação.');
      return;
    }
    const newStore: Store = {
      ...storeData,
      id: uuidv4(),
      status: 'pending', // Default status
      currentPlaylistId: null,
      lastPlayedSong: null,
      playbackStartTime: null,
    };
    setStores(prev => [...prev, newStore]);
    toast.success(`Instalação "${newStore.name}" adicionada!`);
  };

  const updateStore = (id: string, updatedStoreData: Partial<Store>) => {
    setStores(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, ...updatedStoreData }
          : s
      )
    );
    toast.success(`Instalação atualizada!`);
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    toast.success('Instalação excluída.');
  };

  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getPlaylistById = (id: string) => playlists.find(p => p.id === id);
  const getStoreById = (id: string) => stores.find(s => s.id === id); // Added getStoreById

  const addPlaybackLog = (log: Omit<PlaybackLog, 'id'>) => {
    const newLog: PlaybackLog = { ...log, id: uuidv4() };
    setPlaybackLogs(prev => [...prev, newLog]);
  };

  const addMediaItem = (mediaItemData: Omit<Song, 'id' | 'fileUrl'>, file: File) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para adicionar itens à biblioteca.');
      return;
    }

    const fileUrl = URL.createObjectURL(file); // Create a temporary URL for playback
    const newMediaItem: Song = {
      ...mediaItemData,
      id: uuidv4(),
      fileUrl,
    };
    setSongs(prev => [...prev, newMediaItem]);
    toast.success(`${newMediaItem.isAd ? 'Locução' : 'Música'} "${newMediaItem.title}" adicionada à biblioteca!`);
  };

  return (
    <MyuzeContext.Provider
      value={{
        users,
        clients,
        playlists,
        songs,
        stores, // Added stores to context value
        playbackLogs,
        currentUser,
        login,
        register,
        logout,
        addPlaylist,
        updatePlaylist,
        deletePlaylist,
        addClient,
        updateClient,
        deleteClient,
        addStore, // Added addStore to context value
        updateStore, // Added updateStore to context value
        deleteStore, // Added deleteStore to context value
        getClientById,
        getPlaylistById,
        getStoreById, // Added getStoreById to context value
        getSongsByIds,
        addPlaybackLog,
        addMediaItem,
      }}
    >
      {children}
    </MyuzeContext.Provider>
  );
};

export const useMyuze = () => {
  const context = useContext(MyuzeContext);
  if (context === undefined) {
    throw new Error('useMyuze must be used within a MyuzeProvider');
  }
  return context;
};