"""
Breast Cancer Prediction Flask Application
Serves predictions using a trained Random Forest model
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from pathlib import Path
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

# Load the trained model
MODEL_PATH = Path(__file__).parent / 'model' / 'breast_cancer_model.pkl'

try:
    # Try loading the model from the model directory
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
        print(f"✓ Model loaded successfully from {MODEL_PATH}")
    else:
        # Fallback: try loading from root directory
        root_model = Path(__file__).parent / 'model.pkl'
        if root_model.exists():
            model = joblib.load(root_model)
            print(f"✓ Model loaded successfully from {root_model}")
        else:
            model = None
            print("⚠ Warning: No model file found")
except Exception as e:
    model = None
    print(f"✗ Error loading model: {e}")

# Feature names (8 mean features from breast cancer dataset)
FEATURE_NAMES = [
    'radius_mean',
    'texture_mean',
    'perimeter_mean',
    'area_mean',
    'smoothness_mean',
    'compactness_mean',
    'concavity_mean',
    'symmetry_mean'
]


@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint
    Expects JSON with 'features' array of 8 float values
    Returns JSON with diagnosis and confidence
    """
    try:
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({
                'error': 'Invalid request. Expected "features" array.'
            }), 400
        
        features = data['features']
        
        # Validate input
        if len(features) != 8:
            return jsonify({
                'error': f'Expected 8 features, got {len(features)}'
            }), 400
        
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please check server configuration.'
            }), 500
        
        # Convert to numpy array
        try:
            X = np.array(features).reshape(1, -1)
        except Exception as e:
            return jsonify({
                'error': f'Invalid feature values: {str(e)}'
            }), 400
        
        # Make prediction
        try:
            # Get prediction
            prediction = model.predict(X)[0]
            
            # Get prediction probability
            if hasattr(model, 'predict_proba'):
                probabilities = model.predict_proba(X)[0]
                confidence = float(max(probabilities) * 100)
            else:
                confidence = 100.0
            
            # Map prediction to diagnosis
            diagnosis = 'Malignant' if prediction == 1 else 'Benign'
            
            return jsonify({
                'diagnosis': diagnosis,
                'confidence': round(confidence, 2),
                'prediction': int(prediction)
            })
        
        except Exception as e:
            return jsonify({
                'error': f'Prediction error: {str(e)}'
            }), 500
    
    except Exception as e:
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500


@app.route('/api/info', methods=['GET'])
def info():
    """Return API information"""
    return jsonify({
        'name': 'Breast Cancer Prediction API',
        'version': '1.0.0',
        'features': FEATURE_NAMES,
        'model_loaded': model is not None
    })


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    print("\n" + "="*70)
    print("  Breast Cancer Prediction - Flask Server")
    print("="*70)
    print(f"✓ Flask app initialized")
    print(f"✓ CORS enabled")
    print(f"✓ Model status: {'Loaded' if model else 'NOT LOADED'}")
    print("\nStarting server on http://localhost:5000")
    print("="*70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
