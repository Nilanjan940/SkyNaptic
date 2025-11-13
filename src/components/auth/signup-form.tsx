
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
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export function SignupForm() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [role, setRole] = useState<UserRole>("passenger");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'atc' || role === 'pilot' || role === 'drone-operator') {
      setStep(2); // Move to verification step for regulated roles
    } else {
      onVerificationComplete(); // Skip verification for passengers
    }
  };

  const onVerificationComplete = async () => {
    if (!auth || !firestore) {
      toast({
        title: "Signup Failed",
        description: "Firebase service is not ready. Please try again.",
        variant: "destructive",
      });
      return;
    };
    setLoading(true);

    try {
      // 1. Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create the user's profile in Firestore
      const userProfile = {
        id: user.uid,
        email: email,
        name: name,
        role: role,
      };
      const userDocRef = doc(firestore, "userProfiles", user.uid);
      
      // Use the non-blocking write function which has correct error handling
      setDocumentNonBlocking(userDocRef, userProfile, { merge: false });
      
      // 3. Store role and email for immediate UI updates
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);

      // 4. Navigate to the correct dashboard (The AuthRedirect component will handle this, but we can push for faster navigation)
      const targetPath = role === 'drone-operator' ? '/drone' : `/${role}`;
      router.push(targetPath);
      router.refresh();

    } catch (error: any) {
       // This catch block now only handles errors from createUserWithEmailAndPassword (e.g., email already in use)
       // Firestore permission errors will be handled globally.
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create your account. The email might already be in use.",
        variant: "destructive",
      });
      setLoading(false); // Only set loading false on auth error, success will navigate away
    }
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
                        <Input 
                          id="password-signup" 
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
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
                      <Button type="submit" className="w-full mt-4">
                        {role === 'passenger' ? 'Create Account' : 'Create Account & Verify'}
                      </Button>
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
                    <VerifyIdentity onVerificationComplete={onVerificationComplete} loading={loading}/>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
