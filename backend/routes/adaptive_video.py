"""
Adaptive Video Generation Routes
Öğrenci performansına göre kişiselleştirilmiş video üretimi
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import httpx
import json
import os
from datetime import datetime
from ..app import db

adaptive_video_bp = Blueprint('adaptive_video', __name__)

# Environment variables
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
HEYGEN_API_KEY = os.getenv('HEYGEN_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

# Master prompt (kısaltılmış versiyon - tam versiyon dosyadan okunur)
MASTER_PROMPT = """
Sen hipnotik öğretim teknikleri uzmanı bir video senaryo yazarısın.

Öğrenci performansına göre kişiselleştirilmiş, eğlenceli, hafızada kalıcı içerik üretiyorsun.

# HİPNOTİK TEKNİKLER:
1. İsim Tekrarı: Öğrenci adını 5-7 kez kullan
2. 3x Kural: Anahtar kavramı 3 farklı şekilde söyle
3. Ritmik Dil: 8-10 kelimelik cümleler
4. Telkin: Her 90-120sn'de "Sen başarabilirsin" varyasyonu
5. Absürt Benzetmeler: Hafızada yer açmak için

# PERFORMANSA GÖRE ADAPTASYON:
- Skor < 50: 3dk, yavaş, destekleyici
- Skor 50-74: 5dk, normal, cesaretlendirici  
- Skor 75+: 4dk, hızlı, meydan okuyucu

