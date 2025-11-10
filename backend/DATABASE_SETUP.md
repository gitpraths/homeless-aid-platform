# SQLite3 Database Setup Guide

## Overview

This project uses SQLite3 for persistent data storage. SQLite3 is:
- ✅ Serverless (no separate database server needed)
- ✅ Zero-configuration
- ✅ Built into Python (no installation required)
- ✅ Perfect for development and small to medium deployments
- ✅ Single file database (easy backup and migration)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database

The database will be automatically created when you first run the app:

```bash
python app.py
```

This creates `homeless_aid.db` in the backend directory.

### 3. Seed Sample Data

```bash
python seed_data.py
```

This populates the database with:
- 3 test users (admin, volunteer, coordinator)
- 5 sample individuals
- 5 shelters
- 5 job listings

### 4. Test Credentials

After seeding, you can login with:

```
Admin:       admin@example.com / admin123
Volunteer:   volunteer@example.com / volunteer123
Coordinator: coordinator@example.com / coordinator123
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'volunteer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Individuals Table
```sql
CREATE TABLE individuals (
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
```

### Shelters Table
```sql
CREATE TABLE shelters (
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
```

### Jobs Table
```sql
CREATE TABLE jobs (
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
```

### Job Applications Table
```sql
CREATE TABLE job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    individual_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (individual_id) REFERENCES individuals(id)
)
```

### Documents Table
```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    individual_id INTEGER NOT NULL,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (individual_id) REFERENCES individuals(id)
)
```

### Recommendations Table
```sql
CREATE TABLE recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    individual_id INTEGER NOT NULL,
    recommendation_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    score REAL NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (individual_id) REFERENCES individuals(id)
)
```

### Feedback Table
```sql
CREATE TABLE feedback (
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
```

### Chat Tables
```sql
CREATE TABLE chat_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    individual_id INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (individual_id) REFERENCES individuals(id)
)

CREATE TABLE chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
)
```

### Analytics Table
```sql
CREATE TABLE analytics_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    user_id INTEGER,
    individual_id INTEGER,
    metadata TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (individual_id) REFERENCES individuals(id)
)
```

## Database Operations

### Using the Database Class

```python
from database import db

# Create individual
individual_id = db.create_individual({
    'name': 'John Doe',
    'age': 35,
    'email': 'john@example.com',
    'status': 'active'
})

# Get individuals with pagination
individuals, total = db.get_individuals(page=1, limit=10, search='john')

# Get individual by ID
individual = db.get_individual_by_id(1)

# Update individual
db.update_individual(1, {'status': 'completed'})

# Delete individual
db.delete_individual(1)
```

### Direct SQL Queries

```python
from database import db

with db.get_connection() as conn:
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM individuals WHERE status = ?', ('active',))
    results = cursor.fetchall()
```

## Database Management

### View Database

Use SQLite browser or command line:

```bash
# Install sqlite3 (usually pre-installed)
sqlite3 homeless_aid.db

# View tables
.tables

# View schema
.schema individuals

# Query data
SELECT * FROM individuals;

# Exit
.quit
```

### Backup Database

```bash
# Simple file copy
cp homeless_aid.db homeless_aid_backup.db

# Or use SQLite dump
sqlite3 homeless_aid.db .dump > backup.sql
```

### Restore Database

```bash
# From backup file
cp homeless_aid_backup.db homeless_aid.db

# From SQL dump
sqlite3 homeless_aid.db < backup.sql
```

### Reset Database

```bash
# Delete database file
rm homeless_aid.db

# Restart app to recreate
python app.py

# Reseed data
python seed_data.py
```

## Performance Optimization

### Indexes

The database automatically creates indexes on:
- `individuals.status`
- `individuals.created_at`
- `shelters.available_beds`
- `jobs.status`
- `recommendations.individual_id`
- `chat_messages.conversation_id`

### Query Optimization Tips

1. **Use pagination** for large datasets
2. **Use indexes** for frequently queried columns
3. **Limit SELECT columns** to only what you need
4. **Use prepared statements** (already implemented)
5. **Batch operations** when possible

## Migration to Production Database

When ready for production, you can migrate to PostgreSQL or MySQL:

### 1. Export Data

```bash
sqlite3 homeless_aid.db .dump > data.sql
```

### 2. Convert SQL (if needed)

SQLite to PostgreSQL converter tools are available online.

### 3. Import to New Database

```bash
psql -U username -d database_name -f data.sql
```

### 4. Update Connection

Replace `database.py` with PostgreSQL/MySQL connection code.

## Troubleshooting

### Database Locked Error

```python
# Increase timeout
conn = sqlite3.connect('homeless_aid.db', timeout=30)
```

### Permission Denied

```bash
# Check file permissions
chmod 644 homeless_aid.db
```

### Corrupted Database

```bash
# Check integrity
sqlite3 homeless_aid.db "PRAGMA integrity_check;"

# Recover if possible
sqlite3 homeless_aid.db ".recover" | sqlite3 recovered.db
```

## Environment Variables

Create `.env` file in backend directory:

```env
DATABASE_PATH=homeless_aid.db
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
UPLOAD_FOLDER=uploads
```

## Testing

### Run Tests

```bash
# Test database connection
python -c "from database import db; print('✅ Database connected')"

# Test seeding
python seed_data.py

# Test API
python app.py
# Then visit http://localhost:5000/api/analytics/dashboard
```

## Best Practices

1. **Always use context managers** for database connections
2. **Use parameterized queries** to prevent SQL injection
3. **Handle exceptions** properly
4. **Close connections** after use (handled by context manager)
5. **Backup regularly** in production
6. **Use transactions** for multiple related operations
7. **Index frequently queried columns**
8. **Monitor database size** and optimize as needed

## File Structure

```
backend/
├── app.py                 # Main Flask application
├── database.py            # Database manager class
├── seed_data.py           # Sample data seeder
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── homeless_aid.db        # SQLite database file (created automatically)
└── uploads/               # Uploaded documents folder
```

## Next Steps

1. ✅ Install dependencies: `pip install -r requirements.txt`
2. ✅ Run app to create database: `python app.py`
3. ✅ Seed sample data: `python seed_data.py`
4. ✅ Test API endpoints with Postman or curl
5. ✅ Connect frontend to backend
6. ✅ Test real-time Socket.IO events
7. ✅ Deploy to production

## Support

For issues or questions:
- Check Flask documentation: https://flask.palletsprojects.com/
- Check SQLite documentation: https://www.sqlite.org/docs.html
- Review error logs in console
