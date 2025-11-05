import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Brain, Camera, Trophy, Users, Target, 
  BarChart, MessageCircle, Clock, Star, Award, Zap,
  CheckCircle, XCircle, AlertCircle, TrendingUp, Video, PlayCircle
} from 'lucide-react';

// Komponentleri import et
import Dashboard from './components/Dashboard';
import ReflexLearning from './components/ReflexLearning';
import PhotoSolver from './components/PhotoSolver';
import AITeacher from './components/AITeacher';
import ComprehensiveExams from './components/ComprehensiveExams';
import Community from './components/Community';
import ProgressTracking from './components/ProgressTracking';
import VideoLibrary from './components/VideoLibrary'; // YENİ!
import AdaptiveVideoPlayer from './components/AdaptiveVideoPlayer'; // YENİ!

/**
 * MACIGSCOOL - TAM ENTEGRE PLATFORM
 * 
 * Özellikler:
 * - AI Personality (DopingHafıza tarzı)
 * - Photo Solver (Fotoğraftan soru çözme)
 * - Comprehensive Exam (Kapsamlı sınav)
 * - Reflex Learning (Refleks öğrenme)
 * - Live Metrics (Canlı metrikler)
 * - Vizyon AI
 * - Adaptif Video Sistemi ⭐ YENİ
 */
const MacigscoolApp = () => {
  // Kullanıcı durumu ve oturum yönetimi
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [learningData, setLearningData] = useState({
    xp: 0,
    level: 1,
    completedReflexes: [],
    currentStreak: 0,
    achievements: [],
    totalVideos: 0, // YENİ
    videoWatchTime: 0, // YENİ
    videoCompletionRate: 0 // YENİ
  });

  // Video tamamlama callback'i
  const handleVideoComplete = (videoId) => {
    console.log('Video tamamlandı:', videoId);
    
    // Learning data güncelle
    setLearningData(prev => ({
      ...prev,
      totalVideos: prev.totalVideos + 1,
      xp: prev.xp + 50 // Video başına XP
    }));

    // Achievement kontrolü
    checkVideoAchievements();
  };

  // Video achievement'leri kontrol et
  const checkVideoAchievements = () => {
    const { totalVideos } = learningData;
    
    const videoAchievements = [
      { count: 1, name: 'İlk Video', icon: '🎬' },
      { count: 10, name: 'Video Aşığı', icon: '📺' },
      { count: 50, name: 'Video Master', icon: '🏆' },
      { count: 100, name: 'Video Efsanesi', icon: '👑' }
    ];

    videoAchievements.forEach(achievement => {
      if (totalVideos === achievement.count) {
        showAchievement(achievement);
      }
    });
  };

  const showAchievement = (achievement) => {
    // Toast notification veya modal göster
    console.log('🎉 Yeni Başarı:', achievement.name);
  };

  // Platform içindeki farklı bölümler arasında geçiş yapan fonksiyon
  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard userData={learningData} />;
      
      case 'learning':
        return <ReflexLearning />;
      
      case 'photoSolver':
        return <PhotoSolver />;
      
      case 'aiTeacher':
        return <AITeacher />;
      
      case 'exams':
        return <ComprehensiveExams onQuizComplete={handleQuizComplete} />;
      
      case 'community':
        return <Community />;
      
      case 'progress':
        return <ProgressTracking userData={learningData} />;
      
      case 'videos': // YENİ!
        return <VideoLibrary onVideoComplete={handleVideoComplete} />;
      
      default:
        return <Dashboard userData={learningData} />;
    }
  };

  // Quiz tamamlandığında - video üretimini tetikle
  const handleQuizComplete = async (results) => {
    console.log('Quiz tamamlandı:', results);
    
    try {
      // Video üretimi tetikle
      const response = await fetch('/api/video/quiz-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          topic_id: results.topicId,
          quiz_score: results.score,
          correct_answers: results.correctAnswers,
          total_questions: results.totalQuestions,
          time_spent_seconds: results.duration,
          mistakes: results.mistakes
        })
      });

      if (response.ok) {
        // Başarı bildirimi
        showNotification({
          type: 'success',
          title: 'Video Hazırlanıyor! 🎬',
          message: 'Senin için özel video ~5 dakika içinde hazır olacak'
        });

        // Video bölümüne yönlendir
        setTimeout(() => {
          setActiveSection('videos');
        }, 2000);
      }
    } catch (error) {
      console.error('Video tetikleme hatası:', error);
    }

    // XP güncelle
    setLearningData(prev => ({
      ...prev,
      xp: prev.xp + results.score
    }));
  };

  const showNotification = ({ type, title, message }) => {
    // Notification sistemi (toast, modal vb.)
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Üst navigasyon çubuğu */}
      <NavigationBar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        user={user}
        learningData={learningData}
      />
      
      {/* Ana içerik alanı */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Alt bilgi çubuğu */}
      <Footer />
    </div>
  );
};

