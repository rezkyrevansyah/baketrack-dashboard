import { translationsID } from './id';
import { translationsEN } from './en';

export type Language = 'ID' | 'EN';
export type Currency = 'IDR' | 'USD';

export const translations: Record<Language, Record<string, string>> = {
  ID: translationsID,
  EN: translationsEN
};
