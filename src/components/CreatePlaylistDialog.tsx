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
import { Music, Mic, Clock, X } from 'lucide-react'; // Added X icon for cancel button
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
  const [idealSchedule, setIdealSchedule] = useState('any'); // Default to 'Qualquer horário'
  const [coverImageUrl, setCoverImageUrl] = useState(''); // Changed to URL input
  const [selectedMusicIds, setSelectedMusicIds] = useState<string[]>([]);
  const [selectedVoiceoverIds, setSelectedVoiceoverIds] = useState<string[]>([]);
  const [adIntervalMinutes, setAdIntervalMinutes] = useState<number>(15); // Default as per image

  const availableMusic = songs.filter(s => !s.isAd);
  const availableVoiceovers = songs.filter(s => s.isAd);

  const handleMusicSelection = (songId: string, isChecked: boolean) => {
    setSelectedMusicIds(prev =>
      isChecked ? [...prev, songId] : prev.filter(id => id !== songId)
    );
  };

  const handleVoiceoverSelection = (songId: string, isChecked: boolean) => {
    setSelectedVoiceoverIds(prev =>
      isChecked ? [...prev, songId] : prev.filter(id => id !== songId)
    );
  };

  const handleSubmit = () => {
    if (!name || !mood || !description || (selectedMusicIds.length === 0 && selectedVoiceoverIds.length === 0)) {
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione pelo menos uma música ou locução.');
      return;
    }

    const combinedSelectedSongIds = [...selectedMusicIds, ...selectedVoiceoverIds];

    const newPlaylistData: Omit<Playlist, 'id' | 'userId' | 'songs'> = {
      name,
      description,
      coverImageUrl: coverImageUrl || undefined, // Use URL or undefined
      mood,
      style: 'custom', // Default style for now
      bpm: 0, // Default BPM for now
      schedule: { days: [], startTime: '00:00', endTime: '23:59' }, // Default schedule
      scheduleText: idealSchedule === 'any' ? 'Qualquer horário' : idealSchedule, // Set schedule text
      adIntervalMinutes: adIntervalMinutes, // Set ad interval
    };

    addPlaylist(newPlaylistData, combinedSelectedSongIds);
    setIsOpen(false);
    // Reset form fields
    setName('');
    setMood('');
    setDescription('');
    setIdealSchedule('any');
    setCoverImageUrl('');
    setSelectedMusicIds([]);
    setSelectedVoiceoverIds([]);
    setAdIntervalMinutes(15);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-myuze-black text-myuze-white border-myuze-purple">
        <DialogHeader>
          <DialogTitle className="text-myuze-white">Nova Playlist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha os detalhes para criar uma nova playlist.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-myuze-white">
                Nome da Playlist *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Música Ambiente Manhã"
                className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="mood" className="text-myuze-white">
                Clima *
              </Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger id="mood" className="bg-myuze-black/50 border-myuze-purple text-myuze-white">
                  <SelectValue placeholder="Energizante" />
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
          </div>

          <div>
            <Label htmlFor="description" className="text-myuze-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o objetivo desta playlist..."
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ideal-schedule" className="text-myuze-white">
                Horário Ideal
              </Label>
              <Select value={idealSchedule} onValueChange={setIdealSchedule}>
                <SelectTrigger id="ideal-schedule" className="bg-myuze-black/50 border-myuze-purple text-myuze-white">
                  <SelectValue placeholder="Qualquer horário" />
                </SelectTrigger>
                <SelectContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                  <SelectItem value="any">Qualquer horário</SelectItem>
                  {/* Add more schedule options if needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cover-url" className="text-myuze-white">
                URL da Capa
              </Label>
              <Input
                id="cover-url"
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
                className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-myuze-white mb-2 block">Músicas na Playlist ({selectedMusicIds.length} selecionadas)</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border border-myuze-purple/50 p-4 bg-myuze-black/50">
                <div className="space-y-2">
                  {availableMusic.length === 0 ? (
                    <p className="text-gray-400">Nenhuma música disponível na biblioteca.</p>
                  ) : (
                    availableMusic.map(song => (
                      <div key={song.id} className="flex items-center space-x-2 text-myuze-white">
                        <Checkbox
                          id={`music-${song.id}`}
                          checked={selectedMusicIds.includes(song.id)}
                          onCheckedChange={(checked) => handleMusicSelection(song.id, checked as boolean)}
                          className="border-myuze-purple data-[state=checked]:bg-myuze-purple data-[state=checked]:text-myuze-white"
                        />
                        <Label htmlFor={`music-${song.id}`} className="flex items-center cursor-pointer">
                          {song.title} - {song.artist}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            <div>
              <Label className="text-myuze-white mb-2 block">Locuções na Playlist ({selectedVoiceoverIds.length} selecionadas)</Label>
              <ScrollArea className="h-[200px] w-full rounded-md border border-myuze-purple/50 p-4 bg-myuze-black/50">
                <div className="space-y-2">
                  {availableVoiceovers.length === 0 ? (
                    <p className="text-gray-400">Nenhuma locução disponível na biblioteca.</p>
                  ) : (
                    availableVoiceovers.map(vo => (
                      <div key={vo.id} className="flex items-center space-x-2 text-myuze-white">
                        <Checkbox
                          id={`voiceover-${vo.id}`}
                          checked={selectedVoiceoverIds.includes(vo.id)}
                          onCheckedChange={(checked) => handleVoiceoverSelection(vo.id, checked as boolean)}
                          className="border-myuze-purple data-[state=checked]:bg-myuze-purple data-[state=checked]:text-myuze-white"
                        />
                        <Label htmlFor={`voiceover-${vo.id}`} className="flex items-center cursor-pointer">
                          {vo.title}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="ad-interval" className="text-myuze-white">
              Tocar locução a cada (minutos)
            </Label>
            <Input
              id="ad-interval"
              type="number"
              value={adIntervalMinutes}
              onChange={(e) => setAdIntervalMinutes(Number(e.target.value))}
              min="1"
              placeholder="15"
              className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-gray-400 hover:bg-myuze-gray-translucent hover:text-myuze-white">
            <X className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog;