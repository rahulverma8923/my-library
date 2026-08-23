import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { bookService } from '../../services/bookService';
import { useToast } from '../../context/ToastContext';

export const BookCoverUpload = ({ currentCover, onCoverUploaded, onCoverRemoved }) => {
  const [preview, setPreview] = useState(currentCover || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { showError, showSuccess } = useToast();

  const handleFile = async (file) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file (JPEG, PNG, WEBP, GIF)');
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size exceeds 5MB limit');
      return;
    }

    // Create immediate local object URL for preview
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);

    setIsUploading(true);
    try {
      const res = await bookService.uploadCover(file);
      if (res.imageUrl) {
        setPreview(res.imageUrl);
        onCoverUploaded(res.imageUrl);
        showSuccess('Cover image uploaded!');
      }
    } catch (error) {
      console.error('Failed to upload cover:', error);
      showError(error.response?.data?.message || 'Failed to upload cover image');
      setPreview(currentCover || '');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onCoverRemoved) {
      onCoverRemoved();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      {preview ? (
        <div className="relative group w-36 h-48 sm:w-40 sm:h-56 mx-auto rounded-2xl overflow-hidden border-2 border-forest-500/40 shadow-book bg-parchment-200 dark:bg-ink-800">
          <img
            src={preview}
            alt="Book Cover Preview"
            className="w-full h-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-ink-950/70 flex flex-col items-center justify-center text-white">
              <Loader2 className="w-6 h-6 animate-spin mb-1 text-forest-400" />
              <span className="text-xs font-medium">Uploading...</span>
            </div>
          )}
          {!isUploading && (
            <div className="absolute inset-0 bg-ink-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-100 hover:scale-105 transition-transform"
                title="Change Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 rounded-xl bg-rose-600/90 text-white hover:scale-105 transition-transform"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 ${
            isDragging
              ? 'border-forest-500 bg-forest-50/50 dark:bg-forest-950/30'
              : 'border-parchment-300 dark:border-ink-700 hover:border-forest-500/60 bg-parchment-50/60 dark:bg-ink-900/30 hover:bg-parchment-100/60'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-forest-100 dark:bg-forest-950/80 text-forest-700 dark:text-forest-400 flex items-center justify-center mb-3">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <p className="text-sm font-semibold text-ink-800 dark:text-ink-200 mb-1">
            {isUploading ? 'Uploading cover...' : 'Upload Cover Image'}
          </p>
          <p className="text-xs text-ink-400 dark:text-ink-400 max-w-xs">
            Drag & drop or click to browse (JPG, PNG, WEBP up to 5MB)
          </p>
        </div>
      )}
    </div>
  );
};
