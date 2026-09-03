import * as React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, 
  Film, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Play, 
  Sparkles, 
  ArrowRight, 
  Utensils, 
  IndianRupee,
  FileVideo
} from 'lucide-react';
import { foodAPI } from '../../services/api';
import { toast } from 'react-toastify';

export interface FoodReelDropzoneProps {
  onSuccess?: () => void;
  onClose?: () => void;
  className?: string;
}

export const FoodReelDropzone: React.FC<FoodReelDropzoneProps> = ({
  onSuccess,
  onClose,
  className = ''
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'reel'
  });

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      toast.error('Please upload a video or image file.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size exceeds 100MB limit.');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a food video reel or dish photo to upload.');
      return;
    }

    if (!formData.name.trim() || !formData.price) {
      toast.error('Please enter dish name and price.');
      return;
    }

    try {
      setIsUploading(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description || 'Delicious culinary creation');
      submitData.append('price', formData.price);
      submitData.append('type', formData.type);
      submitData.append('media', selectedFile);

      await foodAPI.addFood(submitData);

      toast.success('Food Reel uploaded successfully! Processing in background...');
      handleRemoveFile();
      setFormData({ name: '', description: '', price: '', type: 'reel' });
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err?.response?.data?.message || 'Failed to upload reel. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto space-y-5 text-slate-900 dark:text-white ${className}`}>
      {/* Partner Studio Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] flex items-center justify-center text-white shadow-lg shadow-[#EA580C]/30">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white">
                Creator Studio Dropzone
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Partner Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Publish high-definition food reels to local hungry diners
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            navigate('/partner/addfood');
            onClose?.();
          }}
          type="button"
          className="text-xs font-semibold text-[#EA580C] dark:text-[#F59E0B] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Full Editor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Interactive Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`relative w-full rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
            isDragging
              ? 'border-[#EA580C] bg-[#EA580C]/10 dark:bg-[#EA580C]/15 scale-[1.01]'
              : selectedFile
              ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10'
              : 'border-slate-300 dark:border-slate-700/80 hover:border-[#EA580C]/70 dark:hover:border-[#F59E0B]/70 bg-slate-50/60 dark:bg-[#0E1424]/80 backdrop-blur-xl cursor-pointer'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {selectedFile && previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4"
              >
                {/* Media preview thumbnail */}
                <div className="relative w-36 h-48 sm:w-44 sm:h-52 rounded-2xl overflow-hidden bg-black shadow-lg shrink-0 border border-white/10">
                  {selectedFile.type.startsWith('video/') ? (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Reel preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* File details & Change action */}
                <div className="flex-1 w-full space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Ready to publish
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Media'}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-[#EA580C] dark:text-[#F59E0B] hover:underline"
                    >
                      Choose a different file
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 px-6 sm:py-14 sm:px-8 text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#EA580C]/15 via-[#F59E0B]/15 to-[#38BDF8]/10 dark:from-[#EA580C]/25 dark:via-[#F59E0B]/20 dark:to-[#0F172A] border border-amber-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-[#EA580C] dark:text-[#FB923C]" />
                </div>

                <div className="space-y-1 max-w-sm">
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Drag &amp; drop your Food Reel video here
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supports MP4, MOV, WebM (up to 100MB) or appetizing 4K dish photos
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-200/80 dark:bg-[#1A2338] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-[#EA580C] hover:text-white dark:hover:bg-[#EA580C] transition-colors">
                  <FileVideo className="w-3.5 h-3.5" />
                  <span>Browse local files</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Dish Meta Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-[#EA580C]" />
              <span>Dish Name *</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Sizzling Paneer Tikka"
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#EA580C]/70"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-[#F59E0B]" />
              <span>Price (₹) *</span>
            </label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g. 299"
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#EA580C]/70"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Caption &amp; Ingredients Note (Optional)
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell foodies what makes this dish special..."
            className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#EA580C]/70"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#EA580C]/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading Food Reel...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Publish Food Reel to Discovery Feed</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodReelDropzone;

