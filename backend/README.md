# Backend - Homeless Aid Platform

AI-powered backend services for the Homeless Aid Platform.

## 🏗️ Structure

```
backend/
├── api/
│   ├── __init__.py
│   ├── app.py                      # Main Flask app
│   ├── route_api.py                # Route optimization endpoints
│   ├── needs_assessment_api.py     # Needs assessment endpoints
│   ├── chatbot_api.py              # Chatbot endpoints
│   └── websocket_app.py            # WebSocket server
├── models/
│   ├── __init__.py
│   ├── route_optimizer.py          # Route optimization
│   ├── recommendation_engine.py    # Recommendation engine
│   ├── bandit.py                   # Multi-Armed Bandit
│   ├── scorer.py                   # Scoring system
│   ├── nlp_analyzer.py             # NLP analysis
│   ├── smart_questionnaire.py      # Adaptive questionnaire
│   ├── risk_predictor.py           # Risk prediction
│   ├── risk_predictor_helpers.py   # Helper functions
│   └── chatbot.py                  # Chatbot logic
├── examples/
│   └── websocket_client.html       # WebSocket demo client
├── config.py                       # Configuration
├── requirements.txt                # Dependencies
├── .env.example                    # Environment template
├── test_api.py                     # Recommendation tests
├── test_routes.py                  # Route optimization tests
├── test_needs_assessment.py        # Needs assessment tests
├── test_chatbot.py                 # Chatbot tests
└── README.md                       # This file
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env and add your API keys
```

### Running the Server

**Option 1: Basic API (Recommendations + Needs Assessment + Routes)**
```bash
python api/app.py
```

**Option 2: Full System with WebSocket (includes Chatbot)**
```bash
python api/websocket_app.py
```

The server will start on `http://localhost:5000`

### Testing

```bash
# Test recommendation engine
python test_api.py

# Test route optimization
python test_routes.py

# Test needs assessment
python test_needs_assessment.py

# Test chatbot
python test_chatbot.py
```

## 🔧 Configuration

Edit `.env` file:

```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=5000
DEBUG=False

# OpenAI (optional - uses Hugging Face if not provided)
OPENAI_API_KEY=sk-your-key-here
USE_GPT4=False

# Google APIs (optional)
GOOGLE_MAPS_API_KEY=your-key-here
GOOGLE_TRANSLATE_API_KEY=your-key-here

# Model Parameters
LEARNING_RATE=0.1
EPSILON=0.1
EPSILON_DECAY=0.995
MIN_EPSILON=0.01
```

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Route Optimization
```bash
POST /api/v1/routes/optimize
POST /api/v1/routes/volunteer-optimization
POST /api/v1/routes/accessibility-score
POST /api/v1/routes/visit-times
POST /api/v1/routes/service-gaps
POST /api/v1/routes/distance
POST /api/v1/routes/travel-estimate
```

### Recommendations
```bash
POST /api/v1/recommend/shelters
POST /api/v1/recommend/jobs
POST /api/v1/recommend/training
POST /api/v1/feedback
POST /api/v1/ab-test
GET /api/v1/statistics
```

### Needs Assessment
```bash
POST /api/v1/analyze-notes
POST /api/v1/questionnaire/start
POST /api/v1/questionnaire/next
POST /api/v1/questionnaire/predict
POST /api/v1/risk-assessment
POST /api/v1/risk-assessment/job-placement
POST /api/v1/risk-assessment/chronic-homelessness
POST /api/v1/risk-assessment/intervention
```

### Chatbot
```bash
POST /api/v1/chat/message
GET /api/v1/chat/history/{user_id}
POST /api/v1/chat/clear/{user_id}
POST /api/v1/chat/detect-language
POST /api/v1/chat/translate
GET /api/v1/chat/workflows
GET /api/v1/chat/quick-answers
```

### WebSocket (Chatbot)
```javascript
// Connect to WebSocket
const socket = io('http://localhost:5000/chat');

// Events
socket.on('connect', callback);
socket.on('response', callback);
socket.emit('message', data);
```

## 🧪 Testing Examples

