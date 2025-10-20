import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyuze } from '@/context/MyuzeContext';
import { ListMusic, Clock, Store } from 'lucide-react';

const ClientDashboard = () => {
  const { currentUser, clients, playlists } = useMyuze();

  const client = clients.find(c => c.clientUserId === currentUser?.id);
  const clientPlaylists = playlists.filter(p => p.userId === currentUser?.id); // Assuming client users can also 'own' playlists for simplicity

  if (!client) {
    return (
      <div className="text-myuze-white text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo(a) ao Painel do Cliente</h1>
        <p className="text-xl text-gray-300">Nenhum cliente associado encontrado para este usuário.</p>
      </div>
    );
  }

  // Placeholder for client-specific data
  const totalPlaylists = clientPlaylists.length;
  const totalPlaybackHours = (0).toFixed(1); // This would come from actual playback logs associated with the client's stores/playlists

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-myuze-white mb-6">Painel de {client.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Suas Playlists</CardTitle>
            <ListMusic className="h-5 w-5 text-myuze-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPlaylists}</div>
            <p className="text-xs text-gray-400">Playlists ativas</p>
          </CardContent>
        </Card>

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

        {/* Add more client-specific cards here */}
      </div>

      <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-myuze-white">Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-300">
          <p><strong>Nome:</strong> {client.name}</p>
          <p><strong>E-mail de Contato:</strong> {client.contactEmail}</p>
          {client.contactPhone && <p><strong>Telefone:</strong> {client.contactPhone}</p>}
          {client.logoUrl && <img src={client.logoUrl} alt={`${client.name} Logo`} className="w-24 h-24 object-contain rounded-md mt-2 border border-myuze-purple/50 p-1" />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;