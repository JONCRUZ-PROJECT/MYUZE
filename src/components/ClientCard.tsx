"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User, Mail, Phone, MoreVertical, Edit, Trash2, Building } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { Client } from '@/lib/data';
import { toast } from 'sonner';

interface ClientCardProps {
  client: Client;
}

const ClientCard = ({ client }: ClientCardProps) => {
  const { deleteClient, updateClient } = useMyuze();

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${client.name}"?`)) {
      deleteClient(client.id);
      toast.success(`Cliente "${client.name}" foi excluído.`);
    }
  };

  const handleEdit = () => {
    toast.info(`Funcionalidade de edição para o cliente "${client.name}" será implementada.`);
    // This would typically open an EditClientDialog
  };

  return (
    <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm p-6">
      <CardHeader className="flex flex-row items-start justify-between p-0 mb-4">
        <div className="flex items-center mb-4">
          {client.logoUrl ? (
            <img src={client.logoUrl} alt={`${client.name} Logo`} className="w-16 h-16 object-contain rounded-md mr-4 border border-myuze-purple/50 p-1" />
          ) : (
            <div className="w-16 h-16 bg-myuze-black/50 rounded-md flex items-center justify-center mr-4 border border-myuze-purple/50">
              <Building className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="flex flex-col">
            <CardTitle className="text-2xl font-bold text-myuze-white mb-1">
              {client.name}
            </CardTitle>
            <CardDescription className="text-gray-300 flex items-center">
              <Mail className="h-4 w-4 mr-2" /> {client.contactEmail}
            </CardDescription>
            {client.contactPhone && (
              <CardDescription className="text-gray-300 flex items-center mt-1">
                <Phone className="h-4 w-4 mr-2" /> {client.contactPhone}
              </CardDescription>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-myuze-white">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-myuze-black border-myuze-purple text-myuze-white">
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer hover:bg-myuze-purple/20">
              <Edit className="mr-2 h-4 w-4" /> Editar Cliente
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-myuze-purple/50" />
            <DropdownMenuItem onClick={handleDelete} className="text-red-400 cursor-pointer hover:bg-red-400/20 hover:text-red-300">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir Cliente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        {/* Conteúdo adicional do cliente pode ir aqui */}
      </CardContent>
    </Card>
  );
};

export default ClientCard;