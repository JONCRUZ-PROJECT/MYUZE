import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyuze } from '@/context/MyuzeContext';
import { Users, ListMusic, Clock } from 'lucide-react'; // Removed Store icon

const DashboardHome = () => {
  const { playlists, users, playbackLogs } = useMyuze(); // Removed stores

  const totalActiveCompanies = users.length; // Assuming each user represents a company
  const totalPlaylists = playlists.length;

  // Calculate total playback hours (simplified for MVP)
  const totalPlaybackSeconds = playbackLogs.reduce((sum, log) => {
    const song = playlists.find(p => p.id === log.playlistId)?.songs.find(s => s.id === log.songId);
    return sum + (song?.duration || 0);
  }, 0);
  const totalPlaybackHours = (totalPlaybackSeconds / 3600).toFixed(1);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-myuze-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted grid columns */}
        <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Empresas Ativas</CardTitle>
            <Users className="h-5 w-5 text-myuze-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalActiveCompanies}</div>
            <p className="text-xs text-gray-400">Total de usuários registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Playlists Online</CardTitle>
            <ListMusic className="h-5 w-5 text-myuze-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPlaylists}</div>
            <p className="text-xs text-gray-400">Playlists criadas</p>
          </CardContent>
        </Card>

        {/* Removed Installations Connected card */}

        <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Horas de Reprodução</CardTitle>
            <Clock className="h-5 w-5 text-myuze-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPlaybackHours}h</div>
            <p className="text-xs text-gray-400">Total de música tocada</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for recent activity or logs */}
      <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-myuze-white">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Nenhuma atividade recente para exibir.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;