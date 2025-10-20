import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialMyuzeState, User, Playlist, Song, PlaybackLog, Client } from '@/lib/data'; // Removed Store import
import { saveUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface MyuzeContextType {
  users: User[];
  clients: Client[];
  playlists: Playlist[];
  songs: Song[];
  // Removed stores
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
  // Removed addStore, updateStore, deleteStore
  getClientById: (id: string) => Client | undefined;
  getPlaylistById: (id: string) => Playlist | undefined;
  // Removed getStoreById
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
  // Removed stores state
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

  // Removed addStore, updateStore, deleteStore functions

  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getPlaylistById = (id: string) => playlists.find(p => p.id === id);
  // Removed getStoreById

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
        // Removed stores
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
        // Removed addStore, updateStore, deleteStore
        getClientById,
        getPlaylistById,
        // Removed getStoreById
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