
'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser, setDocumentNonBlocking } from '@/firebase';
import { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/ai/flows/image-flow';

export default function ProfilePage() {
  const { user: authUser, isUserLoading } = useUser();
  const firestore = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(
    () => (firestore && authUser ? doc(firestore, 'userProfiles', authUser.uid) : null),
    [firestore, authUser]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const isLoading = isUserLoading || isProfileLoading;
  
  const roleKey = userProfile?.role as keyof typeof PlaceHolderImages;
  const roleAvatarData = PlaceHolderImages.find(p => p.id.includes(roleKey));
  const avatar = userProfile?.avatarUrl || roleAvatarData?.imageUrl || PlaceHolderImages[0].imageUrl;

  const getRoleDisplayName = (role: string) => {
    if (!role) return 'N/A';
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfileRef) return;

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const imageDataUri = reader.result as string;
        const response = await uploadImage({ photoDataUri: imageDataUri });

        if (response.imageUrl) {
          await setDocumentNonBlocking(userProfileRef, { avatarUrl: response.imageUrl }, { merge: true });
          toast({ title: 'Avatar Updated', description: 'Your new profile picture has been saved.' });
        } else {
          throw new Error('Image upload failed to return a URL.');
        }
      };
      reader.onerror = (error) => {
        throw error;
      };
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Could not update your profile picture. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-md">
            <CardHeader className="text-center">
              {isLoading ? (
                <Skeleton className="h-24 w-24 rounded-full mx-auto" />
              ) : (
                <div className="relative w-24 h-24 mx-auto">
                   <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={avatar} alt="User avatar" />
                    <AvatarFallback>{userProfile?.name?.[0].toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={handleAvatarClick}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-48 mx-auto mt-4" />
                    <Skeleton className="h-5 w-64 mx-auto mt-2" />
                  </>
                ) : (
                  <>
                    <CardTitle className="text-3xl font-headline">{userProfile?.name}</CardTitle>
                    <CardDescription className="text-lg">{userProfile?.email}</CardDescription>
                  </>
                )}
              </div>
              <div className="mt-8 border-t pt-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Role</span>
                     {isLoading ? <Skeleton className="h-6 w-32" /> : <Badge variant="secondary" className="text-base">{getRoleDisplayName(userProfile?.role || 'N/A')}</Badge>}
                  </div>
                   <div className="flex justify-between items-center">
                    <span className="font-medium">User ID</span>
                     {isLoading ? <Skeleton className="h-4 w-48" /> : <span className="text-sm text-muted-foreground font-mono">{userProfile?.id}</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
