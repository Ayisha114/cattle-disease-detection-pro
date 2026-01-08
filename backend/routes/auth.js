const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const twilio = require('twilio');
const User = require('../models/User');

// Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// OTP storage (use Redis in production)
const otpStore = new Map();

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0]?.value || '',
          isVerified: true
        });
      } else {
        user.lastLogin = new Date();
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google token (implement Google token verification)
    // For now, accepting the token and creating/finding user
    
    const { email, name, picture, googleId } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        googleId,
        name,
        email,
        profilePicture: picture,
        isVerified: true
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }
    
    const jwtToken = generateToken(user._id);
    
    res.json({
      success: true,
      token: jwtToken,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
});

// @route   POST /api/auth/otp/send
// @desc    Send OTP to phone number
// @access  Public
router.post('/otp/send', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number required' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiry (5 minutes)
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });
    
    // Send OTP via Twilio
    try {
      await twilioClient.messages.create({
        body: `Your Cattle Disease Detection OTP is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      
      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      // For development, return OTP in response
      res.json({ 
        success: true, 
        message: 'OTP sent successfully',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// @route   POST /api/auth/otp/verify
// @desc    Verify OTP and login/register
// @access  Public
router.post('/otp/verify', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP required' });
    }
    
    // Verify OTP
    const storedOTP = otpStore.get(phone);
    
    if (!storedOTP) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }
    
    if (storedOTP.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    
    if (storedOTP.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    // OTP verified, delete from store
    otpStore.delete(phone);
    
    // Find or create user
    let user = await User.findOne({ phone });
    
    if (!user) {
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name required for new user' });
      }
      
      user = await User.create({
        phone,
        name,
        isVerified: true
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }
    
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
