'use client';

import { Loader2 } from 'lucide-react';
import { ClayCard } from '@/components/ui/ClayCard';
import { usePreferences } from '@/context/PreferencesContext';
import { Product } from '@/services/api';

interface ProductDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
  product: Product | null;
}

export function ProductDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  product
}: ProductDeleteModalProps) {
  const { t } = usePreferences();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-black/10 animate-in fade-in zoom-in-95 duration-200">
      <ClayCard className="w-full max-w-sm !rounded-[40px] !bg-white p-10 shadow-2xl text-center relative overflow-hidden">
         <div className="w-20 h-20 bg-red-50 rounded-[30px] flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner border border-red-100/50 animate-bounce">
            ⚠️
         </div>
         
         <h2 className="text-3xl font-black text-bakery-text mb-2">{t('product.delete_modal_title')}</h2>
         <p className="text-bakery-muted font-bold text-sm mb-8">
            {t('product.delete_modal_desc')} <span className="text-red-500 italic">"{product?.name}"</span>? {t('product.delete_modal_alert')}
         </p>

         <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="h-14 rounded-2xl bg-gray-50 text-bakery-muted font-black hover:bg-gray-100 transition-all border-b-4 border-gray-200"
            >
               {t('product.cancel')}
            </button>
            <button 
              onClick={onConfirm}
              disabled={isSubmitting}
              className="h-14 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-all shadow-lg shadow-red-200 border-b-4 border-red-700 flex items-center justify-center"
            >
               {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : t('product.yes_delete')}
            </button>
         </div>

         <div className="absolute -left-10 -top-10 w-32 h-32 bg-red-50/50 rounded-full blur-3xl pointer-events-none"></div>
      </ClayCard>
    </div>
  );
}
