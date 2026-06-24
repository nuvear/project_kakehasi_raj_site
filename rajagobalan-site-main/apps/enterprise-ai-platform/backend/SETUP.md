# Setup Guide - AI Transformation Command Center Backend

## Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip or conda for package management

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# REQUIRED: PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/ai_platform

# OPTIONAL: OpenAI API (for enhanced AI features)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# OPTIONAL: Security settings
SECRET_KEY=your-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### 3. Initialize Database

Ensure PostgreSQL is running, then:

```bash
# Create database
createdb ai_platform

# Run schema initialization
psql ai_platform < init.sql
```

The schema includes these tables (already created):
- companies
- ai_projects
- maturity_assessments
- maturity_answers
- roi_simulations
- architecture_designs
- roadmaps
- discovery_results
- wardley_maps

### 4. Start the Server

```bash
# Using the provided script
./run.sh

# OR use uvicorn directly
uvicorn app.main:app --reload
```

The API will be available at: `http://localhost:8000`

### 5. Test the API

```bash
# In a new terminal
python test_api.py
```

Or visit the interactive docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Detailed Installation

### Install Python Dependencies

```bash
# Using pip
pip install -r requirements.txt

# Using conda (if you prefer)
conda create -n ai-platform python=3.10
conda activate ai-platform
pip install -r requirements.txt
```

### Required Packages

The `requirements.txt` includes:

```
fastapi==0.104.1           # Web framework
uvicorn==0.24.0            # ASGI server
sqlalchemy==2.0.23         # ORM
psycopg2-binary==2.9.9     # PostgreSQL adapter
pydantic==2.5.0            # Data validation
pydantic-settings==2.1.0   # Environment config
python-multipart==0.0.6    # File uploads
python-pptx==0.6.21        # PowerPoint export
openai==1.3.9              # OpenAI integration
```

### PostgreSQL Setup

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
createdb ai_platform
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
createdb ai_platform
```

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer with default settings
- Use pgAdmin or psql to create database

### Initialize Database Schema

```bash
# Using psql
psql ai_platform < init.sql

# Or manually import the schema
psql ai_platform < /path/to/init.sql
```

The schema creates these tables with proper relationships:

```sql
companies
├── ai_projects (FK)
├── maturity_assessments (FK)
│   └── maturity_answers (FK)
├── roi_simulations (FK)
├── discovery_results (FK)
├── architecture_designs (FK)
├── roadmaps (FK)
└── wardley_maps (FK)
```

### Environment Variables

Create `.env` file in the backend root directory:

```env
# Database Configuration (REQUIRED)
DATABASE_URL=postgresql://username:password@localhost:5432/ai_platform

# OpenAI Configuration (OPTIONAL)
# If not set, the system uses rule-based fallbacks
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# Application Settings
SECRET_KEY=your-secret-key-min-32-chars-recommended
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Recommended for local development
DEBUG=True
```

### Database Connection String Format

PostgreSQL connection strings follow this format:

```
postgresql://[user[:password]@][host][:port][/database]
```

Examples:

```env
# Local development (default credentials)
DATABASE_URL=postgresql://postgres@localhost/ai_platform

# With custom password
DATABASE_URL=postgresql://user:password@localhost:5432/ai_platform

# Remote database
DATABASE_URL=postgresql://user:password@db.example.com:5432/ai_platform

# AWS RDS
DATABASE_URL=postgresql://user:password@mydb.xxxxx.us-east-1.rds.amazonaws.com:5432/ai_platform

# Heroku
DATABASE_URL=postgresql://user:password@ec2-xxx.amazonaws.com:5432/dbname
```

## Running the Application

### Development Server

```bash
# With auto-reload (watches for code changes)
uvicorn app.main:app --reload

# Specify host and port
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Using the provided script (includes setup verification)
./run.sh
```

### Production Server

```bash
# Using Gunicorn + Uvicorn (recommended)
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Using Uvicorn only (single worker)
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker

If using Docker:

```bash
docker build -t ai-platform-backend .
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  ai-platform-backend
```

## Troubleshooting

### Error: "No module named 'pydantic_settings'"

**Solution**: Install requirements
```bash
pip install -r requirements.txt
```

### Error: "could not connect to server: Connection refused"

**Solution**: PostgreSQL is not running
```bash
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo service postgresql start

# Windows
# Use Services app or pgAdmin
```

### Error: "database 'ai_platform' does not exist"

**Solution**: Create the database
```bash
createdb ai_platform
psql ai_platform < init.sql
```

### Error: "no pg_hba.conf entry for host"

**Solution**: Update PostgreSQL authentication
- Check `/etc/postgresql/*/main/pg_hba.conf`
- Ensure line exists: `local   all             all                                     md5`
- Restart PostgreSQL

### ImportError with FastAPI routers

**Solution**: Ensure all routers are importable
```bash
python -c "from app.api import health; print('OK')"
```

## Testing the API

### Using the Test Script

```bash
# Make sure server is running first
./run.sh  # in one terminal

# Then in another terminal
python test_api.py
```

### Manual Testing with curl

```bash
# Health check
curl http://localhost:8000/api/health

# List projects
curl "http://localhost:8000/api/projects?company_id=a0000000-0000-0000-0000-000000000001"

# Create project
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "a0000000-0000-0000-0000-000000000001",
    "name": "Test Project",
    "description": "Test Description"
  }'
```

### Using Swagger UI

1. Navigate to http://localhost:8000/docs
2. Click on any endpoint to expand it
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"
6. View response

## Verifying Installation

Check that everything is installed and configured:

```bash
# Python version
python --version

# Package versions
pip list | grep -E "fastapi|sqlalchemy|pydantic|openai"

# Database connection
psql ai_platform -c "SELECT version();"

# API health check
curl http://localhost:8000/api/health
```

## Next Steps

1. **Review API Documentation**: Visit http://localhost:8000/docs
2. **Create a Company**: Use the projects endpoint to create test data
3. **Run AI Discovery**: Generate use case opportunities
4. **Assessment**: Conduct maturity assessment
5. **ROI Simulation**: Calculate financial impact
6. **View Results**: Check database records

## Support

For issues or questions:

1. Check ARCHITECTURE.md for detailed technical information
2. Review README.md for API endpoint documentation
3. Check error messages in server console
4. Review database schema in init.sql

## Performance Tips

1. **Use Connection Pooling**: SQLAlchemy handles this automatically
2. **Index Foreign Keys**: Already done in init.sql
3. **Batch Operations**: Use bulk_insert_mappings for multiple records
4. **Monitor Queries**: Enable SQLAlchemy echo mode for debugging:
   ```python
   # In database.py
   engine = create_engine(DATABASE_URL, echo=True)
   ```

## Security Checklist

- [ ] Change SECRET_KEY in .env
- [ ] Use strong DATABASE_URL password
- [ ] Set CORS_ORIGINS to specific domains (not "*")
- [ ] Use HTTPS in production (set up reverse proxy)
- [ ] Keep dependencies updated: `pip install --upgrade -r requirements.txt`
- [ ] Use environment variables for sensitive data
- [ ] Enable database backup and replication

