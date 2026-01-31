'use client';

import { usePreferences } from '@/context/PreferencesContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, DollarSign, Check, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

const FlagID = () => <span className="text-lg">🇮🇩</span>;
const FlagEN = () => <span className="text-lg">🇺🇸</span>;

export function LanguageCurrencySwitcher() {
  const { language, setLanguage, currency, setCurrency, t } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
        className={clsx(
          "flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300",
          "bg-white border-2 border-pink-100 shadow-[4px_4px_10px_rgba(255,182,193,0.2),-4px_-4px_10px_rgba(255,255,255,0.8)]",
          "hover:border-pink-300 hover:shadow-[6px_6px_12px_rgba(255,182,193,0.3),-6px_-6px_12px_rgba(255,255,255,0.9)]",
          isOpen ? "ring-4 ring-pink-100/50 border-pink-300" : ""
        )}
      >
        <div className="flex items-center gap-2">
          {language === 'ID' ? <FlagID /> : <FlagEN />}
          <div className="h-4 w-px bg-pink-200"></div>
          <span className="text-sm font-black text-bakery-text/80 tracking-wide">
            {currency}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={clsx("text-pink-400 transition-transform duration-300", isOpen ? "rotate-180" : "")} 
        />
      </motion.button>

      {/* Popover Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={clsx(
                "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm p-6 bg-white/95 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-2xl z-[60]",
                "md:absolute md:top-auto md:left-auto md:right-0 md:translate-x-0 md:translate-y-0 md:w-72 md:p-5 md:mt-3 md:bg-white/90 md:backdrop-blur-xl md:z-20 md:shadow-[8px_8px_24px_rgba(0,0,0,0.08),-8px_-8px_24px_rgba(255,255,255,0.8)]"
              )}
            >
              {/* Arrow Pointer - Desktop Only */}
              <div className="hidden md:block absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-l border-t border-white/50"></div>

              <div className="space-y-6 relative z-10">
                
                {/* Language Section */}
                <div className="space-y-3">
                  <span className="text-xs font-black text-bakery-muted/60 uppercase tracking-widest px-1">
                    {t('language') || 'Language'}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <OptionButton 
                      active={language === 'ID'} 
                      onClick={() => setLanguage('ID')}
                      label="Indonesia"
                      subLabel="Bahasa"
                      icon={<FlagID />}
                    />
                    <OptionButton 
                      active={language === 'EN'} 
                      onClick={() => setLanguage('EN')}
                      label="English"
                      subLabel="US"
                      icon={<FlagEN />}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-50"></div>

                {/* Currency Section */}
                <div className="space-y-3">
                  <span className="text-xs font-black text-bakery-muted/60 uppercase tracking-widest px-1">
                    {t('currency') || 'Currency'}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <OptionButton 
                      active={currency === 'IDR'} 
                      onClick={() => setCurrency('IDR')}
                      label="Rupiah"
                      subLabel="IDR"
                      icon={<span className="font-serif font-bold text-green-600 text-sm">Rp</span>}
                      variant="green"
                    />
                    <OptionButton 
                      active={currency === 'USD'} 
                      onClick={() => setCurrency('USD')}
                      label="Dollar"
                      subLabel="USD"
                      icon={<DollarSign size={14} className="text-green-600" strokeWidth={3} />}
                      variant="green"
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface OptionButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  variant?: 'pink' | 'green';
}

function OptionButton({ active, onClick, label, subLabel, icon, variant = 'pink' }: OptionButtonProps) {
  const activeClasses = variant === 'pink' 
    ? 'bg-pink-50 border-pink-200 shadow-inner' 
    : 'bg-green-50 border-green-200 shadow-inner';
    
  const dotColor = variant === 'pink' ? 'bg-pink-500' : 'bg-green-500';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        "relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all duration-300 w-full",
        active 
          ? activeClasses
          : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100 shadow-sm"
      )}
    >
      <div className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center transition-colors text-lg",
        active ? "bg-white shadow-sm" : "bg-gray-100"
      )}>
        {icon}
      </div>
      <div className="flex flex-col items-center">
        <span className={clsx("text-xs font-bold", active ? "text-bakery-text" : "text-gray-500")}>
          {label}
        </span>
        <span className="text-[10px] font-bold text-bakery-muted/60 uppercase tracking-wider">
          {subLabel}
        </span>
      </div>
      
      {active && (
        <div className={clsx("absolute top-2 right-2 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", dotColor)}></div>
      )}
    </motion.button>
  );
}
