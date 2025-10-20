"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import Tabs components
import { Upload, Music, Mic } from 'lucide-react';
import { toast } from 'sonner';

const Library = () => {
  const [songFile, setSongFile] = useState<File | null>(null);
  const [songMood, setSongMood] = useState<string>('');
  const [songArtist, setSongArtist] = useState<string>('MYUZE');
  const [songGenre, setSongGenre] = useState<string>('');

  const [voiceoverFile, setVoiceoverFile] = useState<File | null>(null);
  const [voiceoverName, setVoiceoverName] = useState<string>('');
  const [voiceoverType, setVoiceoverType] = useState<string>('');
  const [voiceoverDuration, setVoiceoverDuration] = useState<string>('');
  const [voiceoverDescription, setVoiceoverDescription] = useState<string>('');

  const handleSongFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSongFile(file);
      toast.success(`Música "${file.name}" selecionada para upload.`);
      // In a real app, you'd parse metadata here
    }
  };

  const handleVoiceoverFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setVoiceoverFile(file);
      setVoiceoverName(file.name.split('.').slice(0, -1).join('.')); // Extract name without extension
      // Simulate duration extraction (e.g., from audio metadata)
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        setVoiceoverDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      };
      toast.success(`Locução "${file.name}" selecionada para upload.`);
    }
  };

  const handleSongUploadSubmit = () => {
    if (songFile) {
      toast.info(`Iniciando upload da música "${songFile.name}"...`);
      // Implement actual upload logic here
      console.log('Uploading song:', {
        file: songFile,
        mood: songMood,
        artist: songArtist,
        genre: songGenre,
      });
      // Reset form after simulated upload
      setSongFile(null);
      setSongMood('');
      setSongArtist('MYUZE');
      setSongGenre('');
    } else {
      toast.error('Por favor, selecione um arquivo de música para fazer upload.');
    }
  };

  const handleVoiceoverUploadSubmit = () => {
    if (voiceoverFile) {
      toast.info(`Iniciando upload da locução "${voiceoverFile.name}"...`);
      // Implement actual upload logic here
      console.log('Uploading voiceover:', {
        file: voiceoverFile,
        name: voiceoverName,
        type: voiceoverType,
        duration: voiceoverDuration,
        description: voiceoverDescription,
      });
      // Reset form after simulated upload
      setVoiceoverFile(null);
      setVoiceoverName('');
      setVoiceoverType('');
      setVoiceoverDuration('');
      setVoiceoverDescription('');
    } else {
      toast.error('Por favor, selecione um arquivo de locução para fazer upload.');
    }
  };

  return (
    <div className="space-y-8 text-myuze-white">
      <h1 className="text-4xl font-bold mb-6">Biblioteca</h1>

      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-myuze-gray-translucent border border-myuze-purple/50">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-myuze-purple data-[state=active]:text-myuze-white text-gray-300 hover:text-myuze-white transition-colors"
          >
            <Music className="mr-2 h-5 w-5" /> Músicas
          </TabsTrigger>
          <TabsTrigger
            value="voiceovers"
            className="data-[state=active]:bg-myuze-purple data-[state=active]:text-myuze-white text-gray-300 hover:text-myuze-white transition-colors"
          >
            <Mic className="mr-2 h-5 w-5" /> Locuções
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="mt-6">
          <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Gerenciar Músicas</CardTitle>
              <CardDescription className="text-gray-300">Faça upload e categorize suas músicas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="song-upload" className="text-myuze-white mb-2 block">Upload de Música</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="song-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleSongFileUpload}
                    className="flex-grow bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple file:text-myuze-white file:bg-myuze-purple hover:file:bg-myuze-purple/80 file:border-none"
                  />
                  <Button onClick={handleSongUploadSubmit} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                </div>
                {songFile && <p className="text-sm text-gray-400 mt-2">Arquivo selecionado: {songFile.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="song-mood" className="text-myuze-white mb-2 block">Mood</Label>
                  <Select value={songMood} onValueChange={setSongMood}>
                    <SelectTrigger id="song-mood" className="bg-myuze-black/50 border-myuze-purple text-myuze-white focus:ring-myuze-purple focus:border-myuze-purple">
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
                <div>
                  <Label htmlFor="song-genre" className="text-myuze-white mb-2 block">Gênero</Label>
                  <Select value={songGenre} onValueChange={setSongGenre}>
                    <SelectTrigger id="song-genre" className="bg-myuze-black/50 border-myuze-purple text-myuze-white focus:ring-myuze-purple focus:border-myuze-purple">
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                      <SelectItem value="lo-fi">Lo-fi</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="electronic">Eletrônica</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="bossa">Bossa Nova</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="song-artist" className="text-myuze-white mb-2 block">Artista</Label>
                <Input
                  id="song-artist"
                  type="text"
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  placeholder="Nome do Artista"
                  className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voiceovers" className="mt-6">
          <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Gerenciar Locuções</CardTitle>
              <CardDescription className="text-gray-300">Faça upload e gerencie suas locuções e anúncios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="voiceover-upload" className="text-myuze-white mb-2 block">Upload de Locução</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="voiceover-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleVoiceoverFileUpload}
                    className="flex-grow bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple file:text-myuze-white file:bg-myuze-purple hover:file:bg-myuze-purple/80 file:border-none"
                  />
                  <Button onClick={handleVoiceoverUploadSubmit} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                </div>
                {voiceoverFile && <p className="text-sm text-gray-400 mt-2">Arquivo selecionado: {voiceoverFile.name}</p>}
              </div>

              <div>
                <Label htmlFor="voiceover-name" className="text-myuze-white mb-2 block">Nome</Label>
                <Input
                  id="voiceover-name"
                  type="text"
                  value={voiceoverName}
                  readOnly
                  placeholder="Nome do arquivo (automático)"
                  className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voiceover-type" className="text-myuze-white mb-2 block">Tipo de Locução</Label>
                  <Select value={voiceoverType} onValueChange={setVoiceoverType}>
                    <SelectTrigger id="voiceover-type" className="bg-myuze-black/50 border-myuze-purple text-myuze-white focus:ring-myuze-purple focus:border-myuze-purple">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-myuze-black border-myuze-purple text-myuze-white">
                      <SelectItem value="propaganda">Propaganda</SelectItem>
                      <SelectItem value="aviso">Aviso</SelectItem>
                      <SelectItem value="promocao">Promoção</SelectItem>
                      <SelectItem value="institucional">Institucional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="voiceover-duration" className="text-myuze-white mb-2 block">Duração</Label>
                  <Input
                    id="voiceover-duration"
                    type="text"
                    value={voiceoverDuration}
                    readOnly
                    placeholder="Duração (automático)"
                    className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="voiceover-description" className="text-myuze-white mb-2 block">Descrição</Label>
                <Textarea
                  id="voiceover-description"
                  value={voiceoverDescription}
                  onChange={(e) => setVoiceoverDescription(e.target.value)}
                  placeholder="Adicione uma breve descrição da locução..."
                  className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;