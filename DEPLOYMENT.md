# Deployment Guide - Breast Cancer Prediction System

## Quick Start

### Local Development (Windows/macOS/Linux)

```bash
# 1. Clone the repository
git clone https://github.com/D3NN1S-CODE/Breast_Cancer_Akomah_23CG034034.git
cd Breast_Cancer_Akomah_23CG034034

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the application
python app.py

# 6. Open browser
# Navigate to: http://localhost:5000
```

## Testing the Application

### Test with cURL

```bash
# Test the predict endpoint
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": [14.5, 19.2, 91.5, 654.8, 0.096, 0.104, 0.088, 0.181]
  }'

# Test the info endpoint
curl http://localhost:5000/api/info
```

### Test with Python

```python
import requests
import json

# Test prediction
url = "http://localhost:5000/api/predict"
data = {
    "features": [14.5, 19.2, 91.5, 654.8, 0.096, 0.104, 0.088, 0.181]
}

response = requests.post(url, json=data)
result = response.json()
print(f"Diagnosis: {result['diagnosis']}")
print(f"Confidence: {result['confidence']}%")
```

## Production Deployment

### Option 1: Using Gunicorn (Recommended)

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn app:app -w 4 -b 0.0.0.0:5000

# Run with specific settings
gunicorn app:app \
  --workers 4 \
  --worker-class sync \
  --bind 0.0.0.0:5000 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
```

### Option 2: Using Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

Build and run:

```bash
# Build image
docker build -t breast-cancer-predictor .

# Run container
docker run -p 5000:5000 breast-cancer-predictor
```

### Option 3: Heroku Deployment

1. Install Heroku CLI
2. Create `Procfile`:
   ```
   web: gunicorn app:app
   ```

3. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   heroku open
   ```

### Option 4: AWS Elastic Beanstalk

1. Install AWS CLI and EB CLI
2. Initialize:
   ```bash
   eb init -p python-3.9 breast-cancer-predictor
   eb create production
   eb deploy
   ```

### Option 5: Azure App Service

```bash
# Install Azure CLI
az appservice plan create \
  --resource-group myResourceGroup \
  --name myAppServicePlan \
  --sku FREE

az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name breast-cancer-predictor

cd app
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name breast-cancer-predictor \
  --src-path ../deploy.zip
```

## Environment Variables

Create a `.env` file for configuration:

```env
FLASK_ENV=production
FLASK_DEBUG=0
SECRET_KEY=your-secret-key-here
MODEL_PATH=model/breast_cancer_model.pkl
```

Update `app.py` to use environment variables:

```python
import os
from dotenv import load_dotenv

load_dotenv()

app.config['ENV'] = os.getenv('FLASK_ENV', 'development')
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', False)
```

## Performance Optimization

### 1. Enable Caching

```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/info', methods=['GET'])
@cache.cached(timeout=3600)
def info():
    return {...}
```

### 2. Add Rate Limiting

```bash
pip install Flask-Limiter
```

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/api/predict', methods=['POST'])
@limiter.limit("100 per hour")
def predict():
    ...
```

### 3. Use a Reverse Proxy (Nginx)

```nginx
upstream app {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /path/to/app/static/;
        expires 30d;
    }
}
```

## Security Considerations

1. **HTTPS:** Always use HTTPS in production
   ```bash
   pip install flask-talisman
   ```

2. **CORS:** Configure CORS appropriately
   ```python
   CORS(app, resources={
       r"/api/*": {"origins": ["https://yourdomain.com"]}
   })
   ```

3. **Input Validation:** Already implemented with type checking
4. **Error Handling:** Already implemented with try-catch blocks
5. **Rate Limiting:** Use Limiter to prevent abuse

## Monitoring & Logging

### Add Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/predict', methods=['POST'])
def predict():
    logger.info(f"Prediction request received")
    ...
```

### Use Application Insights (Azure)

```bash
pip install opencensus-ext-flask
```

## Database Integration (Optional)

For storing predictions history:

```bash
pip install flask-sqlalchemy
```

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///predictions.db'
db = SQLAlchemy(app)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    features = db.Column(db.JSON)
    diagnosis = db.Column(db.String)
    confidence = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Change port in app.py or use: `netstat -ano \| find ":5000"` |
| Model not found | Verify path exists: `model/breast_cancer_model.pkl` |
| CORS errors | Check Flask-CORS is installed and enabled |
| Static files 404 | Ensure static/ folder exists with correct files |
| Template not found | Verify templates/ folder with index.html |

## Health Check Endpoint (Optional)

```python
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.utcnow().isoformat()
    }), 200
```

## Backup & Recovery

```bash
# Backup model
copy model\breast_cancer_model.pkl model\breast_cancer_model.pkl.backup

# Create deployment package
tar -czf deployment.tar.gz app.py templates/ static/ model/ requirements.txt
```

## Performance Benchmarks

- **Prediction Time:** ~50-100ms
- **Request Rate:** 100+ requests/second (with gunicorn)
- **Memory Usage:** ~150-200MB
- **Model Size:** ~10-15MB

---

For issues or questions, refer to the main README.md
