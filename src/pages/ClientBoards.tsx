"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Monitor, MapPin, ListMusic, Edit, Trash2, PlayCircle, MoreVertical, Share2 } from 'lucide-react'; // Adicionado Share2
import CreateBoardDialog from '@/components/CreateBoardDialog';
import EditBoardDialog from '@/components/EditBoardDialog';
import { useMyuze } from '@/context/MyuzeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ConfirmationDialog from '@/components/ConfirmationDialog'; // Importar o novo componente

const ClientBoards = () => {
  const { boards, playlists, currentUser, deleteBoard } = useMyuze();

  const clientBoards = boards.filter(board => board.clientId === currentUser?.clientId);

  const getPlaylistName = (playlistId: string) => {
    return playlists.find(p => p.id === playlistId)?.name || 'Playlist Desconhecida';
  };

  const handleDeleteBoard = (boardId: string, boardName: string) => {
    deleteBoard(boardId);
    toast.success(`Quadro "${boardName}" excluído.`);
  };

  const handleCopyPlayerLink = (boardId: string) => {
    const playerLink = `${window.location.origin}/player-auth/${boardId}`;
    navigator.clipboard.writeText(playerLink)
      .then(() => toast.success('Link do player copiado para a área de transferência!'))
      .catch(() => toast.error('Falha ao copiar o link.'));
  };

  return (
    <div className="text-myuze-white space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Meus Quadros</h1>
        <CreateBoardDialog>
          <Button className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Quadro
          </Button>
        </CreateBoardDialog>
      </div>
      <p className="text-lg mb-8">Gerencie os quadros de conteúdo que exibem suas playlists.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientBoards.length === 0 ? (
          <p className="text-gray-400 col-span-full">Nenhum quadro cadastrado ainda. Clique em "Adicionar Quadro" para começar!</p>
        ) : (
          clientBoards.map(board => (
            <Card key={board.id} className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm p-6 relative">
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-myuze-white">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                    <EditBoardDialog board={board}>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault(); // Previne o fechamento do DropdownMenu
                          e.stopPropagation(); // Previne a propagação do evento para o DialogTrigger
                        }}
                        className="cursor-pointer hover:bg-myuze-purple/20"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                    </EditBoardDialog>
                    <DropdownMenuSeparator className="bg-myuze-purple/50" />
                    <ConfirmationDialog
                      title="Confirmar Exclusão de Quadro"
                      description={`Tem certeza que deseja excluir o quadro "${board.name}"? Esta ação não pode ser desfeita.`}
                      onConfirm={() => handleDeleteBoard(board.id, board.name)}
                      confirmText="Excluir"
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-400 cursor-pointer hover:bg-red-400/20 hover:text-red-300">
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </ConfirmationDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center mb-2">
                  <Monitor className="h-8 w-8 text-myuze-purple mr-3" />
                  <CardTitle className="text-2xl font-bold text-myuze-white">{board.name}</CardTitle>
                </div>
                <CardDescription className="text-gray-300 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" /> {board.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <div className="flex items-center text-gray-300 mb-4">
                  <ListMusic className="h-4 w-4 mr-2" />
                  <span className="font-medium">Tocando agora:</span> {getPlaylistName(board.playlistId)}
                </div>
                <div className="flex flex-col space-y-2">
                  <Link to={`/player-auth/${board.id}`}>
                    <Button className="w-full bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
                      <PlayCircle className="mr-2 h-4 w-4" /> Acessar Player
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => handleCopyPlayerLink(board.id)}
                    className="w-full border-myuze-purple text-myuze-purple hover:bg-myuze-purple/20 hover:text-myuze-white"
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Compartilhar Link do Player
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientBoards;