const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Report = require('../models/Report');

// Admin auth middleware
const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('-__v')
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    
    // Total reports
    const totalReports = await Report.countDocuments();
    
    // Healthy vs Diseased
    const healthyCount = await Report.countDocuments({ status: 'Healthy' });
    const diseasedCount = await Report.countDocuments({ status: 'Diseased' });
    
    // Disease category distribution
    const diseaseDistribution = await Report.aggregate([
      { $match: { status: 'Diseased' } },
      { $group: { _id: '$disease_name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Recent reports
    const recentReports = await Report.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('user_id', 'name email phone');
    
    // Monthly statistics (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyStats = await Report.aggregate([
      { $match: { timestamp: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' }
          },
          healthy: {
            $sum: { $cond: [{ $eq: ['$status', 'Healthy'] }, 1, 0] }
          },
          diseased: {
            $sum: { $cond: [{ $eq: ['$status', 'Diseased'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalReports,
        healthyCount,
        diseasedCount,
        diseaseDistribution,
        monthlyStats,
        recentReports
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

// @route   GET /api/admin/reports
// @desc    Get all reports (admin view)
// @access  Admin
router.get('/reports', adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, disease } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (disease) query.disease_name = disease;
    
    const reports = await Report.find(query)
      .populate('user_id', 'name email phone')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Report.countDocuments(query);
    
    res.json({
      success: true,
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReports: count
    });
  } catch (error) {
    console.error('Get admin reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
});

module.exports = router;
