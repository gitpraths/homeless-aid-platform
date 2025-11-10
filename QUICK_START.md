# 🚀 Quick Start Guide

## Complete Setup in 5 Minutes

### 1. Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Start server (creates database automatically)
python app.py
```

In a new terminal:
```bash
cd backend

# Seed sample data
python seed_data.py
```

✅ Backend running on `http://localhost:5000`

### 2. Frontend Setup (2 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Start development server
npm run dev
```

✅ Frontend running on `http://localhost:3000`

### 3. Test Integration (1 minute)

Visit these URLs:

1. **Design System Demo**
   - http://localhost:3000/design-system
   - See all UI components

2. **Mobile Demo**
   - http://localhost:3000/example-mobile
   - Test mobile features

3. **API Integration Demo**
   - http://localhost:3000/api-demo
   - Test backend connection

4. **Login**
   - http://localhost:3000/login
   - Use: `admin@example.com` / `admin123`

## 📋 Test Credentials

After seeding data:

```
Admin:       admin@example.com / admin123
Volunteer:   volunteer@example.com / volunteer123
Coordinator: coordinator@example.com / coordinator123
```

## 🧪 Quick Tests

### Test Backend API

```bash
# Health check
curl http://localhost:5000/api/analytics/dashboard

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Test Frontend

1. Open http://localhost:3000
2. Click "Login"
3. Enter credentials
4. Explore dashboard

### Test Real-Time Updates

1. Open http://localhost:3000/api-demo
2. Open browser console
3. Look for: `✅ Connected to Flask backend via Socket.io`
4. Test creating individuals and see real-time updates

## 📁 Project Structure

```
homeless-aid-platform/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── database.py            # SQLite3 database
│   ├── seed_data.py           # Sample data
│   ├── homeless_aid.db        # Database file (auto-created)
│   └── uploads/               # Uploaded files
│
├── frontend/
│   ├── app/                   # Next.js pages
│   ├── components/            # React components
│   ├── utils/                 # API client, helpers
│   ├── hooks/                 # Custom React hooks
│   └── public/                # Static assets
│
└── docs/                      # Documentation
```

## 🔑 Key Features

### Backend
- ✅ SQLite3 database (11 tables)
- ✅ JWT authentication
- ✅ RESTful API
- ✅ Socket.IO real-time updates
- ✅ File upload support

### Frontend
- ✅ Next.js 14 with TypeScript
- ✅ WCAG 2.1 AA accessible design
- ✅ Mobile-first responsive
- ✅ Real-time updates
- ✅ Offline support

## 📚 Documentation

### Backend
- `backend/DATABASE_SETUP.md` - Database guide
- `backend/FLASK_API_SETUP.md` - API examples
- `backend/README.md` - Backend overview

### Frontend
- `frontend/DESIGN_SYSTEM.md` - Design system
- `frontend/API_INTEGRATION_GUIDE.md` - API usage
- `frontend/QUICK_START_DESIGN.md` - Quick reference

### Integration
- `SQLITE_INTEGRATION_SUMMARY.md` - Database integration
- `API_INTEGRATION_SUMMARY.md` - API integration

## 🛠️ Common Commands

### Backend

```bash
# Start server
python app.py

# Seed data
python seed_data.py

# View database
sqlite3 homeless_aid.db
.tables
SELECT * FROM individuals;
.quit

# Reset database
rm homeless_aid.db
python app.py
python seed_data.py
```

### Frontend

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 in use:**
```python
# In app.py, change port
socketio.run(app, port=5001)
```

**Database locked:**
```bash
# Close all connections and restart
rm homeless_aid.db
python app.py
```

**Module not found:**
```bash
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 in use:**
```bash
# Next.js will prompt to use 3001
# Or set PORT environment variable
PORT=3001 npm run dev
```

**API connection failed:**
```bash
# Check NEXT_PUBLIC_API_URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Dependencies error:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Next Steps

1. ✅ Start backend and frontend
2. ✅ Login with test credentials
3. ✅ Explore demo pages
4. ✅ Test API integration
5. ✅ Review documentation
6. 📝 Customize for your needs
7. 🚀 Deploy to production

## 📞 Getting Help

1. Check documentation in respective folders
2. Review error messages in console
3. Test with curl or Postman
4. Check browser network tab
5. Review backend logs

## 🎉 You're Ready!

Your complete homeless aid platform is now running with:
- ✅ Persistent database
- ✅ RESTful API
- ✅ Real-time updates
- ✅ Accessible UI
- ✅ Mobile support
- ✅ Offline capabilities

Start building amazing features! 🚀
