import mongoose from 'mongoose';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }
    
    if (user.role === 'admin') {
      console.log('ℹ️  User is already an admin');
      process.exit(0);
    }
    
    user.role = 'admin';
    await user.save();
    
    console.log(`✅ ${email} is now an admin!`);
    console.log('👤 User details:');
    console.log('   - Username:', user.username);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('   - Active:', user.isActive);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('Usage: node scripts/makeAdmin.js <email>');
  console.log('Example: node scripts/makeAdmin.js user@example.com');
  process.exit(1);
}

makeAdmin(email);
