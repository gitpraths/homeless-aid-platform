# AI Chatbot Assistant

Intelligent, context-aware chatbot for the Homeless Aid Platform with multilingual support, guided workflows, and real-time WebSocket communication.

## Features

### Context-Aware Responses
- **Role-based prompts**: Different responses for volunteers, staff, and admins
- **Page context**: Understands what page user is on
- **Conversation memory**: Maintains context across multiple messages
- **Smart escalation**: Automatically escalates to humans when confidence < 70%

### Guided Workflows
Step-by-step guidance for common tasks:
- Register new homeless individual
- Conduct needs assessment
- Find shelter placement
- Connect to resources (jobs, training, services)
- Log volunteer hours

### Multilingual Support
- **Auto-detect language** from first message
- **Supported languages**: English, Hindi, Tamil, Telugu
- **Real-time translation** using Google Translate API
- **Seamless switching** between languages

### Real-Time Communication
- **WebSocket support** via Flask-SocketIO
- **Instant responses** with typing indicators
- **Room-based chat** for private conversations
- **Broadcast notifications** for escalations

### GPT-4 Function Calling
Smart integration with platform data:
- Get available shelters
- Retrieve individual information
- Access resource databases
- Trigger workflows
- Escalate to human support

## API Endpoints

### REST API

**Send Message:**
```bash
POST /api/v1/chat/message
```

**Request:**
```json
{
  "user_id": "volunteer_001",
  "message": "How do I register a new person?",
  "user_role": "volunteer",
  "language": "en",
  "context": {
    "current_page": "dashboard",
    "selected_individual": null
  }
}
```

**Response:**
```json
{
  "response": "I'll guide you through the registration process:\n\n1. Go to Dashboard > Add New Individual\n2. Fill in basic information (name, age, gender)\n3. Capture location using GPS\n4. Upload ID documents if available\n5. Complete needs assessment\n\nWould you like detailed steps for any of these?",
  "confidence": 0.85,
  "should_escalate": false,
  "language": "en",
  "timestamp": "2024-11-10T10:30:00Z"
}
```

**Get Chat History:**
```bash
GET /api/v1/chat/history/{user_id}
```

**Clear History:**
```bash
POST /api/v1/chat/clear/{user_id}
```

**Detect Language:**
```bash
POST /api/v1/chat/detect-language
```

**Translate Text:**
```bash
POST /api/v1/chat/translate
```

**Get Workflows:**
```bash
GET /api/v1/chat/workflows
```

**Get Quick Answers:**
```bash
GET /api/v1/chat/quick-answers
```

### WebSocket API

**Connect:**
```javascript
const socket = io('http://localhost:5000/chat');

socket.on('connect', () => {
  console.log('Connected to chat server');
});
```

**Join Room:**
```javascript
socket.emit('join', { user_id: 'volunteer_001' });
```

**Send Message:**
```javascript
socket.emit('message', {
  user_id: 'volunteer_001',
  message: 'What shelters are available?',
  user_role: 'volunteer',
  language: 'en'
});
```

**Receive Response:**
```javascript
socket.on('response', (data) => {
  console.log('Bot:', data.response);
  console.log('Confidence:', data.confidence);
});
```

**Typing Indicator:**
```javascript
socket.emit('typing', { user_id: 'volunteer_001' });

socket.on('user_typing', (data) => {
  console.log('User is typing...');
});
```

**Escalation Notification:**
```javascript
socket.on('escalation_needed', (data) => {
  console.log('Escalation needed:', data.reason);
  // Notify staff member
});
```

## Conversation Examples

### Example 1: Registration Workflow
```
User: "How do I add a new homeless person?"

Bot: "I'll guide you through the registration process:

1. Go to Dashboard > Add New Individual
2. Fill in basic information (name, age, gender)
3. Capture location using GPS
4. Upload ID documents if available
5. Complete needs assessment

Would you like detailed steps for any of these?"

User: "Yes, tell me more about step 3"

Bot: "For capturing location:

Option 1 - GPS:
- Click 'Use Current Location' button
- Allow browser location access
- Location will be automatically captured

Option 2 - Manual Entry:
- Enter street address
- Select city and state
- System will geocode the address

The location helps us find nearby resources and shelters."
```

### Example 2: Shelter Query
```
User: "What shelters have beds available?"

Bot: "I found 2 shelters with available beds:

1. Hope Shelter
   - Available beds: 15
   - Location: Downtown
   - Amenities: meals, showers, counseling

2. Community Haven
   - Available beds: 8
   - Location: Downtown
   - Amenities: meals, medical care

Total available beds: 23

Would you like to place someone in a shelter?"
```

