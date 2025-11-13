
'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Laptop, BatteryWarning, Bell, Map, Scaling, Play, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { UserProfile } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { textToSpeech } from '@/ai/flows/tts-flow';

const voices = [
  { id: 'atlas', name: 'Atlas (Male)', model: 'Algenib' },
  { id: 'nova', name: 'Nova (Female)', model: 'Achernar' },
  { id: 'echo', name: 'Echo (Neutral)', model: 'Sirius' },
];


export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const userProfileRef = useMemoFirebase(
    () => (firestore && authUser ? doc(firestore, 'userProfiles', authUser.uid) : null),
    [firestore, authUser]
  );
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const [lowBatteryThreshold, setLowBatteryThreshold] = useState(20);
  
  const getRoleDisplayName = (role: string) => {
    if (!role) return '';
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  const handlePlayVoice = async (voice: { id: string, name: string, model: string }) => {
    setPlayingVoice(voice.id);
    try {
      const response = await textToSpeech({ text: `Hello, I am the ${voice.name} assistant.`, voice: voice.model });
      if (response && response.media) {
        const audio = new Audio(response.media);
        audio.play();
        audio.onended = () => setPlayingVoice(null);
      }
    } catch (error) {
      console.error("Failed to generate speech", error);
      setPlayingVoice(null);
    }
  }


  const renderRoleSpecificSettings = () => {
    if (!userProfile) return null;

    switch (userProfile.role) {
      case 'atc':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2"><Map className="h-5 w-5 text-primary" /> Default Map Style</h4>
            <RadioGroup defaultValue="standard" className="space-y-2">
                 <Label htmlFor="map-standard" className="flex items-center justify-between p-3 rounded-lg border cursor-pointer has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                    <span>Standard View</span>
                    <RadioGroupItem value="standard" id="map-standard" />
                </Label>
                 <Label htmlFor="map-satellite" className="flex items-center justify-between p-3 rounded-lg border cursor-pointer has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                    <span>Satellite View</span>
                    <RadioGroupItem value="satellite" id="map-satellite" />
                </Label>
            </RadioGroup>
          </div>
        );
      case 'pilot':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2"><Scaling className="h-5 w-5 text-primary" /> Default Units</h4>
             <RadioGroup defaultValue="imperial" className="space-y-2">
                 <Label htmlFor="units-imperial" className="flex items-center justify-between p-3 rounded-lg border cursor-pointer has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                    <span>Imperial (feet, knots)</span>
                    <RadioGroupItem value="imperial" id="units-imperial" />
                </Label>
                 <Label htmlFor="units-metric" className="flex items-center justify-between p-3 rounded-lg border cursor-pointer has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                    <span>Metric (meters, km/h)</span>
                    <RadioGroupItem value="metric" id="units-metric" />
                </Label>
            </RadioGroup>
          </div>
        );
      case 'drone-operator':
        return (
           <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2"><BatteryWarning className="h-5 w-5 text-primary" /> Low Battery Threshold</h4>
                <div className="flex items-center gap-4 pt-2">
                    <Slider
                        defaultValue={[lowBatteryThreshold]}
                        max={50}
                        step={5}
                        onValueChange={(value) => setLowBatteryThreshold(value[0])}
                    />
                    <span className="font-bold text-lg w-12 text-right">{lowBatteryThreshold}%</span>
                </div>
            </div>
        );
      case 'passenger':
        return (
           <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notification Preferences</h4>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                        <Checkbox id="notif-gate" defaultChecked />
                        <Label htmlFor="notif-gate">Gate Changes</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                        <Checkbox id="notif-boarding" defaultChecked />
                        <Label htmlFor="notif-boarding">Boarding Reminders</Label>
                    </div>
                     <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                        <Checkbox id="notif-delay" />
                        <Label htmlFor="notif-delay">Flight Delays & Cancellations</Label>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  }


  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold font-headline">Settings</h1>
          
          {/* Appearance Settings */}
          {isClient && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application to your preference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={theme} onValueChange={setTheme} className="space-y-2">
                <Label
                  htmlFor="light"
                  className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-accent hover:text-accent-foreground has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <Sun className="h-5 w-5" />
                    <span className="font-semibold">Light</span>
                  </div>
                  <RadioGroupItem value="light" id="light" />
                </Label>

                <Label
                  htmlFor="dark"
                  className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-accent hover:text-accent-foreground has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5" />
                    <span className="font-semibold">Dark</span>
                  </div>
                  <RadioGroupItem value="dark" id="dark" />
                </Label>

                <Label
                  htmlFor="system"
                  className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-accent hover:text-accent-foreground has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5" />
                    <span className="font-semibold">System</span>
                  </div>
                  <RadioGroupItem value="system" id="system" />
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
          )}

          {/* Voice Assistant Settings */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Voice Assistant</CardTitle>
              <CardDescription>
                Interact with the system using voice commands.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="voice-enable" className="flex flex-col gap-1">
                        <span className="font-semibold">Enable Voice Assistant</span>
                        <span className="font-normal text-sm text-muted-foreground">Hear alerts and issue commands via microphone.</span>
                    </Label>
                    <Switch id="voice-enable" />
                </div>
                 <div className="space-y-2">
                    <Label>Assistant Voice</Label>
                     <div className="space-y-2">
                        {voices.map(voice => (
                            <div key={voice.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <span>{voice.name}</span>
                                <Button size="icon" variant="ghost" onClick={() => handlePlayVoice(voice)} disabled={playingVoice !== null}>
                                    {playingVoice === voice.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                                </Button>
                            </div>
                        ))}
                    </div>
                 </div>
            </CardContent>
          </Card>
          
          {/* Role-Specific Settings */}
          {userProfile && (
             <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>{getRoleDisplayName(userProfile.role)} Settings</CardTitle>
                  <CardDescription>
                    Customize settings specific to your role.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    {renderRoleSpecificSettings()}
                </CardContent>
             </Card>
          )}

        </div>
      </main>
    </div>
  );
}
