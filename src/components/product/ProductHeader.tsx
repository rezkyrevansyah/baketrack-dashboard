'use client';

import { Search, Plus } from 'lucide-react';
import { ClayButton } from '@/components/ui/ClayButton';
import { SyncButton } from '@/components/ui/SyncButton';
import { LanguageCurrencySwitcher } from '@/components/ui/LanguageCurrencySwitcher';
import { usePreferences } from '@/context/PreferencesContext';

interface ProductHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddClick: () => void;
}

export function ProductHeader({ searchQuery, setSearchQuery, onAddClick }: ProductHeaderProps) {
  const { t } = usePreferences();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 pt-4 md:pt-6">
      <div>
        <h1 className="text-4xl font-black text-bakery-text tracking-tight mb-2">{t('product.title')}</h1>
        <p className="text-bakery-muted font-bold text-sm tracking-wide opacity-70 uppercase">
           {t('product.subtitle')}
        </p>
      </div>

      <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-4">
         {/* Row 1: Language/Currency */}
         <div className="flex justify-start md:justify-center">
            <LanguageCurrencySwitcher />
         </div>

         {/* Row 2: Search & Sync */}
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-auto">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={18} />
               <input 
                 type="text"
                 placeholder={t('product.search_placeholder')}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="clay-input !pl-12 !py-3 w-full md:w-64 bg-white/60 focus:bg-white !rounded-2xl transition-all shadow-sm"
               />
            </div>
            <SyncButton variant="compact" />
         </div>
         
         {/* Row 3: Add Button */}
         <ClayButton onClick={onAddClick} className="!rounded-2xl !px-6 flex items-center justify-center gap-2 h-12 shadow-lg w-full md:w-auto">
            <Plus size={20} strokeWidth={3} />
            <span className="font-bold">{t('product.add_button')}</span>
         </ClayButton>
      </div>
    </div>
  );
}
