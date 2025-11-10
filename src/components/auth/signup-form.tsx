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
import { VerifyIdentity } from "./verify-identity";
import { AnimatePresence, motion } from "framer-motion";

export function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("passenger");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Move to verification step
  };

  const onVerificationComplete = () => {
    // Simulate signup and role assignment
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
    <div className="overflow-hidden relative h-[480px]">
        <AnimatePresence>
            {step === 1 && (
                <motion.div
                    key="step1"
                    initial={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ ease: 'easeInOut' }}
                    className="h-full w-full absolute"
                >
                    <form onSubmit={handleSignup} className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="John Doe" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email-signup">Email</Label>
                        <Input 
                          id="email-signup" 
                          type="email" 
                          placeholder="your.email@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password-signup">Password</Label>
                        <Input id="password-signup" type="password" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role-signup">I am a...</Label>
                        <Select onValueChange={(value: UserRole) => setRole(value)} defaultValue={role}>
                          <SelectTrigger id="role-signup">
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
                      <Button type="submit" className="w-full mt-4">Create Account & Verify</Button>
                    </form>
                </motion.div>
            )}
            {step === 2 && (
                <motion.div
                    key="step2"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    transition={{ ease: 'easeInOut' }}
                    className="h-full w-full absolute"
                >
                    <VerifyIdentity onVerificationComplete={onVerificationComplete} />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
