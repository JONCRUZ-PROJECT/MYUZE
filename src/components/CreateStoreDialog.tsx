"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { toast } from 'sonner';

interface CreateStoreDialogProps {
  children: React.ReactNode;
  clientId?: string; // Make clientId optional
}

const CreateStoreDialog = ({ children, clientId }: CreateStoreDialogProps) => {
  const { addStore, clients } = useMyuze();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(clientId);

  // Reset form fields and selectedClientId when dialog opens or clientId prop changes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setLocation('');
      setSelectedClientId(clientId); // Reset to prop clientId or undefined
    }
  }, [isOpen, clientId]);

  const handleSubmit = () => {
    if (!name || !location || !selectedClientId) {
      toast.error('Por favor, preencha o nome, a localização da loja e selecione um cliente.');
      return;
    }

    addStore({ clientId: selectedClientId, name, location });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-myuze-black text-myuze-white border-myuze-purple">
        <DialogHeader>
          <DialogTitle className="text-myuze-white">Adicionar Nova Loja</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os detalhes para adicionar uma nova loja.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!clientId && ( // Only show client selection if clientId is not provided via prop
            <div className="space-y-2">
              <Label htmlFor="client" className="text-myuze-white">
                Cliente *
              </Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger id="client" className="bg-myuze-black/50 border-myuze-purple text-myuze-white">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                  {clients.length === 0 ? (
                    <SelectItem value="no-clients" disabled>Nenhum cliente disponível</SelectItem>
                  ) : (
                    clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
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