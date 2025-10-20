"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { toast } from 'sonner';

interface CreateStoreDialogProps {
  children: React.ReactNode;
  clientId: string;
}

const CreateStoreDialog = ({ children, clientId }: CreateStoreDialogProps) => {
  const { addStore } = useMyuze();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!name || !location) {
      toast.error('Por favor, preencha o nome e a localização da loja.');
      return;
    }

    addStore({ clientId, name, location });
    setIsOpen(false);
    setName('');
    setLocation('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-myuze-black text-myuze-white border-myuze-purple">
        <DialogHeader>
          <DialogTitle className="text-myuze-white">Adicionar Nova Loja</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os detalhes para adicionar uma nova loja para este cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-myuze-white">
              Nome da Loja *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Loja Principal"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-myuze-white">
              Localização *
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Rua Exemplo, 123 - Cidade"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 hover:bg-myuze-gray-translucent hover:text-myuze-white">
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreDialog;