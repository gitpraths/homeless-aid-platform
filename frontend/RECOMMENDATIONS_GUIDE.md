# AI Recommendations Interface

Comprehensive guide for the recommendations system showing shelter and job matches.

## 📋 Overview

The recommendations interface uses AI to match homeless individuals with shelters, jobs, and training programs based on their profile, needs, and preferences.

## 🎯 Features Implemented

### ✅ Shelter Recommendations

**Card Layout:**
- Photo/placeholder image
- Shelter name and location
- Distance from individual
- Available beds (real-time)
- Amenity icons
- Match score (0-100%)
- Rating (stars)
- Reserve bed button
- View on map button

**Match Explanation:**
- Expandable section
- Visual checkmarks
- Detailed reasons:
  - Distance proximity
  - Required amenities
  - Availability
  - Success rate
  - Special features

**Example:**
```
✓ Only 2.3 km away from current location
✓ Has medical facilities (needed for health conditions)
✓ Family rooms available
✓ High success rate (87%) for similar profiles
✓ Wheelchair accessible
```

### ✅ Job Recommendations

**Card Layout:**
- Company logo
- Job title and employer
- Salary range
- Distance
- Job type (full-time, part-time)
- Skills match visualization
- Match score
- Apply button
- Save for later button

**Skills Match:**
- Green badges: Skills matched ✓
- Gray badges: Skills needed
- Counter: "2 of 3 required"

**Match Explanation:**
- Why recommended
- Skill alignment
- Location proximity
- Salary competitiveness
- Requirements match

### ✅ Interactive Features

**Filtering:**
- Max distance slider (1-50 km)
- Min match score slider (0-100%)
- Amenities checkboxes (shelters)
- Availability filter
- Real-time filter application

**Sorting:**
- By match score (default)
- By distance
- By rating
- Ascending/descending toggle

**View Modes:**
- Grid view (cards)
- List view (compact)
- Comparison view (side-by-side)

**Comparison:**
- Select 2+ items
- Side-by-side table
- Feature comparison
- Highlight differences
- Easy decision making

**Map Integration:**
- View on map button
- Show all locations
- Distance visualization
- Directions

### ✅ States

**Loading State:**
- Animated spinner
- "Finding Best Matches..." message
- Skeleton cards
- Progress indication

**Empty State:**
- No results icon
- Clear message
- Reset filters button
- Helpful suggestions

**Error State:**
- Error message
- Retry button
- Support contact

## 📝 Component Structure

```
components/Recommendations/
├── RecommendationsView.tsx       # Main container
├── ShelterRecommendationCard.tsx # Shelter card
├── JobRecommendationCard.tsx     # Job card
├── ComparisonView.tsx            # Side-by-side comparison
├── LoadingState.tsx              # Loading skeleton
└── EmptyState.tsx                # No results state
```

## 🎨 UI Components

### Shelter Card

```tsx
<ShelterRecommendationCard
  shelter={shelter}
  onReserve={handleReserve}
  onViewMap={handleViewMap}
/>
```

**Props:**
- `shelter`: Shelter data object
- `onReserve`: Reserve bed callback
- `onViewMap`: View on map callback

**Features:**
- Photo with fallback
- Match score badge
- Availability indicator
- Amenity icons
- Expandable explanation
- Action buttons

### Job Card

```tsx
<JobRecommendationCard
  job={job}
  onApply={handleApply}
  onSave={handleSave}
/>
```

**Props:**
- `job`: Job data object
- `onApply`: Apply callback
- `onSave`: Save for later callback

**Features:**
- Company logo
- Salary display
- Skills match visualization
- Match explanation
- Apply/Save buttons

### Comparison View

```tsx
<ComparisonView
  items={selectedItems}
  type="shelter"
/>
```

**Features:**
- Table layout
- Feature rows
- Color-coded values
- Easy scanning
- Print-friendly

## 🔧 Technical Implementation

### Data Structure

```typescript
interface ShelterRecommendation {
  id: string
  name: string
  photo?: string
  distance: number
  availableBeds: number
  totalBeds: number
  amenities: string[]
  matchScore: number
  matchReasons: string[]
  address: string
  rating: number
  successRate: number
  location: { lat: number; lon: number }
}

interface JobRecommendation {
  id: string
  title: string
  employer: string
  logo?: string
  salary: { min: number; max: number; period: string }
  distance: number
  jobType: string
  requirements: string[]
  matchScore: number
  matchReasons: string[]
  skillsMatched: string[]
  skillsNeeded: string[]
  location: string
  postedDate: string
}
```

### Filtering Logic

