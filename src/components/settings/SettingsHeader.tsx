'use client';

import { LanguageCurrencySwitcher } from '@/components/ui/LanguageCurrencySwitcher';
import { SyncButton } from '@/components/ui/SyncButton';
import { usePreferences } from '@/context/PreferencesContext';

export function SettingsHeader() {
  const { t } = usePreferences();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 pt-4 md:pt-6">
      <div>
        <h1 className="text-4xl font-black text-bakery-text tracking-tight mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-bakery-muted font-bold text-sm tracking-wide opacity-70 uppercase">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Row 1: Language/Currency */}
        <div className="flex justify-start md:justify-center">
          <LanguageCurrencySwitcher />
        </div>

        {/* Row 2: Sync */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <SyncButton variant="compact" />
        </div>
      </div>
    </div>
  );
}
