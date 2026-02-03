/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUploadZone = ({
  currentImageUrl,
  onImageSelect,
  onImageRemove,
  loading = false,
  label = "Upload Image",
  recommendedSize = "",
  maxSize = "25MB",
  acceptedFormats = "JPG, PNG, WebP, SVG",
  aspectRatio = "auto",
  variant = "default", // "default" | "compact" — compact shows thumbnail, smaller zone
  showUrl = false, // when true, show URL below (compact usually hides it)
}) => {
  const isCompact = variant === "compact";
  // Parse maxSize string (e.g. "25MB") to bytes
  const maxSizeBytes = parseInt(String(maxSize).replace(/\D/g, ''), 10) * 1024 * 1024;
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const fileInputRef = useRef(null);
  // Ref to hold local file preview so it survives re-renders before state commits
  const localPreviewRef = useRef('');

  // Sync preview with currentImageUrl when it changes (e.g. settings loaded from API or after upload)
  // Only set from API when we have a URL; don't clear when empty so local file preview stays visible
  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
      localPreviewRef.current = '';
    }
  }, [currentImageUrl]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error(`Invalid file type. Please upload ${acceptedFormats}`, { duration: 5000 });
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSize}`, { duration: 5000 });
      return;
    }

    // Show local preview first, then notify parent so preview is visible before upload/loading
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result || '';
      if (dataUrl) {
        localPreviewRef.current = dataUrl;
        setPreviewUrl(dataUrl);
      }
      // Defer upload so React commits preview state first; ensures preview shows before loading overlay
      setTimeout(() => {
        if (onImageSelect) {
          onImageSelect(file);
        }
      }, 0);
    };
    reader.onerror = () => {
      toast.error('Could not read the file. Try another image.', { duration: 5000 });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    localPreviewRef.current = '';
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const handleZoneClick = () => {
    if (!loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
          isDragging
            ? 'border-[#CC2B52] bg-pink-50'
            : (previewUrl || localPreviewRef.current)
            ? 'border-gray-300'
            : 'border-gray-300 hover:border-[#CC2B52]'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${isCompact ? 'inline-flex' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
        style={
          isCompact
            ? { width: (previewUrl || localPreviewRef.current) ? 'auto' : '100%', maxWidth: 160 }
            : { aspectRatio: (previewUrl || localPreviewRef.current) ? aspectRatio : 'auto' }
        }
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={loading}
        />

        {(previewUrl || localPreviewRef.current) ? (
          <div
            className={`relative rounded-lg overflow-hidden bg-gray-100 ${
              isCompact ? 'w-[120px] h-[120px] min-w-[120px] min-h-[120px]' : 'w-full h-full min-h-[200px]'
            }`}
          >
            <img
              src={previewUrl || localPreviewRef.current}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
              onError={() => {
                toast.error('Image failed to load. Check URL or try uploading again.', { duration: 5000 });
                localPreviewRef.current = '';
                setPreviewUrl('');
              }}
            />
            
            {/* Remove Button */}
            {!loading && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                title="Remove image"
              >
                <X size={18} />
              </button>
            )}

            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center gap-2 text-white">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {loading ? (
              <>
                <Loader2 className="w-12 h-12 text-[#CC2B52] animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-700">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {isDragging ? (
                    <Upload className="w-8 h-8 text-[#CC2B52]" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {acceptedFormats} • Max {maxSize}
                </p>
                {recommendedSize && (
                  <p className="text-xs text-gray-400">
                    Recommended: {recommendedSize}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Info Text */}
      {(previewUrl || localPreviewRef.current) && !loading && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Click to replace or drag a new image
        </p>
      )}
    </div>
  );
};

export default ImageUploadZone;
