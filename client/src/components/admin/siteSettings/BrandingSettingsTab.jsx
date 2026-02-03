/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUploadZone from './ImageUploadZone';
import { uploadSiteAsset } from '../../../features/admin/siteSettings/siteSettingsThunks';
import { clearError } from '../../../features/admin/siteSettings/siteSettingsSlice';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';

const BrandingSettingsTab = ({ onSave, onHasChangesChange, saveTrigger = 0 }) => {
  const dispatch = useDispatch();
  const { settings, uploadLoading } = useSelector((state) => state.adminSiteSettings);

  const [primaryLogo, setPrimaryLogo] = useState({
    url: '',
    publicId: '',
    file: null,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const prevSaveTriggerRef = useRef(0);

  useEffect(() => {
    if (settings?.branding?.primaryLogo) {
      setPrimaryLogo({
        url: settings.branding.primaryLogo.url || '',
        publicId: settings.branding.primaryLogo.publicId || '',
        file: null,
      });
    }
  }, [settings]);

  useEffect(() => {
    onHasChangesChange?.(hasChanges);
  }, [hasChanges, onHasChangesChange]);

  useEffect(() => {
    if (saveTrigger > 0 && saveTrigger !== prevSaveTriggerRef.current && hasChanges) {
      prevSaveTriggerRef.current = saveTrigger;
      const brandingData = {
        primaryLogo: {
          url: primaryLogo.url,
          publicId: primaryLogo.publicId,
        },
      };
      onSave(brandingData);
      setHasChanges(false);
    }
  }, [saveTrigger, hasChanges, primaryLogo, onSave]);

  const handleLogoSelect = async (file) => {
    try {
      const result = await dispatch(uploadSiteAsset({ file, assetType: 'logo' })).unwrap();
      setPrimaryLogo({
        url: result.url,
        publicId: result.publicId,
        file,
      });
      setHasChanges(true);
      toast.success('Logo uploaded. Save changes below to apply.');
    } catch (error) {
      const message = typeof error === 'string' ? error : (error?.message || 'Failed to upload logo');
      toast.error(message, { duration: 5000 });
      dispatch(clearError());
    }
  };

  const handleLogoRemove = () => {
    setPrimaryLogo({ url: '', publicId: '', file: null });
    setHasChanges(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-[#FDF2F4] border border-[#CC2B52]/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#CC2B52] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <p className="font-medium text-gray-900 mb-1">Branding</p>
          <p className="text-gray-600">
            Logo appears in header, footer & auth pages. SVG or PNG (transparent). Recommended width: <strong>400–600 px</strong>. Max 25MB.
          </p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Primary logo</h3>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <ImageUploadZone
              currentImageUrl={primaryLogo.url}
              onImageSelect={handleLogoSelect}
              onImageRemove={handleLogoRemove}
              loading={uploadLoading}
              label="Logo"
              recommendedSize="400–600px"
              maxSize="25MB"
              acceptedFormats="SVG, PNG"
              aspectRatio="auto"
              variant="compact"
              showUrl={false}
            />
          </div>
          <p className="text-xs text-gray-500 sm:pt-2">
            Click the thumbnail to replace. Use <strong>Save changes</strong> in the bar below to apply.
          </p>
        </div>

        {primaryLogo.url && (
          <div className="mt-5 pt-5 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Preview on backgrounds</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-gray-200 rounded-lg p-4 bg-white flex items-center justify-center min-h-[72px]">
                <img src={primaryLogo.url} alt="Logo on white" className="max-h-10 max-w-full object-contain" />
              </div>
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-900 flex items-center justify-center min-h-[72px]">
                <img src={primaryLogo.url} alt="Logo on dark" className="max-h-10 max-w-full object-contain" />
              </div>
              <div className="border border-[#CC2B52]/30 rounded-lg p-4 bg-[#CC2B52] flex items-center justify-center min-h-[72px]">
                <img src={primaryLogo.url} alt="Logo on brand" className="max-h-10 max-w-full object-contain" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 text-center">White · Dark · Brand</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Admin panel logo</h3>
        <p className="text-sm text-gray-600">Coming in a future update.</p>
      </div>
    </div>
  );
};

export default BrandingSettingsTab;
