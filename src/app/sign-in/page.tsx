// app/sign-in/page.tsx
"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Redirect signed-in users to the admin dashboard (or another route)
  useEffect(() => {
    if (isSignedIn) {
      router.push("/admin");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <SignIn />
      </div>
    </div>
  );
}
