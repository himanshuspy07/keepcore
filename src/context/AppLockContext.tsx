"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

const APP_PIN = "23111003"; // Hardcoded PIN for demonstration

interface AppLockContextType {
  isLocked: boolean;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;
}

const AppLockContext = createContext<AppLockContextType | undefined>(undefined);

export function AppLockProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);

  const unlockApp = (pin: string) => {
    if (pin === APP_PIN) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    setIsLocked(true);
  };

  return (
    <AppLockContext.Provider value={{ isLocked, unlockApp, lockApp }}>
      {children}
    </AppLockContext.Provider>
  );
}

export function useAppLock() {
  const context = useContext(AppLockContext);
  if (context === undefined) {
    throw new Error('useAppLock must be used within an AppLockProvider');
  }
  return context;
}
