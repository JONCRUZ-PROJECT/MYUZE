"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import CreateClientDialog from '@/components/CreateClientDialog';
import ClientCard from '@/components/ClientCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Clients = () => {
  const { clients } = useMyuze();

  const totalClients = clients.length;

  return (
    <div className="text-myuze-white space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Clientes</h1>
        <CreateClientDialog>
          <Button className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </CreateClientDialog>
      </div>
      <p className="text-lg mb-8">Gerencie seus clientes e suas informações de contato.</p>

      {/* Clients Summary Box */}
      <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold text-myuze-white flex items-center">
            <Users className="h-6 w-6 mr-3 text-myuze-purple" />
            Visão Geral de Clientes
          </CardTitle>
          <CardDescription className="text-gray-300">Total de clientes registrados</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-3 bg-myuze-black/50 rounded-md border border-myuze-purple/30">
          <p className="text-5xl font-bold text-myuze-purple">{totalClients}</p>
        </CardContent>
      </Card>

      {/* List of Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.length === 0 ? (
          <p className="text-gray-400 col-span-full">Nenhum cliente cadastrado ainda. Clique em "Novo Cliente" para começar!</p>
        ) : (
          clients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))
        )}
      </div>
    </div>
  );
};

export default Clients;