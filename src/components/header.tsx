"use client";

import { UploadButton } from './upload-button';
import { Logo } from './icons/logo';
import { Button } from './ui/button';
import { LockKeyhole } from 'lucide-react';
import { useAppLock } from '@/context/AppLockContext';

export function Header() {
  const { lockApp } = useAppLock();

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <h1 className="text-xl font-bold text-foreground">KeepCore</h1>
        </div>
        <div className="flex items-center gap-2">
          <UploadButton />
          <Button variant="outline" size="icon" onClick={lockApp}>
            <LockKeyhole className="h-4 w-4" />
            <span className="sr-only">Lock App</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