```typescript
const filteredRecommendations = recommendations
  .filter(item => {
    if (filters.maxDistance && item.distance > filters.maxDistance) 
      return false
    if (filters.minMatchScore && item.matchScore < filters.minMatchScore) 
      return false
    if (filters.amenities.length > 0) {
      if (!filters.amenities.every(a => item.amenities.includes(a))) 
        return false
    }
    return true
  })
```

### Sorting Logic

```typescript
.sort((a, b) => {
  let comparison = 0
  if (sortBy === 'match') 
    comparison = b.matchScore - a.matchScore
  else if (sortBy === 'distance') 
    comparison = a.distance - b.distance
  else if (sortBy === 'rating') 
    comparison = b.rating - a.rating
  
  return sortOrder === 'asc' ? -comparison : comparison
})
```

### Match Score Calculation

The backend calculates match scores based on:
- Location proximity (30%)
- Skill/requirement match (25%)
- Availability (20%)
- Priority level (15%)
- Historical success rate (10%)

### Color Coding

```typescript
const getMatchScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-50'
  if (score >= 60) return 'text-yellow-600 bg-yellow-50'
  return 'text-orange-600 bg-orange-50'
}
```

## 📱 Mobile Optimization

### Responsive Design

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### Touch-Friendly

- Large buttons (44px minimum)
- Swipe gestures
- Tap to expand
- Easy scrolling

### Performance

- Lazy loading images
- Virtual scrolling (large lists)
- Debounced filtering
- Optimized re-renders

## 🎯 User Flows

### View Recommendations

1. Navigate to individual profile
2. Click "View Recommendations"
3. See top 5 matches
4. Review match scores
5. Read explanations

### Filter & Sort

1. Click "Filters" button
2. Adjust distance slider
3. Set minimum match score
4. Select amenities
5. Choose sort order
6. View filtered results

### Compare Options

1. Select checkbox on cards
2. Choose 2+ items
3. Click comparison view
4. Review side-by-side
5. Make decision

### Reserve/Apply

1. Review recommendation
2. Read match explanation
3. Click "Reserve Bed" or "Apply"
4. Confirm action
5. Receive confirmation

## 🔄 API Integration

### Fetch Recommendations

```typescript
const fetchRecommendations = async () => {
  const response = await api.recommendShelters({
    individual: individualData,
    shelters: availableShelters,
    top_k: 5
  })
  setRecommendations(response.data.recommendations)
}
```

### Reserve Bed

```typescript
const handleReserve = async (shelterId: string) => {
  await api.post('/api/v1/reservations', {
    individual_id: individualId,
    shelter_id: shelterId
  })
  toast.success('Bed reserved successfully!')
}
```

### Apply for Job

```typescript
const handleApply = async (jobId: string) => {
  await api.post('/api/v1/applications', {
    individual_id: individualId,
    job_id: jobId
  })
  toast.success('Application submitted!')
}
```

## 🎨 Styling

### Card Hover Effects

```css
.card {
  @apply hover:shadow-xl transition-all duration-300;
}
```

### Match Score Badge

```tsx
<div className={`px-3 py-2 rounded-lg font-bold ${
  score >= 80 ? 'bg-green-50 text-green-600' :
  score >= 60 ? 'bg-yellow-50 text-yellow-600' :
  'bg-orange-50 text-orange-600'
}`}>
  {score}% Match
</div>
```

### Amenity Icons

```tsx
const amenityIcons = {
  meals: Utensils,
  medical: Heart,
  wifi: Wifi,
  accessible: Accessibility,
  family: Users,
}
```

## 📊 Analytics

Track user interactions:
- Recommendations viewed
- Filters applied
- Sort preferences
- Reservations made
- Applications submitted
- Comparison usage
- Time to decision

## 🐛 Troubleshooting

### No Recommendations

- Check individual profile completeness
- Verify location data
- Adjust filters
- Expand search radius

### Low Match Scores

- Update individual skills
- Add more preferences
- Complete needs assessment
- Verify location accuracy

### Loading Issues

- Check API connection
- Verify authentication
- Review console errors
- Check network tab

## 🔄 Future Enhancements

- [ ] Real-time availability updates
- [ ] Push notifications for new matches
- [ ] Saved searches
- [ ] Email recommendations
- [ ] Advanced filters
- [ ] ML-powered suggestions
- [ ] Success prediction
- [ ] Feedback loop
- [ ] A/B testing
- [ ] Personalization

## 📚 Related Documentation

- [Volunteer Dashboard](./VOLUNTEER_DASHBOARD.md)
- [Profile Form](./PROFILE_FORM_GUIDE.md)
- [API Integration](./README.md)

---

For support, contact the development team.
