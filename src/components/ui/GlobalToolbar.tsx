'use client';

import { usePreferences } from '@/context/PreferencesContext';
import { SyncButton } from '@/components/ui/SyncButton';
import { LanguageCurrencySwitcher } from '@/components/ui/LanguageCurrencySwitcher';

interface GlobalToolbarProps {
  className?: string;
}

export function GlobalToolbar({ className = '' }: GlobalToolbarProps) {
  const { t } = usePreferences();

  return (
    <div className={`flex flex-wrap md:flex-nowrap items-center justify-center gap-1 p-1.5 bg-white rounded-3xl border border-pink-100/50 shadow-sm w-full md:w-auto ${className}`}>
               
       {/* 1. Period Indicator */}
       <div className="hidden md:flex flex-col px-4 border-r border-gray-100 items-start">
           <span className="text-[10px] font-bold text-bakery-muted/60 uppercase tracking-widest leading-none mb-1">{t('period')}</span>
           <span className="text-sm font-black text-bakery-text leading-none whitespace-nowrap">
             {new Date().toLocaleDateString(t('language') === 'Bahasa' ? 'id-ID' : 'en-US', { month: 'short', year: 'numeric' })}
           </span>
       </div>

       {/* 2. Live Status Badge */}
       <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 mx-1 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-600">
           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
           <span className="text-[10px] font-black uppercase tracking-widest">{t('live')}</span>
       </div>

       <div className="hidden sm:block h-8 w-px bg-gray-100 mx-1"></div>

       {/* 3. Controls (Language + Sync) */}
       <div className="flex items-center gap-2 px-1">
           <LanguageCurrencySwitcher />
           {/* Sync Button force blue color as requested */}
           <SyncButton variant="compact" className="!w-10 !h-10 !rounded-xl !border-transparent hover:!bg-blue-50 hover:!text-blue-500 !text-blue-400" />
       </div>
    </div>
  );
}