// Navigasyon bileşeni - Platformun farklı bölümlerine erişim sağlar
const NavigationBar = ({ activeSection, setActiveSection, user, learningData }) => {
  const navItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: BarChart, color: 'indigo' },
    { id: 'learning', label: 'Öğrenme', icon: Brain, color: 'purple' },
    { id: 'videos', label: 'Kişisel Videolarım', icon: Video, color: 'pink', badge: learningData.totalVideos }, // YENİ!
    { id: 'photoSolver', label: 'Fotoğraf Çözücü', icon: Camera, color: 'blue' },
    { id: 'aiTeacher', label: 'AI Öğretmen', icon: MessageCircle, color: 'green' },
    { id: 'exams', label: 'Sınavlar', icon: Target, color: 'red' },
    { id: 'community', label: 'Topluluk', icon: Users, color: 'orange' },
    { id: 'progress', label: 'İlerleme', icon: TrendingUp, color: 'teal' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Macigscool
            </span>
            <span className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full font-semibold">
              + Video AI
            </span>
          </div>

          {/* Navigasyon menüsü */}
          <div className="hidden md:flex space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg
                    transition-all duration-200 group
                    ${isActive 
                      ? `bg-${item.color}-100 text-${item.color}-700` 
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  
                  {/* Badge (video sayısı vb.) */}
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}

                  {/* Video bölümü için özel işaret */}
                  {item.id === 'videos' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kullanıcı bilgisi */}
          <div className="flex items-center space-x-4">
            {/* XP Göstergesi */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-700">
                {learningData.xp} XP
              </span>
            </div>

            {/* Seviye */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <Star className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-bold text-purple-700">
                Seviye {learningData.level}
              </span>
            </div>

            {/* Profil */}
            {user ? (
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'M'}
              </div>
            ) : (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Giriş Yap
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobil menü (responsive) */}
      <div className="md:hidden border-t border-gray-200 px-4 py-2 overflow-x-auto">
        <div className="flex space-x-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  relative flex flex-col items-center justify-center min-w-[70px] p-2 rounded-lg
                  ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}
                `}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs whitespace-nowrap">{item.label}</span>
                
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

// Alt bilgi bileşeni
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve açıklama */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-xl font-bold">Macigscool</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI destekli, kişiselleştirilmiş eğitim platformu. 
              Artık hipnotik video sistemi ile!
            </p>
            <div className="flex space-x-3">
              <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">
                AI Powered
              </span>
              <span className="px-2 py-1 bg-pink-900 text-pink-300 rounded text-xs">
                Video AI ⭐
              </span>
            </div>
          </div>

          {/* Özellikler */}
          <div>
            <h3 className="font-semibold mb-4">Özellikler</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Refleks Öğrenme</li>
              <li className="hover:text-white cursor-pointer">Fotoğraf Çözücü</li>
              <li className="hover:text-white cursor-pointer">AI Öğretmen</li>
              <li className="hover:text-white cursor-pointer flex items-center">
                <Video className="w-3 h-3 mr-1" />
                Kişisel Videolar ⭐
              </li>
              <li className="hover:text-white cursor-pointer">Kapsamlı Sınavlar</li>
            </ul>
          </div>

          {/* Kaynak */}
          <div>
            <h3 className="font-semibold mb-4">Kaynaklar</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Dokümantasyon</li>
              <li className="hover:text-white cursor-pointer">Video Rehberi</li>
              <li className="hover:text-white cursor-pointer">API Referansı</li>
              <li className="hover:text-white cursor-pointer">Topluluk</li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@macigscool.com</li>
              <li>Destek: 7/24</li>
              <li className="flex items-center space-x-2 mt-4">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-gray-500">2025 En İyi EdTech</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt satır */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2025 Macigscool. Tüm hakları saklıdır.</p>
          <p className="mt-2 text-xs">
            Yapay zeka destekli adaptif video sistemi ile güçlendirildi 🚀
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MacigscoolApp;
