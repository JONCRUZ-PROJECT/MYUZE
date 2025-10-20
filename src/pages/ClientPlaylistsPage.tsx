"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Music, Clock } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom'; // Importar Link para navegação

const ClientPlaylistsPage = () => {
  const { playlists, currentUser } = useMyuze();

  // Filtrar playlists que pertencem ao usuário cliente logado
  const clientPlaylists = playlists.filter(p => p.userId === currentUser?.id);

  const formatTotalDuration = (songs: { duration: number }[]) => {
    const totalSeconds = songs.reduce((sum, song) => sum + song.duration, 0);
    const totalMinutes = Math.ceil(totalSeconds / 60);
    return `${totalMinutes}min`;
  };

  return (
    <div className="text-myuze-white space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Minhas Playlists</h1>
      </div>
      <p className="text-lg">Visualize e gerencie suas playlists atribuídas aqui.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientPlaylists.length === 0 ? (
          <p className="text-gray-400 col-span-full">Nenhuma playlist atribuída a você ainda.</p>
        ) : (
          clientPlaylists.map(playlist => (
            <div key={playlist.id} className="bg-myuze-gray-translucent p-6 rounded-lg shadow-xl backdrop-blur-sm border border-myuze-purple/30 relative">
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-myuze-white">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                    {/* No momento, não permitimos que clientes editem ou excluam playlists diretamente daqui.
                        Isso pode ser adicionado no futuro, se necessário. */}
                    <DropdownMenuItem disabled className="text-gray-500">
                      <Music className="mr-2 h-4 w-4" /> Ver Detalhes (Em breve)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <img
                src={playlist.coverImageUrl || '/public/placeholder.svg'}
                alt={playlist.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-myuze-white mb-2">{playlist.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{playlist.description}</p>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="border-myuze-purple text-myuze-purple bg-myuze-purple/20">
                  Mood: {playlist.mood}
                </Badge>
                <Badge variant="outline" className="border-myuze-purple text-myuze-purple bg-myuze-purple/20">
                  <Music className="h-3 w-3 mr-1" /> {playlist.songs.length} itens
                </Badge>
                <Badge variant="outline" className="border-myuze-purple text-myuze-purple bg-myuze-purple/20">
                  <Clock className="h-3 w-3 mr-1" /> {formatTotalDuration(playlist.songs)}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientPlaylistsPage;