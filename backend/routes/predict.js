const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Report = require('../models/Report');

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// @route   POST /api/predict
// @desc    Upload image and get disease prediction
// @access  Private
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    
    // Convert buffer to base64
    const imageBase64 = req.file.buffer.toString('base64');
    
    // Call ML API
    const mlResponse = await axios.post(
      process.env.ML_API_URL || 'http://localhost:5000/predict',
      {
        image: imageBase64,
        filename: req.file.originalname
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // 30 seconds timeout
      }
    );
    
    const prediction = mlResponse.data;
    
    // Save report to database
    const report = await Report.create({
      user_id: req.user._id,
      user_name: req.user.name,
      status: prediction.status,
      disease_name: prediction.disease_name || 'None',
      stage: prediction.stage || 'N/A',
      confidence: prediction.confidence,
      precautions: prediction.precautions || [],
      recommendations: prediction.recommendations || [],
      image_url: `data:${req.file.mimetype};base64,${imageBase64.substring(0, 100)}...` // Store truncated for demo
    });
    
    res.json({
      success: true,
      message: 'Prediction completed successfully',
      report: {
        report_id: report.report_id,
        status: report.status,
        disease_name: report.disease_name,
        stage: report.stage,
        confidence: report.confidence,
        precautions: report.precautions,
        recommendations: report.recommendations,
        timestamp: report.timestamp
      }
    });
  } catch (error) {
    console.error('Prediction error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        success: false, 
        message: 'ML service unavailable. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Prediction failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
