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
  Frown,
  TrendingUp,
  PlayCircle,
  Headphones,
  Eye,
  Cpu,
  Layers
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Import images
import logoImage from './assets/macigscool_logo.png'
import heroImage from './assets/hero_image.png'
import aiTutorImage from './assets/ai_tutor_avatar.png'
import aiTutorTalking1 from './assets/ai_tutor_talking_1.png'
import aiTutorTalking2 from './assets/ai_tutor_talking_2.png'

// API Base URL
const API_BASE = 'http://localhost:5000/api'

// AI Tutor Chat Component with Ultimate Features
const AITutorChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', content: 'Merhaba! Ben senin kişisel AI öğretmenin. Hangi konuda yardıma ihtiyacın var?', timestamp: new Date(), emotion: 'happy' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState(aiTutorImage)
  const [isAnimating, setIsAnimating] = useState(false)
  const [studentEmotion, setStudentEmotion] = useState('neutral')
  const [sessionId] = useState(() => Date.now().toString())

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

  // Emotion detection from text
  const detectEmotion = (text) => {
    const emotions = {
      happy: ['mutlu', 'harika', 'güzel', 'mükemmel', 'başardım', 'anladım'],
      confused: ['anlamadım', 'karışık', 'zor', 'nasıl', 'neden', 'bilmiyorum'],
      frustrated: ['sinir', 'kızgın', 'yapamıyorum', 'imkansız', 'berbat'],
      motivated: ['yaparım', 'başarabilirim', 'denerim', 'çalışırım', 'öğrenirim']
    }
    
    const lowerText = text.toLowerCase()
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion
      }
    }
    return 'neutral'
  }

  // Socratic response generation
  const generateSocraticResponse = (message, emotion) => {
    const socraticResponses = {
      happy: [
        'Harika! Bu başarının sırrı ne olabilir? Nasıl bu sonuca ulaştın?',
        'Mükemmel! Peki bu bilgiyi başka hangi konularda kullanabiliriz?',
        'Çok güzel! Bu konuyu daha derinlemesine düşünelim, sence...'
      ],
      confused: [
        'Anlıyorum, kafan karışık. Peki bu konuyu daha basit parçalara bölelim mi?',
        'Hangi kısmı daha net anlamak istiyorsun? Oradan başlayalım.',
        'Bu konuda daha önce benzer bir şeyle karşılaştın mı? Ne hatırlıyorsun?'
      ],
      frustrated: [
        'Anlıyorum, zor geliyor. Ama her zorluk bir öğrenme fırsatı, değil mi?',
        'Bazen en zor anlar en büyük gelişimin habercisidir. Küçük bir adım atalım mı?',
        'Bu duyguların normal. Peki bu zorluğu aşmak için ne yapabiliriz?'
      ],
      motivated: [
        'Bu motivasyonun harika! Peki bu enerjiyi nasıl en iyi şekilde kullanabiliriz?',
        'Çok güzel bir yaklaşım! Bu hedefine ulaşmak için hangi adımları planlıyorsun?',
        'Bu kararlılığın seni çok ileri götürecek! Hangi konudan başlamak istiyorsun?'
      ],
      neutral: [
        'Bu çok iyi bir soru! Sokratik yöntemle birlikte düşünelim. Bu konuyu nasıl yaklaşırsın?',
        'Harika! Bu konuda ne biliyorsun? Önce kendi düşüncelerini paylaş.',
        'Mükemmel bir başlangıç! Bu problemi çözmek için hangi yöntemleri kullanabiliriz?'
      ]
    }
    
    const responses = socraticResponses[emotion] || socraticResponses.neutral
    return responses[Math.floor(Math.random() * responses.length)]
  }

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

  // Send message to AI Tutor API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const emotion = detectEmotion(inputMessage)
    setStudentEmotion(emotion)

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      emotion: emotion
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')

    try {
      // Call AI Tutor API
      const response = await fetch(`${API_BASE}/ai-tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId,
          student_emotion: emotion
        })
      })

      if (response.ok) {
        const data = await response.json()
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          content: data.response,
          timestamp: new Date(),
          emotion: data.ai_emotion || 'supportive'
        }
        
        setMessages(prev => [...prev, aiResponse])
        speakText(data.response)
      } else {
        // Fallback to local Socratic response
        const fallbackResponse = generateSocraticResponse(inputMessage, emotion)
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          content: fallbackResponse,
          timestamp: new Date(),
          emotion: 'supportive'
        }
        
        setMessages(prev => [...prev, aiResponse])
        speakText(fallbackResponse)
      }
    } catch (error) {
      console.error('AI Tutor API error:', error)
      // Fallback to local response
      const fallbackResponse = generateSocraticResponse(inputMessage, emotion)
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date(),
        emotion: 'supportive'
      }
      
      setMessages(prev => [...prev, aiResponse])
      speakText(fallbackResponse)
    }
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
          {/* AI Avatar Section with Enhanced Features */}
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
                isSpeaking ? 'bg-green-500' : isListening ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                <div className={`w-3 h-3 bg-white rounded-full ${
                  isSpeaking || isListening ? 'animate-pulse' : ''
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

            <div className="text-xs text-blue-200 text-center space-y-1">
              <p>🎯 Duygusal Zeka Aktif</p>
              <p>🧠 Sokratik Yöntem</p>
              <p>🎮 Adaptif Oyunlaştırma</p>
              <p className={`${
                isSpeaking ? 'text-green-300' : 
                isListening ? 'text-red-300' : 
                'text-blue-300'
              }`}>
                {isSpeaking ? '🔊 Konuşuyor...' : 
                 isListening ? '🎤 Dinliyor...' : 
                 '💭 Düşünüyor...'}
              </p>
              <p className="text-yellow-300">
                😊 Öğrenci: {studentEmotion === 'happy' ? 'Mutlu' : 
                           studentEmotion === 'confused' ? 'Kafası Karışık' :
                           studentEmotion === 'frustrated' ? 'Sinirli' :
                           studentEmotion === 'motivated' ? 'Motivasyonlu' : 'Normal'}
              </p>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-xl font-bold">AI Öğretmen ile Sohbet</h2>
                <p className="text-sm text-gray-600">Sokratik Öğrenme • Sesli Etkileşim • Duygusal Zeka</p>
              </div>
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
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      {message.emotion && (
                        <span className="text-xs opacity-70">
                          {message.emotion === 'happy' ? '😊' :
                           message.emotion === 'confused' ? '😕' :
                           message.emotion === 'frustrated' ? '😤' :
                           message.emotion === 'motivated' ? '💪' :
                           message.emotion === 'supportive' ? '🤗' : '😐'}
                        </span>
                      )}
                    </div>
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
                  placeholder="Sorunuzu yazın veya sesli olarak sorun..."
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

// Enhanced Photo Solver Component
const PhotoSolver = ({ isOpen, onClose }) => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [solution, setSolution] = useState(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        setUploadedImage(e.target.result)
        setIsAnalyzing(true)
        setAnalysisProgress(0)
        
        // Progress simulation
        const progressInterval = setInterval(() => {
          setAnalysisProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        try {
          // Call Photo Solver API
          const formData = new FormData()
          formData.append('image', file)
          
          const response = await fetch(`${API_BASE}/photo-solver/solve`, {
            method: 'POST',
            body: formData
          })

          if (response.ok) {
            const data = await response.json()
            setAnalysisProgress(100)
            setTimeout(() => {
              setIsAnalyzing(false)
              setSolution(data)
            }, 500)
          } else {
            throw new Error('API call failed')
          }
        } catch (error) {
          console.error('Photo Solver API error:', error)
          // Fallback to mock solution
          setAnalysisProgress(100)
          setTimeout(() => {
            setIsAnalyzing(false)
            setSolution({
              problem_text: "2x + 5 = 13",
              problem_type: "Denklem",
              difficulty: "Temel",
              steps: [
                {
                  step: 1,
                  action: "5'i her iki taraftan çıkar",
                  result: "2x = 13 - 5 = 8",
                  explanation: "Eşitlikte taraf değiştirirken işaret değişir"
                },
                {
                  step: 2,
                  action: "Her iki tarafı 2'ye böl",
                  result: "x = 8/2 = 4",
                  explanation: "Bilinmeyeni yalnız bırakmak için katsayıya böleriz"
                }
              ],
              explanation: "Bu bir birinci dereceden denklemdir. Bilinmeyeni yalnız bırakmak için adım adım işlem yapıyoruz.",
              similar_problems: [
                "3x + 7 = 16",
                "5x - 2 = 18",
                "4x + 1 = 21"
              ],
              video_suggestion: "Bu konuyla ilgili detaylı video hazırlayabilirim!"
            })
          }, 1000)
        }
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
          className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col"
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold">Fotoğraftan Anında Çözüm</h2>
              <p className="text-gray-600">Advanced Vision AI • Adım Adım Çözüm • Video Önerileri</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {!uploadedImage ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center max-w-md">
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
                
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="p-4">
                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Vision AI</h4>
                    <p className="text-sm text-gray-600">Gelişmiş görüntü tanıma</p>
                  </div>
                  <div className="p-4">
                    <Cpu className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Adım Adım</h4>
                    <p className="text-sm text-gray-600">Detaylı çözüm süreci</p>
                  </div>
                  <div className="p-4">
                    <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Video Önerisi</h4>
                    <p className="text-sm text-gray-600">Kişiselleştirilmiş videolar</p>
                  </div>
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
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => {
                      setUploadedImage(null)
                      setSolution(null)
                      setIsAnalyzing(false)
                    }}
                  >
                    Yeni Fotoğraf Yükle
                  </Button>
                </div>

                {/* Solution */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Advanced Vision AI Çözümü</h3>
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                          <div 
                            className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
                          ></div>
                        </div>
                        <p className="text-lg font-semibold mb-2">AI soruyu analiz ediyor...</p>
                        <div className="w-64 bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${analysisProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">{analysisProgress}% tamamlandı</p>
                      </div>
                    </div>
                  ) : solution ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Tespit Edilen Problem:</h4>
                        <p className="text-blue-800 text-lg">{solution.problem_text}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{solution.problem_type}</Badge>
                          <Badge variant={solution.difficulty === 'Temel' ? 'default' : 'destructive'}>
                            {solution.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Layers className="w-4 h-4 mr-2" />
                          Adım Adım Çözüm:
                        </h4>
                        <div className="space-y-3">
                          {solution.steps.map((step, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-start bg-gray-50 p-3 rounded-lg"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                            >
                              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                                {step.step}
                              </span>
                              <div>
                                <p className="font-medium">{step.action}</p>
                                <p className="text-blue-600 font-mono">{step.result}</p>
                                <p className="text-sm text-gray-600 mt-1">{step.explanation}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Açıklama:</h4>
                        <p className="text-green-800">{solution.explanation}</p>
                      </div>

                      {solution.similar_problems && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-900 mb-2">Benzer Problemler:</h4>
                          <div className="space-y-1">
                            {solution.similar_problems.map((problem, index) => (
                              <p key={index} className="text-yellow-800 font-mono text-sm">• {problem}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          AI Öğretmenle Bu Konuyu Derinleştir
                        </Button>
                        {solution.video_suggestion && (
                          <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                            <Video className="w-4 h-4 mr-2" />
                            {solution.video_suggestion}
                          </Button>
                        )}
                      </div>
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

// Enhanced Adaptive Learning Dashboard
const AdaptiveDashboard = ({ isOpen, onClose }) => {
  const [studentData, setStudentData] = useState({
    name: "Ahmet Yılmaz",
    level: "11. Sınıf",
    emotionalState: "Motivasyonlu",
    learningStyle: "Görsel",
    cognitiveLoad: 6,
    xp: 2450,
    currentLevel: 8,
    progress: {
      matematik: 75,
      fizik: 60,
      kimya: 80,
      biyoloji: 65,
      tarih: 70,
      coğrafya: 55
    },
    achievements: [
      { name: "Problem Çözücü", icon: "🧩", date: "Bugün", category: "learning" },
      { name: "Sebat Ödülü", icon: "💪", date: "Dün", category: "persistence" },
      { name: "Sokratik Düşünür", icon: "🤔", date: "2 gün önce", category: "thinking" },
      { name: "Video Master", icon: "🎬", date: "3 gün önce", category: "video" }
    ],
    weeklyGoals: [
      { task: "Türev konusunu tamamla", progress: 80, target: 100 },
      { task: "10 fizik problemi çöz", progress: 60, target: 100 },
      { task: "Kimya denklemi denge", progress: 90, target: 100 },
      { task: "5 video izle", progress: 40, target: 100 }
    ],
    recentActivity: [
      { type: "quiz", subject: "Matematik", score: 85, time: "2 saat önce" },
      { type: "video", subject: "Fizik", duration: "15 dk", time: "4 saat önce" },
      { type: "ai_chat", subject: "Kimya", messages: 12, time: "6 saat önce" }
    ],
    streakDays: 7,
    totalStudyTime: 145 // minutes this week
  })

  const [selectedTab, setSelectedTab] = useState('overview')

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE}/dashboard`)
        if (response.ok) {
          const data = await response.json()
          setStudentData(prev => ({ ...prev, ...data }))
        }
      } catch (error) {
        console.error('Dashboard API error:', error)
      }
    }

    if (isOpen) {
      fetchDashboardData()
    }
  }, [isOpen])

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
          className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
          initial={{ scale: 0.9, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: -20 }}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold">Adaptif Öğrenme Paneli</h2>
              <p className="text-gray-600">Kişiselleştirilmiş • Duygusal Zeka • Bilişsel Yük Takibi</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
              { id: 'progress', label: 'İlerleme', icon: TrendingUp },
              { id: 'achievements', label: 'Başarılar', icon: Trophy },
              { id: 'goals', label: 'Hedefler', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {selectedTab === 'overview' && (
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
                      <div className="text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="font-semibold text-lg">{studentData.name}</p>
                        <p className="text-gray-600">{studentData.level}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Seviye</span>
                          <Badge variant="secondary">Level {studentData.currentLevel}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">XP</span>
                          <span className="font-semibold">{studentData.xp.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Smile className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Duygusal Durum: {studentData.emotionalState}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">Öğrenme Stili: {studentData.learningStyle}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Bilişsel Yük: {studentData.cognitiveLoad}/10</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Bu hafta: {studentData.totalStudyTime} dk</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-orange-600" />
                          <span className="text-sm">Seri: {studentData.streakDays} gün</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Son Aktiviteler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {studentData.recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              {activity.type === 'quiz' && <FileText className="w-4 h-4 text-blue-600" />}
                              {activity.type === 'video' && <Video className="w-4 h-4 text-purple-600" />}
                              {activity.type === 'ai_chat' && <MessageCircle className="w-4 h-4 text-green-600" />}
                              <span>{activity.subject}</span>
                            </div>
                            <span className="text-gray-500">{activity.time}</span>
                          </div>
                        ))}
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
                            <div className="flex justify-between mb-2">
                              <span className="font-medium capitalize">{subject}</span>
                              <span className="text-sm text-gray-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <motion.div 
                                className={`h-3 rounded-full ${
                                  progress >= 80 ? 'bg-green-600' :
                                  progress >= 60 ? 'bg-yellow-600' :
                                  'bg-red-600'
                                }`}
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

                  {/* Cognitive Load Indicator */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Cpu className="w-5 h-5 mr-2" />
                        Bilişsel Yük Analizi
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Mevcut Yük</span>
                          <Badge variant={
                            studentData.cognitiveLoad <= 3 ? 'default' :
                            studentData.cognitiveLoad <= 7 ? 'secondary' :
                            'destructive'
                          }>
                            {studentData.cognitiveLoad}/10
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              studentData.cognitiveLoad <= 3 ? 'bg-green-600' :
                              studentData.cognitiveLoad <= 7 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${(studentData.cognitiveLoad / 10) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {studentData.cognitiveLoad <= 3 ? 'Optimal öğrenme durumu' :
                           studentData.cognitiveLoad <= 7 ? 'Orta düzey yük, dikkat gerekli' :
                           'Yüksek yük, mola öneriliyor'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {selectedTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentData.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{achievement.icon}</div>
                        <h3 className="font-semibold mb-2">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.date}</p>
                        <Badge variant="outline">{achievement.category}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {selectedTab === 'goals' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Haftalık Hedefler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {studentData.weeklyGoals.map((goal, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{goal.task}</span>
                          <span className="text-sm text-gray-600">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <motion.div 
                            className={`h-3 rounded-full ${
                              goal.progress >= 90 ? 'bg-green-600' :
                              goal.progress >= 70 ? 'bg-blue-600' :
                              goal.progress >= 50 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          ></motion.div>
                        </div>
                        {goal.progress >= 100 && (
                          <div className="flex items-center mt-2 text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm">Tamamlandı!</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
      action: () => setIsAiTutorOpen(true),
      features: ["Sesli Etkileşim", "Duygusal Zeka", "Sokratik Yöntem", "Kişiselleştirme"]
    },
    {
      icon: Camera,
      title: "Çözücü 2.0 - Advanced Vision AI",
      description: "Fotoğraf çektiğiniz soruları gelişmiş AI ile analiz eden, adım adım çözmeyi öğreten rehberli öğrenme sistemi.",
      color: "text-orange-600",
      action: () => setIsPhotoSolverOpen(true),
      features: ["Vision AI", "Adım Adım Çözüm", "Video Önerileri", "Benzer Problemler"]
    },
    {
      icon: Target,
      title: "Adaptif Oyunlaştırma Motoru",
      description: "Duygusal durumunuza göre dinamik olarak ayarlanan görevler, ödüller ve motivasyon sistemi.",
      color: "text-green-600",
      action: () => setIsDashboardOpen(true),
      features: ["XP Sistemi", "Rozetler", "Streak Takibi", "Seviye Atlama"]
    },
    {
      icon: Trophy,
      title: "Hiper-Kişiselleştirilmiş Öğrenme",
      description: "Bilişsel yük, öğrenme hızı ve duygusal durumunuza göre tamamen size özel öğrenme deneyimi.",
      color: "text-purple-600",
      action: () => setIsDashboardOpen(true),
      features: ["Bilişsel Yük Takibi", "Adaptif Zorluk", "Kişisel Metrikler", "Akıllı Öneriler"]
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

  const ultimateFeatures = [
    { icon: Headphones, label: "Sesli Etkileşim", description: "TTS & STT" },
    { icon: Eye, label: "Vision AI", description: "Gelişmiş görüntü tanıma" },
    { icon: Cpu, label: "Bilişsel Takip", description: "Yük optimizasyonu" },
    { icon: Layers, label: "22+ Özellik", description: "Tam entegrasyon" }
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
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                ULTIMATE v4.0
              </Badge>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Özellikler</a>
              <a href="#exams" className="text-gray-700 hover:text-blue-600 transition-colors">Sınavlar</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">Hakkımızda</a>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
              <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 hover:from-purple-200 hover:to-blue-200">
                <Sparkles className="w-4 h-4 mr-1" />
                Türkiye'nin En Gelişmiş AI Eğitim Platformu - ULTIMATE v4.0
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Dünyanın En İyi
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600">
                  {" "}Sınava Hazırlık{" "}
                </span>
                Platformu
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sokratik AI öğretmen, gelişmiş Vision AI, empatik avatar ve adaptif oyunlaştırma ile 
                sınavlarda başarıya ulaşın. 22+ özellik, tamamen ücretsiz, tamamen Türkçe.
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {ultimateFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-3 bg-white/50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <feature.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">{feature.label}</p>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                  onClick={() => setIsAiTutorOpen(true)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  AI Öğretmenle Başla
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => setIsPhotoSolverOpen(true)}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Vision AI Dene
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
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 mr-1 text-purple-600" />
                  22+ Özellik
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
                  <span className="text-sm font-medium">ULTIMATE v4.0 Aktif</span>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4" />
                  <span className="text-sm font-medium">22+ Özellik</span>
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
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg mb-4">
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
            <Badge className="mb-4 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 hover:from-orange-200 hover:to-red-200">
              <Zap className="w-4 h-4 mr-1" />
              ULTIMATE v4.0 - 22+ Devrimsel Özellik
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Neden Macigscool ULTIMATE?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Doping Hafıza'nın içerik gücünü, devrimsel AI teknolojisiyle birleştirerek 
              öğrenmeyi tamamen yeniden tanımlıyoruz. Artık 22+ gelişmiş özellikle!
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
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-blue-200">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-gradient-to-r ${
                      feature.color === 'text-blue-600' ? 'from-blue-100 to-blue-200' :
                      feature.color === 'text-orange-600' ? 'from-orange-100 to-orange-200' :
                      feature.color === 'text-green-600' ? 'from-green-100 to-green-200' :
                      'from-purple-100 to-purple-200'
                    }`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed mb-4">
                      {feature.description}
                    </CardDescription>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {feature.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                          {feat}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-blue-50 hover:border-blue-300"
                      onClick={feature.action}
                    >
                      Canlı Demo
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
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
                <Brain className="w-4 h-4 mr-1" />
                A.I.T.O. ULTIMATE Teknolojisi
              </Badge>
              
              <h2 className="text-4xl font-bold mb-6">
                Empatik AI Öğretmeninizle Tanışın
              </h2>
              
              <p className="text-xl mb-8 text-blue-100">
                Cevap vermeyen, düşündüren AI. Duygusal durumunuzu anlayan, 
                Sokratik yöntemle öğreten, sesli etkileşim kuran devrimsel eğitim deneyimi.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
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
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Bilişsel yük optimizasyonu</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Kişiselleştirilmiş öğrenme</span>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => setIsAiTutorOpen(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                A.I.T.O. ULTIMATE ile Konuş
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
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                Canlı Demo
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                ULTIMATE v4.0
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section id="exams" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 hover:from-green-200 hover:to-blue-200">
              <Award className="w-4 h-4 mr-1" />
              Kapsamlı Sınav Hazırlığı
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tüm Sınavlar İçin Eksiksiz Hazırlık
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Doping Hafıza'nın kapsamlı içeriği + ULTIMATE v4.0 AI teknolojisi = 
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
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{exam.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{exam.students}</Badge>
                        {exam.active && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <CardDescription>{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                        AI Öğretmen Desteği
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                        Vision AI Çözümü
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                        Adaptif Oyunlaştırma
                      </div>
                    </div>
                    <Button variant="outline" className="w-full hover:bg-blue-50">
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
      <section className="py-20 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 text-lg px-4 py-2">
              <Sparkles className="w-5 h-5 mr-2" />
              ULTIMATE v4.0 - 22+ Özellik
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Sınav Başarınızı Garanti Altına Alın
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-orange-100">
              1 milyon öğrencinin tercih ettiği platform artık ULTIMATE v4.0 ile daha güçlü! 
              Hayalinizdeki üniversiteye adım atın. Tamamen ücretsiz, tamamen Türkçe.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold">22+</div>
                <div className="text-sm opacity-90">Özellik</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1M+</div>
                <div className="text-sm opacity-90">Öğrenci</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm opacity-90">Ücretsiz</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-sm opacity-90">Başarı</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4"
                onClick={() => setIsAiTutorOpen(true)}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                ULTIMATE'i Dene
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                onClick={() => setIsDashboardOpen(true)}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Dashboard'u Gör
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
              <div className="flex items-center space-x-2 mb-4">
                <img src={logoImage} alt="Macigscool" className="h-8 w-auto" />
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                  ULTIMATE v4.0
                </Badge>
              </div>
              <p className="text-gray-400 mb-4">
                Türkiye'nin en gelişmiş AI destekli eğitim platformu. 
                22+ özellik ile sınavlarda başarıya ulaşın.
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
              <h3 className="text-lg font-semibold mb-4">ULTIMATE Özellikler</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">A.I.T.O. AI Öğretmen</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Vision AI Çözücü</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Adaptif Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gelişmiş Oyunlaştırma</a></li>
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
            <p>&copy; 2025 Macigscool ULTIMATE v4.0. Tüm hakları saklıdır. Türkiye'nin en gelişmiş AI eğitim platformu.</p>
            <p className="mt-2 text-sm">22+ Özellik • 1M+ Öğrenci • %100 Ücretsiz • Dünya Standartlarında Eğitim</p>
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
