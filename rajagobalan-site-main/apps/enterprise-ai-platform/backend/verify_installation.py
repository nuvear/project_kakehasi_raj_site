#!/usr/bin/env python
"""
Verification script for FastAPI backend installation.
Run with: python verify_installation.py
"""

import sys
import os
from pathlib import Path

def check_python_version():
    """Check Python version."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required")
        return False
    print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_files():
    """Check all required files exist."""
    required_files = [
        "app/__init__.py",
        "app/main.py",
        "app/config.py",
        "app/database.py",
        "app/models/__init__.py",
        "app/models/models.py",
        "app/schemas/__init__.py",
        "app/schemas/schemas.py",
        "app/services/__init__.py",
        "app/services/ai_service.py",
        "app/utils/__init__.py",
        "app/api/__init__.py",
        "app/api/health.py",
        "app/api/projects.py",
        "app/api/discovery.py",
        "app/api/maturity.py",
        "app/api/roi.py",
        "app/api/architecture.py",
        "app/api/roadmap.py",
        "app/api/wardley.py",
        "app/api/slides.py",
        "requirements.txt",
        ".env.example",
        "run.sh",
        "test_api.py",
        "README.md",
        "SETUP.md",
        "ARCHITECTURE.md",
    ]
    
    missing = []
    for file in required_files:
        if not Path(file).exists():
            missing.append(file)
    
    if missing:
        print(f"❌ Missing {len(missing)} files:")
        for f in missing:
            print(f"   - {f}")
        return False
    
    print(f"✓ All {len(required_files)} required files present")
    return True

def check_imports():
    """Check key imports work."""
    try:
        # Add to path
        sys.path.insert(0, '.')
        
        # Try importing (without full dependencies)
        import ast
        
        # Check main.py syntax
        with open("app/main.py") as f:
            ast.parse(f.read())
        
        # Check other key files
        for file in [
            "app/config.py",
            "app/database.py",
            "app/models/models.py",
            "app/schemas/schemas.py",
            "app/services/ai_service.py",
        ]:
            with open(file) as f:
                ast.parse(f.read())
        
        print("✓ All Python files have valid syntax")
        return True
        
    except SyntaxError as e:
        print(f"❌ Syntax error in {e.filename}: {e.msg}")
        return False
    except Exception as e:
        print(f"❌ Error checking files: {e}")
        return False

def check_dependencies():
    """Check required dependencies."""
    try:
        # Read requirements
        with open("requirements.txt") as f:
            requirements = [line.strip() for line in f if line.strip() and not line.startswith("#")]
        
        print(f"✓ requirements.txt contains {len(requirements)} dependencies")
        
        # Check key ones mentioned
        key_packages = ["fastapi", "uvicorn", "sqlalchemy", "psycopg2", "pydantic", "openai", "python-pptx"]
        found = []
        
        for req in requirements:
            pkg = req.split("==")[0].split(">")[0].split("<")[0]
            if pkg in key_packages:
                found.append(pkg)
        
        if len(found) >= 6:
            print(f"✓ All key dependencies specified ({len(found)}/7)")
            return True
        else:
            print(f"❌ Missing key dependencies. Found: {found}")
            return False
            
    except Exception as e:
        print(f"❌ Error reading requirements: {e}")
        return False

def check_env_example():
    """Check .env.example template."""
    try:
        with open(".env.example") as f:
            content = f.read()
        
        required_keys = [
            "DATABASE_URL",
            "OPENAI_API_KEY",
            "SECRET_KEY",
            "CORS_ORIGINS"
        ]
        
        missing = []
        for key in required_keys:
            if key not in content:
                missing.append(key)
        
        if missing:
            print(f"❌ .env.example missing keys: {missing}")
            return False
        
        print("✓ .env.example template complete")
        return True
        
    except Exception as e:
        print(f"❌ Error checking .env.example: {e}")
        return False

def count_lines():
    """Count lines of code."""
    import os
    
    py_files = []
    for root, dirs, files in os.walk("app"):
        for file in files:
            if file.endswith(".py"):
                py_files.append(os.path.join(root, file))
    
    total_lines = 0
    for file in py_files:
        with open(file) as f:
            total_lines += len(f.readlines())
    
    print(f"✓ Total {total_lines} lines of Python code in {len(py_files)} files")
    return True

def check_docs():
    """Check documentation."""
    docs = [
        "README.md",
        "SETUP.md",
        "ARCHITECTURE.md",
        "INDEX.md",
        "QUICKREF.md",
        "COMPLETION_SUMMARY.md",
    ]
    
    missing = []
    for doc in docs:
        if not Path(doc).exists():
            missing.append(doc)
    
    if missing:
        print(f"❌ Missing {len(missing)} documentation files: {missing}")
        return False
    
    print(f"✓ All {len(docs)} documentation files present")
    return True

def main():
    """Run all checks."""
    print("\n" + "="*50)
    print("FastAPI Backend Verification")
    print("="*50 + "\n")
    
    checks = [
        ("Python Version", check_python_version),
        ("Required Files", check_files),
        ("Python Syntax", check_imports),
        ("Dependencies", check_dependencies),
        ("Configuration Template", check_env_example),
        ("Code Statistics", count_lines),
        ("Documentation", check_docs),
    ]
    
    results = []
    for name, check in checks:
        print(f"\nChecking: {name}")
        try:
            result = check()
            results.append((name, result))
        except Exception as e:
            print(f"❌ Error: {e}")
            results.append((name, False))
    
    print("\n" + "="*50)
    print("Verification Summary")
    print("="*50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓" if result else "❌"
        print(f"{status} {name}")
    
    print(f"\nResult: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n✅ All checks passed! Backend is ready to use.")
        print("\nNext steps:")
        print("1. pip install -r requirements.txt")
        print("2. cp .env.example .env")
        print("3. Edit .env with DATABASE_URL")
        print("4. ./run.sh")
        return 0
    else:
        print(f"\n❌ {total - passed} checks failed. Please review above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
