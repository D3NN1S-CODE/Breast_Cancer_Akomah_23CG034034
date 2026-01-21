/**
 * Breast Cancer Prediction - Frontend JavaScript
 * Handles form submission and prediction display
 */

document.addEventListener('DOMContentLoaded', function() {
    const predictionForm = document.getElementById('predictionForm');
    const predictBtn = document.getElementById('predictBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultContainer = document.getElementById('resultContainer');
    const loadingModal = document.getElementById('loadingModal');

    // Form submission handler
    predictionForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            showError('Please fill in all fields with valid numbers.');
            return;
        }

        // Show loading modal
        showLoadingModal(true);
        predictBtn.disabled = true;

        try {
            // Collect form data
            const features = collectFormData();

            // Make prediction request
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ features })
            });

            const data = await response.json();

            if (response.ok) {
                // Display result
                displayResult(data);
            } else {
                showError(data.error || 'An error occurred during prediction.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Failed to connect to the prediction service. Is the Flask server running?');
        } finally {
            showLoadingModal(false);
            predictBtn.disabled = false;
        }
    });

    // Reset button handler
    resetBtn.addEventListener('click', function() {
        predictionForm.reset();
        resultContainer.style.display = 'none';
        resultContainer.innerHTML = '';
    });

    /**
     * Validate all form fields
     */
    function validateForm() {
        const inputs = predictionForm.querySelectorAll('input[type="number"]');
        for (let input of inputs) {
            if (!input.value || isNaN(parseFloat(input.value))) {
                input.classList.add('input-error');
                return false;
            }
            input.classList.remove('input-error');
        }
        return true;
    }

    /**
     * Collect form data
     */
    function collectFormData() {
        const formData = new FormData(predictionForm);
        const features = [];
        
        const featureNames = [
            'radius_mean',
            'texture_mean',
            'perimeter_mean',
            'area_mean',
            'smoothness_mean',
            'compactness_mean',
            'concavity_mean',
            'symmetry_mean'
        ];

        featureNames.forEach(name => {
            const value = formData.get(name);
            features.push(parseFloat(value));
        });

        return features;
    }

    /**
     * Display prediction result
     */
    function displayResult(data) {
        const { diagnosis, confidence, error } = data;

        if (error) {
            showError(error);
            return;
        }

        // Determine color based on diagnosis
        const isDiagnosisBenign = diagnosis === 'Benign';
        const diagnosisColor = isDiagnosisBenign ? '#10b981' : '#ef4444';
        const diagnosisClass = isDiagnosisBenign ? 'benign' : 'malignant';

        // Create result HTML
        const resultHTML = `
            <div class="result-card">
                <div class="result-header">
                    <i class="fas fa-stethoscope"></i>
                    <h2>Prediction Result</h2>
                </div>
                
                <div class="result-content">
                    <div class="diagnosis-box">
                        <div class="diagnosis-label">Diagnosis:</div>
                        <div class="diagnosis-value ${diagnosisClass}">${diagnosis}</div>
                    </div>
                    
                    <div class="confidence-section">
                        <div class="confidence-label">Confidence Level:</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${confidence}%"></div>
                        </div>
                        <div class="confidence-text">
                            <span>${confidence}</span>%
                        </div>
                    </div>
                    
                    <div class="result-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <p><strong>Important:</strong> This is a demonstration tool. Please consult with a healthcare professional for accurate diagnosis and treatment.</p>
                            <p style="margin-top: 0.5rem; font-size: 0.85rem;">Early detection is crucial. If you have concerns, please contact your healthcare provider immediately.</p>
                        </div>
                    </div>

                    <div class="result-info">
                        <p style="font-size: 0.85rem; color: #999; margin-top: 1rem;">
                            Prediction made on ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        `;

        resultContainer.innerHTML = resultHTML;
        resultContainer.style.display = 'block';

        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Animate confidence bar
        const confidenceFill = resultContainer.querySelector('.confidence-fill');
        setTimeout(() => {
            confidenceFill.style.width = confidence + '%';
        }, 100);
    }

    /**
     * Show error message
     */
    function showError(message) {
        const errorHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <div>${message}</div>
            </div>
        `;

        resultContainer.innerHTML = errorHTML;
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Show/hide loading modal
     */
    function showLoadingModal(show) {
        if (show) {
            loadingModal.classList.add('active');
        } else {
            loadingModal.classList.remove('active');
        }
    }

    /**
     * Add input error styling
     */
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .form-group input.input-error {
            border-color: #ef4444 !important;
            background-color: #fee2e2 !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Add example data button (for testing)
    const formHeader = document.querySelector('.form-header');
    const exampleBtn = document.createElement('button');
    exampleBtn.type = 'button';
    exampleBtn.className = 'btn btn-example';
    exampleBtn.innerHTML = '<i class="fas fa-flask"></i><span>Load Example</span>';
    exampleBtn.style.cssText = `
        position: absolute;
        top: 2rem;
        right: 2rem;
        padding: 0.5rem 1rem;
        background: #f0f0f0;
        color: #666;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.8rem;
        display: none;
    `;
    
    exampleBtn.addEventListener('click', function() {
        // Load example values
        document.getElementById('radius_mean').value = '14.5';
        document.getElementById('texture_mean').value = '19.2';
        document.getElementById('perimeter_mean').value = '91.5';
        document.getElementById('area_mean').value = '654.8';
        document.getElementById('smoothness_mean').value = '0.096';
        document.getElementById('compactness_mean').value = '0.104';
        document.getElementById('concavity_mean').value = '0.088';
        document.getElementById('symmetry_mean').value = '0.181';
    });

    // Keyboard shortcut: Enter to submit, Escape to reset
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            predictionForm.dispatchEvent(new Event('submit'));
        }
        if (e.key === 'Escape') {
            resetBtn.click();
        }
    });

    console.log('✓ Breast Cancer Prediction frontend initialized');
});
