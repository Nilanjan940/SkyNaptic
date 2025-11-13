
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';

export function AuthRedirect() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'userProfiles', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return; // Wait until we have user and profile info
    }

    if (user && userProfile) {
      // User is logged in and we have their profile
      const role = userProfile.role;
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', userProfile.email);
      
      const targetPath = role === 'drone-operator' ? '/drone' : `/${role}`;
      
      // Redirect if not already on their dashboard or a sub-page
      if (pathname !== targetPath && !pathname.startsWith('/profile') && !pathname.startsWith('/settings')) {
        router.push(targetPath);
      }
    } else if (!user && pathname !== '/') {
      // User is not logged in, and they are not on the landing page
      // Allow access to public pages like landing page
      const publicPages = ['/', '/login', '/signup'];
      const isPublic = publicPages.some(p => pathname === p);
      
      if (!isPublic) {
        // router.push('/');
      }
    }
  }, [user, userProfile, isUserLoading, isProfileLoading, router, pathname]);

  return null; // This component does not render anything
}
