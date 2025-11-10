# AI-Powered Route Optimization

Intelligent route optimization system for volunteers and homeless individuals with smart routing, accessibility scoring, and service gap analysis.

## Features

### 1. Smart Multi-Stop Routing
- **TSP Optimization**: Solves Traveling Salesman Problem using nearest neighbor + 2-opt
- **Multiple Factors**: Distance, time, cost, safety, accessibility
- **Transport Modes**: Walking, cycling, public transport, driving
- **Constraints**: Max time, max distance, preferred transport
- **Alternative Routes**: Generates backup options

### 2. Field Volunteer Optimization
- **Daily Route Planning**: Optimizes routes for multiple volunteers
- **Geographic Clustering**: Groups nearby individuals for efficiency
- **Workload Balancing**: Distributes visits evenly across volunteers
- **Coverage Analysis**: Tracks percentage of individuals reached
- **Time Estimation**: Accounts for travel time and wait times

### 3. Resource Accessibility Scoring
- **Multi-Factor Scoring**: Distance, transport options, cost, mobility
- **Personalized**: Considers individual mobility constraints
- **Transport Options**: Lists all viable transport modes with costs
- **Accessibility Notes**: Provides actionable recommendations
- **Sorted Results**: Best matches first

### 4. Visit Time Optimization
- **Operating Hours**: Considers facility schedules
- **Wait Time Prediction**: Suggests less crowded times
- **Scored Recommendations**: Rates each time slot
- **Alternative Days**: Suggests other days if closed

### 5. Service Gap Analysis
- **Coverage Mapping**: Creates grid-based coverage analysis
- **Gap Identification**: Finds underserved areas
- **Priority Scoring**: Ranks gaps by urgency
- **Recommendations**: Suggests new service locations
- **Impact Estimation**: Predicts benefit of new locations

## API Endpoints

### Multi-Stop Route Optimization
```bash
POST /api/v1/routes/optimize
```

**Request:**
```json
{
  "start_location": {"lat": 40.7128, "lon": -74.0060},
  "destinations": [
    {
      "id": "shelter_1",
      "name": "Hope Shelter",
      "lat": 40.7580,
      "lon": -73.9855,
      "type": "shelter",
      "hours": {"monday": {"open": "08:00", "close": "20:00"}},
      "wait_time": 15
    }
  ],
  "constraints": {
    "max_time": 480,
    "max_distance": 50,
    "transport_mode": "public_transport"
  }
}
```

**Response:**
```json
{
  "success": true,
  "route": {
    "order": ["shelter_1", "job_center_1", "medical_1"],
    "total_distance": 12.5,
    "total_time": 95,
    "estimated_cost": 7.50,
    "accessibility_score": 0.85,
    "waypoints": [[40.7128, -74.0060], [40.7580, -73.9855]],
    "transport_modes": ["public_transport", "public_transport"]
  }
}
```

### Volunteer Route Optimization
```bash
POST /api/v1/routes/volunteer-optimization
```

**Request:**
```json
{
  "volunteers": [
    {
      "id": "vol_1",
      "name": "John Doe",
      "lat": 40.7128,
      "lon": -74.0060,
      "available_hours": 8,
      "transport_mode": "driving"
    }
  ],
  "individuals": [
    {
      "id": "ind_1",
      "name": "Person A",
      "lat": 40.7489,
      "lon": -73.9680,
      "priority": "high"
    }
  ],
  "date": "2024-11-10"
}
```

**Response:**
```json
{
  "success": true,
  "optimization": {
    "date": "2024-11-10",
    "volunteer_routes": {
      "vol_1": {
        "volunteer_name": "John Doe",
        "route": {...},
        "individuals_count": 3,
        "estimated_duration": 240,
        "workload_score": 0.65
      }
    },
    "total_individuals": 4,
    "coverage": 0.75,
    "balance_score": 0.92
  }
}
```

### Accessibility Scoring
```bash
POST /api/v1/routes/accessibility-score
```

