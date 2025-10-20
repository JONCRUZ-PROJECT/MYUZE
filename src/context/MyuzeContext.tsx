import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialMyuzeState, User, Playlist, Song, PlaybackLog, Client } from '@/lib/data';
import { saveUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface MyuzeContextType {
  users: User[];
  clients: Client[];
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
  addClient: (clientData: Omit<Client, 'id' | 'userId' | 'clientUserId'>, clientLoginEmail: string, clientLoginPasswordHash: string) => void;
  updateClient: (id: string, updatedClientData: Partial<Client>, clientLoginEmail?: string, clientLoginPasswordHash?: string) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  getPlaylistById: (id: string) => Playlist | undefined;
  getSongsByIds: (ids: string[]) => Song[];
  addPlaybackLog: (log: Omit<PlaybackLog, 'id'>) => void;
  addMediaItem: (mediaItem: Omit<Song, 'id' | 'fileUrl'>, file: File) => void;
  getClientUserByClientId: (clientId: string) => User | undefined;
}

const MyuzeContext = createContext<MyuzeContextType | undefined>(undefined);

export const MyuzeProvider = ({ children }: { ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialMyuzeState.users);
  const [clients, setClients] = useState<Client[]>(initialMyuzeState.clients);
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
      toast.success(`Bem-vindo(a) de volta, ${user.email}!`);
      return true;
    }
    toast.error('Credenciais inválidas.');
    return false;
  };

  const register = (email: string, passwordHash: string): boolean => {
    if (users.some(u => u.email === email)) {
      toast.error('Já existe um usuário com este e-mail.');
      return false;
    }
    const newUser: User = { id: uuidv4(), email, passwordHash, role: 'user' };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    saveUserToLocalStorage(newUser);
    toast.success('Cadastro realizado com sucesso! Bem-vindo(a) ao Myuze.');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    removeUserFromLocalStorage();
    toast.info('Você foi desconectado(a).');
  };

  const getSongsByIds = (ids: string[]): Song[] => {
    return songs.filter(song => ids.includes(song.id));
  };

  const addPlaylist = (playlistData: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para criar uma playlist.');
      return;
    }
    const newPlaylist: Playlist = {
      ...playlistData,
      id: uuidv4(),
      userId: currentUser.id,
      songs: getSongsByIds(selectedSongIds),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    toast.success(`Playlist "${newPlaylist.name}" criada!`);
  };

  const updatePlaylist = (id: string, updatedPlaylistData: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...updatedPlaylistData, songs: getSongsByIds(selectedSongIds) }
          : p
      )
    );
    toast.success(`Playlist atualizada!`);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    toast.success('Playlist excluída.');
  };

  const addClient = (clientData: Omit<Client, 'id' | 'userId' | 'clientUserId'>, clientLoginEmail: string, clientLoginPasswordHash: string) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para adicionar um cliente.');
      return;
    }
    if (users.some(u => u.email === clientLoginEmail)) {
      toast.error('Já existe um usuário com este e-mail de login para o cliente.');
      return;
    }

    const newClientUserId = uuidv4();
    const newClientUser: User = {
      id: newClientUserId,
      email: clientLoginEmail,
      passwordHash: clientLoginPasswordHash,
      role: 'client',
    };

    const newClient: Client = {
      ...clientData,
      id: uuidv4(),
      userId: currentUser.id, // Admin user who created it
      clientUserId: newClientUserId, // The user account for this client
    };

    newClientUser.clientId = newClient.id; // Link client user to client

    setUsers(prev => [...prev, newClientUser]);
    setClients(prev => [...prev, newClient]);
    toast.success(`Cliente "${newClient.name}" e conta de login criados!`);
  };

  const updateClient = (id: string, updatedClientData: Partial<Client>, clientLoginEmail?: string, clientLoginPasswordHash?: string) => {
    setClients(prevClients =>
      prevClients.map(c => {
        if (c.id === id) {
          // Update client's associated user if email/password are provided
          if (c.clientUserId && (clientLoginEmail || clientLoginPasswordHash)) {
            setUsers(prevUsers =>
              prevUsers.map(u => {
                if (u.id === c.clientUserId) {
                  return {
                    ...u,
                    email: clientLoginEmail !== undefined ? clientLoginEmail : u.email,
                    passwordHash: clientLoginPasswordHash !== undefined ? clientLoginPasswordHash : u.passwordHash,
                  };
                }
                return u;
              })
            );
          }
          return { ...c, ...updatedClientData };
        }
        return c;
      })
    );
    toast.success(`Cliente atualizado!`);
  };

  const deleteClient = (id: string) => {
    const clientToDelete = clients.find(c => c.id === id);
    if (clientToDelete && clientToDelete.clientUserId) {
      setUsers(prev => prev.filter(u => u.id !== clientToDelete.clientUserId));
    }
    setClients(prev => prev.filter(c => c.id !== id));
    toast.success('Cliente excluído.');
  };

  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getPlaylistById = (id: string) => playlists.find(p => p.id === id);
  const getClientUserByClientId = (clientId: string) => users.find(u => u.clientId === clientId);


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
        getClientById,
        getPlaylistById,
        getSongsByIds,
        addPlaybackLog,
        addMediaItem,
        getClientUserByClientId,
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