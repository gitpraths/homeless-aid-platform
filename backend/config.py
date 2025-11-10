import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # API Configuration
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 5000))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    # Model Configuration
    LEARNING_RATE = float(os.getenv("LEARNING_RATE", 0.1))
    DISCOUNT_FACTOR = float(os.getenv("DISCOUNT_FACTOR", 0.95))
    EPSILON = float(os.getenv("EPSILON", 0.1))  # Exploration rate
    EPSILON_DECAY = float(os.getenv("EPSILON_DECAY", 0.995))
    MIN_EPSILON = float(os.getenv("MIN_EPSILON", 0.01))

    # Scoring Weights
    WEIGHT_LOCATION = 0.30
    WEIGHT_SKILL_MATCH = 0.25
    WEIGHT_AVAILABILITY = 0.20
    WEIGHT_PRIORITY = 0.15
    WEIGHT_HISTORICAL = 0.10

    # Cold Start Configuration
    COLD_START_BONUS = 0.05
    MIN_INTERACTIONS_FOR_LEARNING = 5

    # OpenAI Configuration (optional - leave empty to use Hugging Face)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    USE_GPT4 = os.getenv("USE_GPT4", "False").lower() == "true"

    # Google Translate API (optional)
    GOOGLE_TRANSLATE_API_KEY = os.getenv("GOOGLE_TRANSLATE_API_KEY", "")
