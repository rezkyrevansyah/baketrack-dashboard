'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ID' | 'EN';
type Currency = 'IDR' | 'USD';

interface PreferencesContextType {
  language: Language;
  currency: Currency;
  exchangeRate: number;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  setExchangeRate: (rate: number) => void;
  t: (key: string) => string;
  formatPrice: (amount: number) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

import { translations } from '@/constants/translations/index';

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  // Initialize with defaults, then hydrate from localStorage
  const [language, setLanguageState] = useState<Language>('ID');
  const [currency, setCurrencyState] = useState<Currency>('IDR');
  const [exchangeRate, setExchangeRateState] = useState<number>(15000); // Default 1 USD = 15,000 IDR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('baketrack_language') as Language;
    const storedCurr = localStorage.getItem('baketrack_currency') as Currency;
    const storedRate = localStorage.getItem('baketrack_rate');
    
    if (storedLang) setLanguageState(storedLang);
    if (storedCurr) setCurrencyState(storedCurr);
    if (storedRate) setExchangeRateState(Number(storedRate));
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('baketrack_language', lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('baketrack_currency', curr);
  };

  const setExchangeRate = (rate: number) => {
    setExchangeRateState(rate);
    localStorage.setItem('baketrack_rate', rate.toString());
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const formatPrice = (amount: number): string => {
    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }).format(amount);
    } else {
      const usdAmount = amount / exchangeRate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(usdAmount);
    }
  };

  if (!mounted) {
    // Initial render with defaults
  }

  return (
    <PreferencesContext.Provider value={{ language, currency, exchangeRate, setLanguage, setCurrency, setExchangeRate, t, formatPrice }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
