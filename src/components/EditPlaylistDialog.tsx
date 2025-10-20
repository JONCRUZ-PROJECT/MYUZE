"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, Mic, Clock, X } from 'lucide-react';
import { useMyuze } from '@/context/MyuzeContext';
import { Playlist, Song } from '@/lib/data';
import { toast } from 'sonner';

interface EditPlaylistDialogProps {
  children: React.ReactNode;
  playlist: Playlist;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const EditPlaylistDialog = ({ children, playlist }: EditPlaylistDialogProps) => {
  const { songs, updatePlaylist, clients, currentUser } = useMyuze();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(playlist.name);
  const [mood, setMood] = useState(playlist.mood);
  const [description, setDescription] = useState(playlist.description);
  const [idealSchedule, setIdealSchedule] = useState(playlist.scheduleText || 'any');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | undefined>(playlist.coverImageUrl);
  const [selectedMusicIds, setSelectedMusicIds] = useState<string[]>(playlist.songs.filter(s => !s.isAd).map(s => s.id));
  const [selectedVoiceoverIds, setSelectedVoiceoverIds] = useState<string[]>(playlist.songs.filter(s => s.isAd).map(s => s.id));
  const [adIntervalMinutes, setAdIntervalMinutes] = useState<number>(playlist.adIntervalMinutes || 15);
  const [assignedClientId, setAssignedClientId] = useState<string | undefined>(() => {
    const client = clients.find(c => c.clientUserId === playlist.userId);
    return client ? client.id : undefined;
  }); // Novo estado para o cliente atribuído

  const availableMusic = songs.filter(s => !s.isAd);
  const availableVoiceovers = songs.filter(s => s.isAd);

  // Reset form fields when dialog opens or playlist prop changes
  useEffect(() => {
    if (isOpen) {
      setName(playlist.name);
      setMood(playlist.mood);
      setDescription(playlist.description);
      setIdealSchedule(playlist.scheduleText || 'any');
      setCoverFile(null); // Clear file input on open
      setCoverPreviewUrl(playlist.coverImageUrl);
      setSelectedMusicIds(playlist.songs.filter(s => !s.isAd).map(s => s.id));
      setSelectedVoiceoverIds(playlist.songs.filter(s => s.isAd).map(s => s.id));
      setAdIntervalMinutes(playlist.adIntervalMinutes || 15);
      setAssignedClientId(() => {
        const client = clients.find(c => c.clientUserId === playlist.userId);
        return client ? client.id : undefined;
      });
    }
  }, [isOpen, playlist, clients]);

  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setCoverFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
      toast.info(`Capa "${file.name}" selecionada.`);
    } else {
      setCoverFile(null);
      setCoverPreviewUrl(playlist.coverImageUrl); // Revert to original if no new file
    }
  };

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

  const generateInterleavedPlaylistSongs = (
    musicIds: string[],
    voiceoverIds: string[],
    intervalMinutes: number
  ): Song[] => {
    const musicTracks = songs.filter(s => musicIds.includes(s.id));
    const voiceoverTracks = songs.filter(s => voiceoverIds.includes(s.id));

    if (musicTracks.length === 0) return voiceoverTracks;
    if (voiceoverTracks.length === 0) return musicTracks;

    const interleavedSongs: Song[] = [];
    let currentMusicDuration = 0;
    let voiceoverIndex = 0;
    const intervalSeconds = intervalMinutes * 60;

    musicTracks.forEach(music => {
      interleavedSongs.push(music);
      currentMusicDuration += music.duration;

      if (currentMusicDuration >= intervalSeconds) {
        // Insert a voiceover
        interleavedSongs.push(voiceoverTracks[voiceoverIndex]);
        voiceoverIndex = (voiceoverIndex + 1) % voiceoverTracks.length;
        currentMusicDuration = 0; // Reset duration after inserting an ad
      }
    });

    return interleavedSongs;
  };

  const handleSubmit = () => {
    if (!name || !mood || !description || (selectedMusicIds.length === 0 && selectedVoiceoverIds.length === 0)) {
      toast.error('Por favor, preencha todos os campos obrigatórios e selecione pelo menos uma música ou locução.');
      return;
    }

    const finalSongs = generateInterleavedPlaylistSongs(selectedMusicIds, selectedVoiceoverIds, adIntervalMinutes);

    const updatedPlaylistData: Omit<Playlist, 'id' | 'userId' | 'songs'> = {
      name,
      description,
      coverImageUrl: coverPreviewUrl, // Use the generated preview URL or existing one
      mood,
      style: playlist.style,
      bpm: playlist.bpm,
      schedule: playlist.schedule,
      scheduleText: idealSchedule === 'any' ? 'Qualquer horário' : idealSchedule,
      adIntervalMinutes: adIntervalMinutes,
    };

    let targetUserId: string | undefined;
    if (currentUser?.role === 'admin' || currentUser?.role === 'user') {
        if (assignedClientId) {
            targetUserId = clients.find(c => c.id === assignedClientId)?.clientUserId;
        } else {
            targetUserId = undefined; // Explicitly set to undefined if unassigned by admin
        }
    } else if (currentUser?.role === 'client') {
        targetUserId = currentUser.id; // Client always assigns to themselves
    }

    updatePlaylist(playlist.id, updatedPlaylistData, finalSongs.map(s => s.id), targetUserId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-myuze-black text-myuze-white border-myuze-purple">
        <DialogHeader>
          <DialogTitle className="text-myuze-white">Editar Playlist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Modifique os detalhes da playlist existente.
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
              <Label htmlFor="cover-upload" className="text-myuze-white">
                Capa da Playlist (Recomendado: 500x500px)
              </Label>
              <Input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="bg-myuze-black/50 border-myuze-purple text-myuze-white file:text-myuze-white file:bg-myuze-purple hover:file:bg-myuze-purple/80 file:border-none"
              />
              {coverPreviewUrl && (
                <img src={coverPreviewUrl} alt="Prévia da Capa" className="w-32 h-32 object-cover rounded-md mt-2" />
              )}
            </div>
          </div>

          {(currentUser?.role === 'admin' || currentUser?.role === 'user') && (
            <div className="space-y-2">
              <Label htmlFor="assign-client" className="text-myuze-white">
                Atribuir ao Cliente (Opcional)
              </Label>
              <Select value={assignedClientId} onValueChange={setAssignedClientId}>
                <SelectTrigger id="assign-client" className="bg-myuze-black/50 border-myuze-purple text-myuze-white">
                  <SelectValue placeholder="Nenhum cliente" />
                </SelectTrigger>
                <SelectContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                  <SelectItem value="undefined">Nenhum cliente</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlaylistDialog;