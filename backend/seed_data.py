"""
Seed data for development and testing
Run this script to populate the database with sample data
"""

from database import db
from werkzeug.security import generate_password_hash
import random


def seed_users():
    """Seed users"""
    print("Seeding users...")

    users = [
        {
            "email": "admin@example.com",
            "password": "admin123",
            "name": "Admin User",
            "role": "admin",
        },
        {
            "email": "volunteer@example.com",
            "password": "volunteer123",
            "name": "Volunteer User",
            "role": "volunteer",
        },
        {
            "email": "coordinator@example.com",
            "password": "coordinator123",
            "name": "Coordinator User",
            "role": "coordinator",
        },
    ]

    for user in users:
        try:
            password_hash = generate_password_hash(user["password"])
            db.create_user(
                email=user["email"],
                password_hash=password_hash,
                name=user["name"],
                role=user["role"],
            )
            print(f"  ✓ Created user: {user['email']}")
        except Exception as e:
            print(f"  ✗ Failed to create user {user['email']}: {e}")


def seed_individuals():
    """Seed individuals"""
    print("\nSeeding individuals...")

    individuals = [
        {
            "name": "John Doe",
            "age": 35,
            "gender": "Male",
            "email": "john.doe@example.com",
            "phone": "555-0101",
            "status": "active",
            "priority": "high",
            "location_lat": 40.7128,
            "location_lng": -74.0060,
            "address": "123 Main St, New York, NY",
            "notes": "Needs immediate shelter assistance",
            "created_by": 1,
        },
        {
            "name": "Jane Smith",
            "age": 28,
            "gender": "Female",
            "email": "jane.smith@example.com",
            "phone": "555-0102",
            "status": "active",
            "priority": "medium",
            "location_lat": 40.7589,
            "location_lng": -73.9851,
            "address": "456 Park Ave, New York, NY",
            "notes": "Looking for job opportunities",
            "created_by": 1,
        },
        {
            "name": "Robert Johnson",
            "age": 42,
            "gender": "Male",
            "email": "robert.j@example.com",
            "phone": "555-0103",
            "status": "active",
            "priority": "high",
            "location_lat": 40.7614,
            "location_lng": -73.9776,
            "address": "789 Broadway, New York, NY",
            "notes": "Veteran, needs medical assistance",
            "created_by": 2,
        },
        {
            "name": "Maria Garcia",
            "age": 31,
            "gender": "Female",
            "email": "maria.g@example.com",
            "phone": "555-0104",
            "status": "pending",
            "priority": "medium",
            "location_lat": 40.7489,
            "location_lng": -73.9680,
            "address": "321 5th Ave, New York, NY",
            "notes": "Single mother with two children",
            "created_by": 2,
        },
        {
            "name": "David Lee",
            "age": 55,
            "gender": "Male",
            "email": "david.lee@example.com",
            "phone": "555-0105",
            "status": "active",
            "priority": "low",
            "location_lat": 40.7580,
            "location_lng": -73.9855,
            "address": "654 Madison Ave, New York, NY",
            "notes": "Recently employed, needs transitional housing",
            "created_by": 1,
        },
    ]

    for individual in individuals:
        try:
            individual_id = db.create_individual(individual)
            print(f"  ✓ Created individual: {individual['name']} (ID: {individual_id})")
        except Exception as e:
            print(f"  ✗ Failed to create individual {individual['name']}: {e}")


def seed_shelters():
    """Seed shelters"""
    print("\nSeeding shelters...")

    shelters = [
        {
            "name": "Hope Shelter",
            "address": "100 Hope St, New York, NY 10001",
            "location_lat": 40.7505,
            "location_lng": -73.9934,
            "total_capacity": 50,
            "available_beds": 12,
            "contact_phone": "555-1001",
            "contact_email": "info@hopeshelter.org",
            "amenities": ["meals", "showers", "laundry", "medical"],
            "restrictions": ["no_pets", "no_alcohol"],
            "operating_hours": "24/7",
        },
        {
            "name": "Safe Haven",
            "address": "200 Safe St, New York, NY 10002",
            "location_lat": 40.7282,
            "location_lng": -73.9942,
            "total_capacity": 30,
            "available_beds": 5,
            "contact_phone": "555-1002",
            "contact_email": "contact@safehaven.org",
            "amenities": ["meals", "showers", "counseling"],
            "restrictions": ["women_only", "no_alcohol"],
            "operating_hours": "6 PM - 8 AM",
        },
        {
            "name": "Community Care Center",
            "address": "300 Care Ave, New York, NY 10003",
            "location_lat": 40.7614,
            "location_lng": -73.9776,
            "total_capacity": 75,
            "available_beds": 20,
            "contact_phone": "555-1003",
            "contact_email": "info@communitycare.org",
            "amenities": ["meals", "showers", "laundry", "medical", "job_training"],
            "restrictions": ["no_drugs", "no_alcohol"],
            "operating_hours": "24/7",
        },
        {
            "name": "Veterans Shelter",
            "address": "400 Veterans Blvd, New York, NY 10004",
            "location_lat": 40.7047,
            "location_lng": -74.0134,
            "total_capacity": 40,
            "available_beds": 8,
            "contact_phone": "555-1004",
            "contact_email": "support@veteransshelter.org",
            "amenities": ["meals", "showers", "medical", "counseling", "job_training"],
            "restrictions": ["veterans_only", "no_drugs"],
            "operating_hours": "24/7",
        },
        {
            "name": "Family First Shelter",
            "address": "500 Family Way, New York, NY 10005",
            "location_lat": 40.7589,
            "location_lng": -73.9851,
            "total_capacity": 60,
            "available_beds": 15,
            "contact_phone": "555-1005",
            "contact_email": "info@familyfirst.org",
            "amenities": ["meals", "showers", "laundry", "childcare", "education"],
            "restrictions": ["families_only", "no_drugs", "no_alcohol"],
            "operating_hours": "24/7",
        },
    ]

    for shelter in shelters:
        try:
            shelter_id = db.create_shelter(shelter)
            print(f"  ✓ Created shelter: {shelter['name']} (ID: {shelter_id})")
        except Exception as e:
            print(f"  ✗ Failed to create shelter {shelter['name']}: {e}")


