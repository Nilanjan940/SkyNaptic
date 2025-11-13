
'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold font-headline mb-8">Settings</h1>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application to your preference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={theme} onValueChange={setTheme}>
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
        </div>
      </main>
    </div>
  );
}
