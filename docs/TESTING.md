# 🧪 Testing Guide

Quick guide to test the Cattle Disease Detection System without full authentication setup.

## Quick Start Testing

### Option 1: Test with Mock Data (No Auth Required)

#### Step 1: Create Test Server
Create `backend/test-server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Simple file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Mock prediction endpoint (no auth)
app.post('/api/predict', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image provided' });
  }

  // Mock prediction result
  const mockResult = {
    success: true,
    data: {
      report: {
        report_id: 'RPT-' + Date.now(),
        status: Math.random() > 0.5 ? 'Healthy' : 'Diseased',
        disease_name: Math.random() > 0.5 ? 'Lumpy Skin Disease' : 'Foot and Mouth Disease',
        stage: ['Early', 'Moderate', 'Severe'][Math.floor(Math.random() * 3)],
        confidence: Math.floor(Math.random() * 30) + 70,
        precautions: [
          'Isolate affected cattle immediately',
          'Consult veterinarian for treatment',
          'Maintain hygiene in cattle shed',
          'Monitor temperature daily'
        ],
        recommendations: [
          'Administer prescribed medication',
          'Provide nutritious feed',
          'Ensure clean water supply',
          'Regular health checkups'
        ],
        image_url: `/uploads/${req.file.filename}`,
        timestamp: new Date().toISOString()
      }
    }
  };

  res.json(mockResult);
});

// Mock reports endpoint
app.get('/api/reports', (req, res) => {
  const mockReports = Array.from({ length: 5 }, (_, i) => ({
    report_id: 'RPT-' + (Date.now() - i * 1000),
    status: i % 2 === 0 ? 'Healthy' : 'Diseased',
    disease_name: i % 2 === 0 ? 'N/A' : 'Lumpy Skin Disease',
    stage: i % 2 === 0 ? 'N/A' : 'Moderate',
    confidence: Math.floor(Math.random() * 30) + 70,
    timestamp: new Date(Date.now() - i * 86400000).toISOString()
  }));

  res.json({ success: true, data: { reports: mockReports } });
});

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log('📝 No authentication required for testing');
});
```

#### Step 2: Run Test Server
```bash
cd backend
mkdir -p uploads
node test-server.js
```

#### Step 3: Update Frontend for Testing
In `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SKIP_AUTH=true
```

#### Step 4: Run Frontend
```bash
cd frontend
npm run dev
```

---

### Option 2: Simple HTML Test Page

Create `test.html` in project root:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cattle Disease Detection - Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }
        .subtitle {
            color: #666;
            text-align: center;
            margin-bottom: 30px;
        }
        .upload-area {
            border: 3px dashed #667eea;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 20px;
        }
        .upload-area:hover {
            background: #f8f9ff;
            border-color: #764ba2;
        }
        .upload-area.dragover {
            background: #f0f4ff;
            border-color: #667eea;
        }
        input[type="file"] {
            display: none;
        }
        .upload-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .preview {
            margin: 20px 0;
            text-align: center;
        }
        .preview img {
            max-width: 100%;
            max-height: 300px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .result {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9ff;
            border-radius: 10px;
            display: none;
        }
        .result.show {
            display: block;
        }
        .result h2 {
            color: #333;
            margin-bottom: 15px;
        }
        .status {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .status.healthy {
            background: #d4edda;
            color: #155724;
        }
        .status.diseased {
            background: #f8d7da;
            color: #721c24;
        }
        .info-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 8px;
        }
        .info-label {
            font-weight: bold;
            color: #667eea;
        }
        .precautions {
            margin-top: 15px;
        }
        .precautions ul {
            list-style-position: inside;
            color: #555;
        }
        .precautions li {
            margin: 5px 0;
        }
        .loading {
            text-align: center;
            padding: 20px;
            display: none;
        }
        .loading.show {
            display: block;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐄 Cattle Disease Detection</h1>
        <p class="subtitle">Upload an image to detect cattle diseases</p>

        <div class="upload-area" id="uploadArea">
            <div class="upload-icon">📸</div>
            <p><strong>Click to upload</strong> or drag and drop</p>
            <p style="color: #999; font-size: 14px; margin-top: 5px;">PNG, JPG up to 10MB</p>
            <input type="file" id="fileInput" accept="image/*">
        </div>

        <div class="preview" id="preview"></div>

        <button id="uploadBtn" disabled>Analyze Image</button>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p style="margin-top: 10px; color: #667eea;">Analyzing image...</p>
        </div>

        <div class="result" id="result"></div>
    </div>

    <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const preview = document.getElementById('preview');
        const uploadBtn = document.getElementById('uploadBtn');
        const loading = document.getElementById('loading');
        const result = document.getElementById('result');
        let selectedFile = null;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', (e) => {
            handleFile(e.target.files[0]);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFile(e.dataTransfer.files[0]);
        });

        function handleFile(file) {
            if (!file || !file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            selectedFile = file;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                uploadBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }

        // Upload and analyze
        uploadBtn.addEventListener('click', async () => {
            if (!selectedFile) return;

            const formData = new FormData();
            formData.append('image', selectedFile);

            uploadBtn.disabled = true;
            loading.classList.add('show');
            result.classList.remove('show');

            try {
                const response = await fetch('http://localhost:5000/api/predict', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                
                if (data.success) {
                    displayResult(data.data.report);
                } else {
                    alert('Error: ' + (data.error || 'Prediction failed'));
                }
            } catch (error) {
                alert('Error: ' + error.message);
                console.error(error);
            } finally {
                loading.classList.remove('show');
                uploadBtn.disabled = false;
            }
        });

        function displayResult(report) {
            const statusClass = report.status === 'Healthy' ? 'healthy' : 'diseased';
            
            result.innerHTML = `
                <h2>Analysis Result</h2>
                <span class="status ${statusClass}">${report.status}</span>
                
                <div class="info-item">
                    <span class="info-label">Report ID:</span> ${report.report_id}
                </div>
                
                ${report.disease_name !== 'N/A' ? `
                    <div class="info-item">
                        <span class="info-label">Disease:</span> ${report.disease_name}
                    </div>
                    <div class="info-item">
                        <span class="info-label">Stage:</span> ${report.stage}
                    </div>
                ` : ''}
                
                <div class="info-item">
                    <span class="info-label">Confidence:</span> ${report.confidence}%
                </div>
                
                ${report.precautions && report.precautions.length > 0 ? `
                    <div class="precautions">
                        <h3 style="color: #667eea; margin-bottom: 10px;">Precautions:</h3>
                        <ul>
                            ${report.precautions.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            `;
            
            result.classList.add('show');
        }
    </script>
</body>
</html>
```

---

### Option 3: Postman/cURL Testing

#### Test Prediction Endpoint
```bash
curl -X POST http://localhost:5000/api/predict \
  -F "image=@/path/to/cattle-image.jpg"
```

#### Test Reports Endpoint
```bash
curl http://localhost:5000/api/reports
```

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Can upload image file
- [ ] Receives prediction response
- [ ] Image preview works
- [ ] Results display correctly
- [ ] PDF download works (if implemented)
- [ ] Reports page loads
- [ ] Charts render properly

---

## Common Issues

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
Make sure backend has:
```javascript
app.use(cors());
```

### File Upload Fails
Check uploads directory exists:
```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

---

## Next Steps After Testing

1. ✅ Verify all features work
2. 🤖 Integrate real ML model
3. 🗄️ Connect to MongoDB
4. 🔐 Add authentication (when ready)
5. 🚀 Deploy to production

---

**Happy Testing! 🧪**