**Request:**
```json
{
  "individual_location": {"lat": 40.7128, "lon": -74.0060},
  "resources": [
    {
      "id": "shelter_1",
      "name": "Hope Shelter",
      "lat": 40.7580,
      "lon": -73.9855,
      "type": "shelter",
      "wheelchair_accessible": true,
      "public_transport_nearby": true
    }
  ],
  "individual_profile": {
    "mobility_issues": true,
    "has_transportation": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "scored_resources": [
    {
      "resource_id": "shelter_1",
      "resource_name": "Hope Shelter",
      "distance_km": 5.2,
      "accessibility_score": 0.85,
      "transport_options": [
        {
          "mode": "public_transport",
          "time": 25,
          "cost": 2.75,
          "accessibility": "high"
        }
      ],
      "estimated_time": 25,
      "estimated_cost": 2.75,
      "accessibility_notes": [
        "Highly accessible location",
        "Best option: public_transport ($2.75)"
      ]
    }
  ],
  "most_accessible": {...}
}
```

### Visit Time Suggestions
```bash
POST /api/v1/routes/visit-times
```

**Response:**
```json
{
  "success": true,
  "location_name": "Hope Shelter",
  "suggestions": [
    {
      "time_slot": "08:00 - 10:00",
      "score": 0.9,
      "wait_time_estimate": "Low (5-10 min)",
      "reason": "Early morning - typically less crowded",
      "recommended": true
    }
  ]
}
```

### Service Gap Analysis
```bash
POST /api/v1/routes/service-gaps
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "total_gaps": 15,
    "high_priority_gaps": 5,
    "coverage_percentage": 67.5,
    "recommendations": [
      {
        "location": [40.75, -74.0],
        "priority": 0.85,
        "recommendation": "Consider opening new service location",
        "estimated_impact": "Would serve 1500 people",
        "distance_improvement": "Reduce distance by 8.5km"
      }
    ]
  }
}
```

### Utility Endpoints

**Calculate Distance:**
```bash
POST /api/v1/routes/distance
```

**Estimate Travel:**
```bash
POST /api/v1/routes/travel-estimate
```

## Algorithms

### TSP Optimization
1. **Nearest Neighbor**: Constructs initial route by always visiting nearest unvisited location
2. **2-Opt Improvement**: Iteratively improves route by reversing segments
3. **Complexity**: O(n²) for construction, O(n² × iterations) for improvement

### Clustering
- **Distance-based**: Groups individuals within 5km radius
- **Greedy Assignment**: Assigns clusters to volunteers to balance workload
- **Complexity**: O(n²) for clustering, O(c × v) for assignment

### Accessibility Scoring
Weighted factors:
- Distance: 30% (closer is better)
- Transport availability: 25% (more options better)
- Cost: 20% (lower is better)
- Mobility compatibility: 15% (matches individual needs)
- Facility features: 10% (wheelchair access, etc.)

### Coverage Analysis
- Grid-based approach with 2km cells
- Coverage score = 1 - (distance_to_nearest / 10km)
- Priority = (1 - coverage) × population_factor

## Distance Calculation

Uses **Haversine formula** for great-circle distance:
```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1-a))
distance = R × c  (R = 6371 km)
```

Accuracy: ±0.5% for distances up to 1000km

## Transport Modes

### Walking
- Speed: 5 km/h
- Cost: $0
- Max recommended: 3 km
- Accessibility: High (if no mobility issues)

### Cycling
- Speed: 15 km/h
- Cost: $0
- Max recommended: 10 km
- Accessibility: Medium

### Public Transport
- Speed: 25 km/h (includes stops)
- Cost: $2.50 base + $0.30/km over 5km
- Max: Unlimited
- Accessibility: High

### Driving
- Speed: 40 km/h (city average)
- Cost: $0.50/km
- Max: Unlimited
- Accessibility: High (if vehicle available)

## Use Cases

