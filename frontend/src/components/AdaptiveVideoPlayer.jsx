import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import api from '../services/api';

/**
 * AdaptiveVideoPlayer - Kişiselleştirilmiş video oynatıcı
 * 
 * Özellikler:
 * - Video izleme analitikleri
 * - Pause noktalarını takip
 * - Otomatik ilerleme kaydı
 * - Hipnotik skor gösterimi
 */
const AdaptiveVideoPlayer = ({ videoId, onComplete }) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pauseTimestamps, setPauseTimestamps] = useState([]);
  
  const videoRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/video/${videoId}`);
      setVideo(response.data);
    } catch (error) {
      console.error('Video yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
      
      // Pause timestamp kaydet
      const currentTime = Math.floor(videoRef.current.currentTime);
      setPauseTimestamps(prev => [...prev, currentTime]);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);

      // Her 10 saniyede bir analytics gönder
      const now = Date.now();
      if (now - lastUpdateRef.current > 10000) {
        sendAnalytics(false);
        lastUpdateRef.current = now;
      }
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    sendAnalytics(true);
    if (onComplete) onComplete();
  };

  const sendAnalytics = async (completed) => {
    if (!videoRef.current) return;

    try {
      await api.post(`/video/${videoId}/analytics`, {
        watch_duration: Math.floor(videoRef.current.currentTime),
        watch_percentage: Math.floor(progress),
        pause_timestamps: pauseTimestamps,
        completed: completed
      });
    } catch (error) {
      console.error('Analytics gönderme hatası:', error);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      handlePlay();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg">
        <div className="text-white">Video yükleniyor...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg">
        <div className="text-white">Video bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Video Container */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          className="w-full aspect-video"
          src={video.video_url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          
          {/* Play/Pause Overlay */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlay}
                className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-all transform hover:scale-110"
              >
                <Play className="w-10 h-10 text-white ml-1" />
              </button>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Progress Bar */}
            <div className="relative h-1 bg-gray-600 rounded-full cursor-pointer">
              <div 
                className="absolute h-full bg-purple-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {playing ? (
                  <button onClick={handlePause} className="text-white hover:text-purple-400">
                    <Pause className="w-6 h-6" />
                  </button>
                ) : (
                  <button onClick={handlePlay} className="text-white hover:text-purple-400">
                    <Play className="w-6 h-6" />
                  </button>
                )}

                <button onClick={handleRestart} className="text-white hover:text-purple-400">
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button onClick={toggleMute} className="text-white hover:text-purple-400">
                  {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>

                <span className="text-white text-sm">
                  {Math.floor(progress)}%
                </span>
              </div>

              <button onClick={handleFullscreen} className="text-white hover:text-purple-400">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="mt-4 space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{video.title}</h3>
        
        {video.scenario_metadata && (
          <div className="flex gap-3">
            <div className="px-3 py-1 bg-purple-100 rounded-full text-sm text-purple-700">
              🧠 Hipnotik Skor: {video.scenario_metadata.hipnotik_skor}/100
            </div>
            <div className="px-3 py-1 bg-green-100 rounded-full text-sm text-green-700">
              🎯 Kişiselleştirme: {video.scenario_metadata.kisisellesme}
            </div>
          </div>
        )}

        <p className="text-gray-600 text-sm">
          Süre: {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')} dakika
        </p>
      </div>
    </div>
  );
};

export default AdaptiveVideoPlayer;
