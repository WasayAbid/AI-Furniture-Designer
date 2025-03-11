"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; //Import Button

interface UserMenuProps {
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

// Renamed Component to UserMenuContent
export function UserMenuContent({
  isMobileMenuOpen,
  onCloseMobileMenu,
}: UserMenuProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

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
      if (onCloseMobileMenu) onCloseMobileMenu();
      toast.success("Logged out successfully");
      router.push("/"); // Redirect to homepage after logout
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  if (!userEmail) return null;

  return (
    <div className="relative p-4">
      {" "}
      {/* Added padding to the container */}
      <div className="flex items-center gap-3 mb-4">
        {" "}
        {/* User Info Section - Added mb-4 for spacing */}
        <Avatar className="h-10 w-10 bg-zinc-700 ring-2 ring-pink-500">
          {" "}
          {/* Avatar styling */}
          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-pink-600 text-white text-lg">
            {userEmail[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-zinc-300">{userEmail}</span>{" "}
        {/* Email display */}
      </div>
      <Button // Logout Button
        variant="destructive" // Use destructive variant for logout button
        className="w-full justify-center" // Full width and center text
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" /> {/* LogOut Icon */}
        Log out
      </Button>
    </div>
  );
}
