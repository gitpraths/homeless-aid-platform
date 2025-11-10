# Homeless Aid Platform - AI Recommendation Engine

An AI-powered recommendation engine using Reinforcement Learning (Multi-Armed Bandit) to match homeless individuals with shelters, jobs, and training programs.

## Features

- **Multi-Armed Bandit Algorithm**: Uses contextual bandits with Upper Confidence Bound (UCB) for exploration-exploitation balance
- **Weighted Scoring System**:
  - Location proximity: 30%
  - Skill/requirement match: 25%
  - Availability: 20%
  - Priority level: 15%
  - Historical success rate: 10%
- **Explainable AI**: Each recommendation includes detailed scoring breakdown
- **Cold Start Handling**: Bonus scoring for new resources to encourage exploration
- **Feedback Loop**: Learns from successful placements to improve over time
- **A/B Testing**: Framework to compare recommendation strategies
- **Real-time Updates**: Recommendations adapt as new data arrives

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Run the API:
```bash
python api/app.py
```

Or with Gunicorn for production:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 api.app:app
```

## API Endpoints

### 1. Recommend Shelters
```bash
POST /api/v1/recommend/shelters
```

**Request:**
```json
{
  "individual": {
    "id": "ind_123",
    "skills": ["cooking", "cleaning"],
    "location": [40.7128, -74.0060],
    "priority": "high",
    "age": 35,
    "gender": "male"
  },
  "shelters": [
    {
      "id": "shelter_1",
      "name": "Hope Shelter",
      "location": [40.7580, -73.9855],
      "capacity": 50,
      "occupied": 35,
      "amenities": ["meals", "showers"],
      "priority_support": ["high", "critical"],
      "required_skills": []
    }
  ],
  "top_k": 5,
  "use_bandit": true
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "resource_id": "shelter_1",
      "resource_name": "Hope Shelter",
      "resource_type": "shelter",
      "score": 0.823,
      "explanation": {
        "location_score": 0.85,
        "skill_match_score": 1.0,
        "availability_score": 0.7,
        "priority_score": 1.0,
        "historical_score": 0.5,
        "composite_score": 0.823
      },
      "resource_details": {...}
    }
  ],
  "individual_id": "ind_123",
  "resource_type": "shelter"
}
```

### 2. Recommend Jobs
```bash
POST /api/v1/recommend/jobs
```

Similar structure to shelters, with job-specific fields.

### 3. Recommend Training Programs
```bash
POST /api/v1/recommend/training
```

Similar structure to shelters, with training-specific fields.

### 4. Provide Feedback
```bash
POST /api/v1/feedback
```

**Request:**
```json
{
  "resource_type": "shelter",
  "resource_id": "shelter_1",
  "success": true,
  "outcome_score": 0.85
}
```

### 5. Get Statistics
```bash
GET /api/v1/statistics
```

**Response:**
```json
{
  "bandit_stats": {
    "shelter": {
      "total_interactions": 150,
      "unique_resources": 12,
      "avg_reward": 0.78
    }
  },
  "epsilon": 0.05
}
```

### 6. A/B Testing
```bash
POST /api/v1/ab-test
```

**Request:**
```json
{
  "variant": "B"
}
```

## Algorithm Details

### Multi-Armed Bandit
- Uses epsilon-greedy strategy with UCB for action selection
- Balances exploration (trying new resources) with exploitation (using known good resources)
- Epsilon decays over time as the model learns

### Scoring System
Each recommendation is scored based on:
1. **Location Proximity**: Euclidean distance normalized to 0-1
2. **Skill Match**: Jaccard similarity between individual and required skills
3. **Availability**: Capacity utilization with preference for 30-80% occupancy
4. **Priority Alignment**: Match between individual priority and resource support
5. **Historical Success**: Average reward from past placements

### Cold Start Problem
- New resources receive a bonus score to encourage exploration
- Minimum interaction threshold before relying heavily on historical data
- UCB provides high confidence bonus for unexplored options

## Configuration

Edit `.env` file to customize:
- Learning rate and discount factor
- Exploration rate (epsilon) and decay
- Scoring weights for different factors
- API host and port

## Example Usage

```python
import requests

# Recommend shelters
response = requests.post('http://localhost:5000/api/v1/recommend/shelters', json={
    "individual": {
        "id": "ind_001",
        "skills": ["construction", "carpentry"],
        "location": [34.0522, -118.2437],
        "priority": "high"
    },
    "shelters": [...],
    "top_k": 3
})

recommendations = response.json()['recommendations']

# Provide feedback after placement
requests.post('http://localhost:5000/api/v1/feedback', json={
    "resource_type": "shelter",
    "resource_id": recommendations[0]['resource_id'],
    "success": True,
    "outcome_score": 0.9
})
```

## Testing

Run the example test:
```bash
python test_api.py
```

## Architecture

```
├── api/
│   ├── app.py              # Flask REST API
├── models/
│   ├── bandit.py           # Multi-Armed Bandit implementation
│   ├── scorer.py           # Scoring system
│   ├── recommendation_engine.py  # Main engine
├── config.py               # Configuration
├── requirements.txt        # Dependencies
└── README.md
```

## Future Enhancements

- Persistent storage for learned models (Redis/PostgreSQL)
- Advanced RL algorithms (Q-Learning, Deep Q-Networks)
- Multi-objective optimization
- Batch recommendation processing
- Real-time streaming updates
- Advanced A/B testing analytics
