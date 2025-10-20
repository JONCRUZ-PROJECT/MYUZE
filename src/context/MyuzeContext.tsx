import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialMyuzeState, User, Playlist, Song, PlaybackLog, Client, Board } from '@/lib/data';
import { saveUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { generateRandomPassword, slugify } from '@/lib/utils'; // Importar as novas funções

interface MyuzeContextType {
  users: User[];
  clients: Client[];
  playlists: Playlist[];
  songs: Song[];
  playbackLogs: PlaybackLog[];
  boards: Board[]; // Adicionado
  currentUser: User | null;
  currentBoardPlayer: Board | null; // Adicionado para o player
  login: (email: string, passwordHash: string) => boolean;
  register: (email: string, passwordHash: string) => boolean;
  logout: () => void;
  playerLogin: (boardId: string, username: string, passwordHash: string) => boolean; // Adicionado
  playerLogout: () => void; // Adicionado
  addPlaylist: (playlist: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => void;
  updatePlaylist: (id: string, updatedPlaylist: Omit<Playlist, 'id' | 'userId' | 'songs'>, selectedSongIds: string[]) => void;
  deletePlaylist: (id: string) => void;
  addClient: (clientData: Omit<Client, 'id' | 'userId' | 'clientUserId'>) => void;
  updateClient: (id: string, updatedClientData: Partial<Client>, clientLoginEmail?: string, clientLoginPassword?: string) => void; // Adicionado clientLoginEmail e password
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  getPlaylistById: (id: string) => Playlist | undefined;
  getSongsByIds: (ids: string[]) => Song[];
  addPlaybackLog: (log: Omit<PlaybackLog, 'id'>) => void;
  addMediaItem: (mediaItem: Omit<Song, 'id' | 'fileUrl'>, file: File) => void;
  getClientUserByClientId: (clientId: string) => User | undefined;
  addBoard: (boardData: Omit<Board, 'id' | 'clientId' | 'playerUsername' | 'playerPassword'>, playerUsername: string, playerPassword: string) => void; // Modificado
  getBoardById: (id: string) => Board | undefined; // Adicionado
  updateBoard: (id: string, updatedBoardData: Partial<Board>) => void; // Adicionado
  deleteBoard: (id: string) => void; // Adicionado
}

const MyuzeContext = createContext<MyuzeContextType | undefined>(undefined);

const PLAYER_AUTH_STORAGE_KEY = 'myuze_board_player_auth';

export const MyuzeProvider = ({ children }: { ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialMyuzeState.users);
  const [clients, setClients] = useState<Client[]>(initialMyuzeState.clients);
  const [playlists, setPlaylists] = useState<Playlist[]>(initialMyuzeState.playlists);
  const [songs, setSongs] = useState<Song[]>(initialMyuzeState.songs);
  const [playbackLogs, setPlaybackLogs] = useState<PlaybackLog[]>(initialMyuzeState.playbackLogs);
  const [boards, setBoards] = useState<Board[]>(initialMyuzeState.boards);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentBoardPlayer, setCurrentBoardPlayer] = useState<Board | null>(null); // Novo estado para o player

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser) {
      setCurrentUser(storedUser);
    }

    const storedPlayerAuth = localStorage.getItem(PLAYER_AUTH_STORAGE_KEY);
    if (storedPlayerAuth) {
      const { boardId, username, password } = JSON.parse(storedPlayerAuth);
      // Tenta fazer login automático do player, mas sem toast para evitar spam no carregamento
      const board = boards.find(b => b.id === boardId && b.playerUsername === username && b.playerPassword === password);
      if (board) {
        setCurrentBoardPlayer(board);
      } else {
        localStorage.removeItem(PLAYER_AUTH_STORAGE_KEY); // Limpa se as credenciais armazenadas forem inválidas
      }
    }
  }, [boards]); // Adicionado 'boards' como dependência para reavaliar o login do player se os quadros mudarem

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

  const playerLogin = (boardId: string, username: string, passwordHash: string): boolean => {
    console.log('playerLogin: Tentando login para boardId:', boardId, 'username:', username, 'passwordHash:', passwordHash);
    const board = boards.find(b => b.id === boardId);
    
    if (!board) {
      console.log('playerLogin: Quadro não encontrado para ID:', boardId);
      toast.error('Credenciais do player inválidas.');
      return false;
    }

    console.log('playerLogin: Quadro encontrado:', board);
    console.log('playerLogin: Comparando username:', username, 'com', board.playerUsername);
    console.log('playerLogin: Comparando passwordHash:', passwordHash, 'com', board.playerPassword);

    if (board.playerUsername === username && board.playerPassword === passwordHash) {
      setCurrentBoardPlayer(board);
      localStorage.setItem(PLAYER_AUTH_STORAGE_KEY, JSON.stringify({ boardId, username, password: passwordHash }));
      toast.success(`Player do quadro "${board.name}" conectado!`);
      return true;
    }
    toast.error('Credenciais do player inválidas.');
    return false;
  };

  const playerLogout = () => {
    setCurrentBoardPlayer(null);
    localStorage.removeItem(PLAYER_AUTH_STORAGE_KEY);
    toast.info('Player desconectado.');
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

  const addClient = (clientData: Omit<Client, 'id' | 'userId' | 'clientUserId'>) => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para adicionar um cliente.');
      return;
    }

    const generatedClientLoginEmail = `${slugify(clientData.name)}@myuze.com`;
    const generatedClientLoginPassword = generateRandomPassword();

    if (users.some(u => u.email === generatedClientLoginEmail)) {
      toast.error('Já existe um usuário com este e-mail de login gerado para o cliente. Por favor, tente um nome de cliente diferente.');
      return;
    }

    const newClientUserId = uuidv4();
    const newClientUser: User = {
      id: newClientUserId,
      email: generatedClientLoginEmail,
      passwordHash: generatedClientLoginPassword, // Em um app real, isso seria hashed
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
    toast.info(`Credenciais do cliente: E-mail: ${generatedClientLoginEmail}, Senha: ${generatedClientLoginPassword}`, { duration: 10000 });
  };

  const updateClient = (id: string, updatedClientData: Partial<Client>, clientLoginEmail?: string, clientLoginPassword?: string) => {
    setClients(prevClients =>
      prevClients.map(c => {
        if (c.id === id) {
          // If clientLoginEmail or clientLoginPassword are provided, update the associated user
          if (c.clientUserId && (clientLoginEmail || clientLoginPassword)) {
            setUsers(prevUsers =>
              prevUsers.map(u =>
                u.id === c.clientUserId
                  ? { ...u, email: clientLoginEmail || u.email, passwordHash: clientLoginPassword || u.passwordHash }
                  : u
              )
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

  // Funções para Boards
  const addBoard = (boardData: Omit<Board, 'id' | 'clientId' | 'playerUsername' | 'playerPassword'>, playerUsername: string, playerPassword: string) => {
    if (!currentUser || currentUser.role !== 'client' || !currentUser.clientId) {
      toast.error('Você precisa ser um cliente logado para adicionar um quadro.');
      return false; // Retorna false para indicar falha
    }
    const newBoard: Board = {
      ...boardData,
      id: uuidv4(),
      clientId: currentUser.clientId,
      playerUsername,
      playerPassword,
    };
    setBoards(prev => [...prev, newBoard]);
    console.log('addBoard: Novo quadro adicionado:', newBoard); // Log do novo quadro
    toast.success(`Quadro "${newBoard.name}" adicionado!`);
    toast.info(`Credenciais do Player: Usuário: ${playerUsername}, Senha: ${playerPassword}`, { duration: 10000 });
    return true; // Retorna true para indicar sucesso
  };

  const getBoardById = (id: string) => boards.find(b => b.id === id);

  const updateBoard = (id: string, updatedBoardData: Partial<Board>) => {
    setBoards(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, ...updatedBoardData }
          : b
      )
    );
    toast.success(`Quadro atualizado!`);
  };

  const deleteBoard = (id: string) => {
    setBoards(prev => prev.filter(b => b.id !== id));
    toast.success('Quadro excluído.');
  };


  return (
    <MyuzeContext.Provider
      value={{
        users,
        clients,
        playlists,
        songs,
        playbackLogs,
        boards,
        currentUser,
        currentBoardPlayer, // Adicionado
        login,
        register,
        logout,
        playerLogin, // Adicionado
        playerLogout, // Adicionado
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
        addBoard,
        getBoardById,
        updateBoard,
        deleteBoard,
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