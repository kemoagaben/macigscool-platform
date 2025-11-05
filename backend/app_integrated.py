"""
MACIGSCOOL FULL STACK - ENTEGRE BACKEND
Tüm özellikler tek çatı altında
"""

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os
from datetime import datetime

# Flask app oluştur
app = Flask(__name__)

# Konfigürasyon
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'macigscool-secret-key-2025')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///macigscool.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')

# Extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

# ============================================
# MODELS
# ============================================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    exam_type = db.Column(db.String(50))  # YKS, KPSS, etc.
    level = db.Column(db.Integer, default=1)
    xp = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Performance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic_id = db.Column(db.String(100))
    quiz_score = db.Column(db.Integer)
    correct_answers = db.Column(db.Integer)
    total_questions = db.Column(db.Integer)
    time_spent = db.Column(db.Integer)
    mistakes = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic_id = db.Column(db.String(100))
    title = db.Column(db.String(200))
    video_url = db.Column(db.String(500))
    thumbnail_url = db.Column(db.String(500))
    duration_seconds = db.Column(db.Integer)
    scenario_metadata = db.Column(db.JSON)
    status = db.Column(db.String(50), default='ready')
    view_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class VideoAnalytics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    watch_duration = db.Column(db.Integer)
    watch_percentage = db.Column(db.Integer)
    pause_timestamps = db.Column(db.JSON)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================
# ROUTES - CORE
# ============================================