def seed_jobs():
    """Seed jobs"""
    print("\nSeeding jobs...")

    jobs = [
        {
            "title": "Warehouse Associate",
            "company": "ABC Logistics",
            "description": "Entry-level warehouse position. No experience required. Training provided.",
            "location": "Brooklyn, NY",
            "location_lat": 40.6782,
            "location_lng": -73.9442,
            "salary_min": 15.00,
            "salary_max": 18.00,
            "job_type": "full-time",
            "requirements": "Must be able to lift 50 lbs",
            "contact_email": "jobs@abclogistics.com",
            "contact_phone": "555-2001",
            "status": "active",
        },
        {
            "title": "Retail Sales Associate",
            "company": "City Mart",
            "description": "Customer service position in retail store. Flexible hours available.",
            "location": "Manhattan, NY",
            "location_lat": 40.7831,
            "location_lng": -73.9712,
            "salary_min": 16.00,
            "salary_max": 20.00,
            "job_type": "part-time",
            "requirements": "Good communication skills",
            "contact_email": "hr@citymart.com",
            "contact_phone": "555-2002",
            "status": "active",
        },
        {
            "title": "Kitchen Helper",
            "company": "Downtown Diner",
            "description": "Help with food preparation and kitchen cleaning. Meals included.",
            "location": "Manhattan, NY",
            "location_lat": 40.7589,
            "location_lng": -73.9851,
            "salary_min": 14.00,
            "salary_max": 16.00,
            "job_type": "full-time",
            "requirements": "Food handler certificate preferred",
            "contact_email": "hiring@downtowndiner.com",
            "contact_phone": "555-2003",
            "status": "active",
        },
        {
            "title": "Custodian",
            "company": "Clean Pro Services",
            "description": "Building maintenance and cleaning. Evening shift available.",
            "location": "Queens, NY",
            "location_lat": 40.7282,
            "location_lng": -73.7949,
            "salary_min": 15.50,
            "salary_max": 17.50,
            "job_type": "full-time",
            "requirements": "Reliable transportation",
            "contact_email": "jobs@cleanpro.com",
            "contact_phone": "555-2004",
            "status": "active",
        },
        {
            "title": "Delivery Driver",
            "company": "Quick Delivery Co",
            "description": "Deliver packages in local area. Company vehicle provided.",
            "location": "Bronx, NY",
            "location_lat": 40.8448,
            "location_lng": -73.8648,
            "salary_min": 17.00,
            "salary_max": 22.00,
            "job_type": "full-time",
            "requirements": "Valid driver license required",
            "contact_email": "drivers@quickdelivery.com",
            "contact_phone": "555-2005",
            "status": "active",
        },
    ]

    for job in jobs:
        try:
            job_id = db.create_job(job)
            print(f"  ✓ Created job: {job['title']} at {job['company']} (ID: {job_id})")
        except Exception as e:
            print(f"  ✗ Failed to create job {job['title']}: {e}")


def seed_all():
    """Seed all data"""
    print("=" * 50)
    print("SEEDING DATABASE")
    print("=" * 50)

    seed_users()
    seed_individuals()
    seed_shelters()
    seed_jobs()

    print("\n" + "=" * 50)
    print("✅ DATABASE SEEDING COMPLETE")
    print("=" * 50)
    print("\nTest Credentials:")
    print("  Admin:       admin@example.com / admin123")
    print("  Volunteer:   volunteer@example.com / volunteer123")
    print("  Coordinator: coordinator@example.com / coordinator123")
    print("=" * 50)


if __name__ == "__main__":
    seed_all()
