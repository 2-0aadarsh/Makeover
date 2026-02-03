/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUploadZone from './ImageUploadZone';
import { uploadSiteAsset } from '../../../features/admin/siteSettings/siteSettingsThunks';
import { clearError } from '../../../features/admin/siteSettings/siteSettingsSlice';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';

const HeroSettingsTab = ({ onSave, onHasChangesChange, saveTrigger = 0 }) => {
  const dispatch = useDispatch();
  const { settings, uploadLoading } = useSelector((state) => state.adminSiteSettings);

  const [mainImage, setMainImage] = useState({
    url: '',
    publicId: '',
    file: null,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const prevSaveTriggerRef = useRef(0);

  useEffect(() => {
    if (settings?.hero?.mainImage) {
      setMainImage({
        url: settings.hero.mainImage.url || '',
        publicId: settings.hero.mainImage.publicId || '',
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
      const heroData = {
        mainImage: {
          url: mainImage.url,
          publicId: mainImage.publicId,
        },
      };
      onSave(heroData);
      setHasChanges(false);
    }
  }, [saveTrigger, hasChanges, mainImage, onSave]);

  const handleMainImageSelect = async (file) => {
    try {
      const result = await dispatch(uploadSiteAsset({ file, assetType: 'hero' })).unwrap();
      setMainImage({
        url: result.url,
        publicId: result.publicId,
        file,
      });
      setHasChanges(true);
      toast.success('Image uploaded. Save changes below to apply.');
    } catch (error) {
      const message = typeof error === 'string' ? error : (error?.message || 'Failed to upload image');
      toast.error(message, { duration: 5000 });
      dispatch(clearError());
    }
  };

  const handleMainImageRemove = () => {
    setMainImage({ url: '', publicId: '', file: null });
    setHasChanges(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-[#FDF2F4] border border-[#CC2B52]/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#CC2B52] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <p className="font-medium text-gray-900 mb-1">Hero image</p>
          <p className="text-gray-600">
            First thing visitors see. Use high-quality images. Recommended: <strong>1920×1080 px</strong>. Max 25MB.
          </p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Main hero image</h3>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-[160px] sm:w-[200px]">
            <ImageUploadZone
              currentImageUrl={mainImage.url}
              onImageSelect={handleMainImageSelect}
              onImageRemove={handleMainImageRemove}
              loading={uploadLoading}
              label=""
              recommendedSize="1920×1080px"
              maxSize="25MB"
              acceptedFormats="JPG, PNG, WebP, SVG"
              aspectRatio="16/9"
              variant="compact"
              showUrl={false}
            />
          </div>
          <p className="text-xs text-gray-500 sm:pt-2">
            Click the thumbnail to replace. Use <strong>Save changes</strong> in the bar below to apply.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Category icons</h3>
        <p className="text-sm text-gray-600">Coming in a future update.</p>
      </div>
    </div>
  );
};

export default HeroSettingsTab;
