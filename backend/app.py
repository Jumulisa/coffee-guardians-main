"""
Coffee Guardian Backend API
Simple Flask backend with SQLite database for authentication and diagnosis history.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import secrets
import sqlite3
import jwt
import datetime
import os
from functools import wraps

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:8080", "http://localhost:8081", "http://localhost:8082", "http://localhost:8083", "http://localhost:8084", "http://localhost:8085", "http://localhost:3000", "http://127.0.0.1:8080", "http://127.0.0.1:8081", "http://127.0.0.1:8082", "http://127.0.0.1:8083", "http://127.0.0.1:8084"])

# Secret key for JWT - in production, use environment variable
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'coffee-guardian-secret-key-change-in-production')

DATABASE = 'coffee_guardian.db'

# Simple password hashing (compatible with all Python versions)
def hash_password(password: str) -> str:
    """Hash a password with a random salt using SHA256."""
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()
    return f"{salt}${password_hash}"

def verify_password(password: str, stored_hash: str) -> bool:
    """Verify a password against its hash."""
    try:
        salt, password_hash = stored_hash.split('$')
        return hashlib.sha256((salt + password).encode()).hexdigest() == password_hash
    except ValueError:
        return False

def get_db():
    """Get database connection."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with required tables."""
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            language TEXT DEFAULT 'en',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Diagnosis history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS diagnosis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            image_url TEXT,
            disease_name TEXT NOT NULL,
            confidence REAL NOT NULL,
            severity TEXT,
            treatment_data TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # User settings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            language TEXT DEFAULT 'en',
            notifications_enabled INTEGER DEFAULT 1,
            dark_mode INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

def token_required(f):
    """Decorator to require JWT token for protected routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (data['user_id'],))
            current_user = cursor.fetchone()
            conn.close()
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# ============ AUTH ROUTES ============

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """Register a new user."""
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if user already exists
    cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Email already registered'}), 409
    
    # Create user
    password_hash = hash_password(password)
    cursor.execute(
        'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
        (email, password_hash, full_name)
    )
    user_id = cursor.lastrowid
    
    # Create default settings
    cursor.execute(
        'INSERT INTO user_settings (user_id) VALUES (?)',
        (user_id,)
    )
    
    conn.commit()
    
    # Generate token
    token = jwt.encode({
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    # Fetch user data
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'full_name': user['full_name'],
            'avatar_url': user['avatar_url'],
            'language': user['language'],
            'created_at': user['created_at']
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user."""
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    
    if not user or not verify_password(password, user['password_hash']):
        conn.close()
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Get settings
    cursor.execute('SELECT * FROM user_settings WHERE user_id = ?', (user['id'],))
    settings = cursor.fetchone()
    conn.close()
    
    # Generate token
    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'full_name': user['full_name'],
            'avatar_url': user['avatar_url'],
            'language': settings['language'] if settings else 'en',
            'created_at': user['created_at']
        }
    })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user info."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user_settings WHERE user_id = ?', (current_user['id'],))
    settings = cursor.fetchone()
    conn.close()
    
    return jsonify({
        'user': {
            'id': current_user['id'],
            'email': current_user['email'],
            'full_name': current_user['full_name'],
            'avatar_url': current_user['avatar_url'],
            'language': settings['language'] if settings else 'en',
            'created_at': current_user['created_at']
        }
    })

@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout(current_user):
    """Logout user (client should discard token)."""
    return jsonify({'message': 'Logged out successfully'})

# ============ USER ROUTES ============

