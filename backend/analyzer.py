from google import genai
import json
import re
import os

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def analyze_resume(resume_text: str, job_description: str = "") -> dict:
    jd_section = f"\n\nJob Description:\n{job_description}" if job_description else ""

    prompt = f"""
You are an expert resume reviewer. Analyze the resume below and return ONLY a JSON object with no markdown, no backticks, no extra text.

Resume:
{resume_text}
{jd_section}

Return this exact JSON structure:
{{
  "overall_score": <integer 0-100>,
  "ats_score": <integer 0-100>,
  "job_match": <integer 0-100 or null if no JD provided>,
  "strengths": [<list of 3 short strings>],
  "weaknesses": [<list of 3 short strings>],
  "suggestions": [<list of 3 actionable strings>],
  "missing_keywords": [
    {{"keyword": "<word>", "reason": "<why it matters>"}}
  ]
}}

missing_keywords should be empty array if no job description was provided.
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    raw = response.text

    match = re.search(r'\{[\s\S]*\}', raw)
    if not match:
        raise ValueError("Could not parse Gemini response")

    return json.loads(match.group())