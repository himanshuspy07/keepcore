"use client";

import { useAppLock } from "@/context/AppLockContext";
import { AppLock } from "@/components/app-lock";
import { Header } from "@/components/header";
import { MediaLibrary } from "@/components/media-library";

export default function Home() {
  const { isLocked } = useAppLock();

  if (isLocked) {
    return <AppLock />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <MediaLibrary />
      </main>
    </div>
  );
}