@app.route('/api/users/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user profile."""
    data = request.get_json()
    
    full_name = data.get('full_name')
    avatar_url = data.get('avatar_url')
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute(
        'UPDATE users SET full_name = ?, avatar_url = ? WHERE id = ?',
        (full_name, avatar_url, current_user['id'])
    )
    conn.commit()
    
    cursor.execute('SELECT * FROM users WHERE id = ?', (current_user['id'],))
    user = cursor.fetchone()
    conn.close()
    
    return jsonify({
        'id': user['id'],
        'email': user['email'],
        'full_name': user['full_name'],
        'avatar_url': user['avatar_url'],
        'created_at': user['created_at']
    })

@app.route('/api/users/settings', methods=['GET'])
@token_required
def get_settings(current_user):
    """Get user settings."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user_settings WHERE user_id = ?', (current_user['id'],))
    settings = cursor.fetchone()
    conn.close()
    
    if settings:
        return jsonify({
            'language': settings['language'],
            'notifications_enabled': bool(settings['notifications_enabled']),
            'dark_mode': bool(settings['dark_mode'])
        })
    
    return jsonify({
        'language': 'en',
        'notifications_enabled': True,
        'dark_mode': False
    })

@app.route('/api/users/settings', methods=['PUT'])
@token_required
def update_settings(current_user):
    """Update user settings."""
    data = request.get_json()
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if settings exist
    cursor.execute('SELECT id FROM user_settings WHERE user_id = ?', (current_user['id'],))
    existing = cursor.fetchone()
    
    if existing:
        cursor.execute('''
            UPDATE user_settings 
            SET language = ?, notifications_enabled = ?, dark_mode = ?
            WHERE user_id = ?
        ''', (
            data.get('language', 'en'),
            1 if data.get('notifications_enabled', True) else 0,
            1 if data.get('dark_mode', False) else 0,
            current_user['id']
        ))
    else:
        cursor.execute('''
            INSERT INTO user_settings (user_id, language, notifications_enabled, dark_mode)
            VALUES (?, ?, ?, ?)
        ''', (
            current_user['id'],
            data.get('language', 'en'),
            1 if data.get('notifications_enabled', True) else 0,
            1 if data.get('dark_mode', False) else 0
        ))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'language': data.get('language', 'en'),
        'notifications_enabled': data.get('notifications_enabled', True),
        'dark_mode': data.get('dark_mode', False)
    })

# ============ DIAGNOSIS ROUTES ============

@app.route('/api/diagnosis', methods=['POST'])
@token_required
def save_diagnosis(current_user):
    """Save a diagnosis result."""
    data = request.get_json()
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO diagnosis_history 
        (user_id, image_url, disease_name, confidence, severity, treatment_data, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        current_user['id'],
        data.get('image_url'),
        data.get('disease_name'),
        data.get('confidence'),
        data.get('severity'),
        data.get('treatment_data'),  # JSON string
        data.get('notes')
    ))
    
    diagnosis_id = cursor.lastrowid
    conn.commit()
    
    cursor.execute('SELECT * FROM diagnosis_history WHERE id = ?', (diagnosis_id,))
    diagnosis = cursor.fetchone()
    conn.close()
    
    return jsonify({
        'id': diagnosis['id'],
        'user_id': diagnosis['user_id'],
        'image_url': diagnosis['image_url'],
        'disease_name': diagnosis['disease_name'],
        'confidence': diagnosis['confidence'],
        'severity': diagnosis['severity'],
        'treatment_data': diagnosis['treatment_data'],
        'notes': diagnosis['notes'],
        'created_at': diagnosis['created_at']
    }), 201

@app.route('/api/diagnosis', methods=['GET'])
@token_required
def get_diagnosis_history(current_user):
    """Get user's diagnosis history."""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM diagnosis_history 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ''', (current_user['id'],))
    
    diagnoses = cursor.fetchall()
    conn.close()
    
    return jsonify([{
        'id': d['id'],
        'user_id': d['user_id'],
        'image_url': d['image_url'],
        'disease_name': d['disease_name'],
        'confidence': d['confidence'],
        'severity': d['severity'],
        'treatment_data': d['treatment_data'],
        'notes': d['notes'],
        'created_at': d['created_at']
    } for d in diagnoses])

@app.route('/api/diagnosis/<int:diagnosis_id>', methods=['GET'])
@token_required
def get_diagnosis(current_user, diagnosis_id):
    """Get a specific diagnosis."""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM diagnosis_history 
        WHERE id = ? AND user_id = ?
    ''', (diagnosis_id, current_user['id']))
    
    diagnosis = cursor.fetchone()
    conn.close()
    
    if not diagnosis:
        return jsonify({'error': 'Diagnosis not found'}), 404
    
    return jsonify({
        'id': diagnosis['id'],
        'user_id': diagnosis['user_id'],
        'image_url': diagnosis['image_url'],
        'disease_name': diagnosis['disease_name'],
        'confidence': diagnosis['confidence'],
        'severity': diagnosis['severity'],
        'treatment_data': diagnosis['treatment_data'],
        'notes': diagnosis['notes'],
        'created_at': diagnosis['created_at']
    })

@app.route('/api/diagnosis/<int:diagnosis_id>', methods=['DELETE'])
@token_required
def delete_diagnosis(current_user, diagnosis_id):
    """Delete a diagnosis."""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        DELETE FROM diagnosis_history 
        WHERE id = ? AND user_id = ?
    ''', (diagnosis_id, current_user['id']))
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Diagnosis not found'}), 404
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Diagnosis deleted successfully'})

# ============ HEALTH CHECK ============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'service': 'Coffee Guardian API'})

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5001, debug=True)
