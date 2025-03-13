const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  role: { type: String, enum: ['player', 'futsalAdmin', 'superAdmin'], required: true },
  panNumber: { type: String, required: function() { return this.role === 'futsalAdmin'; } },
  documents: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  freeBookingsUsed: { 
    type: Number, 
    default: 0 
  },
  futsalName: { 
    type: String, 
    required: function() { 
      return this.role === 'futsalAdmin'; 
    }
  },

  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      return this.role === 'futsalAdmin' ? 'pending' : 'approved'
    }
  },
  profileCompleted: {
    type: Boolean,
    default: false
},
futsal: { 
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Futsal'
},
loyalty: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Loyalty'
}
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);