"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MapPin, Wifi, ListMusic, MoreVertical, Edit, Trash2, Play } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { Store } from '@/lib/data';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  const { deleteStore, updateStore, getPlaylistById, getClientById } = useMyuze();
  const currentPlaylist = store.currentPlaylistId ? getPlaylistById(store.currentPlaylistId) : null;
  const client = getClientById(store.clientId);

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a loja "${store.name}"?`)) {
      deleteStore(store.id);
    }
  };

  const handleEdit = () => {
    toast.info(`Funcionalidade de edição para a loja "${store.name}" será implementada.`);
    // This would typically open an EditStoreDialog
  };

  const getStatusBadge = (status: Store['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 hover:bg-green-500/80 text-white">Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-500 hover:bg-red-500/80 text-white">Offline</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-500/80 text-white">Pendente</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm p-6">
      <CardHeader className="flex flex-row items-start justify-between p-0 mb-4">
        <div className="flex flex-col">
          <CardTitle className="text-2xl font-bold text-myuze-white mb-1">
            {store.name}
          </CardTitle>
          <CardDescription className="text-gray-300 flex items-center">
            <MapPin className="h-4 w-4 mr-2" /> {store.location}
          </CardDescription>
          {client && (
            <CardDescription className="text-gray-300 flex items-center mt-1">
              Cliente: <span className="font-medium ml-1">{client.name}</span>
            </CardDescription>
          )}
        </div>
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
            <Link to={`/player/${store.id}`}>
              <DropdownMenuItem className="cursor-pointer hover:bg-myuze-purple/20">
                <Play className="mr-2 h-4 w-4" /> Abrir Player
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-myuze-purple/50" />
            <DropdownMenuItem onClick={handleDelete} className="text-red-400 cursor-pointer hover:bg-red-400/20 hover:text-red-300">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0 mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-300">
            <Wifi className="h-4 w-4 mr-2" /> Status:
          </div>
          {getStatusBadge(store.status)}
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <ListMusic className="h-4 w-4 mr-2" /> Playlist Atual:
          <span className="ml-2 font-medium text-myuze-white">
            {currentPlaylist ? currentPlaylist.name : 'Nenhuma'}
          </span>
        </div>
        {store.lastPlayedSong && (
          <p className="text-xs text-gray-400">
            Última música: {store.lastPlayedSong} (simulado)
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreCard;