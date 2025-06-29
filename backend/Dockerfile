# ✅ Use slim Python image (Python already installed)
FROM python:3.11-slim

# ✅ Set working directory
WORKDIR /app

# ✅ Install system dependencies for WeasyPrint (needs some libraries)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# ✅ Copy dependency file first (better Docker caching)
COPY requirements.txt .

# ✅ Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ✅ Copy all app files (app.py, model.py, out/, templates/, fonts/)
COPY . .

# ✅ Expose FastAPI port
EXPOSE 7860

# ✅ Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]