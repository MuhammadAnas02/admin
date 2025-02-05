"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
    } else if (!user?.publicMetadata?.isAdmin) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, user, router]);

  return <div>Loading...</div>;
}