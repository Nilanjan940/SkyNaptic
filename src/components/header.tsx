"use client"
import Link from "next/link";
import { Logo } from "@/components/icons";
import { UserNav } from "@/components/user-nav";
import { useUser } from "@/firebase";
import { LoginButton } from "./auth/login-button";
import { SignupButton } from "./auth/signup-button";
import { Skeleton } from "./ui/skeleton";

type HeaderProps = {
  isLandingPage?: boolean;
};

export function Header({ isLandingPage = false }: HeaderProps) {
  const { user, isUserLoading } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              SkyNaptic
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isUserLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : user && !isLandingPage ? (
            <UserNav />
          ) : (
            <>
              <LoginButton />
              <SignupButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
