
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { UserProfile } from "@/lib/types";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

export function UserNav() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user: authUser, isUserLoading } = useUser();

  const userProfileRef = useMemoFirebase(
    () => (firestore && authUser ? doc(firestore, "userProfiles", authUser.uid) : null),
    [firestore, authUser]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const handleLogout = () => {
    auth?.signOut();
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/");
    router.refresh();
  };
  
  if (isUserLoading || isProfileLoading) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }
  
  if (!authUser || !userProfile) {
    return null;
  }

  const avatar = userProfile.avatarUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar} alt="User avatar" />
            <AvatarFallback>{userProfile.name?.[0].toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userProfile.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userProfile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
