"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { toast } from 'sonner';

interface CreateBoardDialogProps {
  children: React.ReactNode;
}

const CreateBoardDialog = ({ children }: CreateBoardDialogProps) => {
  const { addBoard, playlists, currentUser } = useMyuze();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');

  // Filter playlists relevant to the current client user
  const clientPlaylists = playlists.filter(p => p.userId === currentUser?.id);

  const handleSubmit = () => {
    if (!name || !location || !selectedPlaylistId) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    addBoard({
      name,
      location,
      playlistId: selectedPlaylistId,
    });
    setIsOpen(false);
    // Reset form fields
    setName('');
    setLocation('');
    setSelectedPlaylistId('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-myuze-black text-myuze-white border-myuze-purple">
        <DialogHeader>
          <DialogTitle className="text-myuze-white">Adicionar Novo Quadro</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure um novo quadro para exibir conteúdo em sua loja.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="board-name" className="text-myuze-white">
              Nome do Quadro *
            </Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Tela Principal - Balcão"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="board-location" className="text-myuze-white">
              Localização *
            </Label>
            <Input
              id="board-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Loja 1 - Entrada"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="board-playlist" className="text-myuze-white">
              Selecionar Playlist *
            </Label>
            <Select value={selectedPlaylistId} onValueChange={setSelectedPlaylistId}>
              <SelectTrigger id="board-playlist" className="bg-myuze-black/50 border-myuze-purple text-myuze-white">
                <SelectValue placeholder="Selecione uma playlist" />
              </SelectTrigger>
              <SelectContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                {clientPlaylists.length === 0 ? (
                  <p className="p-2 text-gray-400">Nenhuma playlist disponível.</p>
                ) : (
                  clientPlaylists.map(playlist => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 hover:bg-myuze-gray-translucent hover:text-myuze-white">
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            Adicionar Quadro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardDialog;