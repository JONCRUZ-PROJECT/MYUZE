"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Music, Mic, Clock } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { Playlist, Song } from '@/lib/data';
import { toast } from 'sonner';

interface CreatePlaylistDialogProps {
  children: React.ReactNode;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const CreatePlaylistDialog = ({ children }: CreatePlaylistDialogProps) => {
  const { songs, addPlaylist } = useMyuze();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [mood, setMood] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  const availableMusic = songs.filter(s => !s.isAd);
  const availableVoiceovers = songs.filter(s => s.isAd);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      toast.info(`Capa "${e.target.files[0].name}" selecionada.`);
    }
  };

  const handleSongSelection = (songId: string, isChecked: boolean) => {
    setSelectedSongIds(prev =>
      isChecked ? [...prev, songId] : prev.filter(id => id !== songId)
    );
  };

  const handleSubmit = () => {
    if (!name || !mood || !description || selectedSongIds.length === 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione pelo menos uma música/locução.');
      return;
    }

    // In a real application, you would upload the coverFile to a storage service
    // and get a URL back. For this example, we'll just use a placeholder URL
    // or leave it undefined if no file was selected.
    const coverImageUrl = coverFile ? URL.createObjectURL(coverFile) : undefined;

    const newPlaylistData: Omit<Playlist, 'id' | 'userId' | 'songs'> = {
      name,
      description,
      coverImageUrl,
      mood,
      style: 'custom', // Default style for now, could be derived from songs or user input
      bpm: 0, // Default BPM for now
      schedule: { days: [], startTime: '00:00', endTime: '23:59' }, // Default schedule
    };

    addPlaylist(newPlaylistData, selectedSongIds);
    setIsOpen(false);
    // Reset form fields
    setName('');
    setMood('');
    setDescription('');
    setCoverFile(null);
    setSelectedSongIds([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-myuze-black text-myuze-white border-myuze-purple">
        <DialogHeader>
          <DialogTitle className="text-myuze-white">Criar Nova Playlist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os detalhes para criar uma nova playlist.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-myuze-white">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mood" className="text-right text-myuze-white">
              Mood
            </Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger id="mood" className="col-span-3 bg-myuze-black/50 border-myuze-purple text-myuze-white">
                <SelectValue placeholder="Selecione o mood" />
              </SelectTrigger>
              <SelectContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                <SelectItem value="calm">Calmo</SelectItem>
                <SelectItem value="energetic">Energético</SelectItem>
                <SelectItem value="focused">Focado</SelectItem>
                <SelectItem value="relaxed">Relaxado</SelectItem>
                <SelectItem value="happy">Feliz</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-myuze-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uma breve descrição da playlist..."
              className="col-span-3 bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cover" className="text-right text-myuze-white">
              Capa (500x500px)
            </Label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-3 bg-myuze-black/50 border-myuze-purple text-myuze-white file:text-myuze-white file:bg-myuze-purple hover:file:bg-myuze-purple/80 file:border-none"
            />
          </div>

          <div className="col-span-4">
            <Label className="text-myuze-white mb-2 block">Adicionar Músicas e Locuções</Label>
            <ScrollArea className="h-[200px] w-full rounded-md border border-myuze-purple/50 p-4 bg-myuze-black/50">
              <div className="space-y-2">
                {availableMusic.length === 0 && availableVoiceovers.length === 0 ? (
                  <p className="text-gray-400">Nenhum item de mídia disponível na biblioteca.</p>
                ) : (
                  <>
                    {availableMusic.map(song => (
                      <div key={song.id} className="flex items-center space-x-2 text-myuze-white">
                        <Checkbox
                          id={`song-${song.id}`}
                          checked={selectedSongIds.includes(song.id)}
                          onCheckedChange={(checked) => handleSongSelection(song.id, checked as boolean)}
                          className="border-myuze-purple data-[state=checked]:bg-myuze-purple data-[state=checked]:text-myuze-white"
                        />
                        <Label htmlFor={`song-${song.id}`} className="flex items-center cursor-pointer">
                          <Music className="h-4 w-4 mr-2 text-gray-400" />
                          {song.title} - {song.artist} <span className="text-gray-500 text-xs ml-1">({formatDuration(song.duration)})</span>
                        </Label>
                      </div>
                    ))}
                    {availableVoiceovers.map(vo => (
                      <div key={vo.id} className="flex items-center space-x-2 text-myuze-white">
                        <Checkbox
                          id={`vo-${vo.id}`}
                          checked={selectedSongIds.includes(vo.id)}
                          onCheckedChange={(checked) => handleSongSelection(vo.id, checked as boolean)}
                          className="border-myuze-purple data-[state=checked]:bg-myuze-purple data-[state=checked]:text-myuze-white"
                        />
                        <Label htmlFor={`vo-${vo.id}`} className="flex items-center cursor-pointer">
                          <Mic className="h-4 w-4 mr-2 text-gray-400" />
                          {vo.title} <span className="text-gray-500 text-xs ml-1">({vo.adType}) ({formatDuration(vo.duration)})</span>
                        </Label>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            Criar Playlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog;