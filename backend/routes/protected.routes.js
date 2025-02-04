const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const Futsal = require('../models/futsal.model');

console.log('Loading protected routes...');

// Test route to verify router is working
router.get('/test-protected', (req, res) => {
    res.json({ message: 'Protected routes working' });
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Get pending verifications
router.get('/admin/pending-verifications', auth, async (req, res) => {
    console.log('Hitting pending-verifications route');
    console.log('User role:', req.user?.role);
    
    try {
        if (!req.user || req.user.role !== 'superAdmin') {
            console.log('Access denied - User role not superAdmin');
            return res.status(403).json({ message: 'Access denied' });
        }

        const pendingAdmins = await User.find({ 
            role: 'futsalAdmin',
            verificationStatus: 'pending'
        }).select('-password');

        console.log('Pending admins found:', pendingAdmins);
        res.json({ admins: pendingAdmins });
    } catch (error) {
        console.error('Error in pending-verifications:', error);
        res.status(500).json({ message: 'Error fetching pending verifications' });
    }
});
  
  // Verify admin
  router.post('/admin/verify/:id', auth, async (req, res) => {
    try {
      if (req.user.role !== 'superAdmin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      const { status } = req.body;
      const adminId = req.params.id;
  
      if (status === 'approved') {
        await User.findByIdAndUpdate(adminId, { verificationStatus: 'approved' });
        // Send approval email
      } else if (status === 'rejected') {
        await User.findByIdAndUpdate(adminId, { verificationStatus: 'rejected' });
        // Send rejection email
      }
  
      res.json({ message: `Admin ${status} successfully` });
    } catch (error) {
      res.status(500).json({ message: 'Error updating verification status' });
    }
  });

  router.get('/test-auth', auth, (req, res) => {
    res.json({
        message: 'Auth working',
        user: {
            role: req.user.role,
            id: req.user._id
        }
    });
});

console.log('Protected routes loaded');
module.exports = router;