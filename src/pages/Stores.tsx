"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Wifi } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import CreateStoreDialog from '@/components/CreateStoreDialog'; // Updated import
import StoreCard from '@/components/StoreCard'; // Updated import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Stores = () => {
  const { stores, clients } = useMyuze();

  const totalStores = stores.length;

  return (
    <div className="text-myuze-white space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Lojas</h1>
        {/* The CreateStoreDialog here would be for a generic store,
            but we're focusing on adding it via ClientCard for now.
            Keeping this for future flexibility if needed. */}
        {/* <CreateStoreDialog clientId={clients[0]?.id || ''}>
          <Button className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            <Plus className="mr-2 h-4 w-4" /> Nova Loja
          </Button>
        </CreateStoreDialog> */}
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

      {/* List of Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.length === 0 ? (
          <p className="text-gray-400 col-span-full">Nenhuma loja cadastrada ainda. Adicione uma através da página de Clientes!</p>
        ) : (
          stores.map(store => (
            <StoreCard key={store.id} store={store} />
          ))
        )}
      </div>
    </div>
  );
};

export default Stores;