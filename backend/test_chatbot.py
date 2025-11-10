#!/usr/bin/env python3
"""
Test script for the AI Chatbot Assistant.
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000"


def test_basic_chat():
    """Test basic chat functionality."""
    print("\n=== Testing Basic Chat ===")

    payload = {
        "user_id": "volunteer_001",
        "message": "How do I register a new homeless person?",
        "user_role": "volunteer",
        "language": "en",
    }

    response = requests.post(f"{BASE_URL}/api/v1/chat/message", json=payload)
    print(f"Status: {response.status_code}")
    result = response.json()

    print(f"\nUser: {payload['message']}")
    print(f"Bot: {result['response']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Should Escalate: {result.get('should_escalate', False)}")

    return result


def test_shelter_query():
    """Test shelter availability query."""
    print("\n=== Testing Shelter Query ===")

    payload = {
        "user_id": "volunteer_001",
        "message": "What shelters have beds available in downtown?",
        "user_role": "volunteer",
        "language": "en",
    }

    response = requests.post(f"{BASE_URL}/api/v1/chat/message", json=payload)
    result = response.json()

    print(f"\nUser: {payload['message']}")
    print(f"Bot: {result['response']}")

    return result


def test_context_aware():
    """Test context-aware responses."""
    print("\n=== Testing Context-Aware Chat ===")

    payload = {
        "user_id": "staff_001",
        "message": "Show me details about this individual",
        "user_role": "staff",
        "language": "en",
        "context": {
            "current_page": "individual_profile",
            "selected_individual": "ind_123",
        },
    }

    response = requests.post(f"{BASE_URL}/api/v1/chat/message", json=payload)
    result = response.json()

    print(f"\nUser: {payload['message']}")
    print(f"Context: {payload['context']}")
    print(f"Bot: {result['response']}")

    return result


def test_role_based_responses():
    """Test different responses based on user role."""
    print("\n=== Testing Role-Based Responses ===")

    roles = ["volunteer", "staff", "admin"]
    message = "How do I manage user permissions?"

    for role in roles:
        print(f"\n--- Testing as {role.upper()} ---")
        payload = {
            "user_id": f"{role}_test",
            "message": message,
            "user_role": role,
            "language": "en",
        }

        response = requests.post(f"{BASE_URL}/api/v1/chat/message", json=payload)
        result = response.json()

        print(f"Bot: {result['response'][:150]}...")


def test_conversation_flow():
    """Test multi-turn conversation."""
    print("\n=== Testing Conversation Flow ===")

    user_id = "volunteer_002"
    messages = [
        "I need to register a new person",
        "Yes, please give me detailed steps",
        "What information do I need to collect?",
        "How do I capture their location?",
    ]

    for i, message in enumerate(messages, 1):
        print(f"\n--- Turn {i} ---")
        payload = {
            "user_id": user_id,
            "message": message,
            "user_role": "volunteer",
            "language": "en",
        }

        response = requests.post(f"{BASE_URL}/api/v1/chat/message", json=payload)
        result = response.json()

        print(f"User: {message}")
        print(f"Bot: {result['response'][:200]}...")

        time.sleep(0.5)  # Small delay between messages


def test_chat_history():
    """Test chat history retrieval."""
    print("\n=== Testing Chat History ===")

    user_id = "volunteer_001"

    response = requests.get(f"{BASE_URL}/api/v1/chat/history/{user_id}")
    print(f"Status: {response.status_code}")
    result = response.json()

    print(f"\nUser ID: {result['user_id']}")
    print(f"Message Count: {result['message_count']}")
    print(f"\nLast 3 messages:")
    for msg in result["history"][-3:]:
        print(f"  {msg['role']}: {msg['content'][:80]}...")


def test_workflows():
    """Test workflow retrieval."""
    print("\n=== Testing Workflows ===")

    response = requests.get(f"{BASE_URL}/api/v1/chat/workflows")
    print(f"Status: {response.status_code}")
    result = response.json()

    print("\nAvailable Workflows:")
    for key, workflow in result["workflows"].items():
        print(f"\n  {workflow['name']}")
        print(f"  Description: {workflow['description']}")
        print(f"  Time: {workflow['estimated_time']}")


def test_quick_answers():
    """Test quick answers."""
    print("\n=== Testing Quick Answers ===")

    response = requests.get(f"{BASE_URL}/api/v1/chat/quick-answers")
    print(f"Status: {response.status_code}")
    result = response.json()

    print("\nQuick Answer Topics:")
    for key, question in result["quick_answers"].items():
        print(f"  - {question}")


def test_language_detection():
    """Test language detection."""
    print("\n=== Testing Language Detection ===")

    test_texts = [
        ("Hello, how are you?", "en"),
        ("नमस्ते, आप कैसे हैं?", "hi"),
        ("வணக்கம், எப்படி இருக்கிறீர்கள்?", "ta"),
        ("హలో, మీరు ఎలా ఉన్నారు?", "te"),
    ]

    for text, expected_lang in test_texts:
        payload = {"text": text}
        response = requests.post(
            f"{BASE_URL}/api/v1/chat/detect-language", json=payload
        )
        result = response.json()

        print(f"\nText: {text}")
        print(f"Detected: {result['detected_language']} (Expected: {expected_lang})")
        print(f"Supported: {result['supported']}")


def test_clear_history():
    """Test clearing chat history."""
    print("\n=== Testing Clear History ===")

    user_id = "volunteer_002"

    response = requests.post(f"{BASE_URL}/api/v1/chat/clear/{user_id}")
    print(f"Status: {response.status_code}")
    result = response.json()

    print(f"Message: {result['message']}")
    print(f"User ID: {result['user_id']}")


def test_emergency_scenario():
    """Test emergency/escalation scenario."""
    print("\n=== Testing Emergency Scenario ===")

    payload = {
        "user_id": "volunteer_003",
        "message": "Someone is having a medical emergency and needs immediate help!",
        "user_role": "volunteer",
        "language": "en",
    }

    response = requests.post(f"{BASE_URL}/api/v1/chat/message", json=payload)
    result = response.json()

    print(f"\nUser: {payload['message']}")
    print(f"Bot: {result['response']}")
    print(f"Should Escalate: {result.get('should_escalate', False)}")
    if result.get("escalation_message"):
        print(f"Escalation Message: {result['escalation_message']}")


if __name__ == "__main__":
    print("Starting Chatbot API tests...")
    print("Make sure the API is running: python api/websocket_app.py")

    try:
        # Test health check
        response = requests.get(f"{BASE_URL}/health")
        print(f"\nHealth Check: {response.json()}")

        # Run tests
        test_basic_chat()
        test_shelter_query()
        test_context_aware()
        test_role_based_responses()
        test_conversation_flow()
        test_chat_history()
        test_workflows()
        test_quick_answers()
        test_language_detection()
        test_emergency_scenario()
        test_clear_history()

        print("\n✅ All tests completed!")

    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API.")
        print("Make sure the server is running: python api/websocket_app.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback

        traceback.print_exc()
