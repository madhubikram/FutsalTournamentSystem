const User = require('../models/user.model'); 
const jwt = require('jsonwebtoken');     

const register = async (req, res) => {  
    try {
        const { email, username } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email or username already exists'
            });
        }

        // Handle uploaded files
        const documentPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        // Create user with documents
        const user = new User({
            ...req.body,
            documents: documentPaths
        });

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
                documents: user.documents
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Registration failed',
            error: error.message
        });
    }
};
const login = async (req, res) => {
  try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(401).json({ 
              message: 'Invalid credentials' 
          });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          return res.status(401).json({ 
              message: 'Invalid credentials' 
          });
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
              role: user.role
          }
      });
  } catch (error) {
      res.status(500).json({ 
          message: 'Login failed', 
          error: error.message 
      });
  }
};
console.log('Exporting from controller:', { register, login });
module.exports = { register, login }; 