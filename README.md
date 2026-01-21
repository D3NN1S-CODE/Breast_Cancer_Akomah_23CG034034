# Breast Cancer Prediction System

A web-based machine learning application for predicting breast cancer diagnosis using diagnostic tumor features.

## Overview

This project implements a **Breast Cancer Prediction System** using a trained Random Forest classifier with a web-based GUI. Users can input 8 diagnostic tumor features and receive a prediction (Benign or Malignant) with confidence scores.

### Technology Stack

- **Backend:** Flask + Python
- **Frontend:** HTML5, CSS3, JavaScript
- **Machine Learning:** scikit-learn (Random Forest)
- **Data Format:** JSON API

## Project Structure

```
BreastCancer_Project_Akomah_23CG034034/
├── app.py                          # Flask backend application
├── requirements.txt                # Python dependencies
├── .gitignore                      # Git ignore rules
├── model/
│   ├── breast_cancer_model.pkl    # Trained ML model
│   └── model_building.ipynb       # Model training notebook
├── static/
│   ├── style.css                  # Frontend styling
│   └── script.js                  # Frontend JavaScript
└── templates/
    └── index.html                 # Main HTML page
```

## Features

✅ **ML-Powered Predictions**
- Random Forest classifier trained on Wisconsin Breast Cancer dataset
- 8 diagnostic features for prediction
- Confidence scoring

✅ **Beautiful Web Interface**
- Responsive design (desktop & mobile)
- Real-time form validation
- Smooth animations and transitions
- Awareness and encouragement messaging

✅ **Easy to Deploy**
- Simple Flask setup
- Single-page application
- No external APIs required
- Cross-origin requests supported

## Getting Started

### Prerequisites

- Python 3.7+
- pip (Python package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/D3NN1S-CODE/Breast_Cancer_Akomah_23CG034034.git
   cd Breast_Cancer_Akomah_23CG034034
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask application:**
   ```bash
   python app.py
   ```

5. **Open in browser:**
   ```
   http://localhost:5000
   ```

## Usage

1. Navigate to the web interface
2. Fill in all 8 diagnostic features:
   - **Radius Mean** (Range: 6-28)
   - **Texture Mean** (Range: 9-40)
   - **Perimeter Mean** (Range: 43-188)
   - **Area Mean** (Range: 143-2501)
   - **Smoothness Mean** (Range: 0.05-0.16)
   - **Compactness Mean** (Range: 0.02-0.35)
   - **Concavity Mean** (Range: 0-0.43)
   - **Symmetry Mean** (Range: 0.10-0.30)
3. Click **"Predict"** button
4. View the prediction result with confidence level

### Keyboard Shortcuts

- **Ctrl + Enter:** Submit prediction
- **Escape:** Clear form

## API Documentation

### Prediction Endpoint

**Request:**
```bash
POST /api/predict
Content-Type: application/json

{
  "features": [14.5, 19.2, 91.5, 654.8, 0.096, 0.104, 0.088, 0.181]
}
```

**Response:**
```json
{
  "diagnosis": "Benign",
  "confidence": 95.25,
  "prediction": 0
}
```

### Info Endpoint

**Request:**
```bash
GET /api/info
```

**Response:**
```json
{
  "name": "Breast Cancer Prediction API",
  "version": "1.0.0",
  "features": ["radius_mean", "texture_mean", ...],
  "model_loaded": true
}
```

## Model Information

- **Algorithm:** Random Forest Classifier
- **Training Data:** Wisconsin Breast Cancer Dataset (569 samples)
- **Features:** 8 diagnostic measurements
- **Classes:** Benign (0) / Malignant (1)
- **Train-Test Split:** 80-20
- **Model File:** `model/breast_cancer_model.pkl`

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Flask | >=2.0.0 | Web framework |
| Flask-CORS | >=3.0.10 | Cross-origin requests |
| scikit-learn | >=1.0.0 | ML algorithms |
| numpy | >=1.21.0 | Numerical computing |
| joblib | >=1.1.0 | Model serialization |
| pandas | >=1.3.0 | Data manipulation |
| matplotlib | >=3.4.0 | Visualization |
| seaborn | >=0.11.0 | Statistical visualization |

## Important Disclaimer

⚠️ **DISCLAIMER:**

This is a **demonstration and educational tool** designed for learning purposes only. The predictions made by this application should **NOT** be used for actual medical diagnosis or treatment decisions.

- **Always consult with qualified healthcare professionals** for medical advice
- This tool is not a substitute for professional medical examination
- Early detection is important - seek professional medical guidance if you have concerns

## Author

- **Name:** D3NN1S-CODE (Akomah)
- **Matriculation Number:** 23CG034034
- **Course:** CSC334 - Data Mining & Knowledge Discovery

## License

This project is provided as-is for educational purposes. 

## Acknowledgments

- **Dataset:** UCI Machine Learning Repository - Wisconsin Breast Cancer Dataset
- **Inspiration:** CSC334 Course Requirements
- **Technologies:** Flask, scikit-learn, HTML5/CSS3

## Running the Application

### Development Mode
```bash
python app.py
```
Server runs on `http://localhost:5000` with debug mode enabled.

### Production Mode
```bash
gunicorn app:app
```

## Troubleshooting

### Model not loading?
- Check that `model/breast_cancer_model.pkl` exists
- Verify the file path is correct
- Ensure Flask is running from the correct directory

### Port 5000 already in use?
```bash
# Change port in app.py or run:
python app.py --port 8000
```

### CORS errors in browser?
- CORS is already enabled in the Flask app
- Check browser console for specific error messages

## Future Enhancements

- [ ] Add data visualization/charts
- [ ] Implement model retraining capability
- [ ] Add user authentication
- [ ] Export results as PDF
- [ ] Mobile app version
- [ ] Docker containerization
- [ ] Cloud deployment (AWS/Heroku)

---

**Created:** January 2024  
**Last Updated:** January 2026
