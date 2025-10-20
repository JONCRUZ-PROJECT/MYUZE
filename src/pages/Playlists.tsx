import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, Edit, Trash2, Music, Clock } from 'lucide-react';
import CreatePlaylistDialog from '@/components/CreatePlaylistDialog';
import EditPlaylistDialog from '@/components/EditPlaylistDialog';
import { useMyuze } from '@/context/MyuzeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge'; // Import Badge component

const Playlists = () => {
  const { playlists, deletePlaylist } = useMyuze();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a playlist "${name}"?`)) {
      deletePlaylist(id);
    }
  };

  const formatTotalDuration = (songs: { duration: number }[]) => {
    const totalSeconds = songs.reduce((sum, song) => sum + song.duration, 0);
    const totalMinutes = Math.ceil(totalSeconds / 60); // Arredonda para cima para minutos
    return `${totalMinutes}min`;
  };

  return (
    <div className="text-myuze-white space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Playlists</h1>
        <CreatePlaylistDialog>
          <Button className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            <Plus className="mr-2 h-4 w-4" /> Nova Playlist
          </Button>
        </CreatePlaylistDialog>
      </div>
      <p className="text-lg">Gerencie suas playlists aqui.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.length === 0 ? (
          <p className="text-gray-400 col-span-full">Nenhuma playlist criada ainda. Clique em "Nova Playlist" para começar!</p>
        ) : (
          playlists.map(playlist => (
            <div key={playlist.id} className="bg-myuze-gray-translucent p-6 rounded-lg shadow-xl backdrop-blur-sm border border-myuze-purple/30 relative">
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-myuze-white">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                    <EditPlaylistDialog playlist={playlist}>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer hover:bg-myuze-purple/20">
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                    </EditPlaylistDialog>
                    <DropdownMenuSeparator className="bg-myuze-purple/50" />
                    <DropdownMenuItem onClick={() => handleDelete(playlist.id, playlist.name)} className="text-red-400 cursor-pointer hover:bg-red-400/20 hover:text-red-300">
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <img
                src={playlist.coverImageUrl || '/public/placeholder.svg'}
                alt={playlist.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-myuze-white mb-2">{playlist.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{playlist.description}</p>
              <div className="flex items-center flex-wrap gap-2 mt-2"> {/* Use flex-wrap and gap for badges */}
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

export default Playlists;