import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreatePlaylistDialog from '@/components/CreatePlaylistDialog'; // Import the new component
import { useMyuze } from '@/context/MyuzeContext'; // Import useMyuze to get playlists

const Playlists = () => {
  const { playlists } = useMyuze(); // Get playlists from context

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

      {/* Display existing playlists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.length === 0 ? (
          <p className="text-gray-400 col-span-full">Nenhuma playlist criada ainda. Clique em "Nova Playlist" para começar!</p>
        ) : (
          playlists.map(playlist => (
            <div key={playlist.id} className="bg-myuze-gray-translucent p-6 rounded-lg shadow-xl backdrop-blur-sm border border-myuze-purple/30">
              <img
                src={playlist.coverImageUrl || '/public/placeholder.svg'} // Use cover image or placeholder
                alt={playlist.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-myuze-white mb-2">{playlist.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{playlist.description}</p>
              <div className="flex items-center text-gray-400 text-xs">
                <Music className="h-4 w-4 mr-1" /> {playlist.songs.length} músicas/locuções
              </div>
              <div className="flex items-center text-gray-400 text-xs mt-1">
                Mood: <span className="ml-1 text-myuze-purple font-medium">{playlist.mood}</span>
              </div>
              {/* Add more playlist details or actions here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlists;