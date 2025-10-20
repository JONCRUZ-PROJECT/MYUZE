"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Music, Mic, Plus, Play, Pause, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useMyuze } from '@/context/MyuzeContext';
import { Song } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const Library = () => {
  const { songs, addMediaItem } = useMyuze();
  const [songFile, setSongFile] = useState<File | null>(null);
  const [songTitle, setSongTitle] = useState<string>('');
  const [songMood, setSongMood] = useState<string>('');
  const [songArtist, setSongArtist] = useState<string>('MYUZE');
  const [songGenre, setSongGenre] = useState<string>('');
  const [showSongUploadForm, setShowSongUploadForm] = useState(false);

  const [voiceoverFile, setVoiceoverFile] = useState<File | null>(null);
  const [voiceoverName, setVoiceoverName] = useState<string>('');
  const [voiceoverType, setVoiceoverType] = useState<'propaganda' | 'aviso' | 'promocao' | 'institucional' | ''>('');
  const [voiceoverDuration, setVoiceoverDuration] = useState<number>(0);
  const [voiceoverDurationDisplay, setVoiceoverDurationDisplay] = useState<string>('');
  const [voiceoverDescription, setVoiceoverDescription] = useState<string>('');
  const [showVoiceoverUploadForm, setShowVoiceoverUploadForm] = useState(false);

  // State for audio playback
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const musicTracks = songs.filter(item => !item.isAd);
  const voiceovers = songs.filter(item => item.isAd);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSongFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSongFile(file);
      setSongTitle(file.name.split('.').slice(0, -1).join('.'));
      toast.success(`Música "${file.name}" selecionada para upload.`);
    }
  };

  const handleVoiceoverFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setVoiceoverFile(file);
      setVoiceoverName(file.name.split('.').slice(0, -1).join('.'));
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        setVoiceoverDuration(audio.duration);
        setVoiceoverDurationDisplay(formatDuration(audio.duration));
      };
      toast.success(`Locução "${file.name}" selecionada para upload.`);
    }
  };

  const handleSongUploadSubmit = () => {
    if (!songFile || !songTitle || !songMood || !songGenre) {
      toast.error('Por favor, preencha todos os campos e selecione um arquivo de música.');
      return;
    }

    const audio = new Audio(URL.createObjectURL(songFile));
    audio.onloadedmetadata = () => {
      const newSong: Omit<Song, 'id' | 'fileUrl'> = {
        title: songTitle,
        artist: songArtist,
        duration: audio.duration,
        isAd: false,
        mood: songMood,
        genre: songGenre,
      };
      addMediaItem(newSong, songFile);
      // Reset form
      setSongFile(null);
      setSongTitle('');
      setSongMood('');
      setSongArtist('MYUZE');
      setSongGenre('');
      setShowSongUploadForm(false);
    };
  };

  const handleVoiceoverUploadSubmit = () => {
    if (!voiceoverFile || !voiceoverName || !voiceoverType || !voiceoverDescription || voiceoverDuration === 0) {
      toast.error('Por favor, preencha todos os campos e selecione um arquivo de locução.');
      return;
    }

    const newVoiceover: Omit<Song, 'id' | 'fileUrl'> = {
      title: voiceoverName,
      artist: 'MYUZE',
      duration: voiceoverDuration,
      isAd: true,
      adType: voiceoverType,
      adDescription: voiceoverDescription,
    };
    addMediaItem(newVoiceover, voiceoverFile);
    // Reset form
    setVoiceoverFile(null);
    setVoiceoverName('');
    setVoiceoverType('');
    setVoiceoverDuration(0);
    setVoiceoverDurationDisplay('');
    setVoiceoverDescription('');
    setShowVoiceoverUploadForm(false);
  };

  const handlePlayPause = (song: Song) => {
    if (audioRef.current && playingSongId === song.id) {
      // If this song is already playing, pause it
      audioRef.current.pause();
      setPlayingSongId(null);
      toast.info(`Pausado: "${song.title}"`);
    } else {
      // If another song is playing, pause it first
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Play the new song
      const audio = new Audio(song.fileUrl);
      audio.play().then(() => {
        audioRef.current = audio;
        setPlayingSongId(song.id);
        toast.info(`Reproduzindo: "${song.title}"`);
      }).catch(e => {
        toast.error(`Erro ao reproduzir "${song.title}": ${e.message}`);
        setPlayingSongId(null);
      });

      // Reset playing state when current song ends
      audio.onended = () => {
        setPlayingSongId(null);
        audioRef.current = null;
        toast.info(`Reprodução de "${song.title}" finalizada.`);
      };
    }
  };

  const handleDelete = (id: string, title: string) => {
    // If the deleted song is currently playing, stop it
    if (playingSongId === id && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingSongId(null);
    }
    toast.info(`Simulando exclusão de "${title}" (ID: ${id})...`);
    // In a real app, you'd update the 'songs' state here to remove the item
    // For now, we'll just show a success toast.
    toast.success(`"${title}" excluído (simulado) com sucesso!`);
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold">Gerenciar Músicas</CardTitle>
                <CardDescription className="text-gray-300">Faça upload e categorize suas músicas.</CardDescription>
              </div>
              <Button onClick={() => setShowSongUploadForm(!showSongUploadForm)} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
                <Plus className="mr-2 h-4 w-4" /> {showSongUploadForm ? 'Cancelar' : 'Adicionar Música'}
              </Button>
            </CardHeader>
            {showSongUploadForm && (
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

                <div>
                  <Label htmlFor="song-title" className="text-myuze-white mb-2 block">Título da Música</Label>
                  <Input
                    id="song-title"
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="Título da Música"
                    className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
                  />
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
            )}
            <CardContent className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Músicas Cadastradas ({musicTracks.length})</h3>
              {musicTracks.length === 0 ? (
                <p className="text-gray-400">Nenhuma música cadastrada ainda.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {musicTracks.map(song => (
                    <div key={song.id} className="flex items-center justify-between bg-myuze-black/50 p-3 rounded-md border border-myuze-purple/30">
                      {/* Left section: Icon + Title/Album */}
                      <div className="flex items-center flex-grow min-w-0">
                        <div className="h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                          <Music className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <p className="font-medium text-myuze-white truncate">{song.title}</p>
                          <p className="text-sm text-gray-400 truncate">Álbum Desconhecido</p>
                        </div>
                      </div>

                      {/* Middle section: Artist, Genre, Duration */}
                      <div className="flex items-center gap-x-6 ml-auto mr-4 flex-shrink-0">
                        <p className="text-sm text-gray-400 hidden md:block">{song.artist}</p>
                        {song.genre && (
                          <Badge variant="outline" className="border-myuze-purple text-myuze-purple bg-myuze-purple/20 hidden sm:flex">
                            {song.genre}
                          </Badge>
                        )}
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDuration(song.duration)}</span>
                        </div>
                      </div>

                      {/* Right section: Actions */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handlePlayPause(song)} className="text-myuze-purple hover:text-myuze-purple/80">
                          {playingSongId === song.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(song.id, song.title)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voiceovers" className="mt-6">
          <Card className="bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold">Gerenciar Locuções</CardTitle>
                <CardDescription className="text-gray-300">Faça upload e gerencie suas locuções e anúncios.</CardDescription>
              </div>
              <Button onClick={() => setShowVoiceoverUploadForm(!showVoiceoverUploadForm)} className="bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white">
                <Plus className="mr-2 h-4 w-4" /> {showVoiceoverUploadForm ? 'Cancelar' : 'Adicionar Locução'}
              </Button>
            </CardHeader>
            {showVoiceoverUploadForm && (
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
                    onChange={(e) => setVoiceoverName(e.target.value)}
                    placeholder="Nome do arquivo (automático)"
                    className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="voiceover-type" className="text-myuze-white mb-2 block">Tipo de Locução</Label>
                    <Select
                      value={voiceoverType}
                      onValueChange={(value) => setVoiceoverType(value as typeof voiceoverType)} // Fixed TypeScript error here
                    >
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
                      value={voiceoverDurationDisplay}
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
            )}
            <CardContent className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Locuções Cadastradas ({voiceovers.length})</h3>
              {voiceovers.length === 0 ? (
                <p className="text-gray-400">Nenhuma locução cadastrada ainda.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {voiceovers.map(vo => (
                    <div key={vo.id} className="flex items-center justify-between bg-myuze-black/50 p-3 rounded-md border border-myuze-purple/30">
                      {/* Left section: Icon + Title/Description */}
                      <div className="flex items-center flex-grow min-w-0">
                        <div className="h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center mr-4 flex-shrink-0">
                          <Mic className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <p className="font-medium text-myuze-white truncate">{vo.title}</p>
                          {vo.adDescription && <p className="text-sm text-gray-400 truncate">{vo.adDescription}</p>}
                        </div>
                      </div>

                      {/* Middle section: Type, Duration */}
                      <div className="flex items-center gap-x-6 ml-auto mr-4 flex-shrink-0">
                        {vo.adType && (
                          <Badge variant="outline" className="border-myuze-purple text-myuze-purple bg-myuze-purple/20 hidden sm:flex">
                            {vo.adType}
                          </Badge>
                        )}
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDuration(vo.duration)}</span>
                        </div>
                      </div>

                      {/* Right section: Actions */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handlePlayPause(vo)} className="text-myuze-purple hover:text-myuze-purple/80">
                          {playingSongId === vo.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(vo.id, vo.title)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;