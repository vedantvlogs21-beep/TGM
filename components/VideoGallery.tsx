import React, { useState } from 'react';
import { Video, Translation, Language } from '../types';
import { X, Play } from 'lucide-react';

interface VideoGalleryProps {
    videos: Video[];
    t: Translation;
    lang: Language;
    title?: string;
    id?: string;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, t, lang, title, id = "video-gallery" }) => {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [showAll, setShowAll] = useState(false);

    const displayedVideos = showAll ? videos : videos.slice(0, 3);

    return (
        <section className="py-16 px-4 md:px-8 bg-gray-50" id={id}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-5xl font-bold text-saffron-800 mb-4 ${lang === Language.MR ? 'font-marathi' : 'font-sans'}`}>
                        {title || t.video_gallery}
                    </h2>
                    <div className="h-1 w-24 bg-saffron-500 mx-auto rounded-full mb-8"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedVideos.map((video) => (
                        <div
                            key={video.id}
                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group relative"
                            onClick={() => setSelectedVideo(video)}
                        >

                            <div className="relative aspect-video bg-black">
                                {video.type === 'youtube' ? (
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={video.url}
                                        className="w-full h-full object-cover"
                                        muted
                                        preload="metadata"
                                        playsInline
                                        onMouseOver={(e) => e.currentTarget.play()}
                                        onMouseOut={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.currentTime = 0;
                                        }}
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Play className="text-white fill-current ml-1" size={32} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {videos.length > 3 && (
                    <div className="flex justify-center mt-12">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="bg-white border-2 border-saffron-500 text-saffron-600 hover:bg-saffron-600 hover:text-white font-bold py-3 px-8 rounded-full transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl flex items-center gap-2"
                        >
                            <span className={lang === Language.MR ? 'font-marathi text-lg' : 'font-medium'}>
                                {showAll ? t.see_less : t.see_more}
                            </span>
                        </button>
                    </div>
                )}

                {/* Video Modal */}
                {selectedVideo && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
                        role="dialog"
                        aria-modal="true"
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-saffron-400 transition-colors z-[110]"
                            onClick={() => setSelectedVideo(null)}
                            aria-label={t.close_video}
                        >
                            <X size={40} />
                        </button>

                        <div className="absolute inset-0" onClick={() => setSelectedVideo(null)} aria-hidden="true"></div>

                        <div className="w-full max-w-5xl aspect-video relative z-[105] bg-black rounded-xl overflow-hidden shadow-2xl">
                            {selectedVideo.type === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeID(selectedVideo.url)}?autoplay=1`}
                                    title={selectedVideo.title}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video controls autoPlay className="w-full h-full">
                                    <source src={selectedVideo.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// Helper to extract YouTube ID
function getYouTubeID(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default VideoGallery;
