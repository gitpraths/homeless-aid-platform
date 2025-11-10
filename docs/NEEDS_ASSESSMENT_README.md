# AI-Powered Needs Assessment System

Advanced NLP and ML system for analyzing homeless individuals' needs, conducting smart assessments, and predicting risks.

## Features

### 1. NLP Analysis
Analyzes volunteer notes to extract:
- **Skills mentioned** (construction, cooking, retail, etc.)
- **Health concerns** (mental, physical, substance-related)
- **Urgency indicators** (critical, high, medium, low)
- **Sentiment analysis** with mental health risk detection
- **Auto-categorized needs**:
  - Immediate: shelter, food, crisis intervention
  - Short-term: medical care, documentation, basic supplies
  - Long-term: employment, training, permanent housing

### 2. Smart Questionnaire
Dynamic questionnaire that:
- **Adapts based on previous answers** (skips irrelevant questions)
- **Provides auto-complete suggestions** for common responses
- **Predicts missing information** using similar profiles
- **Tracks progress** through assessment sections
- **Conditional logic** (e.g., skip work questions if retired)

### 3. Risk Prediction
Three predictive models:

**Job Placement Success**
- Predicts likelihood of successful employment
- Considers: age, skills, education, health, resources
- Provides actionable recommendations

**Chronic Homelessness Risk**
- Identifies individuals at high risk
- Factors: duration, age, health, support network
- Suggests appropriate interventions

**Immediate Intervention Flagging**
- Flags cases requiring urgent attention
- Detects crisis situations from notes
- Provides immediate action steps

## API Endpoints

### NLP Analysis
```bash
POST /api/v1/analyze-notes
```

**Request:**
```json
{
  "notes": "John has construction skills. Feeling depressed. Needs shelter urgently."
}
```

**Response:**
```json
{
  "analysis": {
    "skills": ["construction"],
    "health_concerns": {
      "mental": ["depression"]
    },
    "urgency_level": "high",
    "sentiment": {
      "label": "NEGATIVE",
      "score": -0.65,
      "mental_health_risk": "medium"
    },
    "needs_categories": {
      "immediate": ["shelter"],
      "long_term": ["employment"]
    }
  }
}
```

### Smart Questionnaire

**Start Questionnaire:**
```bash
POST /api/v1/questionnaire/start
```

**Get Next Questions:**
```bash
POST /api/v1/questionnaire/next
```

**Predict Missing Info:**
```bash
POST /api/v1/questionnaire/predict
```

### Risk Assessment

**Comprehensive Assessment:**
```bash
POST /api/v1/risk-assessment
```

**Request:**
```json
{
  "profile": {
    "age": 35,
    "skills": ["construction"],
    "education": "High School/GED",
    "duration_homeless": "6-12 months",
    "current_situation": "Street",
    "mental_health_issues": true
  },
  "notes": "Optional volunteer notes"
}
```

**Response:**
```json
{
  "assessment": {
    "job_placement": {
      "probability": 0.65,
      "risk_level": "medium",
      "factors": ["Age favorable", "Limited skills"],
      "recommendations": ["Skills training", "ID assistance"]
    },
    "chronic_homelessness": {
      "probability": 0.45,
      "risk_level": "medium",
      "factors": ["6-12 months duration", "Mental health challenges"],
      "interventions": ["Regular case management", "Mental health counseling"]
    },
    "immediate_intervention": {
      "requires_intervention": true,
      "urgency": "high",
      "reasons": ["Currently unsheltered"],
      "immediate_actions": ["Arrange shelter", "Connect with services"]
    },
    "overall_risk_score": 0.523
  }
}
```

**Individual Predictions:**
```bash
POST /api/v1/risk-assessment/job-placement
POST /api/v1/risk-assessment/chronic-homelessness
POST /api/v1/risk-assessment/intervention
```

## NLP Models

### Using Hugging Face (Default)
Free, runs locally, no API key needed:
- **Sentiment**: DistilBERT fine-tuned on SST-2
- **NER**: BERT-base for named entity recognition
- Models download automatically on first use

### Using OpenAI (Optional)
More accurate, requires API key:
1. Add to `.env`: `OPENAI_API_KEY=your_key_here`
2. Uses GPT-3.5-turbo for analysis
3. Better context understanding

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# First run will download Hugging Face models (~500MB)
# This happens automatically
```

## Testing

```bash
# Run comprehensive tests
python test_needs_assessment.py
```

## Questionnaire Sections

1. **Basic Info**: Age, gender, education
2. **Housing Situation**: Current location, duration homeless
3. **Employment & Skills**: Work history, skills, job interest
4. **Health Assessment**: Conditions, medications, mental health
5. **Immediate Needs**: Urgent priorities, primary goals

## Risk Scoring

### Job Placement Factors
- Age (younger = higher success)
- Skills count and relevance
- Education level
- Work experience
- Resources (ID, phone, transportation)
- Health status

### Chronic Risk Factors
- Duration of homelessness
- Substance abuse
- Mental health issues
- Age (older = higher risk)
- Family support
- Previous shelter stays

### Intervention Triggers
- Currently unsheltered
- Critical urgency in notes
- High mental health risk
- Urgent medical needs
- Medication access issues

## Example Usage

```python
import requests

# Analyze volunteer notes
response = requests.post('http://localhost:5000/api/v1/analyze-notes', json={
    "notes": "Sarah, 28, has retail experience. Staying in car. Needs job help."
})
analysis = response.json()['analysis']

# Start questionnaire
response = requests.post('http://localhost:5000/api/v1/questionnaire/start', json={
    "individual_id": "sarah_001",
    "initial_data": {}
})
questions = response.json()['questions']

# Get risk assessment
response = requests.post('http://localhost:5000/api/v1/risk-assessment', json={
    "profile": {
        "age": 28,
        "skills": ["retail"],
        "current_situation": "Car",
        "duration_homeless": "Less than 6 months"
    },
    "notes": "Has retail experience. Staying in car. Needs job help."
})
assessment = response.json()['assessment']

print(f"Job placement probability: {assessment['job_placement']['probability']}")
print(f"Recommendations: {assessment['job_placement']['recommendations']}")
```

## Model Training (Future)

The system uses rule-based models by default. To train ML models:

1. Collect historical data (profiles + outcomes)
2. Train models using `train_models.py` (to be created)
3. Models saved to `models/artifacts/`
4. System automatically uses trained models if available

## Architecture

```
models/
├── nlp_analyzer.py           # NLP analysis with transformers
├── smart_questionnaire.py    # Adaptive questionnaire logic
├── risk_predictor.py         # Risk prediction models
└── risk_predictor_helpers.py # Helper functions

api/
├── app.py                    # Main Flask app
└── needs_assessment_api.py   # Needs assessment endpoints
```

## Performance

- NLP analysis: ~1-2 seconds (first run), <500ms (cached)
- Risk assessment: <100ms
- Questionnaire: <50ms per section
- Handles concurrent requests efficiently

## Privacy & Security

- No data stored by default (stateless API)
- Sensitive information should be encrypted in transit
- Consider HIPAA compliance for production
- Implement authentication/authorization as needed
