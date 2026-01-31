'use client';

import { X, Tag, Hash, Box, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ClayButton } from '@/components/ui/ClayButton';
import { NumericInput } from '@/components/ui/NumericInput';
import { usePreferences } from '@/context/PreferencesContext';
import { Product } from '@/services/api';

interface ProductFormData {
  name: string;
  price: string;
  costPrice: string;
  stock: string;
  image: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  editingProduct: Product | null;
}

const EMOJI_OPTIONS = ['🧁', '🍩', '🥐', '🍞', '🍰'];

export function ProductFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  editingProduct
}: ProductFormModalProps) {
  const { t } = usePreferences();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/5 animate-in fade-in duration-300">
      <div className="clay-card-static w-full max-w-md !rounded-[40px] !bg-white p-10 shadow-2xl relative overflow-hidden">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-bakery-text">{editingProduct ? t('product.edit') : t('product.new')}</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all">
               <X size={20} />
            </button>
         </div>

         <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                <Tag size={14} className="text-pink-400" /> {t('product.name')}
              </label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder={t('product.name_placeholder')}
                className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                  <Hash size={14} className="text-blue-400" /> {t('product.price')}
                </label>
                <NumericInput 
                  required
                  value={formData.price}
                  onValueChange={(val) => setFormData({...formData, price: val.toString()})}
                  placeholder="8000"
                  className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                  <Hash size={14} className="text-emerald-400" /> {t('product.cost_price')}
                </label>
                <NumericInput 
                  required
                  value={formData.costPrice}
                  onValueChange={(val) => setFormData({...formData, costPrice: val.toString()})}
                  placeholder="5000"
                  className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                  <Box size={14} className="text-orange-400" /> {t('product.stock')}
                </label>
                <NumericInput 
                  required
                  value={formData.stock}
                  onValueChange={(val) => setFormData({...formData, stock: val.toString()})}
                  placeholder="50"
                  className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="clay-label !mb-0 text-xs font-black opacity-50 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={14} className="text-purple-400" /> {t('product.icon')}
              </label>
              <div className="mb-2">
                <input 
                  type="text"
                  required
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  placeholder={t('product.image_placeholder')}
                  className="clay-input w-full !bg-gray-50/50 !shadow-inner focus:!bg-white mb-3"
                />
              </div>
              <div className="flex gap-3 p-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({...formData, image: emoji})}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${formData.image === emoji ? 'bg-white shadow-clay-floating scale-110 border-2 border-pink-100' : 'hover:bg-white/50 opacity-40 hover:opacity-100'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <ClayButton type="submit" disabled={isSubmitting} className="w-full !rounded-2xl h-14 text-lg font-black shadow-xl">
                 {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : (editingProduct ? t('product.save_changes') : t('product.add_product'))}
              </ClayButton>
            </div>
         </form>

         <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-pink-100/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
