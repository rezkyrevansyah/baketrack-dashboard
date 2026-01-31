'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/context/DashboardContext';
import { usePreferences } from '@/context/PreferencesContext';
import { updateProfile } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { SecurityCard } from '@/components/settings/SecurityCard';
import { CurrencySettingsCard } from '@/components/settings/CurrencySettingsCard';
import { IntegrationCard } from '@/components/settings/IntegrationCard';
import { EditProfileModal } from '@/components/settings/EditProfileModal';

export default function SettingsPage() {
  const { data, loading: dataLoading, refreshData } = useDashboard();
  const { user } = useAuth();
  const { t } = usePreferences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile local state for the modal
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photourl: ''
  });

  // Sync modal form with global data when it opens
  useEffect(() => {
    if (data?.profile && isModalOpen) {
      setFormData({
        name: data.profile.name,
        email: data.profile.email,
        photourl: data.profile.photourl
      });
    }
  }, [data, isModalOpen]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await updateProfile(formData);
    if (success) {
      await refreshData();
      setIsModalOpen(false);
    } else {
      alert(t('settings.error_update'));
    }
    setIsSubmitting(false);
  };

  if (dataLoading && !data) {
    return <LoadingSpinner message={t('settings.loading')} />;
  }

  const profile = user || { name: 'Guest', email: 'guest@bakery.com', photourl: '🧁' };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header - Same structure as ProductHeader */}
      <SettingsHeader />

      {/* Content Grid - Simple single-level structure */}
      <div className="grid grid-cols-1 gap-8 px-4">
        {/* Profile Card - Full Width */}
        <ProfileCard profile={profile} onEditClick={() => setIsModalOpen(true)} />

        {/* Security + Currency - 2 Column on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SecurityCard />
          <CurrencySettingsCard />
        </div>

        {/* Integration Card - Full Width */}
        <IntegrationCard />
      </div>

      {/* Modal */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateProfile}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
