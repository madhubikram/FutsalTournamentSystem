const User = require('../models/user.model'); 
const jwt = require('jsonwebtoken');     

const register = async (req, res) => {  
  console.log('Registration request received:', req.body); 
  console.log('Files received:', req.files); 
  console.log('Contact number in request:', req.body.contactNumber);

  try {
    const { 
      email, 
      username, 
      firstName,
      lastName,
      password,
      role,
      contactNumber, 
      panNumber,
      futsalName
  } = req.body;

  console.log('Extracted fields:', {
    email,
    username,
    firstName,
    lastName,
    role,
    contactNumber,
    panNumber,
    futsalName
});

  if (!contactNumber) {
    console.log('Contact number missing from request');
    return res.status(400).json({ 
        message: 'Registration failed', 
        error: 'Contact number is required' 
    });
  }

      // Check for existing user
      const existingUser = await User.findOne({
          $or: [
              { email },
              { username },
              { panNumber: panNumber || null },
              { contactNumber }
          ]
      });

      if (existingUser) {
          let errorMessage = '';
          if (existingUser.email === email) {
              errorMessage = 'Email already exists';
          } else if (existingUser.username === username) {
              errorMessage = 'Username already exists';
          } else if (existingUser.contactNumber === contactNumber) {
            message = 'Contact number already registered';
        } else if (existingUser.panNumber === panNumber) {
              errorMessage = 'PAN number already registered';
          }
          return res.status(400).json({ message: errorMessage });
      }

           // Handle uploaded files
           const documentPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

           // Create user data object
           const userData = {
               firstName,
               lastName,
               username,
               email,
               password,
               role,
               contactNumber,
               documents: documentPaths
           };
     
           // Add futsal admin specific fields
           if (role === 'futsalAdmin') {
               userData.panNumber = panNumber;
               userData.futsalName = futsalName;
               userData.verificationStatus = 'pending';
           }
     
           console.log('Creating user with data:', userData);
     
           // Create and save user
           const user = new User(userData);
           await user.save();
     
           const token = jwt.sign(
               { userId: user._id },
               process.env.JWT_SECRET,
               { expiresIn: '24h' }
           );
     
           res.status(201).json({
               message: 'Registration successful',
               token,
               user: {
                   id: user._id,
                   username: user.username,
                   email: user.email,
                   role: user.role,
                   verificationStatus: user.verificationStatus,
                   documents: user.documents
               }
           });
       } catch (error) {
           console.error('Registration error:', error);
           console.error('Error stack:', error.stack);
           res.status(500).json({
               message: 'Registration failed',
               error: error.message
           });
       }
     };

// auth.controller.js
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check verification status for futsal admins
    if (user.role === 'futsalAdmin') {
      if (user.verificationStatus === 'pending') {
        return res.status(401).json({ 
          message: 'Your account is pending verification' 
        });
      }
      if (user.verificationStatus === 'rejected') {
        // Delete rejected user
        await User.deleteOne({ _id: user._id });
        return res.status(401).json({ 
          message: 'Your registration has been rejected' 
        });
      }
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
};

module.exports = { login };
console.log('Exporting from controller:', { register, login });
module.exports = { register, login }; 