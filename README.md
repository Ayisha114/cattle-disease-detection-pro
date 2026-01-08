# 🐄 Cattle Disease Detection System

A comprehensive web-based application for detecting cattle diseases using deep learning and computer vision. This system helps farmers and veterinarians identify cattle diseases early through image analysis, providing detailed reports with precautions and recommendations.

![Cattle Disease Detection](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18.0+-61dafb)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- 🔐 **Secure Authentication**: JWT-based user authentication and authorization
- 📸 **Image Upload**: Upload cattle images for disease detection
- 🤖 **AI-Powered Detection**: Deep learning model for accurate disease identification
- 📊 **Confidence Scoring**: Visual confidence percentage with circular progress indicator
- 📄 **PDF Reports**: Download detailed reports with precautions and recommendations
- 🔊 **Text-to-Speech**: Listen to report results
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 📈 **Report History**: View all past predictions and reports
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

### Admin Features
- 📊 **Dashboard Analytics**: Comprehensive statistics and visualizations
- 👥 **User Management**: Monitor all registered users
- 📈 **Disease Distribution**: Visual charts showing disease patterns
- 📋 **Report Management**: View and filter all system reports
- 🔍 **Advanced Filters**: Filter reports by status, disease, and date
- 📥 **Export Data**: Download reports and analytics

### Disease Detection
- ✅ **Healthy/Diseased Classification**
- 🦠 **Multiple Disease Types**: Lumpy Skin Disease, Foot and Mouth Disease, etc.
- 📊 **Disease Stage Identification**: Early, Moderate, Severe
- 💡 **Precautions & Recommendations**: Actionable advice for treatment
- 🎯 **High Accuracy**: Trained on extensive cattle disease dataset

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **Lucide React** - Beautiful icons
- **jsPDF** - PDF generation
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Python** - ML model integration
- **TensorFlow/PyTorch** - Deep learning framework

### DevOps
- **Git** - Version control
- **GitHub** - Code hosting
- **Docker** - Containerization (optional)
- **Nginx** - Web server (production)

## 🏗️ System Architecture

```
┌─────────────────┐
│   React Client  │
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│  Express Server │
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│MongoDB│ │ ML Model│
│  DB   │ │ (Python)│
└───────┘ └─────────┘
```

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ayisha114/cattle-disease-detection-pro.git
cd cattle-disease-detection-pro
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### Step 4: ML Model Setup
```bash
cd ../ml-model
pip install -r requirements.txt

# Download pre-trained model (if available)
# Or train your own model
python train.py
```

### Step 5: Database Setup
```bash
# Start MongoDB service
sudo systemctl start mongodb

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

## ⚙️ Configuration

### Backend Environment Variables (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cattle-disease-db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# ML Model
ML_MODEL_PATH=../ml-model/model.h5
PYTHON_PATH=/usr/bin/python3
```

### Frontend Environment Variables (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Cattle Disease Detection
VITE_MAX_UPLOAD_SIZE=10485760
```

## 🚀 Usage

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

#### Start Production Server
```bash
cd backend
npm start
# Serves both API and static frontend
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Prediction Endpoints

#### Upload Image for Prediction
```http
POST /api/predict
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

#### Get User Reports
```http
GET /api/reports
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get System Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

## 📁 Project Structure

```
cattle-disease-detection-pro/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/         # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Express backend server
│   ├── config/              # Configuration files
│   │   └── db.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   └── Report.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── predict.js
│   │   ├── reports.js
│   │   └── admin.js
│   ├── utils/               # Utility functions
│   │   └── mlPredictor.js
│   ├── uploads/             # Uploaded images
│   ├── server.js            # Server entry point
│   └── package.json
│
├── ml-model/                 # Machine learning model
│   ├── data/                # Training data
│   ├── models/              # Saved models
│   ├── notebooks/           # Jupyter notebooks
│   ├── train.py             # Training script
│   ├── predict.py           # Prediction script
│   └── requirements.txt
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── LICENSE
└── README.md
```

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Upload & Prediction
![Upload Page](screenshots/upload.png)

### Reports Dashboard
![Reports](screenshots/reports.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and development process.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ayisha D** - *Initial work* - [Ayisha114](https://github.com/Ayisha114)

## 🙏 Acknowledgments

- Dataset providers for cattle disease images
- Open source community for amazing tools and libraries
- GITAM University for project support
- All contributors who helped improve this project

## 📞 Contact

For questions or support, please contact:
- Email: adadapee@gitam.in
- GitHub: [@Ayisha114](https://github.com/Ayisha114)

## 🔮 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Real-time video analysis
- [ ] Multi-language support
- [ ] Integration with veterinary services
- [ ] Blockchain-based report verification
- [ ] Advanced analytics and insights
- [ ] Notification system for disease outbreaks
- [ ] Community forum for farmers

---

**Made with ❤️ for better cattle health management**
