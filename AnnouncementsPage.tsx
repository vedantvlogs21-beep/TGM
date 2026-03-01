import React from 'react';
import { X, Calendar, Image, Video } from 'lucide-react';
import { Announcement, Translation, Language } from '../types';

interface AnnouncementsPageProps {
    isOpen: boolean;
    onClose: () => void;
    announcements: Announcement[];
    t: Translation;
    lang: Language;
}

const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ isOpen, onClose, announcements, t, lang }) => {
    if (!isOpen) return null;

    const getYouTubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    return (
        <div className="fixed inset-0 bg-white z-[100] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-saffron-600 to-saffron-700 text-white shadow-lg z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className={`text-3xl font-bold ${lang === Language.MR ? 'font-marathi' : ''}`}>
                            {t.announcements}
                        </h1>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-all hover:rotate-90 duration-300"
                        >
                            <X size={28} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {announcements.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={48} className="text-gray-300" />
                        </div>
                        <h3 className={`text-xl font-bold text-gray-500 mb-2 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                            {t.no_announcements}
                        </h3>
                        <p className="text-gray-400">Check back later for updates!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {announcements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                            >
                                {/* Media Section */}
                                {announcement.mediaUrl && announcement.mediaType === 'image' && (
                                    <div className="relative bg-gray-50">
                                        <img
                                            src={announcement.mediaUrl}
                                            alt="Announcement"
                                            className="w-full h-auto max-h-[500px] object-contain"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Image size={16} className="text-saffron-600" />
                                            Photo
                                        </div>
                                    </div>
                                )}

                                {announcement.mediaUrl && announcement.mediaType === 'video' && (
                                    <div className="relative bg-gray-50 aspect-video">
                                        {getYouTubeEmbedUrl(announcement.mediaUrl) ? (
                                            <iframe
                                                src={getYouTubeEmbedUrl(announcement.mediaUrl)!}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <video
                                                src={announcement.mediaUrl}
                                                controls
                                                className="w-full h-full"
                                            />
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Video size={16} className="text-saffron-600" />
                                            Video
                                        </div>
                                    </div>
                                )}

                                {/* Content Section */}
                                <div className="p-6">
                                    {/* Timestamp */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Calendar size={16} />
                                        <span>
                                            {t.posted_on} {new Date(announcement.timestamp).toLocaleDateString(lang === Language.MR ? 'mr-IN' : 'en-IN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    {/* Message */}
                                    {announcement.message && (
                                        <p className={`text-gray-800 text-lg leading-relaxed whitespace-pre-wrap ${lang === Language.MR ? 'font-marathi' : ''}`}>
                                            {announcement.message}
                                        </p>
                                    )}
                                </div>

                                {/* Admin Badge */}
                                <div className="px-6 pb-4">
                                    <div className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-700 px-3 py-1 rounded-full text-xs font-bold border border-saffron-200">
                                        <div className="w-2 h-2 bg-saffron-600 rounded-full animate-pulse"></div>
                                        {t.admin_post}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
