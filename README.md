# 🐄 Cattle Disease Detection & Health Monitoring System

A professional, production-ready web application for detecting cattle diseases using Vision Transformer (ViT) AI model.

## 🚀 Features

- **AI-Powered Disease Detection** - Upload cattle images and get instant diagnosis
- **Multi-Auth System** - Google OAuth & Mobile OTP login
- **PDF Report Generation** - Professional downloadable reports
- **Admin Dashboard** - Analytics with interactive charts
- **Voice Output** - Text-to-speech for results
- **Multi-language Support** - Farmer-friendly interface
- **Mobile Responsive** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Chart.js for analytics
- jsPDF for reports
- React Router for navigation

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Google OAuth 2.0
- Twilio for OTP

### ML Server
- Python Flask
- PyTorch + Vision Transformer (ViT)
- Image preprocessing with PIL

## 📁 Project Structure

```
cattle-disease-detection-pro/
├── frontend/          # React frontend
├── backend/           # Node.js API
├── ml-server/         # Python ML inference
└── docs/              # Documentation
```

## 🔧 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB
- Git LFS (for model files)

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Ayisha114/cattle-disease-detection-pro.git
cd cattle-disease-detection-pro
```

2. **Install Frontend**
```bash
cd frontend
npm install
```

3. **Install Backend**
```bash
cd ../backend
npm install
```

4. **Install ML Server**
```bash
cd ../ml-server
pip install -r requirements.txt
```

5. **Environment Variables**

Create `.env` files in each directory:

**backend/.env**
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
ML_API_URL=http://localhost:5000
```

**frontend/.env**
```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**ml-server/.env**
```
MODEL_PATH=./models/cattle_disease_vit_model.pth
PORT=5000
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```

**Terminal 3 - ML Server**
```bash
cd ml-server
python app.py
```

### Production Deployment

Deploy to Railway:
```bash
railway up
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/otp/send` - Send OTP
- `POST /api/auth/otp/verify` - Verify OTP

### Predictions
- `POST /api/predict` - Upload image and get prediction
- `GET /api/reports` - Get user reports
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/:id/pdf` - Download PDF report

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard statistics

## 🔐 Security Features

- JWT-based authentication
- Secure password hashing
- Rate limiting
- CORS protection
- Input validation
- XSS protection

## 📱 Mobile Support

Fully responsive design optimized for:
- Desktop (1920x1080+)
- Tablet (768x1024)
- Mobile (375x667+)

## 🎨 UI Design

Based on professional farmer-friendly interface with:
- Clean blue/green color scheme
- Large, readable fonts
- Simple navigation
- Visual feedback
- Accessibility features

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- Ayisha D - Full Stack Developer

## 📞 Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ for farmers and cattle health monitoring
