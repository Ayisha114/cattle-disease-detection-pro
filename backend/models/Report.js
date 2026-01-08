const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  report_id: {
    type: String,
    required: true,
    unique: true,
    default: () => `RPT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Healthy', 'Diseased'],
    required: true
  },
  disease_name: {
    type: String,
    default: 'None'
  },
  stage: {
    type: String,
    default: 'N/A'
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  precautions: {
    type: [String],
    default: []
  },
  recommendations: {
    type: [String],
    default: []
  },
  image_url: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
reportSchema.index({ user_id: 1, timestamp: -1 });
reportSchema.index({ report_id: 1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model('Report', reportSchema);
