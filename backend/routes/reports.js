const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Report = require('../models/Report');

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

// @route   GET /api/reports
// @desc    Get all reports for logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ user_id: req.user._id })
      .sort({ timestamp: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
});

// @route   GET /api/reports/:id
// @desc    Get specific report by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findOne({
      report_id: req.params.id,
      user_id: req.user._id
    }).select('-__v');
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    res.json({ success: true, report });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report' });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete a report
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      report_id: req.params.id,
      user_id: req.user._id
    });
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete report' });
  }
});

module.exports = router;
