"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/icons";
import type { UserRole } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("atc");
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and role assignment
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email || `${role}@skynaptic.com`);
    
    switch (role) {
      case "atc":
        router.push("/atc");
        break;
      case "pilot":
        router.push("/pilot");
        break;
      case "passenger":
        router.push("/passenger");
        break;
      case "drone-operator":
        router.push("/drone");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <Card className="w-full max-w-sm shadow-2xl">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Logo className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">SkyNaptic</CardTitle>
            <CardDescription>
              Sign in to the Air Traffic Management System
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
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
              <Input id="password" type="password" defaultValue="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value: UserRole) => setRole(value)} defaultValue={role}>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Sign In</Button>
          </CardFooter>
        </form>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Built for demonstration purposes. Choose a role and sign in.
      </p>
    </main>
  );
}
