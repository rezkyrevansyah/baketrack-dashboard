'use client';

import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayButton } from '@/components/ui/ClayButton';
import { usePreferences } from '@/context/PreferencesContext';

interface ProfileFormData {
  name: string;
  email: string;
  photourl: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export function EditProfileModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isSubmitting
}: EditProfileModalProps) {
  const { t } = usePreferences();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/10 animate-in fade-in duration-300">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="w-full max-w-md"
          >
            <div className="clay-card-static w-full !rounded-[40px] !bg-white p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-bakery-text tracking-tight">{t('settings.edit_profile')}</h3>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-bakery-muted uppercase tracking-widest pl-1">
                    {t('settings.full_name')}
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="clay-input w-full !h-14 !bg-gray-50 !shadow-inner focus:!bg-white border-transparent focus:border-pink-200 transition-all font-bold text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-bakery-muted uppercase tracking-widest pl-1">
                    {t('settings.email_address')}
                  </label>
                  <input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="clay-input w-full !h-14 !bg-gray-50 !shadow-inner focus:!bg-white border-transparent focus:border-pink-200 transition-all font-bold text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-bakery-muted uppercase tracking-widest pl-1">
                    {t('settings.photo_url')}
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.photourl}
                    onChange={e => setFormData({...formData, photourl: e.target.value})}
                    placeholder="Enter image URL or emoji"
                    className="clay-input w-full !h-14 !bg-gray-50 !shadow-inner focus:!bg-white border-transparent focus:border-pink-200 transition-all font-bold text-base"
                  />
                </div>

                <div className="pt-2">
                  <ClayButton type="submit" disabled={isSubmitting} className="w-full !rounded-[20px] h-14 text-base font-black shadow-xl">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('settings.save_button')}
                  </ClayButton>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
