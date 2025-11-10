#!/usr/bin/env python3
"""
Test script for the Homeless Aid Platform Recommendation Engine API.
"""

import requests
import json

BASE_URL = "http://localhost:5000"


def test_shelter_recommendation():
    """Test shelter recommendation endpoint."""
    print("\n=== Testing Shelter Recommendations ===")

    payload = {
        "individual": {
            "id": "ind_001",
            "skills": ["cooking", "cleaning"],
            "location": [40.7128, -74.0060],  # NYC
            "priority": "high",
            "age": 35,
            "gender": "male",
        },
        "shelters": [
            {
                "id": "shelter_1",
                "name": "Hope Shelter",
                "location": [40.7580, -73.9855],  # Central Park
                "capacity": 50,
                "occupied": 35,
                "amenities": ["meals", "showers", "counseling"],
                "priority_support": ["high", "critical"],
                "required_skills": [],
            },
            {
                "id": "shelter_2",
                "name": "Community Haven",
                "location": [40.7489, -73.9680],  # Queens
                "capacity": 30,
                "occupied": 25,
                "amenities": ["meals", "medical"],
                "priority_support": ["medium", "high"],
                "required_skills": ["cooking"],
            },
            {
                "id": "shelter_3",
                "name": "Safe Harbor",
                "location": [40.6782, -73.9442],  # Brooklyn
                "capacity": 40,
                "occupied": 10,
                "amenities": ["meals", "job_training"],
                "priority_support": ["low", "medium"],
                "required_skills": [],
            },
        ],
        "top_k": 3,
        "use_bandit": True,
    }

    response = requests.post(f"{BASE_URL}/api/v1/recommend/shelters", json=payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

    return response.json()


def test_job_recommendation():
    """Test job recommendation endpoint."""
    print("\n=== Testing Job Recommendations ===")

    payload = {
        "individual": {
            "id": "ind_002",
            "skills": ["construction", "carpentry", "painting"],
            "location": [34.0522, -118.2437],  # LA
            "priority": "medium",
            "age": 42,
            "education": "high_school",
        },
        "jobs": [
            {
                "id": "job_1",
                "name": "Construction Worker",
                "location": [34.0407, -118.2468],
                "capacity": 5,
                "occupied": 2,
                "required_skills": ["construction"],
                "priority_support": ["low", "medium", "high"],
            },
            {
                "id": "job_2",
                "name": "Warehouse Associate",
                "location": [34.0195, -118.4912],
                "capacity": 10,
                "occupied": 8,
                "required_skills": [],
                "priority_support": ["low", "medium"],
            },
        ],
        "top_k": 2,
        "use_bandit": True,
    }

    response = requests.post(f"{BASE_URL}/api/v1/recommend/jobs", json=payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

    return response.json()


def test_feedback():
    """Test feedback endpoint."""
    print("\n=== Testing Feedback ===")

    payload = {
        "resource_type": "shelter",
        "resource_id": "shelter_1",
        "success": True,
        "outcome_score": 0.9,
    }

    response = requests.post(f"{BASE_URL}/api/v1/feedback", json=payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))


def test_statistics():
    """Test statistics endpoint."""
    print("\n=== Testing Statistics ===")

    response = requests.get(f"{BASE_URL}/api/v1/statistics")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))


def test_ab_testing():
    """Test A/B testing endpoint."""
    print("\n=== Testing A/B Testing ===")

    payload = {"variant": "B"}
    response = requests.post(f"{BASE_URL}/api/v1/ab-test", json=payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))


if __name__ == "__main__":
    print("Starting API tests...")
    print("Make sure the API is running: python api/app.py")

    try:
        # Test health check
        response = requests.get(f"{BASE_URL}/health")
        print(f"\nHealth Check: {response.json()}")

        # Run tests
        shelter_result = test_shelter_recommendation()
        test_job_recommendation()

        # Provide feedback on first recommendation
        if shelter_result.get("recommendations"):
            test_feedback()

        test_statistics()
        test_ab_testing()

        print("\n✅ All tests completed!")

    except requests.exceptions.ConnectionError:
        print(
            "\n❌ Error: Could not connect to API. Make sure it's running on port 5000."
        )
    except Exception as e:
        print(f"\n❌ Error: {e}")
