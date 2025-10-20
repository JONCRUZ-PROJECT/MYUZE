import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialMyuzeState, User, Store, Playlist, Song, PlaybackLog } from '@/lib/data';
import { saveUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface MyuzeContextType {
  users: User[];
  stores: Store[];
  playlists: Playlist[];
  songs: Song[];
  playbackLogs: PlaybackLog[];
  currentUser: User | null;
  login: (email: string, passwordHash: string) => boolean;
  register: (email: string, passwordHash: string) => boolean;
  logout: () => void;
  addPlaylist: (playlist: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => void;
  updatePlaylist: (id: string, updatedPlaylist: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => void;
  deletePlaylist: (id: string) => void;
  addStore: (store: Omit<Store, 'id' | 'userId' | 'status' | 'currentPlaylistId' | 'lastPlayedSong' | 'playbackStartTime'>) => void;
  updateStore: (id: string, updatedStore: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  getPlaylistById: (id: string) => Playlist | undefined;
  getStoreById: (id: string) => Store | undefined;
  getSongsByIds: (ids: string[]) => Song[];
  addPlaybackLog: (log: Omit<PlaybackLog, 'id'>) => void;
  addMediaItem: (mediaItem: Omit<Song, 'id' | 'fileUrl'>, file: File) => void; // New function
}

const MyuzeContext = createContext<MyuzeContextType | undefined>(undefined);

export const MyuzeProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialMyuzeState.users);
  const [stores, setStores] = useState<Store[]>(initialMyuzeState.stores);
  const [playlists, setPlaylists] = useState<Playlist[]>(initialMyuzeState.playlists);
  const [songs, setSongs] = useState<Song[]>(initialMyuzeState.songs);
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

  const addStore = (storeData: Omit<Store, 'id' | 'userId' | 'status' | 'currentPlaylistId' | 'lastPlayedSong' | 'playbackStartTime'>) => {
    if (!currentUser) {
      toast.error('You must be logged in to add a store.');
      return;
    }
    const newStore: Store = {
      ...storeData,
      id: uuidv4(),
      userId: currentUser.id,
      status: 'offline', // Default status
    };
    setStores(prev => [...prev, newStore]);
    toast.success(`Store "${newStore.name}" added!`);
  };

  const updateStore = (id: string, updatedStore: Partial<Store>) => {
    setStores(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, ...updatedStore }
          : s
      )
    );
    toast.success('Store updated!');
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    toast.success('Store deleted.');
  };

  const getPlaylistById = (id: string) => playlists.find(p => p.id === id);
  const getStoreById = (id: string) => stores.find(s => s.id === id);

  const addPlaybackLog = (log: Omit<PlaybackLog, 'id'>) => {
    const newLog: PlaybackLog = { ...log, id: uuidv4() };
    setPlaybackLogs(prev => [...prev, newLog]);
  };

  // New function to add songs or voiceovers
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
        stores,
        playlists,
        songs,
        playbackLogs,
        currentUser,
        login,
        register,
        logout,
        addPlaylist,
        updatePlaylist,
        deletePlaylist,
        addStore,
        updateStore,
        deleteStore,
        getPlaylistById,
        getStoreById,
        getSongsByIds,
        addPlaybackLog,
        addMediaItem, // Provide the new function
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