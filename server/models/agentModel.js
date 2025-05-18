import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const agentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Agent name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    assignedItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ListItem'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Method to compare entered password with hashed password
agentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
agentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;