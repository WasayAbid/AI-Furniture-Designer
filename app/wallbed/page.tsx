// app/wallbed/page.tsx
"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { WallbedDesignerForm } from "@/components/wallbed/WallbedDesignerForm";

export default function WallbedDesigner() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const supabase = createClientComponentClient();
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        // Not logged in, redirect to login page
        router.push("/wallbedlogin");
      } else {
        setHasMounted(true);
      }
    };

    checkAuthentication();
  }, [router]);

  const handleGoBack = () => {
    router.push("/");
  };

  if (!hasMounted) {
    return <div>Loading...</div>; // Or a loading indicator
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 relative">
      <div className="container mx-auto px-4 py-8">
        <WallbedDesignerForm />
      </div>
    </div>
  );
}
