import React, { useState, useEffect } from 'react';
import { Video, Clock, Eye, TrendingUp, Sparkles } from 'lucide-react';
import api from '../services/api';
import AdaptiveVideoPlayer from './AdaptiveVideoPlayer';

/**
 * VideoLibrary - Öğrencinin kişisel video kütüphanesi
 * 
 * Özellikler:
 * - Video listesi
 * - Filtreleme (konu, tarih)
 * - İzleme durumu
 * - Skor geliştirme gösterimi
 */
const VideoLibrary = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadVideos();
    loadStats();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/video/list');
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Video listesi yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/video/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleVideoComplete = () => {
    // Video tamamlandığında listeyi güncelle
    loadVideos();
    loadStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Videolar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kişisel Video Kütüphanem 🎬
        </h1>
        <p className="text-gray-600">
          Sana özel hazırlanmış eğitim videoların
        </p>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Video className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.total_videos}</span>
            </div>
            <p className="text-purple-100">Toplam Video</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8" />
              <span className="text-3xl font-bold">
                {Math.floor(stats.total_watch_time / 60)}dk
              </span>
            </div>
            <p className="text-blue-100">İzleme Süresi</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-8 h-8" />
              <span className="text-3xl font-bold">{stats.completion_rate}%</span>
            </div>
            <p className="text-green-100">Tamamlama Oranı</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" />
              <span className="text-3xl font-bold">+{stats.average_score_improvement}%</span>
            </div>
            <p className="text-orange-100">Ortalama Gelişim</p>
          </div>
        </div>
      )}

      {/* Video Player veya Video List */}
      {selectedVideo ? (
        <div>
          <button
            onClick={() => setSelectedVideo(null)}
            className="mb-4 text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Video Listesine Dön
          </button>
          <AdaptiveVideoPlayer 
            videoId={selectedVideo.id}
            onComplete={handleVideoComplete}
          />
        </div>
      ) : (
        <div>
          {/* Video Grid */}
          {videos.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Henüz video oluşturulmadı
              </h3>
              <p className="text-gray-600 mb-6">
                İlk quiz'ini tamamla ve sana özel videon hemen hazırlanacak!
              </p>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                Quiz Çöz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleVideoSelect(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img 
                      src={video.thumbnail_url || 'https://via.placeholder.com/320x180'}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                    </div>

                    {/* Status Badge */}
                    {video.status === 'processing' && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Hazırlanıyor...
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {video.topic}
                      </span>
                      <span>•</span>
                      <span>{video.view_count} izlenme</span>
                    </div>

                    <div className="text-xs text-gray-500">
                      {new Date(video.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Nasıl Çalışır?
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✨ Her quiz sonrası sana özel video oluşturulur</li>
              <li>🎯 Videoların senin performansına göre kişiselleştirilir</li>
              <li>🧠 Hipnotik öğretim teknikleri ile hafızanda kalır</li>
              <li>📈 Her video sonrası skorun yükselir</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLibrary;
