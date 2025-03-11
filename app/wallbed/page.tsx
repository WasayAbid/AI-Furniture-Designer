// WallbedDesigner.js
"use client";

import { useRouter } from "next/navigation";
import { WallbedDesignerForm } from "@/components/wallbed/WallbedDesignerForm";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function WallbedDesigner() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    console.log("WallbedDesigner mounted. Path:", window.location.pathname);
    console.log("Router object:", router);

    return () => {
      console.log("WallbedDesigner unmounted.");
    };
  }, [router]);


  const handleGoBack = () => {
    console.log("Before router.back():", window.location.pathname);
    router.back();
    console.log("After router.back(): Navigation attempted.");
    // REMOVE window.location.reload();  <----  Simply remove this line
  };


  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-8 relative">
        
        <div className="pt-12">
          <WallbedDesignerForm key={window.location.pathname} />
        </div>
      </div>
    </div>
  );
}