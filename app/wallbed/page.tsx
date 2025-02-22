// WallbedDesigner.js
"use client";

import { useRouter } from "next/navigation";
import { WallbedDesignerForm } from "@/components/wallbed/WallbedDesignerForm";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react"; // Import useState

export default function WallbedDesigner() {
  const router = useRouter();
  const historyRef = useRef<number>(0);
  const [isMounted, setIsMounted] = useState(false); // Add isMounted state

  useEffect(() => {
    console.log(
      "WallbedDesigner mounted. Initial history.length:",
      history.length
    );
    historyRef.current = history.length;

    // Log the router object itself and pathname right after initialization
    console.log("WallbedDesigner useEffect - Router object:", router);
    console.log(
      "WallbedDesigner useEffect - router.pathname:",
      router.pathname
    );

    setIsMounted(true); // Set isMounted to true after initial render

    return () => {
      console.log("WallbedDesigner unmounted.");
    };
  }, [router]); // Add router to dependency array (important for this test)

  const handleGoBack = () => {
    const currentPath = router.asPath; // Get currentPath right before back
    console.log(
      "Before router.back():",
      currentPath,
      "history.length:",
      historyRef.current
    );
    try {
      router.back();
      console.log("After router.back(): Navigation attempted.");
    } catch (error: any) {
      console.error("Error during router.back():", error);
      console.error("Error Object", error);
      console.trace();
    }
  };

  // Conditionally render button and form only AFTER mount
  if (!isMounted) {
    return <div>Loading Router...</div>; // Or a simple loading message
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="container mx-auto px-4 py-8 relative">
        <Button
          onClick={handleGoBack}
          className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white mb-4"
        >
          Go Back
        </Button>
        <div className="pt-12">
          <WallbedDesignerForm key={router.asPath} />
        </div>
      </div>
    </div>
  );
}
