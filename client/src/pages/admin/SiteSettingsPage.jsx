import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSiteSettings,
  updateHeroSettings,
  updateGallerySettings,
  updateBrandingSettings,
} from '../../features/admin/siteSettings/siteSettingsThunks';
import { clearError } from '../../features/admin/siteSettings/siteSettingsSlice';
import HeroSettingsTab from '../../components/admin/siteSettings/HeroSettingsTab';
import GallerySettingsTab from '../../components/admin/siteSettings/GallerySettingsTab';
import BrandingSettingsTab from '../../components/admin/siteSettings/BrandingSettingsTab';
import DiscardConfirmModal from '../../components/admin/siteSettings/DiscardConfirmModal';
import { Loader2, Settings, Save, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'branding', label: 'Branding' },
];

const SiteSettingsPage = () => {
  const dispatch = useDispatch();
  const { settings, loading, error } = useSelector((state) => state.adminSiteSettings);

  const [activeTab, setActiveTab] = useState('hero');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [discardAction, setDiscardAction] = useState(null); // null | 'discard-bar' | 'switch-tab'

  // Fetch settings on mount
  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      const message = typeof error === 'string' ? error : (error?.message || 'Something went wrong');
      toast.error(message, { duration: 5000 });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSaveHero = useCallback(async (heroData) => {
    try {
      await dispatch(updateHeroSettings(heroData)).unwrap();
      toast.success('Hero settings updated successfully!');
      setUnsavedChanges(false);
    } catch (err) {
      toast.error(err || 'Failed to update hero settings');
    }
  }, [dispatch]);

  const handleSaveGallery = useCallback(async (galleryData) => {
    try {
      await dispatch(updateGallerySettings(galleryData)).unwrap();
      toast.success('Gallery settings updated successfully!');
      setUnsavedChanges(false);
    } catch (err) {
      toast.error(err || 'Failed to update gallery settings');
    }
  }, [dispatch]);

  const handleSaveBranding = useCallback(async (brandingData) => {
    try {
      await dispatch(updateBrandingSettings(brandingData)).unwrap();
      toast.success('Branding settings updated successfully!');
      setUnsavedChanges(false);
    } catch (err) {
      toast.error(err || 'Failed to update branding settings');
    }
  }, [dispatch]);

  const [discardActionPayload, setDiscardActionPayload] = useState(null);

  const openDiscardModal = (action, payload = null) => {
    setDiscardAction(action);
    setDiscardActionPayload(payload);
    setDiscardModalOpen(true);
  };

  const handleTabClick = (tabId) => {
    if (tabId === activeTab) return;
    if (unsavedChanges) {
      openDiscardModal('switch-tab', tabId);
    } else {
      setActiveTab(tabId);
    }
  };

  const handleDiscardConfirm = useCallback(() => {
    setUnsavedChanges(false);
    setDiscardModalOpen(false);
    dispatch(fetchSiteSettings());
    if (discardAction === 'switch-tab' && discardActionPayload) {
      setActiveTab(discardActionPayload);
    }
    setDiscardAction(null);
    setDiscardActionPayload(null);
  }, [dispatch, discardAction, discardActionPayload]);

  const handleStickySave = () => {
    setSaveTrigger((t) => t + 1);
  };

  const handleStickyDiscard = () => {
    openDiscardModal('discard-bar');
  };

  if (loading && !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#CC2B52] animate-spin" />
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px] pb-24">
      {/* Sticky header: title + tabs */}
      <div className="sticky top-[80px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <Settings className="w-7 h-7 text-[#CC2B52]" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
                <p className="text-sm text-gray-500">Hero, gallery & branding</p>
              </div>
            </div>
            <nav className="flex gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#CC2B52] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === 'hero' && (
            <HeroSettingsTab
              onSave={handleSaveHero}
              onHasChangesChange={setUnsavedChanges}
              saveTrigger={saveTrigger}
            />
          )}
          {activeTab === 'gallery' && (
            <GallerySettingsTab
              onSave={handleSaveGallery}
              onHasChangesChange={setUnsavedChanges}
              saveTrigger={saveTrigger}
            />
          )}
          {activeTab === 'branding' && (
            <BrandingSettingsTab
              onSave={handleSaveBranding}
              onHasChangesChange={setUnsavedChanges}
              saveTrigger={saveTrigger}
            />
          )}
        </div>
      </div>

      {/* Sticky bottom bar: unsaved changes + Save / Discard */}
      {unsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-medium">You have unsaved changes</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleStickyDiscard}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw size={18} />
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleStickySave}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white bg-[#CC2B52] hover:bg-[#CC2B52]/90 transition-colors shadow-sm"
                >
                  <Save size={18} />
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DiscardConfirmModal
        isOpen={discardModalOpen}
        onClose={() => {
          setDiscardModalOpen(false);
          setDiscardAction(null);
          setDiscardActionPayload(null);
        }}
        onConfirm={handleDiscardConfirm}
        title="Discard unsaved changes?"
        message={
          discardAction === 'switch-tab'
            ? 'You have unsaved changes. Discard them and switch tab? Your changes will not be applied.'
            : 'You have unsaved changes. Are you sure you want to discard them? They will not be applied.'
        }
      />
    </div>
  );
};

export default SiteSettingsPage;
