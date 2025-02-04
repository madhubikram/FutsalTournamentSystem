const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/auth.controller');

console.log('Imported in routes:', authController); // Debug log
const { register, login } = require('../controllers/auth.controller');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')) 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
      // Accept images and PDFs only
      if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
        return cb(new Error('Only image and PDF files are allowed!'), false);
      }
      cb(null, true);
    }
  });

router.post('/register', upload.array('documents', 5), register);
router.post('/login', login);

module.exports = router;