@app.route('/api/health', methods=['GET'])
def health():
    """Sistem sağlık kontrolü"""
    return jsonify({
        'status': 'ok',
        'version': '2.0.0',
        'features': [
            'AI Personality',
            'Photo Solver',
            'Comprehensive Exams',
            'Reflex Learning',
            'Live Metrics',
            'Vizyon AI',
            'Adaptive Video System ⭐'
        ],
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/features', methods=['GET'])
def get_features():
    """Platform özelliklerini listele"""
    features = {
        'ai_personality': {
            'name': 'AI Personality',
            'description': 'DopingHafıza tarzı empatik AI öğretmen',
            'status': 'active'
        },
        'photo_solver': {
            'name': 'Fotoğraf Çözücü',
            'description': 'Fotoğraftan soru çözme',
            'status': 'active'
        },
        'comprehensive_exams': {
            'name': 'Kapsamlı Sınavlar',
            'description': 'Gerçek sınav deneyimi',
            'status': 'active'
        },
        'reflex_learning': {
            'name': 'Refleks Öğrenme',
            'description': 'Hızlı öğrenme teknikleri',
            'status': 'active'
        },
        'adaptive_videos': {
            'name': 'Adaptif Video Sistemi',
            'description': 'Kişiselleştirilmiş hipnotik eğitim videoları',
            'status': 'active',
            'new': True
        }
    }
    return jsonify(features)

# ============================================
# ROUTES - VIDEO SYSTEM
# ============================================

@app.route('/api/video/quiz-completed', methods=['POST'])
@jwt_required()
def video_quiz_completed():
    """Quiz tamamlandığında video üretimi tetikle"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Performans kaydı oluştur
        performance = Performance(
            user_id=user_id,
            topic_id=data.get('topic_id'),
            quiz_score=data.get('quiz_score'),
            correct_answers=data.get('correct_answers'),
            total_questions=data.get('total_questions'),
            time_spent=data.get('time_spent_seconds'),
            mistakes=data.get('mistakes', [])
        )
        db.session.add(performance)
        db.session.commit()
        
        # Video üretimi tetikle (async olmalı - şimdi mock)
        # Background task: generate_video_async(user_id, topic_id, performance)
        
        return jsonify({
            'status': 'success',
            'message': 'Quiz kaydedildi, video hazırlanıyor',
            'user_id': user_id,
            'topic_id': data.get('topic_id'),
            'estimated_time': 300  # 5 dakika
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/video/list', methods=['GET'])
@jwt_required()
def video_list():
    """Kullanıcının videolarını listele"""
    try:
        user_id = get_jwt_identity()
        
        videos = Video.query.filter_by(user_id=user_id).order_by(Video.created_at.desc()).all()
        
        video_list = [{
            'id': v.id,
            'title': v.title,
            'thumbnail_url': v.thumbnail_url or 'https://via.placeholder.com/320x180',
            'duration_seconds': v.duration_seconds,
            'topic': v.topic_id,
            'created_at': v.created_at.isoformat(),
            'view_count': v.view_count,
            'status': v.status
        } for v in videos]
        
        return jsonify({
            'total': len(video_list),
            'videos': video_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/video/<int:video_id>', methods=['GET'])
@jwt_required()
def get_video(video_id):
    """Video detaylarını al"""
    try:
        user_id = get_jwt_identity()
        
        video = Video.query.filter_by(id=video_id, user_id=user_id).first()
        
        if not video:
            return jsonify({'error': 'Video bulunamadı'}), 404
        
        # View count artır
        video.view_count += 1
        db.session.commit()
        
        return jsonify({
            'id': video.id,
            'title': video.title,
            'video_url': video.video_url,
            'thumbnail_url': video.thumbnail_url,
            'duration_seconds': video.duration_seconds,
            'scenario_metadata': video.scenario_metadata,
            'view_count': video.view_count,
            'created_at': video.created_at.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/video/<int:video_id>/analytics', methods=['POST'])
@jwt_required()
def track_analytics(video_id):
    """Video izleme analitiğini kaydet"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        analytics = VideoAnalytics(
            video_id=video_id,
            user_id=user_id,
            watch_duration=data.get('watch_duration'),
            watch_percentage=data.get('watch_percentage'),
            pause_timestamps=data.get('pause_timestamps', []),
            completed=data.get('completed', False)
        )
        db.session.add(analytics)
        db.session.commit()
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/video/dashboard', methods=['GET'])
@jwt_required()
def video_dashboard():
    """Video dashboard istatistikleri"""
    try:
        user_id = get_jwt_identity()
        
        # Video sayısı
        total_videos = Video.query.filter_by(user_id=user_id).count()
        
        # Toplam izleme süresi
        analytics = VideoAnalytics.query.filter_by(user_id=user_id).all()
        total_watch_time = sum(a.watch_duration or 0 for a in analytics)
        
        # Tamamlama oranı
        completed_count = sum(1 for a in analytics if a.completed)
        completion_rate = (completed_count / len(analytics) * 100) if analytics else 0
        
        # Son videolar
        recent_videos = Video.query.filter_by(user_id=user_id)\
            .order_by(Video.created_at.desc())\
            .limit(5).all()
        
        return jsonify({
            'total_videos': total_videos,
            'total_watch_time': total_watch_time,
            'completion_rate': int(completion_rate),
            'average_score_improvement': 15,  # Mock
            'streak_days': 7,  # Mock
            'recent_videos': [{
                'title': v.title,
                'created_at': v.created_at.isoformat(),
                'watched': True
            } for v in recent_videos]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# ROUTES - AI PERSONALITY
# ============================================

@app.route('/api/ai-personality/chat', methods=['POST'])
@jwt_required()
def ai_chat():
    """AI öğretmen ile sohbet"""
    data = request.get_json()
    message = data.get('message')
    
    # Mock response (gerçek implementasyon OpenAI API kullanır)
    response = {
        'message': f'DopingHafıza tarzında yanıt: {message}',
        'personality': 'empathetic',
        'tone': 'supportive'
    }
    
    return jsonify(response)

# ============================================
# ROUTES - PHOTO SOLVER
# ============================================

@app.route('/api/photo-solver/solve', methods=['POST'])
@jwt_required()
def photo_solve():
    """Fotoğraftan soru çöz"""
    # Fotoğraf işleme (Vision API)
    return jsonify({
        'solution': 'Adım adım çözüm...',
        'confidence': 0.95
    })

# ============================================
# ROUTES - COMPREHENSIVE EXAMS
# ============================================

@app.route('/api/exams/list', methods=['GET'])
@jwt_required()
def list_exams():
    """Sınav listesi"""
    exams = [
        {'id': 1, 'name': 'YKS Matematik', 'questions': 40, 'duration': 90},
        {'id': 2, 'name': 'KPSS Genel Kültür', 'questions': 60, 'duration': 120}
    ]
    return jsonify(exams)

@app.route('/api/exams/<int:exam_id>/start', methods=['POST'])
@jwt_required()
def start_exam(exam_id):
    """Sınav başlat"""
    return jsonify({
        'exam_id': exam_id,
        'session_id': 'session-123',
        'questions': []  # Sorular
    })

# ============================================
# ROUTES - REFLEX LEARNING
# ============================================

@app.route('/api/reflex/challenges', methods=['GET'])
@jwt_required()
def reflex_challenges():
    """Refleks öğrenme challengeları"""
    challenges = [
        {'id': 1, 'name': 'Hız Okuma', 'type': 'speed_reading'},
        {'id': 2, 'name': 'Bellek Testi', 'type': 'memory'}
    ]
    return jsonify(challenges)

# ============================================
# ROUTES - LIVE METRICS
# ============================================

@app.route('/api/metrics/live', methods=['GET'])
@jwt_required()
def live_metrics():
    """Canlı metrikler"""
    user_id = get_jwt_identity()
    
    return jsonify({
        'active_users': 1247,
        'videos_generated_today': 342,
        'avg_score_improvement': 18.5,
        'user_rank': 156
    })

# ============================================
# INITIALIZE DATABASE
# ============================================

@app.before_first_request
def create_tables():
    """İlk istekten önce tabloları oluştur"""
    db.create_all()
    print("✅ Database tabloları oluşturuldu")

# ============================================
# RUN
# ============================================

if __name__ == '__main__':
    print("""
    ╔═══════════════════════════════════════╗
    ║   MACIGSCOOL FULL STACK BACKEND       ║
    ║   Version: 2.0.0                      ║
    ║   Features: 7+ AI Modules             ║
    ║   ⭐ Adaptive Video System Enabled    ║
    ╚═══════════════════════════════════════╝
    """)
    app.run(host='0.0.0.0', port=5000, debug=True)
