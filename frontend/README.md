# Homeless Aid Platform - Frontend

Next.js 14 frontend application with TypeScript, Tailwind CSS, and PWA support.

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Landing page
│   ├── login/             # Authentication
│   ├── dashboard/         # Main dashboard
│   │   ├── page.tsx
│   │   ├── add-individual/
│   │   ├── profiles/
│   │   ├── shelters/
│   │   ├── jobs/
│   │   └── analytics/
│   ├── admin/             # Admin pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── Forms/
│   ├── Cards/
│   ├── Maps/
│   ├── Charts/
│   └── Chatbot/
│       └── ChatWidget.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx
├── utils/                 # Utilities
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth helpers
│   └── validators.ts     # Form validation
├── public/               # Static assets
│   ├── manifest.json     # PWA manifest
│   └── images/
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## 🎨 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Chart.js** - Data visualization
- **Google Maps React** - Maps integration
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Hot Toast** - Notifications

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Homeless Aid Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Tailwind CSS

Customize colors and theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: { ... },
      secondary: { ... },
    },
  },
}
```

## 📱 PWA Features

- **Offline Support** - Service workers for offline functionality
- **Install Prompt** - Add to home screen
- **Push Notifications** - Real-time updates
- **Responsive Design** - Mobile-first approach
- **Touch Optimized** - 44px minimum touch targets

### PWA Configuration

Edit `public/manifest.json` for PWA settings.

## 🎯 Key Features

### Authentication
- Login/Register pages
- JWT token management
- Role-based access control
- Protected routes

### Dashboard
- Overview statistics
- Quick actions
- Recent activity
- Alerts and notifications

### Individual Management
- Add new individuals
- Profile management
- Needs assessment
- Document upload

### Resource Matching
- Shelter recommendations
- Job matching
- Training programs
- Accessibility scoring

### Route Optimization
- Multi-stop routing
- Volunteer route planning
- Interactive maps
- Travel time estimates

### Analytics
- Charts and graphs
- Performance metrics
- Trend analysis
- Export reports

### AI Chatbot
- Real-time chat
- Context-aware responses
- Multilingual support
- WebSocket connection

## 🧩 Components

### Layout Components

**Navbar** - Top navigation with user menu
**Sidebar** - Side navigation for dashboard
**Footer** - Footer with links

### Form Components

**ProfileForm** - Individual profile form
**NeedsAssessment** - Assessment questionnaire
**DocumentUpload** - File upload component

### Card Components

**IndividualCard** - Display individual info
**ShelterCard** - Shelter information
**JobCard** - Job listing card

### Map Components

**LocationMap** - Google Maps integration
- Marker clustering
- Route visualization
- Location search

### Chart Components

**AnalyticsCharts** - Data visualization
- Line charts
- Bar charts
- Pie charts
- Real-time updates

## 🎨 Styling

### Tailwind Utilities

```tsx
// Buttons
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>

// Cards
<div className="card">Content</div>

// Inputs
<input className="input" />

// Labels
<label className="label">Label</label>
```

### Custom Classes

- `.btn` - Base button styles
- `.card` - Card container
- `.input` - Form input
- `.label` - Form label
- `.spinner` - Loading spinner

### Responsive Design

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Content */}
</div>
```

## 🔐 Authentication

### Login Flow

```typescript
import { login } from '@/utils/auth'

const user = await login(email, password)
// Redirects to dashboard
```

### Protected Routes

```typescript
import { useAuth } from '@/contexts/AuthContext'

const { user, isAuthenticated } = useAuth()

if (!isAuthenticated) {
  redirect('/login')
}
```

### Role-Based Access

```typescript
import { hasRole } from '@/utils/auth'

if (hasRole('admin')) {
  // Show admin features
}
```

## 📡 API Integration

### Making API Calls

```typescript
import api from '@/utils/api'

// Get recommendations
const response = await api.recommendShelters({
  individual: {...},
  shelters: [...]
})

// Optimize route
const route = await api.optimizeRoute({
  start_location: {...},
  destinations: [...]
})
```

### WebSocket Connection

```typescript
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000/chat')

socket.on('response', (data) => {
  console.log(data)
})

socket.emit('message', {
  user_id: 'user_123',
  message: 'Hello'
})
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production (tests build)
npm run build
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

Set these in your deployment platform:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## 🔧 Development

### Adding New Pages

```bash
# Create new page
touch app/your-page/page.tsx
```

```typescript
export default function YourPage() {
  return <div>Your content</div>
}
```

### Adding New Components

```bash
# Create component
touch components/YourComponent.tsx
```

```typescript
export default function YourComponent() {
  return <div>Component</div>
}
```

### Adding New API Endpoints

Edit `utils/api.ts`:

```typescript
async yourEndpoint(data: any) {
  return this.client.post('/api/v1/your-endpoint', data)
}
```

## 📱 Mobile Optimization

- **Touch Targets**: Minimum 44px × 44px
- **Safe Areas**: Respects device safe areas
- **Responsive Images**: Next.js Image optimization
- **Lazy Loading**: Components load on demand
- **Service Workers**: Offline functionality
- **App-like Experience**: PWA installation

## 🎯 Performance

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Next.js Font optimization
- **Lazy Loading**: React.lazy for components
- **Caching**: API response caching
- **Bundle Size**: Optimized with tree shaking

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change port
PORT=3001 npm run dev
```

**API connection issues:**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running
- Check CORS settings

**Build errors:**
```bash
# Clear cache
rm -rf .next
npm run build
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [React Hook Form](https://react-hook-form.com)

---

For backend documentation, see `../backend/README.md`
