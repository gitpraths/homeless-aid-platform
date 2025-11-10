from flask import Flask, request, jsonify
from models.recommendation_engine import RecommendationEngine
from api.needs_assessment_api import needs_bp
from api.route_api import route_bp
from config import Config

app = Flask(__name__)
app.register_blueprint(needs_bp)
app.register_blueprint(route_bp)
engine = RecommendationEngine()


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "recommendation-engine"}), 200


@app.route("/api/v1/recommend/shelters", methods=["POST"])
def recommend_shelters():
    """
    Recommend shelters for a homeless individual.

    Request body:
    {
        "individual": {
            "id": "ind_123",
            "skills": ["cooking", "cleaning"],
            "location": [40.7128, -74.0060],
            "priority": "high",
            "age": 35,
            "gender": "male"
        },
        "shelters": [
            {
                "id": "shelter_1",
                "name": "Hope Shelter",
                "location": [40.7580, -73.9855],
                "capacity": 50,
                "occupied": 35,
                "amenities": ["meals", "showers", "counseling"],
                "priority_support": ["high", "critical"],
                "required_skills": []
            }
        ],
        "top_k": 5,
        "use_bandit": true
    }
    """
    try:
        data = request.get_json()

        individual = data.get("individual")
        shelters = data.get("shelters", [])
        top_k = data.get("top_k", 5)
        use_bandit = data.get("use_bandit", True)

        if not individual:
            return jsonify({"error": "Individual data is required"}), 400

        recommendations = engine.recommend(
            individual, shelters, "shelter", top_k, use_bandit
        )

        return jsonify(
            {
                "recommendations": recommendations,
                "individual_id": individual.get("id"),
                "resource_type": "shelter",
            }
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/recommend/jobs", methods=["POST"])
def recommend_jobs():
    """
    Recommend jobs for a homeless individual.
    """
    try:
        data = request.get_json()

        individual = data.get("individual")
        jobs = data.get("jobs", [])
        top_k = data.get("top_k", 5)
        use_bandit = data.get("use_bandit", True)

        if not individual:
            return jsonify({"error": "Individual data is required"}), 400

        recommendations = engine.recommend(individual, jobs, "job", top_k, use_bandit)

        return jsonify(
            {
                "recommendations": recommendations,
                "individual_id": individual.get("id"),
                "resource_type": "job",
            }
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/recommend/training", methods=["POST"])
def recommend_training():
    """
    Recommend training programs for a homeless individual.
    """
    try:
        data = request.get_json()

        individual = data.get("individual")
        programs = data.get("programs", [])
        top_k = data.get("top_k", 5)
        use_bandit = data.get("use_bandit", True)

        if not individual:
            return jsonify({"error": "Individual data is required"}), 400

        recommendations = engine.recommend(
            individual, programs, "training", top_k, use_bandit
        )

        return jsonify(
            {
                "recommendations": recommendations,
                "individual_id": individual.get("id"),
                "resource_type": "training",
            }
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/feedback", methods=["POST"])
def provide_feedback():
    """
    Provide feedback on a recommendation to improve the model.

    Request body:
    {
        "resource_type": "shelter",
        "resource_id": "shelter_1",
        "success": true,
        "outcome_score": 0.85
    }
    """
    try:
        data = request.get_json()

        resource_type = data.get("resource_type")
        resource_id = data.get("resource_id")
        success = data.get("success")
        outcome_score = data.get("outcome_score")

        if not resource_type or not resource_id:
            return jsonify({"error": "resource_type and resource_id are required"}), 400

        if success is None and outcome_score is None:
            return jsonify(
                {"error": "Either success or outcome_score is required"}
            ), 400

        engine.provide_feedback(resource_type, resource_id, success, outcome_score)

        return jsonify(
            {
                "message": "Feedback recorded successfully",
                "resource_type": resource_type,
                "resource_id": resource_id,
            }
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/statistics", methods=["GET"])
def get_statistics():
    """
    Get learning statistics and model performance.
    """
    try:
        stats = engine.get_statistics()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/ab-test", methods=["POST"])
def set_ab_variant():
    """
    Set A/B testing variant.

    Request body:
    {
        "variant": "A"  // or "B"
    }
    """
    try:
        data = request.get_json()
        variant = data.get("variant", "A")

        if variant not in ["A", "B"]:
            return jsonify({"error": "Variant must be A or B"}), 400

        engine.set_ab_variant(variant)

        return jsonify(
            {"message": f"A/B variant set to {variant}", "variant": variant}
        ), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host=Config.API_HOST, port=Config.API_PORT, debug=Config.DEBUG)
