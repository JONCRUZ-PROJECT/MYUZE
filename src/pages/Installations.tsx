"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Store, Globe, WifiOff } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import InstallationCard from '@/components/InstallationCard';
import CreateInstallationDialog from '@/components/CreateInstallationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const Installations = () => {
  const { stores, currentUser } = useMyuze();
  const companyName = currentUser?.email ? currentUser.email.split('@')[0] : 'Sua Empresa';

  const totalInstallations = stores.length;
  const onlineInstallations = stores.filter(store => store.status === 'online').length;
  const offlineInstallations = totalInstallations - onlineInstallations;

  const handleCompanyEdit = () => {
    toast.info(`Funcionalidade de edição para a empresa "${companyName}" será implementada.`);
  };

  const handleCompanyDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a empresa "${companyName}" e todas as suas instalações?`)) {
      toast.info(`Funcionalidade de exclusão para a empresa "${companyName}" será implementada.`);
      // In a real app, this would trigger a more complex deletion logic
    }
  };

  return (
    <div className="text-myuze-white space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold mr-4">{companyName}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-myuze-white">
                <Edit className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-myuze-black border-myuze-purple text-myuze-white">
              <DropdownMenuItem onClick={handleCompanyEdit} className="cursor-pointer hover:bg-myuze-purple/20">
                <Edit className="mr-2 h-4 w-4" /> Editar Empresa
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-myuze-purple/50" />
              <DropdownMenuItem onClick={handleCompanyDelete} className="text-red-400 cursor-pointer hover:bg-red-400/20 hover:text-red-300">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir Empresa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CreateInstallationDialog>
          <Button className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Instalação
          </Button>
        </CreateInstallationDialog>
      </div>

      <p className="text-lg mb-8">Gerencie suas instalações aqui.</p>

      {/* Company Summary Box */}
      <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm mb-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold text-myuze-white flex items-center">
            <Store className="h-6 w-6 mr-3 text-myuze-purple" />
            {companyName}
          </CardTitle>
          <CardDescription className="text-gray-300">Visão Geral das Instalações</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-myuze-black/50 rounded-md border border-myuze-purple/30">
            <p className="text-3xl font-bold text-myuze-purple">{totalInstallations}</p>
            <p className="text-sm text-gray-300">Total</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-myuze-black/50 rounded-md border border-myuze-purple/30">
            <p className="text-3xl font-bold text-green-400">{onlineInstallations}</p>
            <p className="text-sm text-gray-300 flex items-center"><Globe className="h-4 w-4 mr-1" /> Online</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-myuze-black/50 rounded-md border border-myuze-purple/30">
            <p className="text-3xl font-bold text-red-400">{offlineInstallations}</p>
            <p className="text-sm text-gray-300 flex items-center"><WifiOff className="h-4 w-4 mr-1" /> Offline</p>
          </div>
        </CardContent>
      </Card>

      {/* List of Installation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.length === 0 ? (
          <p className="text-gray-400 col-span-full">Nenhuma instalação criada ainda. Clique em "Adicionar Instalação" para começar!</p>
        ) : (
          stores.map(store => (
            <InstallationCard key={store.id} installation={store} />
          ))
        )}
      </div>
    </div>
  );
};

export default Installations;