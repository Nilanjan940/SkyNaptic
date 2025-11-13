
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';

export function LoginForm() {
  const auth = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // Default for demo
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      // In a real app, you would not `await` this and would rely on `onAuthStateChanged`
      // For this demo, we await to provide immediate feedback on login failure.
      await signInWithEmailAndPassword(auth, email, password);
      // The AuthRedirect component will handle redirection.
    } catch (error: any) {
      console.error('Login failed:', error);
      let description = 'Could not sign in. Please check your credentials and try again.';
      if (error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password. Please try again.';
      }
      toast({
        title: 'Login Failed',
        description: description,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>
      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
}