# ÇIKTI FORMATI: JSON
{
  "video_metadata": {
    "baslik": "{{ad}} İçin: {{konu}}",
    "sure_saniye": 180,
    "zorluk_seviyesi": "temel|orta|ileri"
  },
  "senaryo": [
    {
      "saniye": "0-15",
      "metin": "Senaryo metni...",
      "ton": "enerjik",
      "vurgu": ["kelime1", "kelime2"]
    }
  ],
  "hipnotik_analizler": {
    "isim_tekrar_sayisi": 7,
    "kavram_tekrar": 3,
    "telkin_sayisi": 2
  }
}
"""


@adaptive_video_bp.route('/video/quiz-completed', methods=['POST'])
@jwt_required()
def quiz_completed():
    """
    Quiz tamamlandığında video üretimini tetikle
    
    Request Body:
    {
        "topic_id": "uuid",
        "quiz_score": 52,
        "correct_answers": 13,
        "total_questions": 25,
        "time_spent_seconds": 1200,
        "mistakes": [{"type": "kavram_yanlis", "description": "..."}]
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Performans kaydı oluştur (basitleştirilmiş)
        performance_record = {
            'user_id': user_id,
            'topic_id': data.get('topic_id'),
            'quiz_score': data.get('quiz_score'),
            'correct_answers': data.get('correct_answers'),
            'total_questions': data.get('total_questions'),
            'time_spent_seconds': data.get('time_spent_seconds'),
            'mistakes': data.get('mistakes', []),
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Video üretim kuyruğuna ekle
        # (Gerçek implementasyonda background task kullanılır)
        
        return jsonify({
            'status': 'success',
            'message': 'Quiz kaydedildi, video hazırlanıyor',
            'user_id': user_id,
            'topic_id': data.get('topic_id')
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@adaptive_video_bp.route('/video/generate', methods=['POST'])
@jwt_required()
def generate_video():
    """
    Manuel video üretimi tetikleme
    
    Request Body:
    {
        "topic_id": "uuid",
        "force_regenerate": false
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        topic_id = data.get('topic_id')
        
        # Kullanıcı bilgilerini al
        # user = User.query.get(user_id)
        
        # Performans geçmişini al
        # performance_history = get_performance_history(user_id, topic_id)
        
        # Mock data (gerçek implementasyon için DB query gerekli)
        student_data = {
            'ad': 'Öğrenci',
            'yas': 17,
            'sinav_turu': 'YKS'
        }
        
        performance_data = {
            'konu_adi': 'Geometri - Alan',
            'ortalama_skor': 52.0,
            'son_5_skor': [45, 48, 52, 54, 50],
            'zayif_konular': ['dikdortgen_alan']
        }
        
        # GPT-4 ile senaryo oluştur
        scenario = generate_scenario_gpt4(student_data, performance_data)
        
        # HeyGen ile video oluştur (async olmalı)
        video_id = create_heygen_video(scenario, user_id, topic_id)
        
        return jsonify({
            'status': 'processing',
            'video_id': video_id,
            'message': 'Video üretimi başlatıldı',
            'estimated_time': 300  # 5 dakika
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@adaptive_video_bp.route('/video/list', methods=['GET'])
@jwt_required()
def list_videos():
    """Kullanıcının videolarını listele"""
    try:
        user_id = get_jwt_identity()
        
        # Mock data (gerçek implementasyon DB'den çeker)
        videos = [
            {
                'id': 'vid-123',
                'title': 'Geometri Alan Hesaplama - Kişisel Ders #1',
                'thumbnail_url': 'https://via.placeholder.com/320x180',
                'duration_seconds': 180,
                'topic': 'Geometri',
                'created_at': datetime.utcnow().isoformat(),
                'view_count': 3,
                'status': 'ready'
            }
        ]
        
        return jsonify({
            'total': len(videos),
            'videos': videos
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@adaptive_video_bp.route('/video/<video_id>', methods=['GET'])
@jwt_required()
def get_video(video_id):
    """Video detaylarını ve izleme URL'sini al"""
    try:
        user_id = get_jwt_identity()
        
        # Mock video data
        video = {
            'id': video_id,
            'title': 'Geometri Alan - Kişisel Ders',
            'video_url': 'https://cdn.example.com/videos/' + video_id + '.mp4',
            'duration_seconds': 180,
            'created_at': datetime.utcnow().isoformat(),
            'scenario_metadata': {
                'hipnotik_skor': 95,
                'kisisellesme': 'yuksek'
            }
        }
        
        return jsonify(video), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@adaptive_video_bp.route('/video/<video_id>/analytics', methods=['POST'])
@jwt_required()
def track_video_analytics(video_id):
    """
    Video izleme analitiğini kaydet
    
    Request Body:
    {
        "watch_duration": 150,
        "watch_percentage": 83,
        "pause_timestamps": [45, 120],
        "completed": false
    }
    """
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Analytics kaydı oluştur
        analytics = {
            'video_id': video_id,
            'user_id': user_id,
            'watch_duration': data.get('watch_duration'),
            'watch_percentage': data.get('watch_percentage'),
            'pause_timestamps': data.get('pause_timestamps', []),
            'completed': data.get('completed', False),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return jsonify({
            'status': 'success',
            'message': 'Analitik kaydedildi'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def generate_scenario_gpt4(student_data, performance_data):
    """GPT-4 ile senaryo oluştur"""
    
    if not OPENAI_API_KEY:
        # Mock scenario döndür
        return {
            'video_metadata': {
                'baslik': f"{student_data['ad']} İçin: {performance_data['konu_adi']}",
                'sure_saniye': 180,
                'zorluk_seviyesi': 'temel'
            },
            'senaryo': [
                {
                    'saniye': '0-15',
                    'metin': f"Merhaba {student_data['ad']}! Bu video senin için hazırlandı.",
                    'ton': 'enerjik',
                    'vurgu': [student_data['ad'], 'senin için']
                }
            ],
            'hipnotik_analizler': {
                'isim_tekrar_sayisi': 7,
                'kavram_tekrar': 3
            }
        }
    
    # Gerçek GPT-4 çağrısı
    input_data = {
        'ogrenci': student_data,
        'performans': performance_data
    }
    
    # OpenAI API call (async olmalı)
    # response = openai.ChatCompletion.create(...)
    
    return {}  # Placeholder


def create_heygen_video(scenario, user_id, topic_id):
    """HeyGen API ile video oluştur"""
    
    if not HEYGEN_API_KEY:
        # Mock video ID döndür
        return 'mock-video-id-' + str(datetime.utcnow().timestamp())
    
    # HeyGen API call
    full_script = ' '.join([s['metin'] for s in scenario.get('senaryo', [])])
    
    # API request (async olmalı)
    # response = httpx.post('https://api.heygen.com/v2/video/generate', ...)
    
    return 'video-id-placeholder'


@adaptive_video_bp.route('/video/webhook/heygen', methods=['POST'])
def heygen_webhook():
    """HeyGen'den gelen webhook'u işle"""
    try:
        data = request.get_json()
        
        video_id = data.get('video_id')
        status = data.get('status')
        download_url = data.get('download_url')
        
        if status == 'completed' and download_url:
            # Video'yu S3'e yükle
            # S3'ten URL al
            # Video kütüphanesine kaydet
            # Öğrenciye bildirim gönder
            pass
        
        return jsonify({'status': 'received'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@adaptive_video_bp.route('/video/dashboard', methods=['GET'])
@jwt_required()
def video_dashboard():
    """Video dashboard istatistikleri"""
    try:
        user_id = get_jwt_identity()
        
        # Mock stats
        stats = {
            'total_videos': 12,
            'total_watch_time': 3600,
            'completion_rate': 85,
            'average_score_improvement': 15,
            'streak_days': 7,
            'recent_videos': [
                {
                    'title': 'Geometri Alan',
                    'created_at': datetime.utcnow().isoformat(),
                    'watched': True
                }
            ]
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
