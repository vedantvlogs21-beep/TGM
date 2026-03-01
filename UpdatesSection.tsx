import React from 'react';
import { Translation, Language, Announcement } from '../types';
import { Calendar, Video, Image as ImageIcon } from 'lucide-react';

interface UpdatesSectionProps {
    announcements: Announcement[];
    t: Translation;
    lang: Language;
}

const UpdatesSection: React.FC<UpdatesSectionProps> = ({ announcements, t, lang }) => {
    if (announcements.length === 0) return null;

    const getYouTubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    return (
        <section className="py-12 bg-gray-50" id="updates">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-saffron-600 p-2 rounded-lg text-white">
                        <Calendar size={24} />
                    </div>
                    <h2 className={`text-2xl font-bold text-gray-800 ${lang === Language.MR ? 'font-marathi' : ''}`}>
                        {lang === Language.MR ? 'नवीनतम अपडेट' : 'Latest Updates'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {announcements.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">

                            {/* Media Section */}
                            {item.mediaUrl && item.mediaType !== 'none' && (
                                <div className="w-full h-48 bg-black/5 relative group">
                                    {item.mediaType === 'video' ? (
                                        getYouTubeEmbedUrl(item.mediaUrl!) ? (
                                            <iframe
                                                src={getYouTubeEmbedUrl(item.mediaUrl!)!}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <video
                                                src={item.mediaUrl}
                                                controls
                                                className="w-full h-full object-cover"
                                            />
                                        )
                                    ) : (
                                        <img
                                            src={item.mediaUrl}
                                            alt="Update media"
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                    {/* Type Badge */}
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        {item.mediaType === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                        <span className="capitalize">{item.mediaType}</span>
                                    </div>
                                </div>
                            )}

                            {/* Content Section */}
                            <div className="p-5 flex-1 flex flex-col">
                                <p className={`text-gray-700 whitespace-pre-wrap flex-1 ${lang === Language.MR ? 'font-marathi' : ''} ${!item.mediaUrl ? 'text-lg font-medium' : ''}`}>
                                    {item.message}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                                    <span>{t.admin_post}</span>
                                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UpdatesSection;
