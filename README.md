# AI-Based Resume Analysis Tool

## Project Overview
This project is a web-based application designed to help students and recruiters analyze resumes using Artificial Intelligence. It allows users to upload resumes in PDF or DOCX format, extracts key information using Groq AI (Llama 3.3 model), and presents a structured summary including a "Resume Score" to evaluate completeness.

## Features
- **File Upload**: Supports `.pdf` and `.docx` files (up to 5MB).
- **AI-Powered Extraction**: Uses Groq Cloud API for fast and accurate parsing (Llama 3.3).
- **Structured Insights**: Automatically extracts:
    - Candidate Name, Email, and Phone
    - Skills & Key Strengths
    - Education & Experience Summary
    - Projects & Certifications
- **Resume Score**: A calculated score based on resume completeness.
- **Modern UI**: A premium, glassmorphism design with responsive elements and progress indicators.
- **Clean Architecture**: Decoupled frontend (HTML/JS) and backend (Django REST Framework).

## Technical Details
- **Backend**: Python 3.10+ / Django 5.x / Django REST Framework
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **AI Service**: Groq API (Model: `llama-3.3-70b-versatile`)
- **Libraries**: 
    - `pdfplumber` (PDF parsing)
    - `python-docx` (Word document parsing)
    - `django-cors-headers` (CORS management)
    - `python-dotenv` (Environment variable management)
    - `whitenoise` (Static file serving)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-based_resume_analysis
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_actual_groq_api_key
DEBUG=True
SECRET_KEY=your_secret_key
```

### 3. Setup Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Run Migrations & Start Server
```bash
python backend/manage.py migrate
python backend/manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000`.

### 6. Launch Frontend
Open `frontend/index.html` in any modern web browser.
Alternatively, server it using a local server:
```bash
# Example using Python's built-in server
cd frontend
python -m http.server 8080
```

## API Documentation

### POST `/api/upload/`
Analyze a resume file.

**Request**: `multipart/form-data`
- `file`: The resume file (PDF or DOCX).

**Response (200 OK)**:
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "skills": ["Python", "Django", "React"],
  "education": "B.Tech in Computer Science",
  "experience_summary": "Junior developer with 2 years of experience...",
  "projects": ["Personal Website", "E-commerce Site"],
  "certifications": ["AWS Certified Cloud Practitioner"],
  "key_strengths": ["Fast learner", "Problem solver"],
  "resume_score": 85
}
```

## Build & Deployment
For production deployment, you can use the provided `build.sh` script:
```bash
chmod +x build.sh
./build.sh
```
This script installs dependencies, collects static files, and runs migrations.
