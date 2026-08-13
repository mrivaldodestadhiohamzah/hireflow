"""Demo-only, provider-neutral candidate matching service.

Keep an LLM provider behind a separate adapter in production. This heuristic route
ensures the product remains useful when no provider credentials are configured.
"""
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="HireFlow AI Service", version="0.1.0")

class MatchRequest(BaseModel):
    resume_text: str = Field(min_length=20, max_length=100_000)
    job_description: str = Field(min_length=20, max_length=100_000)
    required_skills: list[str] = Field(default_factory=list, max_length=30)

class Analysis(BaseModel):
    overall_match_score: int
    matched_skills: list[str]
    missing_skills: list[str]
    experience_relevance: str
    strengths: list[str]
    potential_concerns: list[str]
    summary: str
    disclaimer: str

@app.get("/health")
def health():
    return {"service": "hireflow-ai", "status": "healthy", "mode": "heuristic-demo"}

@app.post("/analyze", response_model=Analysis)
def analyze(payload: MatchRequest):
    resume = payload.resume_text.lower()
    skills = [skill.strip() for skill in payload.required_skills if skill.strip()]
    matched = [skill for skill in skills if skill.lower() in resume]
    missing = [skill for skill in skills if skill.lower() not in resume]
    score = 50 if not skills else min(95, round(45 + 50 * len(matched) / len(skills)))
    relevance = "High" if score >= 80 else "Moderate" if score >= 65 else "Needs recruiter review"
    return Analysis(
        overall_match_score=score,
        matched_skills=matched,
        missing_skills=missing,
        experience_relevance=relevance,
        strengths=["Relevant skills found in the submitted resume"] if matched else ["Resume received for recruiter review"],
        potential_concerns=["Confirm depth of experience during the interview"] if missing else [],
        summary="A structured, keyword-based starting point for a recruiter’s resume review.",
        disclaimer="AI-assisted analysis is guidance, not a hiring decision. Review the original resume before proceeding.",
    )
