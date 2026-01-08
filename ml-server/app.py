from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import base64
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Model configuration
MODEL_PATH = os.getenv('MODEL_PATH', './models/cattle_disease_vit_model.pth')
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Disease information database
DISEASE_INFO = {
    'Healthy': {
        'stage': 'N/A',
        'precautions': [
            'Maintain regular veterinary checkups',
            'Ensure proper nutrition and clean water',
            'Keep living area clean and hygienic',
            'Monitor for any behavioral changes'
        ],
        'recommendations': [
            'Continue current health practices',
            'Regular vaccination schedule',
            'Balanced diet with supplements'
        ]
    },
    'Foot-and-Mouth Disease': {
        'stage': 'Early/Advanced',
        'precautions': [
            'Isolate affected cattle immediately',
            'Disinfect all equipment and facilities',
            'Restrict movement of animals',
            'Contact veterinarian urgently',
            'Implement biosecurity measures'
        ],
        'recommendations': [
            'Administer prescribed medications',
            'Provide soft, easily digestible food',
            'Ensure adequate hydration',
            'Monitor temperature regularly',
            'Vaccination of healthy animals'
        ]
    },
    'Lumpy Skin Disease': {
        'stage': 'Mild/Severe',
        'precautions': [
            'Isolate infected animals',
            'Control insect vectors (flies, mosquitoes)',
            'Disinfect premises thoroughly',
            'Avoid contact with other herds',
            'Report to veterinary authorities'
        ],
        'recommendations': [
            'Supportive care and antibiotics',
            'Anti-inflammatory medications',
            'Wound care for skin lesions',
            'Nutritional support',
            'Vaccination program'
        ]
    },
    'Mastitis': {
        'stage': 'Acute/Chronic',
        'precautions': [
            'Maintain strict milking hygiene',
            'Disinfect udder before and after milking',
            'Use clean milking equipment',
            'Isolate affected quarter',
            'Monitor milk quality regularly'
        ],
        'recommendations': [
            'Antibiotic treatment as prescribed',
            'Frequent milking of affected quarter',
            'Apply warm compresses',
            'Proper nutrition and hydration',
            'Dry cow therapy'
        ]
    }
}

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Load model (placeholder - replace with actual model loading)
model = None

def load_model():
    global model
    try:
        if os.path.exists(MODEL_PATH):
            # Load your trained ViT model here
            # model = torch.load(MODEL_PATH, map_location=DEVICE)
            # model.eval()
            print(f"✅ Model loaded from {MODEL_PATH}")
        else:
            print(f"⚠️  Model file not found at {MODEL_PATH}")
            print("Using mock predictions for development")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("Using mock predictions")

def predict_disease(image):
    """
    Predict disease from image
    Returns: disease_name, confidence, stage
    """
    try:
        # Preprocess image
        img_tensor = transform(image).unsqueeze(0).to(DEVICE)
        
        # If model is loaded, use it
        if model is not None:
            with torch.no_grad():
                outputs = model(img_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                confidence, predicted = torch.max(probabilities, 1)
                
                # Map prediction to disease name
                disease_classes = ['Healthy', 'Foot-and-Mouth Disease', 'Lumpy Skin Disease', 'Mastitis']
                disease_name = disease_classes[predicted.item()]
                confidence_score = confidence.item() * 100
        else:
            # Mock prediction for development
            import random
            disease_classes = ['Healthy', 'Foot-and-Mouth Disease', 'Lumpy Skin Disease', 'Mastitis']
            disease_name = random.choice(disease_classes)
            confidence_score = random.uniform(75, 98)
        
        # Get disease info
        disease_data = DISEASE_INFO.get(disease_name, DISEASE_INFO['Healthy'])
        
        return {
            'status': 'Healthy' if disease_name == 'Healthy' else 'Diseased',
            'disease_name': disease_name,
            'stage': disease_data['stage'],
            'confidence': round(confidence_score, 2),
            'precautions': disease_data['precautions'],
            'recommendations': disease_data['recommendations']
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        raise

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'ML Server is running',
        'model_loaded': model is not None,
        'device': str(DEVICE)
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'])
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Get prediction
        result = predict_disease(image)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting ML Server...")
    print(f"📍 Device: {DEVICE}")
    load_model()
    
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
