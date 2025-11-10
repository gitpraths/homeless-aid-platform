"""
Flask Backend API with SQLite3 Database
Main application file with all API endpoints
"""

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Import database
from database import db

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY", "your-secret-key-change-in-production"
)
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY", "jwt-secret-key-change-in-production"
)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
app.config["UPLOAD_FOLDER"] = os.getenv("UPLOAD_FOLDER", "uploads")
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size

# Create upload folder if it doesn't exist
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# CORS configuration
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# JWT configuration
jwt = JWTManager(app)

# Socket.IO configuration
socketio = SocketIO(
    app, cors_allowed_origins="http://localhost:3000", async_mode="threading"
)

# ==========================================
# RESPONSE HELPERS
# ==========================================


def success_response(data=None, message="Success"):
    """Standard success response format"""
    return jsonify({"success": True, "data": data, "message": message}), 200


def error_response(message="Error occurred", errors=None, status=400):
    """Standard error response format"""
    response = {"success": False, "message": message}
    if errors:
        response["errors"] = errors
    return jsonify(response), status


def paginated_response(data, page, limit, total):
    """Paginated response format"""
    pages = (total + limit - 1) // limit
    return jsonify(
        {
            "success": True,
            "data": {
                "data": data,
                "page": page,
                "limit": limit,
                "total": total,
                "pages": pages,
            },
        }
    ), 200


# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================


@app.route("/api/auth/register", methods=["POST"])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()

        # Validate input
        required_fields = ["email", "password", "name"]
        errors = {}
        for field in required_fields:
            if not data.get(field):
                errors[field] = [f"{field} is required"]

        if errors:
            return error_response("Validation failed", errors, 422)

        # Check if user already exists
        existing_user = db.get_user_by_email(data["email"])
        if existing_user:
            return error_response(
                "Email already registered", {"email": ["Email already in use"]}, 422
            )

        # Create user
        password_hash = generate_password_hash(data["password"])
        user_id = db.create_user(
            email=data["email"],
            password_hash=password_hash,
            name=data["name"],
            role=data.get("role", "volunteer"),
        )

        # Create access token
        access_token = create_access_token(identity=data["email"])

        return success_response(
            {
                "token": access_token,
                "user": {
                    "id": user_id,
                    "email": data["email"],
                    "name": data["name"],
                    "role": data.get("role", "volunteer"),
                },
            },
            "Registration successful",
        )
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/auth/login", methods=["POST"])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return error_response("Email and password are required", status=400)

        # Get user from database
        user = db.get_user_by_email(email)

        if not user or not check_password_hash(user["password_hash"], password):
            return error_response("Invalid email or password", status=401)

        # Create access token
        access_token = create_access_token(identity=email)

        return success_response(
            {
                "token": access_token,
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "name": user["name"],
                    "role": user["role"],
                },
            },
            "Login successful",
        )
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/auth/logout", methods=["POST"])
@jwt_required()
def logout():
    """User logout endpoint"""
    return success_response(message="Logout successful")