### 1. Individual Seeking Services
```python
# Find most accessible shelters
response = requests.post('/api/v1/routes/accessibility-score', json={
    "individual_location": {"lat": 40.7128, "lon": -74.0060},
    "resources": shelters,
    "individual_profile": {"mobility_issues": True}
})

# Get best shelter
best = response.json()['most_accessible']
print(f"Go to {best['resource_name']}")
print(f"Take {best['transport_options'][0]['mode']}")
print(f"Cost: ${best['estimated_cost']}")
```

### 2. Volunteer Planning Daily Route
```python
# Optimize route for 5 individuals
response = requests.post('/api/v1/routes/optimize', json={
    "start_location": volunteer_home,
    "destinations": individuals_to_visit,
    "constraints": {"max_time": 480, "transport_mode": "driving"}
})

route = response.json()['route']
print(f"Visit order: {route['order']}")
print(f"Total time: {route['total_time']} min")
```

### 3. Organization Planning Outreach
```python
# Optimize routes for 10 volunteers visiting 50 individuals
response = requests.post('/api/v1/routes/volunteer-optimization', json={
    "volunteers": volunteers,
    "individuals": individuals,
    "date": "2024-11-10"
})

# Assign routes
for vol_id, route_info in response.json()['optimization']['volunteer_routes'].items():
    send_route_to_volunteer(vol_id, route_info)
```

### 4. Identifying Service Gaps
```python
# Analyze coverage in city
response = requests.post('/api/v1/routes/service-gaps', json={
    "service_locations": existing_shelters,
    "coverage_area": city_bounds
})

gaps = response.json()['analysis']
print(f"Coverage: {gaps['coverage_percentage']}%")
print(f"High priority gaps: {len(gaps['high_priority_gaps'])}")

# Plan new locations
for rec in gaps['recommendations']:
    print(f"Open shelter at {rec['location']}")
```

## Integration with Google Maps

For production, integrate with Google Maps API:

```python
import googlemaps

gmaps = googlemaps.Client(key='YOUR_API_KEY')

# Get real directions
directions = gmaps.directions(
    origin,
    destination,
    mode="transit",
    departure_time=datetime.now()
)

# Get real distance matrix
matrix = gmaps.distance_matrix(
    origins=[origin],
    destinations=destinations,
    mode="transit"
)
```

## Performance

- **Route optimization**: <500ms for 10 stops
- **Volunteer optimization**: <2s for 10 volunteers, 50 individuals
- **Accessibility scoring**: <100ms for 20 resources
- **Service gap analysis**: <3s for 100km² area
- **Distance calculation**: <1ms per calculation

## Testing

```bash
# Run comprehensive tests
python test_routes.py
```

Tests cover:
- Multi-stop optimization
- Volunteer route planning
- Accessibility scoring
- Visit time suggestions
- Service gap analysis
- Distance calculations
- Travel estimates

## Future Enhancements

- Real-time traffic integration
- Weather-based routing
- Safety scoring by neighborhood
- Historical wait time data
- Multi-day route planning
- Route sharing between volunteers
- Mobile app with turn-by-turn navigation
- Offline route caching
- Dynamic rerouting
- Carbon footprint tracking

## Configuration

```bash
# In .env file
GOOGLE_MAPS_API_KEY=your-key-here
ROUTE_OPTIMIZATION_CACHE_TTL=3600
MAX_ROUTE_STOPS=20
DEFAULT_TRANSPORT_MODE=public_transport
```

## Best Practices

1. **Cache distances**: Store calculated distances to reduce computation
2. **Batch requests**: Optimize multiple routes together
3. **Update regularly**: Refresh routes as conditions change
4. **Consider time windows**: Factor in facility hours
5. **Balance workload**: Don't overload volunteers
6. **Prioritize urgent cases**: Visit high-priority individuals first
7. **Plan for contingencies**: Always have alternative routes
8. **Track actual times**: Learn from real-world data

## Accessibility Considerations

- Always provide multiple transport options
- Consider mobility limitations
- Account for wheelchair accessibility
- Factor in weather conditions
- Provide clear directions
- Include landmarks for navigation
- Offer assistance when needed
- Respect individual preferences

---

Built to help volunteers work efficiently and individuals access services easily.
