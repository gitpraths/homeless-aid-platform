"""
SQLite3 Database Manager
Handles all database operations with connection pooling and error handling
"""

import sqlite3
import json
from datetime import datetime
from contextlib import contextmanager
from typing import List, Dict, Any, Optional, Tuple
import os

DATABASE_PATH = os.getenv("DATABASE_PATH", "homeless_aid.db")


class Database:
    """SQLite3 Database Manager with connection pooling"""

    def __init__(self, db_path: str = DATABASE_PATH):
        self.db_path = db_path
        self.init_database()

    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Return rows as dictionaries
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def init_database(self):
        """Initialize database with all required tables"""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # Users table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    name TEXT NOT NULL,
                    role TEXT DEFAULT 'volunteer',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Individuals table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS individuals (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    age INTEGER,
                    gender TEXT,
                    email TEXT,
                    phone TEXT,
                    status TEXT DEFAULT 'active',
                    priority TEXT DEFAULT 'medium',
                    location_lat REAL,
                    location_lng REAL,
                    address TEXT,
                    notes TEXT,
                    created_by INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (created_by) REFERENCES users(id)
                )
            """)

            # Shelters table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS shelters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    address TEXT NOT NULL,
                    location_lat REAL NOT NULL,
                    location_lng REAL NOT NULL,
                    total_capacity INTEGER NOT NULL,
                    available_beds INTEGER NOT NULL,
                    contact_phone TEXT,
                    contact_email TEXT,
                    amenities TEXT,
                    restrictions TEXT,
                    operating_hours TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Jobs table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS jobs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    company TEXT NOT NULL,
                    description TEXT,
                    location TEXT,
                    location_lat REAL,
                    location_lng REAL,
                    salary_min REAL,
                    salary_max REAL,
                    job_type TEXT,
                    requirements TEXT,
                    contact_email TEXT,
                    contact_phone TEXT,
                    status TEXT DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Job applications table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS job_applications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    job_id INTEGER NOT NULL,
                    individual_id INTEGER NOT NULL,
                    status TEXT DEFAULT 'pending',
                    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    notes TEXT,
                    FOREIGN KEY (job_id) REFERENCES jobs(id),
                    FOREIGN KEY (individual_id) REFERENCES individuals(id)
                )
            """)

            # Documents table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    individual_id INTEGER NOT NULL,
                    document_type TEXT NOT NULL,
                    file_name TEXT NOT NULL,
                    file_path TEXT NOT NULL,
                    file_size INTEGER,
                    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (individual_id) REFERENCES individuals(id)
                )
            """)

            # Recommendations table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS recommendations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    individual_id INTEGER NOT NULL,
                    recommendation_type TEXT NOT NULL,
                    item_id INTEGER NOT NULL,
                    score REAL NOT NULL,
                    reason TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (individual_id) REFERENCES individuals(id)
                )
            """)

            # Feedback table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS feedback (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    individual_id INTEGER NOT NULL,
                    recommendation_id INTEGER NOT NULL,
                    feedback_type TEXT NOT NULL,
                    rating INTEGER,
                    comments TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (individual_id) REFERENCES individuals(id),
                    FOREIGN KEY (recommendation_id) REFERENCES recommendations(id)
                )
            """)

            # Chat conversations table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    individual_id INTEGER,
                    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    ended_at TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (individual_id) REFERENCES individuals(id)
                )
            """)

            # Chat messages table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chat_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id INTEGER NOT NULL,
                    sender_type TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
                )
            """)

            # Analytics events table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS analytics_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    event_type TEXT NOT NULL,
                    user_id INTEGER,
                    individual_id INTEGER,
                    metadata TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (individual_id) REFERENCES individuals(id)
                )
            """)

            # Create indexes for better performance
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_individuals_status ON individuals(status)"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_individuals_created_at ON individuals(created_at)"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_shelters_available ON shelters(available_beds)"
            )
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)")
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_recommendations_individual ON recommendations(individual_id)"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id)"
            )

            conn.commit()
            print("✅ Database initialized successfully")

    def row_to_dict(self, row: sqlite3.Row) -> Dict[str, Any]:
        """Convert SQLite Row to dictionary"""
        if row is None:
            return None
        return dict(row)

    def rows_to_list(self, rows: List[sqlite3.Row]) -> List[Dict[str, Any]]:
        """Convert list of SQLite Rows to list of dictionaries"""
        return [self.row_to_dict(row) for row in rows]

    # ==========================================
    # USER OPERATIONS
    # ==========================================

    def create_user(
        self, email: str, password_hash: str, name: str, role: str = "volunteer"
    ) -> int:
        """Create a new user"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
                (email, password_hash, name, role),
            )
            return cursor.lastrowid

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            return self.row_to_dict(cursor.fetchone())

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            return self.row_to_dict(cursor.fetchone())

    # ==========================================
    # INDIVIDUAL OPERATIONS
    # ==========================================

    def create_individual(self, data: Dict[str, Any]) -> int:
        """Create a new individual"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO individuals 
                (name, age, gender, email, phone, status, priority, location_lat, location_lng, address, notes, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    data.get("name"),
                    data.get("age"),
                    data.get("gender"),
                    data.get("email"),
                    data.get("phone"),
                    data.get("status", "active"),
                    data.get("priority", "medium"),
                    data.get("location_lat"),
                    data.get("location_lng"),
                    data.get("address"),
                    data.get("notes"),
                    data.get("created_by"),
                ),
            )
            return cursor.lastrowid

    def get_individuals(
        self, page: int = 1, limit: int = 10, search: str = ""
    ) -> Tuple[List[Dict], int]:
        """Get paginated list of individuals"""
        offset = (page - 1) * limit

        with self.get_connection() as conn:
            cursor = conn.cursor()

            # Build query with search
            query = "SELECT * FROM individuals"
            count_query = "SELECT COUNT(*) FROM individuals"
            params = []

            if search:
                query += " WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?"
                count_query += " WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?"
                search_param = f"%{search}%"
                params = [search_param, search_param, search_param]

            query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            # Get individuals
            cursor.execute(query, params)
            individuals = self.rows_to_list(cursor.fetchall())

            # Get total count
            cursor.execute(count_query, params[:3] if search else [])
            total = cursor.fetchone()[0]

            return individuals, total

    def get_individual_by_id(self, individual_id: int) -> Optional[Dict[str, Any]]:
        """Get individual by ID"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM individuals WHERE id = ?", (individual_id,))
            return self.row_to_dict(cursor.fetchone())

    def update_individual(self, individual_id: int, data: Dict[str, Any]) -> bool:
        """Update individual"""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # Build dynamic update query
            fields = []
            values = []
            for key, value in data.items():
                if key != "id":
                    fields.append(f"{key} = ?")
                    values.append(value)

            if not fields:
                return False

            values.append(datetime.now())
            values.append(individual_id)

            query = f"UPDATE individuals SET {', '.join(fields)}, updated_at = ? WHERE id = ?"
            cursor.execute(query, values)

            return cursor.rowcount > 0

    def delete_individual(self, individual_id: int) -> bool:
        """Delete individual"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM individuals WHERE id = ?", (individual_id,))
            return cursor.rowcount > 0

    # ==========================================
    # SHELTER OPERATIONS
    # ==========================================

    def create_shelter(self, data: Dict[str, Any]) -> int:
        """Create a new shelter"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO shelters 
                (name, address, location_lat, location_lng, total_capacity, available_beds, 
                 contact_phone, contact_email, amenities, restrictions, operating_hours)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    data.get("name"),
                    data.get("address"),
                    data.get("location_lat"),
                    data.get("location_lng"),
                    data.get("total_capacity"),
                    data.get("available_beds"),
                    data.get("contact_phone"),
                    data.get("contact_email"),
                    json.dumps(data.get("amenities", [])),
                    json.dumps(data.get("restrictions", [])),
                    data.get("operating_hours"),
                ),
            )
            return cursor.lastrowid

    def get_shelters(self, available_only: bool = False) -> List[Dict[str, Any]]:
        """Get all shelters"""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            query = "SELECT * FROM shelters"
            if available_only:
                query += " WHERE available_beds > 0"
            query += " ORDER BY name"

            cursor.execute(query)
            shelters = self.rows_to_list(cursor.fetchall())

            # Parse JSON fields
            for shelter in shelters:
                if shelter.get("amenities"):
                    shelter["amenities"] = json.loads(shelter["amenities"])
                if shelter.get("restrictions"):
                    shelter["restrictions"] = json.loads(shelter["restrictions"])

            return shelters

    def get_shelter_by_id(self, shelter_id: int) -> Optional[Dict[str, Any]]:
        """Get shelter by ID"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM shelters WHERE id = ?", (shelter_id,))
            shelter = self.row_to_dict(cursor.fetchone())

            if shelter:
                if shelter.get("amenities"):
                    shelter["amenities"] = json.loads(shelter["amenities"])
                if shelter.get("restrictions"):
                    shelter["restrictions"] = json.loads(shelter["restrictions"])

            return shelter

    def update_shelter_capacity(self, shelter_id: int, available_beds: int) -> bool:
        """Update shelter capacity"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE shelters SET available_beds = ?, updated_at = ? WHERE id = ?",
                (available_beds, datetime.now(), shelter_id),
            )
            return cursor.rowcount > 0

    # ==========================================
    # JOB OPERATIONS
    # ==========================================

    def create_job(self, data: Dict[str, Any]) -> int:
        """Create a new job"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO jobs 
                (title, company, description, location, location_lat, location_lng,
                 salary_min, salary_max, job_type, requirements, contact_email, contact_phone, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    data.get("title"),
                    data.get("company"),
                    data.get("description"),
                    data.get("location"),
                    data.get("location_lat"),
                    data.get("location_lng"),
                    data.get("salary_min"),
                    data.get("salary_max"),
                    data.get("job_type"),
                    data.get("requirements"),
                    data.get("contact_email"),
                    data.get("contact_phone"),
                    data.get("status", "active"),
                ),
            )
            return cursor.lastrowid

    def get_jobs(
        self, page: int = 1, limit: int = 10, status: str = "active"
    ) -> Tuple[List[Dict], int]:
        """Get paginated list of jobs"""
        offset = (page - 1) * limit

        with self.get_connection() as conn:
            cursor = conn.cursor()

            cursor.execute(
                "SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
                (status, limit, offset),
            )
            jobs = self.rows_to_list(cursor.fetchall())

            cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = ?", (status,))
            total = cursor.fetchone()[0]

            return jobs, total

    def get_job_by_id(self, job_id: int) -> Optional[Dict[str, Any]]:
        """Get job by ID"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
            return self.row_to_dict(cursor.fetchone())

    def apply_for_job(self, job_id: int, individual_id: int, notes: str = "") -> int:
        """Apply for a job"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO job_applications (job_id, individual_id, notes) VALUES (?, ?, ?)",
                (job_id, individual_id, notes),
            )
            return cursor.lastrowid

    # ==========================================
    # DOCUMENT OPERATIONS
    # ==========================================

    def create_document(
        self,
        individual_id: int,
        document_type: str,
        file_name: str,
        file_path: str,
        file_size: int,
    ) -> int:
        """Create a document record"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO documents (individual_id, document_type, file_name, file_path, file_size)
                VALUES (?, ?, ?, ?, ?)
            """,
                (individual_id, document_type, file_name, file_path, file_size),
            )
            return cursor.lastrowid

    def get_documents_by_individual(self, individual_id: int) -> List[Dict[str, Any]]:
        """Get all documents for an individual"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM documents WHERE individual_id = ? ORDER BY uploaded_at DESC",
                (individual_id,),
            )
            return self.rows_to_list(cursor.fetchall())

    def delete_document(self, document_id: int) -> bool:
        """Delete a document"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM documents WHERE id = ?", (document_id,))
            return cursor.rowcount > 0

    # ==========================================
    # ANALYTICS OPERATIONS
    # ==========================================

    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Get dashboard statistics"""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # Total individuals
            cursor.execute("SELECT COUNT(*) FROM individuals")
            total_individuals = cursor.fetchone()[0]

            # Active individuals
            cursor.execute(
                "SELECT COUNT(*) FROM individuals WHERE status = ?", ("active",)
            )
            active_individuals = cursor.fetchone()[0]

            # Total shelters
            cursor.execute("SELECT COUNT(*) FROM shelters")
            total_shelters = cursor.fetchone()[0]

            # Available beds
            cursor.execute("SELECT SUM(available_beds) FROM shelters")
            available_beds = cursor.fetchone()[0] or 0

            # Total jobs
            cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = ?", ("active",))
            active_jobs = cursor.fetchone()[0]

            # Recent registrations (last 7 days)
            cursor.execute("""
                SELECT COUNT(*) FROM individuals 
                WHERE created_at >= datetime('now', '-7 days')
            """)
            recent_registrations = cursor.fetchone()[0]

            return {
                "total_individuals": total_individuals,
                "active_individuals": active_individuals,
                "total_shelters": total_shelters,
                "available_beds": available_beds,
                "active_jobs": active_jobs,
                "recent_registrations": recent_registrations,
            }


# Create global database instance
db = Database()
