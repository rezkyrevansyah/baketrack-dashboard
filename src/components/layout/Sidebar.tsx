'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Receipt, Package, Settings, ChevronLeft, ChevronRight, X, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferences } from '@/context/PreferencesContext';
import { useAuth } from '@/context/AuthContext';

// MENU_ITEMS moved inside component to access t()

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { t } = usePreferences();
  const { logout } = useAuth();
  const menuItems = [
    { name: t('sidebar.report'), icon: BarChart3, path: '/report' },
    { name: t('sidebar.input'), icon: Receipt, path: '/input' },
    { name: t('sidebar.product'), icon: Package, path: '/product' },
  ];

  // Handle responsive check safely
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarWidth = isCollapsed ? 100 : 288;

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Spacer to push main content - Desktop only */}
      <motion.div 
        animate={{ width: sidebarWidth }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:block shrink-0"
      />

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* The Actual Sidebar */}
      <motion.aside 
        initial={false}
        animate={isMobile 
          ? { x: isOpen ? 0 : '-100%', width: 288 } 
          : { x: 0, width: sidebarWidth }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={clsx(
          "clay-sidebar fixed left-0 top-0 h-screen text-white p-4 flex flex-col z-[100] overflow-hidden shadow-2xl",
          // On mobile, if not open, we still relying on animate to hide it, 
          // but accessibility-wise adding visibility utility is good? 
          // Framer motion handles the transform.
        )}
      >
        {/* Close Button (Mobile Only) */}
        <button 
          onClick={onClose}
          className="md:hidden absolute right-4 top-4 p-2 text-white/80 hover:text-white"
        >
          <X size={24} />
        </button>

        {/* Collapse Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block absolute -right-0 top-10 bg-white/20 hover:bg-white/30 p-1.5 rounded-l-xl backdrop-blur-md transition-all z-[100] border-l border-white/30 active:scale-90"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Brand / Logo */}
        <div className={clsx("flex items-center gap-4 mb-12 mt-4 px-2", (isCollapsed && !isMobile) ? "justify-center" : "")}>
          <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-lg transform -rotate-6">
            🧁
          </div>
          {(!isCollapsed || isMobile) && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="whitespace-nowrap"
            >
              <h1 className="font-extrabold text-2xl leading-none drop-shadow-sm">BakeTrack</h1>
              <p className="text-sm text-pink-100 font-medium opacity-90">{t('dashboard.subtitle')}</p>
            </motion.div>
          )}
        </div>

        {/* Navigation Pills */}
        <nav className="flex-1 space-y-5">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const showText = !isCollapsed || isMobile;

            return (
              <Link key={item.path} href={item.path} className="block group" onClick={handleLinkClick}>
                <div
                  className={clsx(
                    "clay-nav-item relative flex items-center gap-4 px-4 py-3.5 transition-all duration-300",
                    isActive ? "active" : "",
                    (!showText) ? "justify-center px-0 mx-2" : ""
                  )}
                >
                  {/* Icon Container */}
                  <div className={clsx(
                    "p-2.5 rounded-xl transition-colors flex-shrink-0",
                    isActive ? "bg-pink-400 text-white shadow-inner" : "bg-white/10 text-pink-50"
                  )}>
                    <item.icon size={22} strokeWidth={2.5} />
                  </div>
                  
                  {showText && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-bold text-lg tracking-wide whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Active Indicator Dot */}
                  {isActive && showText && (
                    <motion.div 
                      layoutId="activeDot"
                      className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" 
                      initial={false}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto mb-4 space-y-2">
          {/* Settings */}
          <Link href="/settings" onClick={handleLinkClick} className="block group">
              <div className={clsx(
                "clay-nav-item flex items-center gap-4 px-4 py-3 pointer-events-auto", 
                pathname === '/settings' ? 'active' : '',
                (!isCollapsed || isMobile) ? "" : "justify-center px-0 mx-2"
              )}>
                <div className={clsx(
                    "p-2.5 rounded-xl flex-shrink-0",
                    pathname === '/settings' ? "bg-pink-400 text-white" : "bg-white/10 text-pink-50"
                )}>
                    <Settings size={22} />
                </div>
                {(!isCollapsed || isMobile) && <span className="font-bold text-lg">{t('sidebar.settings')}</span>}
              </div>
          </Link>

          {/* Logout */}
          <button 
            onClick={() => {
              if (onClose && isMobile) onClose();
              logout(); // Call actual logout
            }}
            className="w-full block group text-left"
          >
              <div className={clsx(
                "clay-nav-item flex items-center gap-4 px-4 py-3 transition-colors hover:bg-red-50/10",
                (!isCollapsed || isMobile) ? "" : "justify-center px-0 mx-2"
              )}>
                <div className={clsx(
                    "p-2.5 rounded-xl flex-shrink-0 bg-red-100/20 text-red-100 group-hover:bg-red-500 group-hover:text-white transition-colors",
                )}>
                    <LogOut size={22} />
                </div>
                {(!isCollapsed || isMobile) && <span className="font-bold text-lg text-red-100 group-hover:text-red-200 transition-colors">{t('sidebar.logout')}</span>}
              </div>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
