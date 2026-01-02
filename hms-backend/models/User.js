const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'], // Only these values allowed
    default: 'patient',
  },
  // Specific to Patients
  isBlocked: {
    type: Boolean,
    default: false, 
  },
  // Specific to Doctors
  specialization: {
    type: String,
    // Not required because patients/admins don't have one
  }
}, { timestamps: true });

// --- SECURITY MIDDLEWARE ---

// 1. Encrypt password before saving
userSchema.pre('save', async function () {
  // Note: We removed 'next' from the parameters above ^
  
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return; // Just return, don't call next()
  }
  
  // Generate a salt (random data) and hash
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Helper to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;