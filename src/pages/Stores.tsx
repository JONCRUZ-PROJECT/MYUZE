"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Wifi, Store as StoreIcon } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import CreateStoreDialog from '@/components/CreateStoreDialog';
import StoreCard from '@/components/StoreCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Stores = () => {
  const { stores, clients } = useMyuze();

  const totalStores = stores.length;

  return (
    <div className="text-myuze-white space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Lojas</h1>
        <CreateStoreDialog> {/* Removed clientId prop to allow selection */}
          <Button className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            <Plus className="mr-2 h-4 w-4" /> Nova Loja
          </Button>
        </CreateStoreDialog>
      </div>
      <p className="text-lg mb-8">Gerencie as lojas de música dos seus clientes.</p>

      {/* Stores Summary Box */}
      <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold text-myuze-white flex items-center">
            <Wifi className="h-6 w-6 mr-3 text-myuze-purple" />
            Visão Geral de Lojas
          </CardTitle>
          <CardDescription className="text-gray-300">Total de lojas registradas</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-3 bg-myuze-black/50 rounded-md border border-myuze-purple/30">
          <p className="text-5xl font-bold text-myuze-purple">{totalStores}</p>
        </CardContent>
      </Card>

      {/* Grouped List of Store Cards by Client */}
      <div className="space-y-8">
        {clients.length === 0 ? (
          <p className="text-gray-400 col-span-full">Nenhum cliente cadastrado ainda. Adicione um cliente para começar a gerenciar suas lojas!</p>
        ) : (
          clients.map(client => {
            const clientStores = stores.filter(store => store.clientId === client.id);
            return (
              <Card key={client.id} className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold text-myuze-white flex items-center">
                    <StoreIcon className="h-6 w-6 mr-3 text-myuze-purple" />
                    {client.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300 mt-1">
                    {clientStores.length} loja(s) associada(s)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                  {clientStores.length === 0 ? (
                    <p className="text-gray-400">Nenhuma loja cadastrada para este cliente ainda.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {clientStores.map(store => (
                        <StoreCard key={store.id} store={store} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Stores;