"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Copy, Eye, EyeOff } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { toast } from 'sonner';
import { generateRandomPassword, slugify } from '@/lib/utils';

interface CreateBoardDialogProps {
  children: React.ReactNode;
}

const CreateBoardDialog = ({ children }: CreateBoardDialogProps) => {
  const { addBoard, playlists, currentUser } = useMyuze();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [playerUsername, setPlayerUsername] = useState('');
  const [playerPassword, setPlayerPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Filter playlists relevant to the current client user
  const clientPlaylists = playlists.filter(p => p.userId === currentUser?.id);

  // Effect to generate credentials when dialog opens or name changes
  React.useEffect(() => {
    if (isOpen) {
      const generatedUsername = slugify(name || 'quadro') + Math.floor(Math.random() * 1000);
      setPlayerUsername(generatedUsername);
      setPlayerPassword(generateRandomPassword(10));
    }
  }, [isOpen, name]);

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(playerUsername)
      .then(() => toast.success('Usuário do player copiado!'))
      .catch(() => toast.error('Falha ao copiar usuário.'));
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(playerPassword)
      .then(() => toast.success('Senha do player copiada!'))
      .catch(() => toast.error('Falha ao copiar senha.'));
  };

  const handleSubmit = () => {
    if (!name || !location || !selectedPlaylistId || !playerUsername || !playerPassword) {
      toast.error('Por favor, preencha todos os campos, incluindo as credenciais do player.');
      return;
    }

    const success = addBoard({
      name,
      location,
      playlistId: selectedPlaylistId,
    }, playerUsername, playerPassword);

    if (success) {
      setIsOpen(false);
      // Reset form fields
      setName('');
      setLocation('');
      setSelectedPlaylistId('');
      setPlayerUsername('');
      setPlayerPassword('');
      setShowPassword(false);
    }
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

          <div className="space-y-2 border-t border-myuze-purple/50 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-myuze-white">Credenciais de Acesso ao Player</h3>
            <p className="text-sm text-gray-400">Use estas credenciais para acessar o player de áudio deste quadro.</p>
            <div className="space-y-2">
              <Label htmlFor="player-username" className="text-myuze-white">
                Usuário do Player *
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="player-username"
                  type="text"
                  value={playerUsername}
                  onChange={(e) => setPlayerUsername(e.target.value)}
                  placeholder="Usuário gerado automaticamente"
                  className="flex-grow bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
                />
                <Button variant="ghost" size="icon" onClick={handleCopyUsername} className="text-myuze-purple hover:text-myuze-purple/80">
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="player-password" className="text-myuze-white">
                Senha do Player *
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="player-password"
                  type={showPassword ? "text" : "password"}
                  value={playerPassword}
                  onChange={(e) => setPlayerPassword(e.target.value)}
                  placeholder="Senha gerada automaticamente"
                  className="flex-grow bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
                />
                <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="text-myuze-purple hover:text-myuze-purple/80">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopyPassword} className="text-myuze-purple hover:text-myuze-purple/80">
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
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