### Example 3: Multilingual Support
```
User: "नमस्ते, मुझे मदद चाहिए" (Hindi: "Hello, I need help")

Bot: "नमस्कार! मैं आपकी कैसे मदद कर सकता हूं? मैं आपको निम्नलिखित में मदद कर सकता हूं:
- नए व्यक्ति का पंजीकरण
- आश्रय खोजना
- संसाधनों से जुड़ना
- आवश्यकता मूल्यांकन"

(Translation: "Hello! How can I help you? I can help you with:
- Registering new individuals
- Finding shelter
- Connecting to resources
- Needs assessment")
```

### Example 4: Emergency Escalation
```
User: "Someone is having a medical emergency!"

Bot: "This is a medical emergency. Please:

1. Call 911 immediately
2. Stay with the person
3. Do not move them unless in immediate danger
4. Provide first aid if trained

I'm connecting you with a staff member now for additional support.

[Confidence: 0.95, Escalated: Yes]"
```

## Role-Based Responses

### Volunteer
- Simple, step-by-step instructions
- Focus on common tasks
- Empathetic and supportive tone
- Limited to volunteer-level information

### Staff
- Detailed operational information
- Case management workflows
- Access to full individual profiles
- Reporting and analytics guidance

### Admin
- System administration help
- Technical configuration details
- User management guidance
- Advanced features and integrations

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# Run with WebSocket support
python api/websocket_app.py
```

## Configuration

### OpenAI Setup
```bash
# In .env file
OPENAI_API_KEY=sk-your-key-here
USE_GPT4=False  # Set to True for GPT-4 (more expensive but better)
```

### Google Translate (Optional)
```bash
# For production multilingual support
GOOGLE_TRANSLATE_API_KEY=your-key-here
```

## Testing

```bash
# Test REST API
python test_chatbot.py

# Test WebSocket (requires separate client)
# See examples/websocket_client.html
```

## Function Calling

The chatbot uses GPT function calling to integrate with platform data:

**Available Functions:**
- `get_available_shelters`: Query shelter availability
- `get_individual_info`: Retrieve individual profiles
- `start_registration_workflow`: Begin guided registration
- `get_resource_info`: Access jobs, training, services
- `escalate_to_human`: Connect with staff member

Functions are automatically called when relevant to user queries.

## Confidence Scoring

Responses include confidence scores (0.0 - 1.0):
- **0.85+**: High confidence, no escalation needed
- **0.70-0.84**: Medium confidence, monitor
- **< 0.70**: Low confidence, escalate to human

Escalation triggers:
- Low confidence score
- Emergency keywords detected
- User explicitly requests human help
- Complex queries outside training data

## Conversation History

- Maintains last 10 messages per user
- Stored in memory (use Redis for production)
- Provides context for follow-up questions
- Can be cleared by user or automatically after timeout

## Multilingual Implementation

### Language Detection
```python
# Automatic detection from first message
detected = detect_language("नमस्ते")  # Returns 'hi'
```

### Translation Flow
1. User sends message in native language
2. System detects language
3. Translates to English for GPT processing
4. GPT generates English response
5. Translates response back to user's language
6. Returns translated response

### Supported Languages
- **en**: English (default)
- **hi**: Hindi (Devanagari script)
- **ta**: Tamil (Tamil script)
- **te**: Telugu (Telugu script)

## Production Considerations

### Scalability
- Use Redis for conversation history
- Implement rate limiting
- Add caching for common queries
- Load balance WebSocket connections

### Security
- Authenticate WebSocket connections
- Validate user roles and permissions
- Sanitize user inputs
- Encrypt sensitive data

### Monitoring
- Log all conversations (with privacy compliance)
- Track confidence scores
- Monitor escalation rates
- Measure response times

### Cost Optimization
- Use GPT-3.5-turbo for most queries (cheaper)
- Reserve GPT-4 for complex questions
- Cache common responses
- Implement smart retry logic

## Example Client Integration

### React Component
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000/chat');

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    socket.on('response', (data) => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: data.response,
        confidence: data.confidence
      }]);
    });
  }, []);
  
  const sendMessage = (text) => {
    socket.emit('message', {
      user_id: currentUser.id,
      message: text,
      user_role: currentUser.role,
      language: currentUser.language
    });
  };
  
  return <ChatInterface messages={messages} onSend={sendMessage} />;
}
```

## Future Enhancements

- Voice input/output support
- Image recognition for documents
- Sentiment analysis for user frustration
- Proactive suggestions based on context
- Integration with calendar for appointments
- SMS/WhatsApp integration
- Advanced analytics dashboard
