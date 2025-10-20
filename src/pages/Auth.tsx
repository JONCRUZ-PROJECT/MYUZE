import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMyuze } from '@/context/MyuzeContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useMyuze();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = login(email, password);
    } else {
      success = register(email, password);
    }
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-myuze-black to-myuze-purple p-4">
      <Card className="w-full max-w-md bg-myuze-gray-translucent text-myuze-white border-none shadow-xl backdrop-blur-sm">
        <CardHeader className="text-center">
          <img src="/logo/logomyuzew.png" alt="Myuze Logo" className="h-16 mx-auto mb-2" />
          <CardDescription className="text-gray-200">
            {isLogin ? 'Faça login para continuar' : 'Crie sua conta Myuze'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-myuze-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-myuze-black/50 border-myuze-purple text-myuze-white placeholder:text-gray-400 focus:ring-myuze-purple focus:border-myuze-purple"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-myuze-white">Senha</Label>
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
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </Button>
          </form>
          <p className="mt-6 text-center text-gray-300">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-myuze-purple hover:text-myuze-purple/80 ml-1 p-0 h-auto"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;