### Test Route Optimization
```bash
curl -X POST http://localhost:5000/api/v1/routes/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "start_location": {"lat": 40.7128, "lon": -74.0060},
    "destinations": [
      {"id": "shelter_1", "lat": 40.7580, "lon": -73.9855, "type": "shelter"}
    ]
  }'
```

### Test Recommendations
```bash
curl -X POST http://localhost:5000/api/v1/recommend/shelters \
  -H "Content-Type: application/json" \
  -d '{
    "individual": {
      "id": "ind_123",
      "skills": ["cooking"],
      "location": [40.7128, -74.0060],
      "priority": "high"
    },
    "shelters": [...]
  }'
```

### Test NLP Analysis
```bash
curl -X POST http://localhost:5000/api/v1/analyze-notes \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "John has construction skills. Needs shelter urgently."
  }'
```

### Test Chatbot
```bash
curl -X POST http://localhost:5000/api/v1/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "volunteer_001",
    "message": "How do I register a new person?",
    "user_role": "volunteer"
  }'
```

## 📦 Dependencies

Key packages:
- `flask` - Web framework
- `flask-socketio` - WebSocket support
- `openai` - GPT integration
- `transformers` - NLP models
- `scikit-learn` - ML algorithms
- `numpy` - Numerical computing
- `scipy` - Scientific computing
- `ortools` - Optimization (optional)
- `googlemaps` - Maps API (optional)

See `requirements.txt` for complete list.

## 🔒 Security

- Use HTTPS in production
- Set `DEBUG=False` in production
- Keep API keys in `.env` (never commit)
- Implement authentication/authorization
- Validate all inputs
- Rate limit API endpoints
- Encrypt sensitive data

## 📊 Performance Tips

1. **Caching**: Use Redis for conversation history and route caching
2. **Database**: Use PostgreSQL for persistent storage
3. **Load Balancing**: Use Gunicorn with multiple workers
4. **Async**: Consider async endpoints for long-running tasks
5. **Monitoring**: Add logging and metrics (Prometheus, Grafana)

## 🐛 Debugging

Enable debug mode:
```bash
# In .env
DEBUG=True
```

View logs:
```bash
# Flask logs to stdout
python api/app.py

# Or use logging
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🚀 Deployment

### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5000 api.app:app
```

### Using Docker
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "api.app:app"]
```

### Environment Variables for Production
```bash
API_HOST=0.0.0.0
API_PORT=5000
DEBUG=False
OPENAI_API_KEY=your-production-key
# Add database URLs, Redis URLs, etc.
```

## 📝 Development

### Adding New Endpoints

1. Create endpoint in appropriate API file:
```python
# api/your_api.py
@your_bp.route('/api/v1/your-endpoint', methods=['POST'])
def your_endpoint():
    # Implementation
    pass
```

2. Register blueprint in `api/app.py`:
```python
from api.your_api import your_bp
app.register_blueprint(your_bp)
```

3. Add tests in `test_your_feature.py`

### Adding New Models

1. Create model in `models/your_model.py`
2. Import in API file
3. Add tests
4. Update documentation

## 🔄 CI/CD

Recommended workflow:
1. Run tests on PR
2. Check code quality (pylint, black)
3. Build Docker image
4. Deploy to staging
5. Run integration tests
6. Deploy to production

## 📚 Additional Documentation

See `../docs/` for detailed documentation:
- Route Optimization
- Recommendation Engine
- Needs Assessment
- Chatbot Assistant
- Project Summary

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Change port in .env
API_PORT=5001
```

**Module not found:**
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**OpenAI API errors:**
- Check API key in `.env`
- Verify account has credits
- System falls back to Hugging Face if OpenAI unavailable

**WebSocket connection issues:**
- Use `websocket_app.py` instead of `app.py`
- Check CORS settings
- Verify client is connecting to correct namespace

## 🤝 Contributing

1. Follow PEP 8 style guide
2. Add type hints
3. Write docstrings
4. Add tests for new features
5. Update documentation

---

For more information, see the main project README and documentation in `../docs/`.
