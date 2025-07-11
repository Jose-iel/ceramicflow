
import { Eye, EyeOff, Mountain } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signIn } = useAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao CeramicFlow.',
      });

      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Verifique suas credenciais e tente novamente.';
      toast({
        title: 'Erro no login',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Mountain className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold">CeramicFlow</h1>
          </div>
          <CardTitle className="text-2xl text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                required
                id="email"
                placeholder="seu@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  required
                  id="password"
                  placeholder="Sua senha"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
