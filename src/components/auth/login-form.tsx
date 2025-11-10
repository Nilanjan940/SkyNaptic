"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/lib/types";

export function LoginForm() {
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
    // This is a bit of a hack to force a re-render of the header
    router.refresh();
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
      <Button type="submit" className="w-full mt-4">Sign In</Button>
    </form>
  );
}
