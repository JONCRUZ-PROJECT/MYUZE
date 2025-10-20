"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Store as StoreIcon, MoreVertical, Play, Link as LinkIcon, Key, Edit, Trash2 } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { Store } from '@/lib/data';
import { toast } from 'sonner';

interface InstallationCardProps {
  installation: Store;
}

const InstallationCard = ({ installation }: InstallationCardProps) => {
  const { playlists, updateStore, deleteStore, getPlaylistById } = useMyuze();
  const currentPlaylist = installation.currentPlaylistId ? getPlaylistById(installation.currentPlaylistId) : undefined;

  const handlePlaylistChange = (newPlaylistId: string) => {
    updateStore(installation.id, { currentPlaylistId: newPlaylistId });
    toast.success(`Playlist da instalação "${installation.name}" atualizada para "${getPlaylistById(newPlaylistId)?.name}"`);
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a instalação "${installation.name}"?`)) {
      deleteStore(installation.id);
    }
  };

  const handleEdit = () => {
    toast.info(`Funcionalidade de edição para "${installation.name}" será implementada.`);
    // This would typically open an EditInstallationDialog
  };

  const handlePlayerClick = () => {
    // Navigate to player page
    toast.info(`Abrindo player para "${installation.name}"...`);
  };

  const handleLinkPlayerClick = () => {
    // Copy player link to clipboard
    const playerLink = `${window.location.origin}/player/${installation.id}`;
    navigator.clipboard.writeText(playerLink);
    toast.success('Link do player copiado para a área de transferência!');
  };

  const handleCredentialsClick = () => {
    toast.info(`Funcionalidade de credenciais para "${installation.name}" será implementada.`);
  };

  return (
    <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm p-6">
      <CardHeader className="flex flex-row items-start justify-between p-0 mb-4">
        <div className="flex flex-col">
          <CardTitle className="text-2xl font-bold text-myuze-white mb-1">
            {installation.name}
          </CardTitle>
          <p className="text-sm text-gray-300">{installation.address}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              installation.status === 'online'
                ? 'bg-green-500/20 text-green-400 border-green-500/50'
                : 'bg-red-500/20 text-red-400 border-red-500/50'
            }`}
          >
            {installation.status === 'online' ? 'Online' : 'Offline'}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-myuze-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-myuze-black border-myuze-purple text-myuze-white">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer hover:bg-myuze-purple/20">
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-myuze-purple/50" />
              <DropdownMenuItem onClick={handleDelete} className="text-red-400 cursor-pointer hover:bg-red-400/20 hover:text-red-300">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div>
          <p className="text-sm text-gray-400">Tocando agora</p>
          <p className="font-semibold text-myuze-white">
            {installation.status === 'online' && currentPlaylist
              ? currentPlaylist.name
              : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Mudar Playlist</p>
          <Select
            value={installation.currentPlaylistId || ''}
            onValueChange={handlePlaylistChange}
            disabled={installation.status === 'offline'}
          >
            <SelectTrigger className="w-full bg-myuze-black/50 border-myuze-purple text-myuze-white">
              <SelectValue placeholder="Selecione uma playlist" />
            </SelectTrigger>
            <SelectContent className="bg-myuze-black border-myuze-purple text-myuze-white">
              {playlists.map((playlist) => (
                <SelectItem key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link to={`/player/${installation.id}`}>
            <Button onClick={handlePlayerClick} className="w-full bg-myuze-black/70 hover:bg-myuze-black/90 text-myuze-white border border-myuze-purple/50">
              <Play className="mr-2 h-4 w-4" /> Player
            </Button>
          </Link>
          <Button onClick={handleLinkPlayerClick} className="w-full bg-myuze-black/70 hover:bg-myuze-black/90 text-myuze-white border border-myuze-purple/50">
            <LinkIcon className="mr-2 h-4 w-4" /> Link do Player
          </Button>
          <Button onClick={handleCredentialsClick} className="w-full bg-myuze-black/70 hover:bg-myuze-black/90 text-myuze-white border border-myuze-purple/50">
            <Key className="mr-2 h-4 w-4" /> Credenciais
          </Button>
          <Button onClick={handleEdit} className="w-full bg-myuze-black/70 hover:bg-myuze-black/90 text-myuze-white border border-myuze-purple/50">
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallationCard;