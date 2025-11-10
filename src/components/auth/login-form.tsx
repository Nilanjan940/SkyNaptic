'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UserRole } from '@/lib/types';
import { useAuth, useFirestore } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [role, setRole] = useState<UserRole>('atc');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setLoading(true);

    try {
      // 1. Sign in the user anonymously to get a UID
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // 2. Create or update the user's profile in Firestore
      const userProfile = {
        id: user.uid,
        email: email || `${role}@skynaptic.com`,
        name: email.split('@')[0] || role,
        role: role,
      };
      await setDoc(doc(firestore, 'userProfiles', user.uid), userProfile);
      
      // 3. Store role and email for immediate UI updates (optional, can be derived from Firestore)
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', userProfile.email);

      // 4. Navigate to the correct dashboard
      switch (role) {
        case 'atc':
          router.push('/atc');
          break;
        case 'pilot':
          router.push('/pilot');
          break;
        case 'passenger':
          router.push('/passenger');
          break;
        case 'drone-operator':
          router.push('/drone');
          break;
        default:
          router.push('/');
      }
      router.refresh();
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login Failed',
        description: 'Could not sign in. Please try again.',
        variant: 'destructive',
      });
    } finally {
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
        <Label htmlFor="password">Password (simulation)</Label>
        <Input id="password" type="password" defaultValue="password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select
          onValueChange={(value: UserRole) => setRole(value)}
          defaultValue={role}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="atc">Air Traffic Controller</SelectItem>
            <SelectItem value="pilot">Pilot</SelectItem>
            <SelectItem value="passenger">Passenger</SelectItem>
            <SelectItem value="drone-operator">Drone Operator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
}
