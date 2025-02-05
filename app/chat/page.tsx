// app/chat/page.tsx
"use client";

import ChatComponent from "@/components/chat/ChatComponent";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Import Supabase client
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Chat() {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const checkAuthentication = async () => {
      const supabase = createClientComponentClient();
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        // Not logged in, redirect to login page
        router.push("/chatlogin");
      } else {
        setHasMounted(true);
      }
    };

    checkAuthentication();
  }, [router]);

  const handleGoBack = () => {
    router.push("/"); // Redirect to homepage
  };

  if (!hasMounted) {
    return <div>Loading...</div>; // Or a loading indicator
  }

  return (
    <div className="relative">
      <Button
        onClick={handleGoBack}
        variant="ghost"
        className="absolute top-4 left-4 z-10 p-2 text-zinc-300 hover:text-white hover:bg-zinc-900/30 rounded-full border border-pink-500/20"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <ChatComponent />
    </div>
  );
}
