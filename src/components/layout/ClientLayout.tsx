'use client';

import { useAuth, AuthProvider } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn && pathname !== '/login') {
        router.push('/login');
      } else if (isLoggedIn && pathname === '/login') {
        router.push('/');
      } else {
        setIsReady(true);
      }
    }
  }, [isLoggedIn, loading, pathname, router]);

  if (loading || !isReady) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // If on login page, render children (LoginPage) without Sidebar
  if (pathname === '/login') {
      return <>{children}</>;
  }

  // Otherwise render with Sidebar (Dashboard Layout)
  return (
    <div className="flex w-full min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-0 transition-all duration-300">
            {children}
        </main>
    </div>
  );
}

import { usePreferences, PreferencesProvider } from '@/context/PreferencesContext';
import { DashboardProvider } from '@/context/DashboardContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <PreferencesProvider>
                <DashboardProvider>
                    <ClientLayoutContent>{children}</ClientLayoutContent>
                </DashboardProvider>
            </PreferencesProvider>
        </AuthProvider>
    );
}
