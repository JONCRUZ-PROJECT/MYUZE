"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { toast } from 'sonner';

interface CreateClientDialogProps {
  children: React.ReactNode;
}

const CreateClientDialog = ({ children }: CreateClientDialogProps) => {
  const { addClient } = useMyuze();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleSubmit = () => {
    if (!name || !contactEmail) {
      toast.error('Por favor, preencha o nome e o e-mail de contato do cliente.');
      return;
    }

    addClient({ name, contactEmail, contactPhone: contactPhone || undefined });
    setIsOpen(false);
    setName('');
    setContactEmail('');
    setContactPhone('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-myuze-black text-myuze-white border-myuze-purple">
        <DialogHeader>
          <DialogTitle className="text-myuze-white">Adicionar Novo Cliente</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os detalhes para adicionar um novo cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-myuze-white">
              Nome do Cliente *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Empresa XYZ"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-myuze-white">
              E-mail de Contato *
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contato@empresa.com"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone" className="text-myuze-white">
              Telefone de Contato
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
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

export default CreateClientDialog;