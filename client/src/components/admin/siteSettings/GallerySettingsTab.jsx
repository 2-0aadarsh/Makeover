/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUploadZone from './ImageUploadZone';
import { uploadSiteAsset } from '../../../features/admin/siteSettings/siteSettingsThunks';
import { clearError } from '../../../features/admin/siteSettings/siteSettingsSlice';
import { Info, Eye, EyeOff, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const MAX_SLIDES = 10;
const DEFAULT_SLIDE = { title: '', description: '', imageUrl: '', publicId: '', active: true, order: 0 };

const GallerySettingsTab = ({ onSave, onHasChangesChange, saveTrigger = 0 }) => {
  const dispatch = useDispatch();
  const { settings, uploadLoading } = useSelector((state) => state.adminSiteSettings);

  const [slides, setSlides] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState(null);
  const [removeConfirmIndex, setRemoveConfirmIndex] = useState(null);
  const prevSaveTriggerRef = useRef(0);

  useEffect(() => {
    if (settings?.gallery?.slides) {
      const loaded = settings.gallery.slides.map((slide, index) => ({
        ...slide,
        order: slide.order ?? index + 1,
      }));
      setSlides(loaded.length ? loaded : []);
    }
  }, [settings]);

  useEffect(() => {
    onHasChangesChange?.(hasChanges);
  }, [hasChanges, onHasChangesChange]);

  useEffect(() => {
    if (saveTrigger > 0 && saveTrigger !== prevSaveTriggerRef.current && hasChanges) {
      prevSaveTriggerRef.current = saveTrigger;
      const galleryData = {
        slides: slides.map((slide, index) => ({
          title: slide.title || 'Untitled',
          description: slide.description || '',
          imageUrl: slide.imageUrl || '',
          publicId: slide.publicId || '',
          active: slide.active !== false,
          order: index + 1,
        })),
      };
      onSave(galleryData);
      setHasChanges(false);
      setRemoveConfirmIndex(null);
    }
  }, [saveTrigger, hasChanges, slides, onSave]);

  const handleImageSelect = async (file, index) => {
    try {
      setUploadingSlideIndex(index);
      const result = await dispatch(uploadSiteAsset({ file, assetType: 'gallery' })).unwrap();
      const updatedSlides = [...slides];
      updatedSlides[index] = {
        ...updatedSlides[index],
        imageUrl: result.url,
        publicId: result.publicId,
      };
      setSlides(updatedSlides);
      setHasChanges(true);
      setUploadingSlideIndex(null);
      toast.success('Image uploaded. Save changes below to apply.');
    } catch (error) {
      setUploadingSlideIndex(null);
      const message = typeof error === 'string' ? error : (error?.message || 'Failed to upload image');
      toast.error(message, { duration: 5000 });
      dispatch(clearError());
    }
  };

  const handleImageRemove = (index) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = { ...updatedSlides[index], imageUrl: '', publicId: '' };
    setSlides(updatedSlides);
    setHasChanges(true);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[index][field] = value;
    setSlides(updatedSlides);
    setHasChanges(true);
  };

  const handleToggleActive = (index) => {
    const updatedSlides = [...slides];
    updatedSlides[index].active = !updatedSlides[index].active;
    setSlides(updatedSlides);
    setHasChanges(true);
  };

  const handleAddSlide = () => {
    if (slides.length >= MAX_SLIDES) {
      toast.error(`Maximum ${MAX_SLIDES} slides allowed`);
      return;
    }
    setSlides([...slides, { ...DEFAULT_SLIDE, order: slides.length + 1 }]);
    setHasChanges(true);
    toast.success('Slide added. Fill title, description & upload image.');
  };

  const handleRemoveSlide = (index) => {
    if (removeConfirmIndex === index) {
      setSlides(slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })));
      setHasChanges(true);
      setRemoveConfirmIndex(null);
      toast.success('Slide removed. Save changes below to apply.');
    } else {
      setRemoveConfirmIndex(index);
      toast('Click Remove again to confirm', { icon: '⚠️', duration: 3000 });
    }
  };

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const updated = [...slides];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((s, i) => (s.order = i + 1));
    setSlides(updated);
    setHasChanges(true);
  };

  const handleMoveDown = (index) => {
    if (index >= slides.length - 1) return;
    const updated = [...slides];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((s, i) => (s.order = i + 1));
    setSlides(updated);
    setHasChanges(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-[#FDF2F4] border border-[#CC2B52]/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#CC2B52] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <p className="font-medium text-gray-900 mb-1">Gallery slides</p>
          <p className="text-gray-600">
            Portrait images work best. Recommended: <strong>1200×1600 px (3:4)</strong>. Max <strong>{MAX_SLIDES} slides</strong>. Inactive slides are hidden on the site.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Slides ({slides.length})</h3>
        <button
          type="button"
          onClick={handleAddSlide}
          disabled={slides.length >= MAX_SLIDES}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            slides.length >= MAX_SLIDES
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#CC2B52] text-white hover:bg-[#CC2B52]/90'
          }`}
        >
          <Plus size={18} />
          Add slide
        </button>
      </div>

      {slides.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
          <p className="text-gray-600 font-medium mb-2">No slides yet</p>
          <p className="text-sm text-gray-500 mb-4">Add your first slide to show images in the gallery section.</p>
          <button
            type="button"
            onClick={handleAddSlide}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#CC2B52] text-white rounded-lg text-sm font-medium hover:bg-[#CC2B52]/90"
          >
            <Plus size={18} />
            Add first slide
          </button>
        </div>
      )}

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`border rounded-lg p-5 transition-opacity ${!slide.active ? 'opacity-60 bg-gray-50' : 'bg-white border-gray-200'}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h4 className="text-sm font-semibold text-gray-900">
              Slide {index + 1}: {slide.title || 'Untitled'}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === slides.length - 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleToggleActive(index)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  slide.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {slide.active ? <Eye size={14} /> : <EyeOff size={14} />}
                {slide.active ? 'Active' : 'Inactive'}
              </button>
              <button
                type="button"
                onClick={() => handleRemoveSlide(index)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  removeConfirmIndex === index ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
                title={removeConfirmIndex === index ? 'Click again to confirm' : 'Remove slide'}
              >
                <Trash2 size={14} />
                {removeConfirmIndex === index ? 'Confirm?' : 'Remove'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-shrink-0">
              <ImageUploadZone
                currentImageUrl={slide.imageUrl}
                onImageSelect={(file) => handleImageSelect(file, index)}
                onImageRemove={() => handleImageRemove(index)}
                loading={uploadingSlideIndex === index}
                label="Image"
                recommendedSize="1200×1600"
                maxSize="25MB"
                acceptedFormats="JPG, PNG, WebP, SVG"
                aspectRatio="3/4"
                variant="compact"
                showUrl={false}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] text-sm"
                  placeholder="e.g. Bridal Makeup"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={slide.description}
                  onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC2B52] text-sm resize-none"
                  placeholder="Brief description..."
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySettingsTab;
