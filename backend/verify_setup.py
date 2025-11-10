#!/usr/bin/env python3
"""
Backend Setup Verification Script
Checks that all components are properly configured
"""

import os
import sys
import sqlite3


def print_status(message, status):
    """Print colored status message"""
    colors = {
        "success": "\033[92m✅",
        "error": "\033[91m❌",
        "warning": "\033[93m⚠️",
        "info": "\033[94mℹ️",
    }
    reset = "\033[0m"
    print(f"{colors.get(status, '')} {message}{reset}")


def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_status(
            f"Python {version.major}.{version.minor}.{version.micro}", "success"
        )
        return True
    else:
        print_status(
            f"Python {version.major}.{version.minor}.{version.micro} (3.8+ required)",
            "error",
        )
        return False


def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        "flask",
        "flask_cors",
        "flask_socketio",
        "flask_jwt_extended",
        "werkzeug",
        "dotenv",
    ]

    missing = []
    for package in required_packages:
        try:
            __import__(package)
            print_status(f"Package '{package}' installed", "success")
        except ImportError:
            print_status(f"Package '{package}' missing", "error")
            missing.append(package)

    return len(missing) == 0


def check_database():
    """Check database file and structure"""
    db_path = "homeless_aid.db"

    if not os.path.exists(db_path):
        print_status(
            f"Database file not found (will be created on first run)", "warning"
        )
        return True

    print_status(f"Database file exists: {db_path}", "success")

    # Check tables
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]

        required_tables = [
            "users",
            "individuals",
            "shelters",
            "jobs",
            "job_applications",
            "documents",
            "recommendations",
            "feedback",
            "chat_conversations",
            "chat_messages",
            "analytics_events",
        ]

        for table in required_tables:
            if table in tables:
                print_status(f"Table '{table}' exists", "success")
            else:
                print_status(f"Table '{table}' missing", "warning")

        conn.close()
        return True
    except Exception as e:
        print_status(f"Database error: {str(e)}", "error")
        return False


def check_env_file():
    """Check environment configuration"""
    if os.path.exists(".env"):
        print_status(".env file exists", "success")

        # Check required variables
        from dotenv import load_dotenv

        load_dotenv()

        required_vars = ["SECRET_KEY", "JWT_SECRET_KEY"]
        for var in required_vars:
            value = os.getenv(var)
            if value and value != f"your-{var.lower()}-change-in-production":
                print_status(f"{var} is configured", "success")
            else:
                print_status(f"{var} needs to be set", "warning")

        return True
    else:
        print_status(".env file not found (using defaults)", "warning")
        print_status("Run: cp .env.example .env", "info")
        return False


def check_uploads_folder():
    """Check uploads folder"""
    if os.path.exists("uploads"):
        print_status("Uploads folder exists", "success")
        return True
    else:
        print_status("Uploads folder missing (will be created)", "warning")
        return True


def check_database_module():
    """Check database module"""
    try:
        from database import db

        print_status("Database module loads successfully", "success")
        return True
    except Exception as e:
        print_status(f"Database module error: {str(e)}", "error")
        return False


def check_app_module():
    """Check Flask app module"""
    try:
        # Don't actually import to avoid running the server
        with open("app.py", "r") as f:
            content = f.read()
            if "Flask" in content and "socketio" in content:
                print_status("Flask app file is valid", "success")
                return True
    except Exception as e:
        print_status(f"App module error: {str(e)}", "error")
        return False


def main():
    """Run all verification checks"""
    print("\n" + "=" * 50)
    print("🔍 Backend Setup Verification")
    print("=" * 50 + "\n")

    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Environment Config", check_env_file),
        ("Database Module", check_database_module),
        ("Flask App", check_app_module),
        ("Database File", check_database),
        ("Uploads Folder", check_uploads_folder),
    ]

    results = []
    for name, check_func in checks:
        print(f"\n📋 Checking {name}...")
        results.append(check_func())

    print("\n" + "=" * 50)
    print("📊 Verification Summary")
    print("=" * 50)

    passed = sum(results)
    total = len(results)

    print(f"\nPassed: {passed}/{total} checks")

    if passed == total:
        print_status("\n✅ All checks passed! Backend is ready to run.", "success")
        print("\n🚀 Start the server with:")
        print("   python app.py")
        print("\n💾 Seed sample data with:")
        print("   python seed_data.py")
        return 0
    else:
        print_status(
            f"\n⚠️  {total - passed} check(s) failed or need attention.", "warning"
        )
        print("\n🔧 Fix issues and run verification again:")
        print("   python verify_setup.py")
        return 1


if __name__ == "__main__":
    sys.exit(main())
