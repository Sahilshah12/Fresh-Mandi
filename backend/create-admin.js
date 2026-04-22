/**
 * Create Admin User Script
 * Run this to create an admin account if you don't have one
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freshmandi');
    console.log('✅ MongoDB Connected');

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Name:', existingAdmin.name);
      console.log('\n💡 Use this to login to admin dashboard');
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: 'Admin',
      email: 'sahil123@gmail.com',
      password: 'Sahil123',
      role: 'admin',
      city: 'Mumbai'
    };

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminData.password, salt);

    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      passwordHash,
      role: adminData.role,
      city: adminData.city,
      approved: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('   Email:', adminData.email);
    console.log('   Password:', adminData.password);
    console.log('\n🚀 You can now login to the admin dashboard');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createAdmin();
