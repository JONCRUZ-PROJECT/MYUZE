import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyuze } from '@/context/MyuzeContext';
import { ListMusic, Clock, User as UserIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';

const AdminClientView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients, playlists } = useMyuze();

  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="text-myuze-white text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Cliente Não Encontrado</h1>
        <p className="text-xl text-gray-300">O cliente com ID "{clientId}" não foi encontrado.</p>
      </div>
    );
  }

  // Filtrar playlists que pertencem ao usuário de login deste cliente
  const clientPlaylists = playlists.filter(p => p.userId === client.clientUserId);

  // Placeholder para dados específicos do cliente (você pode expandir isso)
  const totalPlaylists = clientPlaylists.length;
  const totalPlaybackHours = (0).toFixed(1); // Isso viria de logs de reprodução reais associados às lojas/playlists do cliente

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-myuze-white mb-6">Painel de {client.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Playlists Ativas</CardTitle>
            <ListMusic className="h-5 w-5 text-myuze-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPlaylists}</div>
            <p className="text-xs text-gray-400">Playlists atribuídas</p>
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

        {/* Adicione mais cards específicos do cliente aqui */}
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

export default AdminClientView;