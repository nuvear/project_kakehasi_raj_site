FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment defaults for Cloud Run
ENV PORT=8080
ENV DATABASE_URL=sqlite:///ai_platform.db

CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT

