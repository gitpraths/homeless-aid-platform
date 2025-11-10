# Homeless Aid Platform

Complete AI-powered platform for homeless assistance with intelligent routing, recommendations, needs assessment, and chatbot support.

## 🏗️ Project Structure

```
homeless-aid-platform/
├── backend/              # Backend API and AI services
│   ├── api/             # REST and WebSocket APIs
│   ├── models/          # AI models and algorithms
│   ├── examples/        # Example clients
│   ├── config.py        # Configuration
│   ├── requirements.txt # Python dependencies
│   └── test_*.py        # Test suites
├── frontend/            # Frontend application (to be added)
├── docs/                # Documentation
│   ├── README.md                      # Recommendation engine
│   ├── ROUTE_OPTIMIZATION_README.md   # Route optimization
│   ├── NEEDS_ASSESSMENT_README.md     # Needs assessment
│   ├── CHATBOT_README.md              # Chatbot assistant
│   └── PROJECT_SUMMARY.md             # Complete overview
└── README.md            # This file
```

## 🚀 Quick Start

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Add your API keys to .env

# Run the API server
python api/app.py

# Or run with WebSocket support (includes chatbot)
python api/websocket_app.py
```

### Testing

```bash
cd backend

# Test all systems
python test_api.py              # Recommendation engine
python test_routes.py           # Route optimization
python test_needs_assessment.py # Needs assessment
python test_chatbot.py          # Chatbot assistant
```

## 🎯 Features

### 1. AI Route Optimization
- Multi-stop route optimization (TSP)
- Volunteer route planning with workload balancing
- Resource accessibility scoring
- Visit time suggestions
- Service gap analysis

### 2. AI Recommendation Engine
- Multi-Armed Bandit algorithm
- Matches individuals with shelters, jobs, training
- Learns from feedback
- Explainable AI with score breakdowns

### 3. AI Needs Assessment
- NLP analysis of volunteer notes
- Smart adaptive questionnaires
- Risk prediction (job placement, chronic homelessness, intervention)
- Sentiment analysis and mental health detection

### 4. AI Chatbot Assistant
- Context-aware responses (volunteer, staff, admin)
- Multilingual support (English, Hindi, Tamil, Telugu)
- Guided workflows
- Real-time WebSocket communication
- GPT-4 function calling

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Complete system overview
- **[Route Optimization](docs/ROUTE_OPTIMIZATION_README.md)** - Routing and accessibility
- **[Recommendation Engine](docs/README.md)** - RL-based matching
- **[Needs Assessment](docs/NEEDS_ASSESSMENT_README.md)** - NLP and risk prediction
- **[Chatbot Assistant](docs/CHATBOT_README.md)** - Conversational AI

## 🔧 Technology Stack

### Backend
- **Python 3.8+**
- **Flask** - REST API framework
- **Flask-SocketIO** - WebSocket support
- **OpenAI GPT-4** - Chatbot intelligence
- **Hugging Face Transformers** - NLP analysis
- **scikit-learn** - ML models
- **NumPy/SciPy** - Numerical computations
- **OR-Tools** - Advanced optimization (optional)

### Frontend (Coming Soon)
- React.js / Next.js
- TypeScript
- Tailwind CSS
- Socket.IO client
- Google Maps integration

## 🌐 API Endpoints

### Route Optimization
- `POST /api/v1/routes/optimize` - Multi-stop routing
- `POST /api/v1/routes/volunteer-optimization` - Volunteer planning
- `POST /api/v1/routes/accessibility-score` - Accessibility scoring
- `POST /api/v1/routes/visit-times` - Visit time suggestions
- `POST /api/v1/routes/service-gaps` - Gap analysis

### Recommendations
- `POST /api/v1/recommend/shelters` - Shelter matching
- `POST /api/v1/recommend/jobs` - Job matching
- `POST /api/v1/recommend/training` - Training matching
- `POST /api/v1/feedback` - Provide feedback

### Needs Assessment
- `POST /api/v1/analyze-notes` - NLP analysis
- `POST /api/v1/questionnaire/start` - Start assessment
- `POST /api/v1/risk-assessment` - Risk prediction

### Chatbot
- `POST /api/v1/chat/message` - Send message
- `GET /api/v1/chat/history/{user_id}` - Get history
- WebSocket: `/chat` namespace

## 🔒 Environment Variables

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
```

## 📊 Performance

- **Route Optimization**: <500ms for 10 stops
- **Recommendation Engine**: <100ms per recommendation
- **NLP Analysis**: ~1-2s first run, <500ms cached
- **Risk Assessment**: <100ms
- **Chatbot Response**: 1-3s (GPT-4), <1s (GPT-3.5)
- **WebSocket Latency**: <50ms

## 🎯 Use Cases

### For Volunteers
- Optimize daily outreach routes
- Find accessible shelters quickly
- Conduct smart needs assessments
- Get AI-powered recommendations
- Chat in native language

### For Staff
- Optimize volunteer assignments
- Analyze volunteer notes automatically
- Predict risk levels
- Track performance metrics
- Identify service gaps

### For Admins
- Monitor system performance
- A/B test strategies
- Configure AI models
- Analyze trends
- Manage escalations

## 🚧 Roadmap

### Phase 1: Backend (Complete ✅)
- [x] Route optimization
- [x] Recommendation engine
- [x] Needs assessment
- [x] Chatbot assistant

### Phase 2: Frontend (Next)
- [ ] React dashboard
- [ ] Interactive maps
- [ ] Real-time chat interface
- [ ] Mobile-responsive design
- [ ] Volunteer portal
- [ ] Admin panel

### Phase 3: Integration
- [ ] Database integration (PostgreSQL)
- [ ] Authentication & authorization
- [ ] Real-time notifications
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics

### Phase 4: Scale
- [ ] Multi-tenant support
- [ ] Cloud deployment (AWS/GCP)
- [ ] Load balancing
- [ ] Caching layer (Redis)
- [ ] Monitoring & logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check documentation in `docs/`
- Review test files for examples

## 🙏 Acknowledgments

Built with ❤️ to help those in need.

---

**Next Steps:**
1. Set up backend: `cd backend && pip install -r requirements.txt`
2. Configure environment: `cp backend/.env.example backend/.env`
3. Start server: `cd backend && python api/websocket_app.py`
4. Run tests: `cd backend && python test_api.py`
5. Build frontend: Coming soon!
