import { useState, useEffect, useRef } from "react";
import "./App.css";

function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const HERO_WORDS = [
  { text: "Land",     accent: false },
  { text: "your",     accent: false },
  { text: "dream",    accent: false },
  { text: "job",      accent: false },
  { text: "with",     accent: false },
  { text: "a",        accent: false },
  { text: "stronger", accent: true  },
  { text: "resume",   accent: true  },
];

export default function App() {
  const [file, setFile]         = useState(null);
  const [jd, setJd]             = useState("");
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [barWidth, setBarWidth] = useState(0);
  const [wordFlags, setWordFlags] = useState(HERO_WORDS.map(() => false));

  const statsRef  = useFadeIn();
  const uploadRef = useFadeIn();

  // word fall animation on mount
  useEffect(() => {
    HERO_WORDS.forEach((_, i) => {
      setTimeout(() => {
        setWordFlags(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 100 + i * 90);
    });
  }, []);

  // animate bar after result arrives
  useEffect(() => {
    if (result?.job_match) setTimeout(() => setBarWidth(result.job_match), 200);
  }, [result]);

  const handleAnalyze = async () => {
    if (!file) { setError("Please upload a PDF resume first."); return; }
    setError(""); setLoading(true); setResult(null); setBarWidth(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jd);
    try {
      const res  = await fetch("http://127.0.0.1:8000/analyze", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <span className="nav-logo">Resume<span>X</span></span>
        <div className="nav-links">
          <a href="#how" className="nav-link">How it works</a>
          <button className="nav-cta">Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">✦ AI-powered resume analysis</div>
        <h1 className="hero-title">
          {HERO_WORDS.map((w, i) => (
            <span key={i} className={`fall-word${w.accent ? " accent" : ""}${wordFlags[i] ? " go" : ""}`}
              style={{ transitionDelay: `${i * 0.05}s` }}>
              {w.text}
            </span>
          ))}
        </h1>
        <p className={`hero-sub${wordFlags[7] ? " go" : ""}`}
          style={{ transitionDelay: "0.75s" }}>
          Upload your resume, paste a job description, and get an instant AI analysis — score, feedback, and job match in seconds.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-bar fade-in" ref={statsRef}>
        {[["98%","ATS pass rate"],["2s","Analysis time"],["React + FastAPI","Tech stack"],["Free","No signup needed"]].map(([num, lbl]) => (
          <div className="stat-item" key={lbl}>
            <div className="stat-num">{num}</div>
            <div className="stat-lbl">{lbl}</div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="main-grid">

        {/* Upload panel */}
        <div className="card fade-in" ref={uploadRef}>
          <div className="card-title">Your resume</div>
          <label className="upload-zone">
            <span className="upload-icon">☁</span>
            <div className="uz-title">Drop your resume here</div>
            <div className="uz-sub">PDF up to 5MB</div>
            <span className="browse-btn">Browse file</span>
            <input type="file" accept=".pdf" style={{ display: "none" }}
              onChange={e => { setFile(e.target.files[0]); setResult(null); setBarWidth(0); }} />
          </label>

          {file && (
            <div className="file-pill">
              <span style={{ fontSize: 18, color: "#993C1D" }}>📄</span>
              <span style={{ fontSize: 13, color: "#444441", flex: 1 }}>{file.name}</span>
              <span style={{ color: "#0F6E56" }}>✓</span>
            </div>
          )}

          <span className="jd-label">Job description (optional — for match score)</span>
          <textarea className="jd-textarea" value={jd} onChange={e => setJd(e.target.value)}
            placeholder="Paste the job description here…" />

          {error && <p style={{ fontSize: 12, color: "#A32D2D", marginTop: 6 }}>{error}</p>}

          <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? <span>Analyzing<span className="loading-dots" /></span> : "Analyze resume"}
          </button>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {!result && !loading && (
            <div className="card" style={{ padding: "3rem 1.25rem", textAlign: "center", color: "#B4B2A9", fontSize: 14 }}>
              Upload a resume and click analyze to see results
            </div>
          )}

          {loading && (
            <div className="loading-card">
              Analyzing your resume<span className="loading-dots" />
            </div>
          )}

          {result && (
            <>
              <div className="card results-enter">
                <div className="card-title">Analysis results</div>
                <div className="score-grid">
                  {[
                    ["Overall score", `${result.overall_score}/100`, "#534AB7"],
                    ["Job match", result.job_match != null ? `${result.job_match}%` : "N/A", "#0F6E56"],
                    ["ATS score", `${result.ats_score}%`, "#BA7517"],
                    ["Keyword gaps", result.missing_keywords?.length ?? 0, "#993C1D"],
                  ].map(([label, val, color]) => (
                    <div className="score-card" key={label}>
                      <div style={{ fontSize: 11, color: "#B4B2A9", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 22, fontWeight: 500, color }}>{val}</div>
                    </div>
                  ))}
                </div>

                <div className="divider" />

                <div className="section-head">Strengths</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                  {result.strengths?.map(s => <span className="tag tag-green" key={s}>{s}</span>)}
                </div>

                <div className="section-head">Weaknesses</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                  {result.weaknesses?.map(w => <span className="tag tag-red" key={w}>{w}</span>)}
                </div>

                <div className="section-head">Suggestions</div>
                {result.suggestions?.map(s => (
                  <div key={s} style={{ display: "flex", gap: 7, alignItems: "flex-start", fontSize: 12, color: "#5F5E5A", marginBottom: 7, lineHeight: 1.5 }}>
                    <span style={{ color: "#534AB7", flexShrink: 0 }}>→</span>{s}
                  </div>
                ))}
              </div>

              {result.missing_keywords?.length > 0 && (
                <div className="card results-enter">
                  <div className="card-title">Job match</div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888780", marginBottom: 5 }}>
                      <span>Match score</span>
                      <span style={{ fontWeight: 500, color: "#0F6E56" }}>{result.job_match}%</span>
                    </div>
                    <div style={{ height: 6, background: "#f8f8f6", borderRadius: 3, border: "0.5px solid #e8e8e4", overflow: "hidden" }}>
                      <div className="bar-fill" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                  <div className="section-head">Missing keywords</div>
                  {result.missing_keywords?.map(k => (
                    <div key={k.keyword} style={{ display: "flex", gap: 7, alignItems: "center", fontSize: 12, color: "#5F5E5A", marginBottom: 6 }}>
                      <span style={{ color: "#BA7517", flexShrink: 0 }}>⚠</span>
                      <span><strong>{k.keyword}</strong> — {k.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="footer">ResumeX — built with React + FastAPI + Gemini API</div>
    </div>
  );
}