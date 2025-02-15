// components/layout/UserMenuDesktop.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenuDesktop() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null); // Use null coalescing operator to handle undefined user.email
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  if (!userEmail) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 focus:outline-none touch-button hover:opacity-80 transition-opacity">
          {" "}
          {/* Reduced gap, added opacity hover */}
          <Avatar className="h-7 w-7 bg-zinc-800 ring-1 ring-transparent hover:ring-pink-500 transition-colors">
            {" "}
            {/* Smaller Avatar, thinner ring, ring hover */}
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-pink-600 text-white text-sm">
              {" "}
              {/* Smaller AvatarFallback text */}
              {userEmail[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-zinc-400 hover:text-white transition-colors">
            {" "}
            {/* Smaller Email text, muted color */}
            {userEmail}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 mt-1 bg-zinc-800/95 backdrop-blur-sm border border-pink-500/10 shadow-md rounded-md"
      >
        {" "}
        {/* Narrower dropdown, less prominent border and shadow */}
        <DropdownMenuItem
          className="flex items-center justify-center gap-2 px-2 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md cursor-pointer transition-colors touch-button" // Smaller text and padding in dropdown item
          onSelect={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-1" /> {/* Smaller icon in dropdown */}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
