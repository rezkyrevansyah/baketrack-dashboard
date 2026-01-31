'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardProvider } from "@/context/DashboardContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <PreferencesProvider>
      <DashboardProvider>
        {/* Mobile Header Trigger */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#F5E6EE]/80 backdrop-blur-md p-4 flex items-center gap-4 border-b border-white/20 shadow-sm h-16">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 bg-white rounded-xl shadow-sm text-pink-500 hover:bg-pink-50 transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-extrabold text-xl text-pink-600">BakeTrack</h1>
        </div>

        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 h-screen overflow-y-auto w-full relative pt-20 md:pt-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </DashboardProvider>
    </PreferencesProvider>
  );
}