@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Get current user endpoint"""
    try:
        current_user_email = get_jwt_identity()
        user = db.get_user_by_email(current_user_email)

        if not user:
            return error_response("User not found", status=404)

        return success_response(
            {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
            }
        )
    except Exception as e:
        return error_response(str(e), status=500)


# ==========================================
# INDIVIDUALS ENDPOINTS
# ==========================================


@app.route("/api/individuals", methods=["GET"])
@jwt_required()
def get_individuals():
    """Get all individuals with pagination"""
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        search = request.args.get("search", "")

        individuals, total = db.get_individuals(page, limit, search)

        return paginated_response(individuals, page, limit, total)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/individuals/<int:id>", methods=["GET"])
@jwt_required()
def get_individual(id):
    """Get individual by ID"""
    try:
        individual = db.get_individual_by_id(id)

        if not individual:
            return error_response("Individual not found", status=404)

        return success_response(individual)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/individuals", methods=["POST"])
@jwt_required()
def create_individual():
    """Create new individual"""
    try:
        data = request.get_json()

        # Validate input
        required_fields = ["name"]
        errors = {}
        for field in required_fields:
            if not data.get(field):
                errors[field] = [f"{field} is required"]

        if errors:
            return error_response("Validation failed", errors, 422)

        # Get current user
        current_user_email = get_jwt_identity()
        user = db.get_user_by_email(current_user_email)
        data["created_by"] = user["id"]

        # Create individual
        individual_id = db.create_individual(data)
        individual = db.get_individual_by_id(individual_id)

        # Emit socket event
        socketio.emit("new_individual", individual)

        return success_response(individual, "Individual created successfully")
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/individuals/<int:id>", methods=["PUT"])
@jwt_required()
def update_individual(id):
    """Update individual"""
    try:
        data = request.get_json()

        # Check if individual exists
        individual = db.get_individual_by_id(id)
        if not individual:
            return error_response("Individual not found", status=404)

        # Update individual
        success = db.update_individual(id, data)

        if not success:
            return error_response("Failed to update individual", status=500)

        updated_individual = db.get_individual_by_id(id)
        return success_response(updated_individual, "Individual updated successfully")
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/individuals/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_individual(id):
    """Delete individual"""
    try:
        success = db.delete_individual(id)

        if not success:
            return error_response("Individual not found", status=404)

        return success_response(message="Individual deleted successfully")
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/individuals/search", methods=["GET"])
@jwt_required()
def search_individuals():
    """Search individuals"""
    try:
        query = request.args.get("q", "")

        individuals, total = db.get_individuals(page=1, limit=50, search=query)

        return success_response(individuals)
    except Exception as e:
        return error_response(str(e), status=500)


# ==========================================
# SHELTERS ENDPOINTS
# ==========================================


@app.route("/api/shelters", methods=["GET"])
@jwt_required()
def get_shelters():
    """Get all shelters"""
    try:
        shelters = db.get_shelters()
        return success_response(shelters)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/shelters/available", methods=["GET"])
@jwt_required()
def get_available_shelters():
    """Get shelters with available beds"""
    try:
        shelters = db.get_shelters(available_only=True)
        return success_response(shelters)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/shelters/<int:id>", methods=["GET"])
@jwt_required()
def get_shelter(id):
    """Get shelter by ID"""
    try:
        shelter = db.get_shelter_by_id(id)

        if not shelter:
            return error_response("Shelter not found", status=404)

        return success_response(shelter)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/shelters/<int:id>/capacity", methods=["PATCH"])
@jwt_required()
def update_shelter_capacity(id):
    """Update shelter capacity"""
    try:
        data = request.get_json()
        available_beds = data.get("available_beds")

        if available_beds is None:
            return error_response("available_beds is required", status=400)

        success = db.update_shelter_capacity(id, available_beds)

        if not success:
            return error_response("Shelter not found", status=404)

        shelter = db.get_shelter_by_id(id)

        # Emit socket event
        socketio.emit(
            "shelter_update",
            {
                "shelter_id": id,
                "available_beds": available_beds,
                "total_capacity": shelter["total_capacity"],
            },
        )

        return success_response(shelter, "Capacity updated successfully")
    except Exception as e:
        return error_response(str(e), status=500)


# ==========================================
# JOBS ENDPOINTS
# ==========================================


@app.route("/api/jobs", methods=["GET"])
@jwt_required()
def get_jobs():
    """Get all jobs with pagination"""
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        status = request.args.get("status", "active")

        jobs, total = db.get_jobs(page, limit, status)

        return paginated_response(jobs, page, limit, total)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/jobs/<int:id>", methods=["GET"])
@jwt_required()
def get_job(id):
    """Get job by ID"""
    try:
        job = db.get_job_by_id(id)

        if not job:
            return error_response("Job not found", status=404)

        return success_response(job)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/jobs", methods=["POST"])
@jwt_required()
def create_job():
    """Create new job"""
    try:
        data = request.get_json()

        # Validate input
        required_fields = ["title", "company"]
        errors = {}
        for field in required_fields:
            if not data.get(field):
                errors[field] = [f"{field} is required"]

        if errors:
            return error_response("Validation failed", errors, 422)

        job_id = db.create_job(data)
        job = db.get_job_by_id(job_id)

        return success_response(job, "Job created successfully")
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/jobs/<int:job_id>/apply", methods=["POST"])
@jwt_required()
def apply_for_job(job_id):
    """Apply for a job"""
    try:
        data = request.get_json()
        individual_id = data.get("individual_id")

        if not individual_id:
            return error_response("individual_id is required", status=400)

        # Check if job exists
        job = db.get_job_by_id(job_id)
        if not job:
            return error_response("Job not found", status=404)

        # Check if individual exists
        individual = db.get_individual_by_id(individual_id)
        if not individual:
            return error_response("Individual not found", status=404)

        # Apply for job
        application_id = db.apply_for_job(job_id, individual_id, data.get("notes", ""))

        # Emit socket event
        socketio.emit(
            "job_placement",
            {
                "individual_id": individual_id,
                "individual_name": individual["name"],
                "job_id": job_id,
                "job_title": job["title"],
                "company": job["company"],
            },
        )

        return success_response(
            {"application_id": application_id, "job": job, "individual": individual},
            "Application submitted successfully",
        )
    except Exception as e:
        return error_response(str(e), status=500)


# ==========================================
# DOCUMENTS ENDPOINTS
# ==========================================

ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "doc", "docx"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/documents/upload", methods=["POST"])
@jwt_required()
def upload_document():
    """Upload document"""
    try:
        if "file" not in request.files:
            return error_response("No file provided", status=400)

        file = request.files["file"]
        individual_id = request.form.get("individual_id")
        document_type = request.form.get("document_type", "other")

        if not individual_id:
            return error_response("individual_id is required", status=400)

        if file.filename == "":
            return error_response("No file selected", status=400)

        if not allowed_file(file.filename):
            return error_response("File type not allowed", status=400)

        # Check if individual exists
        individual = db.get_individual_by_id(int(individual_id))
        if not individual:
            return error_response("Individual not found", status=404)

        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{individual_id}_{timestamp}_{filename}"
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

        # Get file size
        file_size = os.path.getsize(file_path)

        # Create document record
        document_id = db.create_document(
            individual_id=int(individual_id),
            document_type=document_type,
            file_name=filename,
            file_path=file_path,
            file_size=file_size,
        )

        return success_response(
            {"document_id": document_id, "file_name": filename, "file_size": file_size},
            "Document uploaded successfully",
        )
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/documents/individual/<int:individual_id>", methods=["GET"])
@jwt_required()
def get_documents_by_individual(individual_id):
    """Get all documents for an individual"""
    try:
        documents = db.get_documents_by_individual(individual_id)
        return success_response(documents)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/documents/<int:document_id>", methods=["DELETE"])
@jwt_required()
def delete_document(document_id):
    """Delete a document"""
    try:
        success = db.delete_document(document_id)

        if not success:
            return error_response("Document not found", status=404)

        return success_response(message="Document deleted successfully")
    except Exception as e:
        return error_response(str(e), status=500)


# ==========================================
# ANALYTICS ENDPOINTS
# ==========================================


@app.route("/api/analytics/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        stats = db.get_dashboard_stats()
        return success_response(stats)
    except Exception as e:
        return error_response(str(e), status=500)


# ==========================================
# AI ENDPOINTS (Placeholder - integrate with your AI models)
# ==========================================


@app.route("/api/ai/recommend/shelter", methods=["POST"])
@jwt_required()
def recommend_shelter():
    """Get shelter recommendations"""
    try:
        data = request.get_json()
        individual_id = data.get("individual_id")

        # TODO: Integrate with your AI recommendation engine
        # For now, return mock data
        recommendations = db.get_shelters(available_only=True)[:3]

        return success_response(recommendations)
    except Exception as e:
        return error_response(str(e), status=500)


@app.route("/api/ai/chatbot", methods=["POST"])
@jwt_required()
def chatbot():
    """Chatbot endpoint"""
    try:
        data = request.get_json()
        message = data.get("message")

        # TODO: Integrate with your chatbot AI
        response = {
            "message": f"I received your message: '{message}'. How can I help you?",
            "conversation_id": "conv_123",
        }

        return success_response(response)
    except Exception as e:
        return error_response(str(e), status=500)


# ==========================================
# SOCKET.IO EVENTS
# ==========================================


@socketio.on("connect")
def handle_connect():
    """Handle client connection"""
    print("Client connected")
    emit("connection_response", {"status": "connected"})


@socketio.on("disconnect")
def handle_disconnect():
    """Handle client disconnection"""
    print("Client disconnected")


@socketio.on("join_room")
def handle_join_room(data):
    """Handle room join"""
    room = data.get("room")
    join_room(room)
    emit("room_joined", {"room": room}, room=room)


@socketio.on("leave_room")
def handle_leave_room(data):
    """Handle room leave"""
    room = data.get("room")
    leave_room(room)
    emit("room_left", {"room": room}, room=room)


# ==========================================
# ERROR HANDLERS
# ==========================================


@app.errorhandler(404)
def not_found(error):
    return error_response("Resource not found", status=404)


@app.errorhandler(500)
def internal_error(error):
    return error_response("Internal server error", status=500)


@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return error_response("Missing authorization token", status=401)


@jwt.invalid_token_loader
def invalid_token_callback(callback):
    return error_response("Invalid authorization token", status=401)


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return error_response("Token has expired", status=401)


# ==========================================
# RUN APPLICATION
# ==========================================

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("🚀 Starting Flask Backend Server")
    print("=" * 50)
    print(f"📊 Database: {db.db_path}")
    print(f"📁 Upload folder: {app.config['UPLOAD_FOLDER']}")
    print(f"🌐 Server: http://localhost:5000")
    print(f"🔌 Socket.IO: Enabled")
    print("=" * 50 + "\n")

    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
