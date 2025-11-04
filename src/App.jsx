import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  BookOpen, 
  Brain, 
  Camera, 
  Users, 
  Trophy, 
  Star, 
  Play, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Award,
  MessageCircle,
  Zap,
  Globe,
  Shield,
  Heart,
  X,
  Send,
  Upload,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  User,
  BarChart3,
  Gamepad2,
  Lightbulb,
  FileText,
  Video,
  HelpCircle,
  ChevronRight,
  Smile,
  ThumbsUp,
  Frown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Import images
import logoImage from './assets/macigscool_logo.png'
import heroImage from './assets/hero_image.png'
import aiTutorImage from './assets/ai_tutor_avatar.png'
import aiTutorTalking1 from './assets/ai_tutor_talking_1.png'
import aiTutorTalking2 from './assets/ai_tutor_talking_2.png'

// AI Tutor Chat Component with Animation
const AITutorChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', content: 'Merhaba! Ben senin kişisel AI öğretmenin. Hangi konuda yardıma ihtiyacın var?', timestamp: new Date() }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState(aiTutorImage)
  const [isAnimating, setIsAnimating] = useState(false)

  // Avatar animation for speaking
  useEffect(() => {
    if (isSpeaking && !isAnimating) {
      setIsAnimating(true)
      const animationInterval = setInterval(() => {
        setCurrentAvatar(prev => {
          if (prev === aiTutorImage) return aiTutorTalking1
          if (prev === aiTutorTalking1) return aiTutorTalking2
          return aiTutorImage
        })
      }, 300)

      setTimeout(() => {
        clearInterval(animationInterval)
        setCurrentAvatar(aiTutorImage)
        setIsAnimating(false)
      }, 3000)

      return () => clearInterval(animationInterval)
    }
  }, [isSpeaking, isAnimating])

  // Text-to-Speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'tr-TR'
      utterance.rate = 0.9
      utterance.pitch = 1.1
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      
      speechSynthesis.speak(utterance)
    }
  }

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')

    // Simulate AI response with speech
    setTimeout(() => {
      const responses = [
        'Bu çok iyi bir soru! Sokratik yöntemle birlikte düşünelim. Bu konuyu nasıl yaklaşırsın? İlk adım ne olabilir?',
        'Harika! Bu konuda ne biliyorsun? Önce kendi düşüncelerini paylaş, sonra birlikte derinleştirelim.',
        'Mükemmel bir başlangıç! Bu problemi çözmek için hangi yöntemleri kullanabiliriz? Sen ne düşünüyorsun?',
        'Çok güzel! Bu konuda daha önce benzer bir problemle karşılaştın mı? Nasıl yaklaştın?'
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: randomResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiResponse])
      speakText(randomResponse)
    }, 1000)
  }

  const toggleListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.lang = 'tr-TR'
      recognition.continuous = false
      recognition.interimResults = false

      if (!isListening) {
        setIsListening(true)
        recognition.start()

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputMessage(transcript)
          setIsListening(false)
        }

        recognition.onerror = () => {
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }
      } else {
        recognition.stop()
        setIsListening(false)
      }
    } else {
      // Fallback for browsers that don't support speech recognition
      setIsListening(!isListening)
      if (!isListening) {
        setTimeout(() => {
          setInputMessage('Matematik problemini çözemiyorum')
          setIsListening(false)
        }, 2000)
      }
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      const lastAiMessage = messages.filter(m => m.type === 'ai').pop()
      if (lastAiMessage) {
        speakText(lastAiMessage.content)
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex"
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
        >
          {/* AI Avatar Section with Animation */}
          <div className="w-1/3 bg-gradient-to-br from-blue-600 to-purple-700 rounded-l-lg p-6 flex flex-col items-center justify-center text-white">
            <div className="relative mb-6">
              <motion.img 
                src={currentAvatar} 
                alt="AI Öğretmen" 
                className="w-32 h-32 rounded-full border-4 border-white/20"
                animate={{ 
                  scale: isSpeaking ? [1, 1.05, 1] : 1,
                }}
                transition={{ 
                  duration: 0.3,
                  repeat: isSpeaking ? Infinity : 0,
                  repeatType: "reverse"
                }}
              />
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                isSpeaking ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                <div className={`w-3 h-3 bg-white rounded-full ${
                  isSpeaking ? 'animate-pulse' : ''
                }`}></div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">AI Öğretmen Ayşe</h3>
            <p className="text-blue-100 text-center text-sm mb-4">
              Sokratik yöntemle öğreten, empatik AI öğretmeniniz
            </p>
            
            <div className="flex space-x-2 mb-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-white border-white/30 hover:bg-white/10"
                onClick={toggleSpeaking}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-white border-white/30 hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-blue-200 text-center">
              <p>🎯 Duygusal Zeka Aktif</p>
              <p>🧠 Sokratik Yöntem</p>
              <p>🎮 Adaptif Oyunlaştırma</p>
              <p className={isSpeaking ? 'text-green-300' : ''}>
                {isSpeaking ? '🔊 Konuşuyor...' : '🎤 Dinliyor...'}
              </p>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">AI Öğretmen ile Sohbet</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isSpeaking && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm">Sesli yanıt veriyor...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Sorunuzu yazın..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleListening}
                  className={isListening ? 'bg-red-100 text-red-600' : ''}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button onClick={sendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {isListening && (
                <p className="text-sm text-red-600 mt-2 flex items-center">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
                  Dinliyor... Lütfen konuşun
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Photo Solver Component
const PhotoSolver = ({ isOpen, onClose }) => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [solution, setSolution] = useState(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
        setIsAnalyzing(true)
        
        // Simulate AI analysis
        setTimeout(() => {
          setIsAnalyzing(false)
          setSolution({
            problem: "2x + 5 = 13",
            steps: [
              "Önce 5'i her iki taraftan çıkaralım",
              "2x = 13 - 5",
              "2x = 8",
              "Her iki tarafı 2'ye bölelim",
              "x = 4"
            ],
            explanation: "Bu bir birinci dereceden denklemdir. Bilinmeyeni yalnız bırakmak için adım adım işlem yapıyoruz."
          })
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Fotoğraftan Anında Çözüm</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {!uploadedImage ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Soru Fotoğrafı Yükleyin</h3>
                  <p className="text-gray-600 mb-4">
                    Matematik, fizik, kimya veya herhangi bir ders sorusunun fotoğrafını çekin
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Fotoğraf Yükle
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Uploaded Image */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Yüklenen Soru</h3>
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded problem" 
                    className="w-full h-64 object-contain border rounded-lg"
                  />
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sokratik Çözüm</h3>
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>AI soruyu analiz ediyor...</p>
                      </div>
                    </div>
                  ) : solution ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900">Tespit Edilen Problem:</h4>
                        <p className="text-blue-800">{solution.problem}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Adım Adım Çözüm:</h4>
                        <ol className="space-y-2">
                          {solution.steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900">Açıklama:</h4>
                        <p className="text-green-800">{solution.explanation}</p>
                      </div>

                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        AI Öğretmenle Bu Konuyu Derinleştir
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Adaptive Learning Dashboard
const AdaptiveDashboard = ({ isOpen, onClose }) => {
  const [studentData] = useState({
    name: "Ahmet Yılmaz",
    level: "11. Sınıf",
    emotionalState: "Motivasyonlu",
    learningStyle: "Görsel",
    progress: {
      matematik: 75,
      fizik: 60,
      kimya: 80,
      biyoloji: 65
    },
    achievements: [
      { name: "Problem Çözücü", icon: "🧩", date: "Bugün" },
      { name: "Sebat Ödülü", icon: "💪", date: "Dün" },
      { name: "Sokratik Düşünür", icon: "🤔", date: "2 gün önce" }
    ],
    weeklyGoals: [
      { task: "Türev konusunu tamamla", progress: 80 },
      { task: "10 fizik problemi çöz", progress: 60 },
      { task: "Kimya denklemi denge", progress: 90 }
    ]
  })

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col"
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Adaptif Öğrenme Paneli</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student Profile */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Öğrenci Profili
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold">{studentData.name}</p>
                      <p className="text-gray-600">{studentData.level}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Smile className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Duygusal Durum: {studentData.emotionalState}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Öğrenme Stili: {studentData.learningStyle}</span>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Son Başarılar</h4>
                      <div className="space-y-2">
                        {studentData.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{achievement.icon} {achievement.name}</span>
                            <span className="text-gray-500">{achievement.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Charts */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Ders Bazlı İlerleme
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(studentData.progress).map(([subject, progress]) => (
                        <div key={subject}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium capitalize">{subject}</span>
                            <span className="text-sm text-gray-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Haftalık Hedefler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentData.weeklyGoals.map((goal, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{goal.task}</span>
                            <span className="text-sm text-gray-600">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-green-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Main App Component
function App() {
  const [isVisible, setIsVisible] = useState(false)
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false)
  const [isPhotoSolverOpen, setIsPhotoSolverOpen] = useState(false)
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Brain,
      title: "A.I.T.O. - Sokratik AI Öğretmen",
      description: "Cevap vermeyen, düşündüren yapay zeka. Sokratik yöntemle eleştirel düşünce geliştiren, duygusal zekaya sahip kişisel öğretmeniniz.",
      color: "text-blue-600",
      action: () => setIsAiTutorOpen(true)
    },
    {
      icon: Camera,
      title: "Çözücü 2.0 - Sokratik Fotoğraf Çözümü",
      description: "Fotoğraf çektiğiniz soruları adım adım çözmeyi öğreten, cevap vermeyen rehberli öğrenme sistemi.",
      color: "text-orange-600",
      action: () => setIsPhotoSolverOpen(true)
    },
    {
      icon: Target,
      title: "Adaptif Oyunlaştırma Motoru",
      description: "Duygusal durumunuza göre dinamik olarak ayarlanan görevler, ödüller ve motivasyon sistemi.",
      color: "text-green-600",
      action: () => setIsDashboardOpen(true)
    },
    {
      icon: Trophy,
      title: "Hiper-Kişiselleştirilmiş Öğrenme",
      description: "Bilişsel yük, öğrenme hızı ve duygusal durumunuza göre tamamen size özel öğrenme deneyimi.",
      color: "text-purple-600",
      action: () => setIsDashboardOpen(true)
    }
  ]

  const examTypes = [
    { name: "YKS (TYT/AYT)", description: "Üniversite Sınavı", students: "500K+", active: true },
    { name: "LGS", description: "Lise Geçiş Sınavı", students: "300K+", active: true },
    { name: "KPSS", description: "Kamu Personel Sınavı", students: "200K+", active: true },
    { name: "DGS", description: "Dikey Geçiş Sınavı", students: "150K+", active: true },
    { name: "ALES", description: "Lisansüstü Sınavı", students: "100K+", active: true },
    { name: "Sınıf Bazlı", description: "1-12. Sınıf Desteği", students: "1M+", active: true }
  ]

  const stats = [
    { number: "1M+", label: "Aktif Öğrenci", icon: Users },
    { number: "50K+", label: "Video Ders", icon: Play },
    { number: "100K+", label: "Çözümlü Soru", icon: CheckCircle },
    { number: "99%", label: "Başarı Oranı", icon: Trophy }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img src={logoImage} alt="Macigscool" className="h-10 w-auto" />
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Özellikler</a>
              <a href="#exams" className="text-gray-700 hover:text-blue-600 transition-colors">Sınavlar</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Hakkımızda</a>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsDashboardOpen(true)}
              >
                Ücretsiz Başla
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Sparkles className="w-4 h-4 mr-1" />
                Türkiye'nin En Gelişmiş Empatik AI Eğitim Platformu
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Dünyanın En İyi
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">
                  {" "}Sınava Hazırlık{" "}
                </span>
                Platformu
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sokratik AI öğretmen, empatik avatar ve adaptif oyunlaştırma ile 
                sınavlarda başarıya ulaşın. Tamamen ücretsiz, tamamen Türkçe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
                  onClick={() => setIsAiTutorOpen(true)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  AI Öğretmenle Başla
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4"
                  onClick={() => setIsPhotoSolverOpen(true)}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Fotoğraf Çözücü Dene
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-600" />
                  100% Ücretsiz
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 text-blue-600" />
                  Tamamen Türkçe
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-red-600" />
                  Empatik AI
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src={heroImage} 
                alt="Öğrenciler AI ile öğreniyor" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">A.I.T.O. Aktif</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200">
              <Zap className="w-4 h-4 mr-1" />
              Devrimsel Özellikler
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden Macigscool?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Doping Hafıza'nın içerik gücünü, devrimsel AI teknolojisiyle birleştirerek 
              öğrenmeyi tamamen yeniden tanımlıyoruz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${feature.color.replace('text', 'bg').replace('600', '100')}`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed mb-4">
                      {feature.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={feature.action}
                    >
                      Deneyin
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tutor Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
                <Brain className="w-4 h-4 mr-1" />
                A.I.T.O. Teknolojisi
              </Badge>
              
              <h2 className="text-4xl font-bold mb-6">
                Empatik AI Öğretmeninizle Tanışın
              </h2>
              
              <p className="text-xl mb-8 text-blue-100">
                Cevap vermeyen, düşündüren AI. Duygusal durumunuzu anlayan, 
                Sokratik yöntemle öğreten devrimsel eğitim deneyimi.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Duygusal hesaplama ile empati</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Sokratik sorgulama yöntemi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Adaptif zorluk ayarı</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Gerçek zamanlı ses ve animasyon</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => setIsAiTutorOpen(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                A.I.T.O. ile Konuş
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <img 
                  src={aiTutorImage} 
                  alt="AI Öğretmen Avatar" 
                  className="w-full h-auto rounded-xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                Canlı Demo
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section id="exams" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              <Award className="w-4 h-4 mr-1" />
              Sınav Hazırlığı
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tüm Sınavlar İçin Eksiksiz Hazırlık
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Doping Hafıza'nın kapsamlı içeriği + Devrimsel AI teknolojisi = 
              Türkiye'nin en etkili sınav hazırlık platformu
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examTypes.map((exam, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{exam.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{exam.students}</Badge>
                        {exam.active && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <CardDescription>{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Başla
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Sınav Başarınızı Garanti Altına Alın
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-orange-100">
              1 milyon öğrencinin tercih ettiği platform ile hayalinizdeki üniversiteye adım atın.
              Tamamen ücretsiz, tamamen Türkçe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4"
                onClick={() => setIsAiTutorOpen(true)}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Hemen Başla
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                onClick={() => setIsDashboardOpen(true)}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Demo İzle
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src={logoImage} alt="Macigscool" className="h-8 w-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Türkiye'nin en gelişmiş AI destekli eğitim platformu. 
                Sokratik öğrenme ile sınavlarda başarıya ulaşın.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">y</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">A.I.T.O. AI Öğretmen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fotoğraf Çözücü</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Adaptif Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Oyunlaştırma</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Sınavlar</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">YKS (TYT/AYT)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">KPSS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DGS & ALES</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Macigscool. Tüm hakları saklıdır. Türkiye'nin en gelişmiş AI eğitim platformu.</p>
          </div>
        </div>
      </footer>

      {/* Modal Components */}
      <AITutorChat isOpen={isAiTutorOpen} onClose={() => setIsAiTutorOpen(false)} />
      <PhotoSolver isOpen={isPhotoSolverOpen} onClose={() => setIsPhotoSolverOpen(false)} />
      <AdaptiveDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
    </div>
  )
}

export default App

