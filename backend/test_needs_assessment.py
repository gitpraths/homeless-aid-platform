#!/usr/bin/env python3
"""
Test script for the Needs Assessment API.
"""

import requests
import json

BASE_URL = "http://localhost:5000"


def test_nlp_analysis():
    """Test NLP analysis of volunteer notes."""
    print("\n=== Testing NLP Analysis ===")

    payload = {
        "notes": """John is 35 years old and has been homeless for about 8 months. 
        He has construction and carpentry skills from his previous job. 
        He mentioned feeling depressed lately and struggling with anxiety. 
        He urgently needs shelter and is currently sleeping on the street. 
        He's interested in finding work but needs help getting his ID replaced first."""
    }

    response = requests.post(f"{BASE_URL}/api/v1/analyze-notes", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2))
    return result


def test_questionnaire_flow():
    """Test smart questionnaire flow."""
    print("\n=== Testing Smart Questionnaire ===")

    # Start questionnaire
    print("\n1. Starting questionnaire...")
    response = requests.post(
        f"{BASE_URL}/api/v1/questionnaire/start",
        json={"individual_id": "ind_test_001", "initial_data": {}},
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Section: {result['current_section']}")
    print(f"Questions: {len(result['questions'])}")

    # Answer first section
    print("\n2. Answering basic info...")
    answers = {"age": 35, "gender": "Male", "education": "High School/GED"}

    response = requests.post(
        f"{BASE_URL}/api/v1/questionnaire/next",
        json={"current_section": "basic_info", "answers": answers},
    )
    result = response.json()
    print(f"Next section: {result.get('current_section')}")
    print(f"Progress: {result.get('progress')}%")

    # Continue with housing situation
    print("\n3. Answering housing situation...")
    answers.update({"current_situation": "Street", "duration_homeless": "6-12 months"})

    response = requests.post(
        f"{BASE_URL}/api/v1/questionnaire/next",
        json={"current_section": "housing_situation", "answers": answers},
    )
    result = response.json()
    print(f"Next section: {result.get('current_section')}")
    print(f"Progress: {result.get('progress')}%")

    return answers


def test_risk_assessment():
    """Test comprehensive risk assessment."""
    print("\n=== Testing Risk Assessment ===")

    payload = {
        "profile": {
            "id": "ind_test_001",
            "age": 35,
            "skills": ["construction", "carpentry"],
            "education": "High School/GED",
            "duration_homeless": "6-12 months",
            "current_situation": "Street",
            "substance_abuse": False,
            "mental_health_issues": True,
            "has_id": False,
            "has_transportation": False,
            "urgent_needs": ["Shelter", "ID/Documents"],
        },
        "notes": """Feeling depressed and anxious. Urgently needs shelter. 
        Has good construction skills but lacks ID documents.""",
    }

    response = requests.post(f"{BASE_URL}/api/v1/risk-assessment", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()

    assessment = result["assessment"]
    print(f"\nJob Placement Probability: {assessment['job_placement']['probability']}")
    print(f"Risk Level: {assessment['job_placement']['risk_level']}")
    print(f"Factors: {assessment['job_placement']['factors']}")

    print(
        f"\nChronic Homelessness Risk: {assessment['chronic_homelessness']['probability']}"
    )
    print(f"Risk Level: {assessment['chronic_homelessness']['risk_level']}")

    print(
        f"\nImmediate Intervention Required: {assessment['immediate_intervention']['requires_intervention']}"
    )
    print(f"Urgency: {assessment['immediate_intervention']['urgency']}")
    print(f"Actions: {assessment['immediate_intervention']['immediate_actions'][:2]}")

    print(f"\nOverall Risk Score: {assessment['overall_risk_score']}")

    return result


def test_job_placement_prediction():
    """Test job placement prediction."""
    print("\n=== Testing Job Placement Prediction ===")

    payload = {
        "profile": {
            "age": 28,
            "skills": ["retail", "customer service", "computer skills"],
            "education": "Some College",
            "work_experience_years": 5,
            "has_transportation": True,
            "has_phone": True,
            "has_id": True,
            "health_conditions": [],
        }
    }

    response = requests.post(
        f"{BASE_URL}/api/v1/risk-assessment/job-placement", json=payload
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2))


def test_intervention_flagging():
    """Test immediate intervention flagging."""
    print("\n=== Testing Intervention Flagging ===")

    payload = {
        "profile": {
            "current_situation": "Street",
            "age": 55,
            "medications_needed": True,
            "medication_access": False,
            "urgent_needs": ["Medical Care", "Shelter"],
            "has_disability": True,
        },
        "notes": "Emergency situation. Patient needs immediate medical attention. Ran out of heart medication 3 days ago.",
    }

    response = requests.post(
        f"{BASE_URL}/api/v1/risk-assessment/intervention", json=payload
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2))


def test_prediction():
    """Test missing info prediction."""
    print("\n=== Testing Missing Info Prediction ===")

    payload = {
        "profile": {
            "age": 42,
            "education": "Bachelor Degree",
            "skills": ["computer skills", "data entry", "customer service"],
        }
    }

    response = requests.post(f"{BASE_URL}/api/v1/questionnaire/predict", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    print("Starting Needs Assessment API tests...")
    print("Make sure the API is running: python api/app.py")

    try:
        # Test health check
        response = requests.get(f"{BASE_URL}/health")
        print(f"\nHealth Check: {response.json()}")

        # Run tests
        test_nlp_analysis()
        test_questionnaire_flow()
        test_risk_assessment()
        test_job_placement_prediction()
        test_intervention_flagging()
        test_prediction()

        print("\n✅ All tests completed!")

    except requests.exceptions.ConnectionError:
        print(
            "\n❌ Error: Could not connect to API. Make sure it's running on port 5000."
        )
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback

        traceback.print_exc()
