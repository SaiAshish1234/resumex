# ResumeX — AI Resume Analyzer

> Full-stack AI-powered resume analyzer built with React, FastAPI, and Gemini API.
> Upload your resume, paste a job description, and get instant feedback — score, strengths, weaknesses, and job match analysis.

🔗 **Live:** https://resumex-eight.vercel.app

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/SaiAshish1234/resumex.git
cd resumex
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
set GEMINI_API_KEY=your_gemini_api_key_here   # Windows
python -m uvicorn main:app --reload
# Runs on http://127.0.0.1:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## What it does

- **Resume scoring** — overall score out of 100, ATS compatibility score
- **Strengths & weaknesses** — AI-identified positives and gaps
- **Actionable suggestions** — specific improvements to make
- **Job match analysis** — paste a job description to get a match % and missing keywords
- **PDF parsing** — extracts and analyzes text from uploaded PDF resumes

---

## Project Structure

```
resumex/
├── backend/                  # FastAPI server
│   ├── main.py               # API routes
│   ├── parser.py             # PDF text extraction (PyMuPDF)
│   ├── analyzer.py           # Gemini AI analysis
│   └── requirements.txt      # Python dependencies
└── frontend/                 # React app
    └── src/
        ├── App.js            # Main component
        └── App.css           # Animations + styling
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, CSS animations |
| Backend | FastAPI, Python |
| AI | Google Gemini API (`gemini-2.0-flash`) |
| PDF parsing | PyMuPDF (fitz) |
| Frontend deployment | Vercel |
| Backend deployment | Render |

---

## API

### `POST /analyze`
Analyzes a resume PDF and returns structured feedback.

**Request:** `multipart/form-data`
- `file` — PDF resume file
- `job_description` — (optional) job description text for match analysis

**Response:**
```json
{
  "overall_score": 85,
  "ats_score": 90,
  "job_match": 72,
  "strengths": ["Strong project portfolio", "..."],
  "weaknesses": ["No quantified metrics", "..."],
  "suggestions": ["Add impact numbers to bullets", "..."],
  "missing_keywords": [
    { "keyword": "TypeScript", "reason": "Required skill in JD" }
  ]
}
```

---

## Setup

### Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey) |

### Get a Gemini API key
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click **Create API key**
4. Copy and set as `GEMINI_API_KEY`

---

## Deployment

**Frontend → Vercel**
1. Import `SaiAshish1234/resumex` on Vercel
2. Set root directory to `frontend`
3. Deploy

**Backend → Render**
1. Create a new Web Service on Render
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Add `GEMINI_API_KEY` as environment variable

> **Note:** The backend runs on Render's free tier and may take ~50 seconds
> to respond after a period of inactivity. This is normal — subsequent
> requests will be fast.

---

## Features in Detail

### Word Fall Animation
Hero text animates word-by-word on page load with a rotation effect.

### Animated Match Bar
Job match score bar fills from 0 to the actual percentage with a smooth 1s transition.

### Scroll Fade-in
Stats bar and upload panel fade in as they enter the viewport using the Intersection Observer API.

### Live Loading State
Animated dots during analysis so users know the request is in progress.

---

*Built for educational and portfolio purposes.*
