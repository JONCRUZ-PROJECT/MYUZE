"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
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
import { toast } from 'sonner';

const Installations = () => {
  const { stores, currentUser } = useMyuze();
  const companyName = currentUser?.email ? currentUser.email.split('@')[0] : 'Sua Empresa';

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
                <ChevronDown className="h-5 w-5" />
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

      <p className="text-lg">Gerencie suas instalações aqui.</p>

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