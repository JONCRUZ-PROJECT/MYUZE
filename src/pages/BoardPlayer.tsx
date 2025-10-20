"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMyuze } from '@/context/MyuzeContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Song } from '@/lib/data';

const BoardPlayer = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { getBoardById, getPlaylistById, currentBoardPlayer, playerLogout, addPlaybackLog } = useMyuze();

  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeBeforeMute = useRef(0.5);

  useEffect(() => {
    if (!boardId) {
      toast.error('ID do quadro não fornecido.');
      navigate('/client-boards'); // Redireciona para a lista de quadros
      return;
    }

    if (!currentBoardPlayer || currentBoardPlayer.id !== boardId) {
      // Se não estiver logado como este player, redireciona para o login do player
      navigate(`/player-auth/${boardId}`);
      return;
    }

    const board = getBoardById(boardId);
    if (!board) {
      toast.error('Quadro não encontrado.');
      navigate('/client-boards');
      return;
    }

    const playlist = getPlaylistById(board.playlistId);
    if (!playlist) {
      toast.error('Playlist não encontrada para este quadro.');
      navigate('/client-boards');
      return;
    }

    setCurrentPlaylist(playlist);
    setIsLoading(false);
  }, [boardId, currentBoardPlayer, getBoardById, getPlaylistById, navigate]);

  const currentSong = currentPlaylist?.songs[currentSongIndex];

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        toast.info(`Pausado: ${currentSong?.title}`);
      } else {
        audioRef.current.play().catch(e => {
          toast.error(`Erro ao reproduzir: ${e.message}`);
          setIsPlaying(false);
        });
        toast.info(`Reproduzindo: ${currentSong?.title}`);
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, currentSong]);

  const playNextSong = useCallback(() => {
    if (currentPlaylist && currentPlaylist.songs.length > 0) {
      const nextIndex = (currentSongIndex + 1) % currentPlaylist.songs.length;
      setCurrentSongIndex(nextIndex);
      setCurrentTime(0); // Reset current time for the new song
      setIsPlaying(false); // Pause briefly to allow new song to load
      if (audioRef.current) {
        audioRef.current.load(); // Load the new song
      }
    }
  }, [currentPlaylist, currentSongIndex]);

  const playPreviousSong = useCallback(() => {
    if (currentPlaylist && currentPlaylist.songs.length > 0) {
      const prevIndex = (currentSongIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length;
      setCurrentSongIndex(prevIndex);
      setCurrentTime(0); // Reset current time for the new song
      setIsPlaying(false); // Pause briefly to allow new song to load
      if (audioRef.current) {
        audioRef.current.load(); // Load the new song
      }
    }
  }, [currentPlaylist, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.fileUrl;
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
          toast.error(`Falha na reprodução automática: ${currentSong.title}. Por favor, inicie manualmente.`);
        });
      }

      // Log playback
      addPlaybackLog({
        playlistId: currentPlaylist.id,
        songId: currentSong.id,
        timestamp: new Date().toISOString(),
        type: currentSong.isAd ? 'ad' : 'song',
      });
    }
  }, [currentSong, volume, isMuted, addPlaybackLog, currentPlaylist]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    playNextSong();
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0) setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        setVolume(volumeBeforeMute.current);
        audioRef.current.volume = volumeBeforeMute.current;
      } else {
        volumeBeforeMute.current = volume;
        audioRef.current.muted = true;
        setVolume(0);
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (isLoading || !currentPlaylist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-myuze-black to-myuze-purple text-myuze-white">
        <Loader2 className="h-12 w-12 animate-spin text-myuze-purple" />
        <p className="ml-4 text-xl">Carregando player...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-myuze-black to-myuze-purple text-myuze-white p-4">
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="auto"
      />

      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={playerLogout} className="text-red-400 hover:text-red-300">
          <LogOut className="mr-2 h-5 w-5" /> Sair do Player
        </Button>
      </div>

      <div className="w-full max-w-2xl bg-myuze-gray-translucent rounded-lg shadow-xl backdrop-blur-sm p-8 text-center">
        <img
          src={currentPlaylist.coverImageUrl || '/public/placeholder.svg'}
          alt={currentPlaylist.name}
          className="w-48 h-48 object-cover rounded-md mx-auto mb-6 shadow-lg"
        />
        <h2 className="text-3xl font-bold mb-2">{currentPlaylist.name}</h2>
        <p className="text-lg text-gray-300 mb-6">{currentPlaylist.description}</p>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-myuze-purple mb-2">Tocando agora:</h3>
          <p className="text-2xl font-medium">{currentSong?.title || 'Nenhuma música'}</p>
          <p className="text-lg text-gray-400">{currentSong?.artist || ''}</p>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
          <Progress value={(currentTime / duration) * 100} className="flex-grow h-2 bg-myuze-black/50" indicatorClassName="bg-myuze-purple" />
          <span className="text-sm text-gray-400">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center space-x-6 mb-6">
          <Button variant="ghost" size="icon" onClick={playPreviousSong} className="text-myuze-white hover:text-myuze-purple">
            <SkipBack className="h-8 w-8" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-myuze-purple hover:text-myuze-white">
            {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={playNextSong} className="text-myuze-white hover:text-myuze-purple">
            <SkipForward className="h-8 w-8" />
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="text-myuze-white hover:text-myuze-purple">
            {isMuted || volume === 0 ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
          </Button>
          <Slider
            defaultValue={[volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-32 [&>span:first-child]:h-2 [&>span:first-child]:bg-myuze-black/50 [&>span:first-child>span]:bg-myuze-purple"
            thumbClassName="bg-myuze-purple border-myuze-purple"
          />
        </div>
      </div>
    </div>
  );
};

export default BoardPlayer;