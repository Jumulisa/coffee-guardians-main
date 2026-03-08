# Coffee Guardian Backend

A simple Flask backend with SQLite database for the Coffee Guardian application.

## Features

- User authentication (signup, login, JWT tokens)
- Diagnosis history storage
- User profile and settings management
- RESTful API endpoints

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5001` and automatically create the SQLite database.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/logout` | Logout (client discards token) |

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/users/settings` | Get user settings |
| PUT | `/api/users/settings` | Update user settings |

### Diagnosis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/diagnosis` | Save a diagnosis result |
| GET | `/api/diagnosis` | Get diagnosis history |
| GET | `/api/diagnosis/:id` | Get specific diagnosis |
| DELETE | `/api/diagnosis/:id` | Delete a diagnosis |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check if API is running |

## Database Schema

The SQLite database (`coffee_guardian.db`) contains:

- **users**: User accounts with email, password hash, profile info
- **diagnosis_history**: Diagnosis results with disease info and treatment data
- **user_settings**: User preferences (language, notifications, theme)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| SECRET_KEY | JWT signing key | `coffee-guardian-secret-key-change-in-production` |

## Development

The database file (`coffee_guardian.db`) is created automatically on first run in the backend directory.

To reset the database, simply delete the `.db` file and restart the server.
