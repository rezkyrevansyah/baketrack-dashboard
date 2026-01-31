'use client';

import { ShieldCheck } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';

export function SecurityCard() {
  const { t } = usePreferences();

  return (
    <div className="clay-card-static p-6 flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-green-50/30 to-white border-green-100/30 relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-green-500 shadow-sm border border-green-50 shrink-0">
        <ShieldCheck size={32} />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-lg font-black text-bakery-text mb-1">{t('settings.account_secured')}</h3>
        <p className="text-sm text-bakery-muted leading-relaxed max-w-lg">
          Your account is protected with SSL encryption. No actions required.
        </p>
      </div>
      <div className="shrink-0">
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-green-600 font-black text-xs uppercase tracking-widest shadow-sm border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Active
        </span>
      </div>
    </div>
  );
}
