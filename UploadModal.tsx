import React, { useState } from 'react';
import { Lock, Image as ImageIcon, X, AlertCircle, Camera, Video, Type } from 'lucide-react';
import { Translation, Language, Announcement } from '../types';
import { ADMIN_PASSWORD } from '../constants';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (announcement: Announcement) => void;
  t: Translation;
  lang: Language;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, t, lang }) => {
  const [step, setStep] = useState<'password' | 'form'>('password');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [useUrl, setUseUrl] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setStep('form');
      setError('');
    } else {
      setError(t.invalid_password || 'Invalid Password');
    }
  };


  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          const finalScale = scaleSize < 1 ? scaleSize : 1;
          canvas.width = img.width * finalScale;
          canvas.height = img.height * finalScale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message && !mediaFile && !videoUrl) return;

    setIsProcessing(true);
    setError('');

    try {
      let mediaUrl = useUrl ? videoUrl : null;
      let mediaType: 'image' | 'video' | 'none' = useUrl ? 'video' : 'none';

      if (!useUrl && mediaFile) {
        const isVideo = mediaFile.type.startsWith('video/');
        mediaType = isVideo ? 'video' : 'image';

        if (isVideo) {
          // Warning for raw videos in GitHub
          if (mediaFile.size > 20 * 1024 * 1024) throw new Error("Video is too large for GitHub. Please use a YouTube link instead.");
          mediaUrl = await fileToBase64(mediaFile);
        } else {
          // COMPRESS PHOTO
          mediaUrl = await compressImage(mediaFile);
        }
      }

      const newAnnouncement: Announcement = {
        id: Date.now(),
        message,
        mediaUrl,
        mediaType,
        timestamp: new Date()
      };

      onUpload(newAnnouncement);
      resetAndClose();
    } catch (err: any) {
      setError(err.message || "Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAndClose = () => {
    setStep('password');
    setPassword('');
    setMessage('');
    setMediaFile(null);
    setError('');
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="bg-saffron-600 p-4 flex justify-between items-center text-white">
          <h3 className={`font-bold text-lg ${lang === Language.MR ? 'font-marathi' : ''}`}>
            {step === 'password' ? t.password_required : t.admin_upload}
          </h3>
          <button onClick={resetAndClose} className="hover:bg-saffron-700 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex justify-center mb-4 text-saffron-600">
                <div className="bg-saffron-100 p-4 rounded-full">
                  <Lock size={40} />
                </div>
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.enter_password}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-saffron-600 text-white py-2 rounded-lg font-bold hover:bg-saffron-700 transition-colors"
              >
                {t.submit}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <Type size={16} /> {t.caption_message || "Caption / Message"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.write_message}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none h-28 resize-none"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUseUrl(false)}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${!useUrl ? 'bg-white shadow-sm text-saffron-600' : 'text-gray-500'}`}
                >
                  {t.upload_file || "File Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => setUseUrl(true)}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${useUrl ? 'bg-white shadow-sm text-saffron-600' : 'text-gray-500'}`}
                >
                  {t.youtube_link || "YouTube Link"}
                </button>
              </div>

              {!useUrl ? (
                <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isProcessing}
                  />
                  <div className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-saffron-600 transition-colors">
                    {mediaFile ? (
                      <>
                        {mediaFile.type.startsWith('video/') ? (
                          <Video className="text-saffron-600" size={32} />
                        ) : (
                          <ImageIcon className="text-saffron-600" size={32} />
                        )}
                        <span className="text-sm font-medium text-saffron-700 truncate max-w-[200px]">{mediaFile.name}</span>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-2"><Camera size={32} /><Video size={32} /></div>
                        <span className="text-sm font-medium">{t.upload_media}</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Video className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste YouTube Video URL here..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 italic">Recommended for large videos to save storage.</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={isProcessing}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={(!message && !mediaFile) || isProcessing}
                  className="flex-1 bg-saffron-600 text-white py-2 rounded-lg font-bold hover:bg-saffron-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {t.saving || "Saving..."}
                    </>
                  ) : (
                    t.submit
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;