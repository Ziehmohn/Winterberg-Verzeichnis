import React, { useState, useRef } from 'react';
import { Star, Camera, X, Upload, Loader2 } from 'lucide-react';
import { Business, Review } from '../types';
import { useTranslation } from '../i18n';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface SelectedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ReviewForm({ business, onReviewSubmit }: { business: Business, onReviewSubmit: (businessId: string, review: Review) => void }) {
  const { t, lang } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(() => {
    try {
      return localStorage.getItem(`wv_reviewed_${business.id}`) === 'true';
    } catch {
      return false;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side image compression helper (max 1600px, 0.82 JPEG quality)
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDimension = 1600;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            'image/jpeg',
            0.82
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 3 - selectedImages.length;
    if (remainingSlots <= 0) {
      alert(t("maxPhotosAllowed"));
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots) as File[];
    const newItems: SelectedImage[] = filesToAdd.map((file: File) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...newItems]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (idToRemove: string) => {
    setSelectedImages(prev => {
      const item = prev.find(i => i.id === idToRemove);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter(i => i.id !== idToRemove);
    });
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert(t("alertStarRating"));
      return;
    }
    if (authorName.trim() === '') {
      alert(t("alertAuthorName"));
      return;
    }

    setIsSubmitting(true);
    const uploadedUrls: string[] = [];

    // Upload selected images to Firebase Storage with base64 fallback
    for (let i = 0; i < selectedImages.length; i++) {
      const imgItem = selectedImages[i];
      try {
        const compressedBlob = await compressImage(imgItem.file);
        const storagePath = `reviews/${business.id}/${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}.jpg`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, compressedBlob);
        const downloadUrl = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadUrl);
      } catch (storageErr) {
        console.warn('Review storage upload failed, converting to data URL fallback', storageErr);
        try {
          const compressedBlob = await compressImage(imgItem.file);
          const base64Url = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(compressedBlob);
          });
          if (base64Url) uploadedUrls.push(base64Url);
        } catch (e2) {
          console.error('Image fallback failed:', e2);
        }
      }
    }
    
    const newReview: Review = {
      id: 'rev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      authorName: authorName.trim(),
      businessId: business.id,
      text: text.trim(),
      rating,
      status: 'pending',
      date: new Date().toISOString(),
      ...(uploadedUrls.length > 0 ? { images: uploadedUrls } : {})
    };
    
    try {
      await onReviewSubmit(business.id, newReview);
      try {
        localStorage.setItem(`wv_reviewed_${business.id}`, 'true');
      } catch (e) {
        console.warn('Could not set review localStorage flag', e);
      }
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-[#EDE8E0] rounded-xl p-5 bg-[#FAF8F5]">
      {submitted ? (
        <div className="bg-[#E8F1EB] rounded-xl p-5 text-[#0F4C2E] text-[15px] border border-[#0F4C2E]/20">
          <div className="font-bold mb-1">
            {lang === 'nl' ? 'Hartelijk dank!' : 'Vielen Dank!'}
          </div>
          <p className="m-0 leading-relaxed">
            {lang === 'nl' 
              ? 'Bedankt voor uw beoordeling! Deze wordt na een korte controle door de redactie gepubliceerd.' 
              : 'Danke für deine Bewertung! Sie wird nach einer kurzen Prüfung durch die Redaktion freigeschaltet.'}
          </p>
        </div>
      ) : alreadyReviewed ? (
        <div className="bg-emerald-50/70 rounded-xl p-4 text-[#0F4C2E] text-[14px] border border-emerald-200/50 flex items-center gap-3">
          <span className="text-xl">✓</span>
          <p className="m-0 leading-relaxed font-medium">
            {t("alreadyReviewed")}
          </p>
        </div>
      ) : (
        <>
          <div className="font-display font-semibold text-[16px] text-[#1B211D] mb-3">
            {lang === 'nl' ? 'Eigen beoordeling schrijven' : 'Eigene Bewertung schreiben'}
          </div>

          {/* Star rating selector */}
          <div className="mb-3.5">
            <div className="text-xs font-semibold text-[#5F6B63] mb-1">
              {lang === 'nl' ? 'Uw waardering *' : 'Deine Bewertung *'}
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  type="button"
                  className="border-none bg-transparent cursor-pointer text-[28px] leading-none p-0 transition-transform hover:scale-110"
                  style={{ color: star <= (hoverRating || rating) ? '#F2761B' : '#E7E2DA' }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} Sterne`}
                >
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span className="text-xs font-semibold text-[#5F6B63] ml-2">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Author Name */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-[#5F6B63] mb-1">
              {lang === 'nl' ? 'Uw naam *' : 'Dein Name *'}
            </label>
            <input 
              type="text"
              placeholder={lang === 'nl' ? 'Uw naam (bijv. Jan Jansen)' : 'Dein Name (z. B. Michael S.)'}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full border border-[#E7E2DA] rounded-lg px-3.5 py-2.5 text-[14.5px] bg-white outline-none focus:border-[#0F4C2E] focus:ring-1 focus:ring-[#0F4C2E] transition-all"
            />
          </div>

          {/* Review Text */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-[#5F6B63] mb-1">
              {lang === 'nl' ? 'Ervaringsverslag (optioneel)' : 'Erfahrungsbericht (optional)'}
            </label>
            <textarea 
              rows={3} 
              placeholder={lang === 'nl' ? 'Optioneel: Hoe waren uw ervaringen? Wat vond u goed of wat kan beter?' : 'Optional: Wie waren deine Erfahrungen? Was hat dir besonders gefallen?'}
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              className="w-full border border-[#E7E2DA] rounded-lg px-3.5 py-2.5 text-[14.5px] bg-white resize-y outline-none focus:border-[#0F4C2E] focus:ring-1 focus:ring-[#0F4C2E] transition-all"
            ></textarea>
          </div>

          {/* Image Upload Area (Max 3 Images) */}
          <div className="mb-4">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileChange}
              disabled={selectedImages.length >= 3 || isSubmitting}
            />

            {/* Preview Grid */}
            {selectedImages.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-2.5">
                {selectedImages.map((img, idx) => (
                  <div key={img.id} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-[#EDE8E0] shadow-xs bg-black/5">
                    <img 
                      src={img.previewUrl} 
                      alt={`Upload ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      disabled={isSubmitting}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full cursor-pointer transition-colors shadow-sm"
                      title={t("removePhoto")}
                      aria-label={t("removePhoto")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded font-mono">
                      {idx + 1}/3
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Photos Button */}
            {selectedImages.length < 3 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#D8D2C8] bg-white hover:bg-[#F3F0EA] hover:border-[#0F4C2E] text-[#5F6B63] hover:text-[#0F4C2E] text-xs font-medium cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4 text-[#0F4C2E]" />
                <span>
                  {t("addPhotos")} ({selectedImages.length}/3)
                </span>
              </button>
            )}
            <p className="text-[11.5px] text-[#8A928B] mt-1.5 mb-0">
              {t("photosHint")}
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="button"
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#0F4C2E] hover:bg-[#06301C] disabled:bg-gray-400 text-white border-none rounded-lg px-6 py-2.5 text-[14.5px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("uploadingPhotos")}</span>
              </>
            ) : (
              <span>{t("submitReview")}</span>
            )}
          </button>
        </>
      )}
    </div>
  );
}
