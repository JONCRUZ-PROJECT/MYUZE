"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { useMyuze } from '@/context/MyuzeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const BoardPlayerAuth = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { playerLogin } = useMyuze();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId) {
      toast.error('ID do quadro não fornecido.');
      return;
    }
    console.log('BoardPlayerAuth: Tentando login com boardId:', boardId, 'username:', username, 'password:', password);
    const success = playerLogin(boardId, username, password);
    if (success) {
      navigate(`/player-board/${boardId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-myuze-black to-myuze-purple p-4">
      <Card className="w-full max-w-md bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
        <CardHeader className="text-center">
          <img src="/logo/logomyuzew.png" alt="Myuze Logo" className="h-16 mx-auto mb-2" />
          <CardDescription className="text-gray-200">
            Acesse o player de áudio do seu quadro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-myuze-white">Usuário do Player</Label>
              <Input
                id="username"
                type="text"
                placeholder="usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-myuze-white">Senha do Player</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
              />
            </div>
            <Button type="submit" className="w-full bg-myuze-purple hover:bg-myuze-purple/80 text-myuze-white py-2 text-lg rounded-md transition-all duration-300 ease-in-out">
              Entrar no Player
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardPlayerAuth;