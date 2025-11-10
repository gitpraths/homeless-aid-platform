#!/usr/bin/env python3
"""
Test script for the Route Optimization API.
"""

import requests
import json

BASE_URL = "http://localhost:5000"


def test_multi_stop_optimization():
    """Test multi-stop route optimization."""
    print("\n=== Testing Multi-Stop Route Optimization ===")

    payload = {
        "start_location": {"lat": 40.7128, "lon": -74.0060},
        "destinations": [
            {
                "id": "shelter_1",
                "name": "Hope Shelter",
                "lat": 40.7580,
                "lon": -73.9855,
                "type": "shelter",
                "hours": {"monday": {"open": "08:00", "close": "20:00"}},
                "wait_time": 15,
            },
            {
                "id": "job_center_1",
                "name": "Employment Center",
                "lat": 40.7489,
                "lon": -73.9680,
                "type": "job_center",
                "wait_time": 20,
            },
            {
                "id": "medical_1",
                "name": "Community Health",
                "lat": 40.7282,
                "lon": -73.9942,
                "type": "medical",
                "wait_time": 30,
            },
        ],
        "constraints": {"max_time": 480, "transport_mode": "public_transport"},
    }

    response = requests.post(f"{BASE_URL}/api/v1/routes/optimize", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()

    if result.get("success"):
        route = result["route"]
        print(f"\nOptimized Route:")
        print(f"  Total Distance: {route['total_distance']} km")
        print(f"  Total Time: {route['total_time']} minutes")
        print(f"  Estimated Cost: ${route['estimated_cost']}")
        print(f"  Accessibility Score: {route['accessibility_score']}")
        print(f"  Visit Order: {' → '.join(route['order'])}")

    return result


def test_volunteer_optimization():
    """Test volunteer route optimization."""
    print("\n=== Testing Volunteer Route Optimization ===")

    payload = {
        "volunteers": [
            {
                "id": "vol_1",
                "name": "John Doe",
                "lat": 40.7128,
                "lon": -74.0060,
                "available_hours": 8,
                "transport_mode": "driving",
            },
            {
                "id": "vol_2",
                "name": "Jane Smith",
                "lat": 40.7580,
                "lon": -73.9855,
                "available_hours": 6,
                "transport_mode": "public_transport",
            },
        ],
        "individuals": [
            {
                "id": "ind_1",
                "name": "Person A",
                "lat": 40.7489,
                "lon": -73.9680,
                "priority": "high",
            },
            {
                "id": "ind_2",
                "name": "Person B",
                "lat": 40.7282,
                "lon": -73.9942,
                "priority": "medium",
            },
            {
                "id": "ind_3",
                "name": "Person C",
                "lat": 40.7614,
                "lon": -73.9776,
                "priority": "high",
            },
            {
                "id": "ind_4",
                "name": "Person D",
                "lat": 40.7350,
                "lon": -74.0020,
                "priority": "low",
            },
        ],
        "date": "2024-11-10",
    }

    response = requests.post(
        f"{BASE_URL}/api/v1/routes/volunteer-optimization", json=payload
    )
    print(f"Status: {response.status_code}")
    result = response.json()

    if result.get("success"):
        opt = result["optimization"]
        print(f"\nOptimization Results:")
        print(f"  Date: {opt['date']}")
        print(f"  Total Individuals: {opt['total_individuals']}")
        print(f"  Coverage: {opt['coverage'] * 100:.1f}%")
        print(f"  Balance Score: {opt['balance_score']:.3f}")

        for vol_id, route_info in opt["volunteer_routes"].items():
            print(f"\n  {route_info['volunteer_name']}:")
            print(f"    Individuals: {route_info['individuals_count']}")
            print(f"    Duration: {route_info['estimated_duration']} min")
            print(f"    Distance: {route_info['route']['total_distance']} km")
            print(f"    Workload: {route_info['workload_score']:.2f}")

    return result


def test_accessibility_scoring():
    """Test resource accessibility scoring."""
    print("\n=== Testing Accessibility Scoring ===")

    payload = {
        "individual_location": {"lat": 40.7128, "lon": -74.0060},
        "resources": [
            {
                "id": "shelter_1",
                "name": "Hope Shelter",
                "lat": 40.7580,
                "lon": -73.9855,
                "type": "shelter",
                "wheelchair_accessible": True,
                "public_transport_nearby": True,
            },
            {
                "id": "shelter_2",
                "name": "Community Haven",
                "lat": 40.6782,
                "lon": -73.9442,
                "type": "shelter",
                "wheelchair_accessible": False,
                "public_transport_nearby": True,
            },
            {
                "id": "shelter_3",
                "name": "Safe Harbor",
                "lat": 40.8448,
                "lon": -73.8648,
                "type": "shelter",
                "wheelchair_accessible": True,
                "public_transport_nearby": False,
            },
        ],
        "individual_profile": {"mobility_issues": True, "has_transportation": False},
    }

    response = requests.post(
        f"{BASE_URL}/api/v1/routes/accessibility-score", json=payload
    )
    print(f"Status: {response.status_code}")
    result = response.json()

    if result.get("success"):
        print(f"\nAccessibility Scores (sorted by best match):")
        for resource in result["scored_resources"][:3]:
            print(f"\n  {resource['resource_name']}:")
            print(f"    Score: {resource['accessibility_score']}")
            print(f"    Distance: {resource['distance_km']} km")
            print(f"    Time: {resource['estimated_time']} min")
            print(f"    Cost: ${resource['estimated_cost']:.2f}")
            print(f"    Notes: {', '.join(resource['accessibility_notes'])}")

    return result


def test_visit_time_suggestions():
    """Test visit time suggestions."""
    print("\n=== Testing Visit Time Suggestions ===")

    payload = {
        "location": {
            "id": "shelter_1",
            "name": "Hope Shelter",
            "hours": {
                "monday": {"open": "08:00", "close": "20:00"},
                "tuesday": {"open": "08:00", "close": "20:00"},
                "wednesday": {"open": "08:00", "close": "20:00"},
                "thursday": {"open": "08:00", "close": "20:00"},
                "friday": {"open": "08:00", "close": "20:00"},
                "saturday": {"open": "10:00", "close": "18:00"},
                "sunday": {"closed": True},
            },
        },
        "date": "2024-11-11",  # Monday
    }

    response = requests.post(f"{BASE_URL}/api/v1/routes/visit-times", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()

    if result.get("success"):
        print(f"\nBest Times to Visit {result['location_name']}:")
        for suggestion in result["suggestions"]:
            recommended = "⭐ RECOMMENDED" if suggestion.get("recommended") else ""
            print(f"\n  {suggestion['time_slot']} {recommended}")
            print(f"    Score: {suggestion['score']}")
            print(f"    Wait Time: {suggestion['wait_time_estimate']}")
            print(f"    Reason: {suggestion['reason']}")

    return result


def test_service_gap_analysis():
    """Test service gap identification."""
    print("\n=== Testing Service Gap Analysis ===")

    payload = {
        "service_locations": [
            {
                "id": "shelter_1",
                "name": "Hope Shelter",
                "lat": 40.7580,
                "lon": -73.9855,
                "type": "shelter",
            },
            {
                "id": "shelter_2",
                "name": "Community Haven",
                "lat": 40.7128,
                "lon": -74.0060,
                "type": "shelter",
            },
        ],
        "coverage_area": {
            "min_lat": 40.7,
            "max_lat": 40.8,
            "min_lon": -74.1,
            "max_lon": -73.9,
        },
    }

    response = requests.post(f"{BASE_URL}/api/v1/routes/service-gaps", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()

    if result.get("success"):
        analysis = result["analysis"]
        print(f"\nService Gap Analysis:")
        print(f"  Total Gaps: {analysis['total_gaps']}")
        print(f"  High Priority Gaps: {len(analysis['high_priority_gaps'])}")
        print(f"  Overall Coverage: {analysis['coverage_percentage']:.1f}%")

        print(f"\n  Top Recommendations:")
        for i, rec in enumerate(analysis["recommendations"][:3], 1):
            print(f"\n    {i}. Priority: {rec['priority']:.2f}")
            print(f"       Location: {rec['location']}")
            print(f"       {rec['recommendation']}")
            print(f"       Impact: {rec['estimated_impact']}")

    return result


def test_distance_calculation():
    """Test distance calculation."""
    print("\n=== Testing Distance Calculation ===")

    payload = {
        "origin": {"lat": 40.7128, "lon": -74.0060},
        "destination": {"lat": 40.7580, "lon": -73.9855},
    }

    response = requests.post(f"{BASE_URL}/api/v1/routes/distance", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()

    if result.get("success"):
        print(f"\nDistance:")
        print(f"  {result['distance_km']} km")
        print(f"  {result['distance_miles']} miles")

    return result


def test_travel_estimate():
    """Test travel time and cost estimation."""
    print("\n=== Testing Travel Estimate ===")

    modes = ["walking", "cycling", "public_transport", "driving"]

    for mode in modes:
        payload = {
            "origin": {"lat": 40.7128, "lon": -74.0060},
            "destination": {"lat": 40.7580, "lon": -73.9855},
            "transport_mode": mode,
        }

        response = requests.post(
            f"{BASE_URL}/api/v1/routes/travel-estimate", json=payload
        )
        result = response.json()

        if result.get("success"):
            print(f"\n  {mode.replace('_', ' ').title()}:")
            print(f"    Time: {result['estimated_time_minutes']} min")
            print(f"    Cost: ${result['estimated_cost']:.2f}")


if __name__ == "__main__":
    print("Starting Route Optimization API tests...")
    print("Make sure the API is running: python api/app.py")

    try:
        # Test health check
        response = requests.get(f"{BASE_URL}/health")
        print(f"\nHealth Check: {response.json()}")

        # Run tests
        test_multi_stop_optimization()
        test_volunteer_optimization()
        test_accessibility_scoring()
        test_visit_time_suggestions()
        test_service_gap_analysis()
        test_distance_calculation()
        test_travel_estimate()

        print("\n✅ All tests completed!")

    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API.")
        print("Make sure the server is running: python api/app.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback

        traceback.print_exc()
