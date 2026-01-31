import os
import groq
import json

def analyze_resume(resume_text):
    api_key = os.environ.get("GROQ_API_KEY")
    # Fallback for local testing if env var not set in shell but maybe hardcoded for dev (not recommended but useful context)
    # Ideally user sets environment variable.
    
    if not api_key:
        return {"error": "Groq API Key (GROQ_API_KEY) not configured on the server."}

    client = groq.Client(api_key=api_key)
    
    prompt = f"""
You are a simple resume parsing assistant built for a student-level MVP project.

Your job is to read the resume text and extract only basic and useful details.
This is NOT a professional or corporate system.

VERY IMPORTANT RULES:
- Output must feel natural and human-written
- Language should be simple and normal, like a student wrote it
- Do NOT use fancy words or corporate-style sentences
- Do NOT sound like AI-generated content
- Keep everything short and clear

TASK:
Extract basic information from the resume text.
Do not guess or assume anything.
If something is missing, leave it empty.

OUTPUT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text
- No comments

JSON FORMAT (do not change keys):
{{
  "full_name": "",
  "email": "",
  "phone": "",
  "links": [],
  "skills": [],
  "education": "",
  "experience_summary": "",
  "projects": [],
  "certifications": [],
  "key_strengths": [],
  "resume_score": 0
}}

CONTENT RULES:
- Sentences must be short and simple
- Skills should be basic technical or soft skills
- Experience summary should be plain and easy to understand
- Key strengths should be simple human qualities (example: hard working, quick learner)
- Avoid words like: leveraged, optimized, synergy, scalable, dynamic
- resume_score must be an integer between 0 and 100
- Score should be based only on how complete the resume is
- Do NOT add new fields
- Do NOT rename any keys

This is a student assignment MVP.
The output should clearly look like student project data.

RESUME TEXT:
{resume_text}
"""

    try:
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5, # Lower temperature for cleaner JSON
        )
        result = completion.choices[0].message.content
        
        # Clean up potential markdown code blocks
        if "```json" in result:
            result = result.split("```json")[1].split("```")[0]
        elif "```" in result:
            result = result.split("```")[1].split("```")[0]
            
        return json.loads(result.strip())
             
    except Exception as e:
        return {"error": f"AI Processing Failed: {str(e)}"}
