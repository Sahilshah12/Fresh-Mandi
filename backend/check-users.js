/**
 * Check Users Script
 * Lists all users and their roles
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freshmandi');
    console.log('✅ MongoDB Connected\n');

    const users = await User.find({}).select('name email role city approved');
    
    console.log('📊 Total Users:', users.length);
    console.log('━'.repeat(80));
    
    const admins = users.filter(u => u.role === 'admin');
    const farmers = users.filter(u => u.role === 'farmer');
    const consumers = users.filter(u => u.role === 'consumer');
    
    console.log('\n👔 ADMIN USERS:', admins.length);
    admins.forEach(u => {
      console.log(`   • ${u.name} (${u.email})`);
    });
    
    console.log('\n🚜 FARMER USERS:', farmers.length);
    farmers.forEach(u => {
      console.log(`   • ${u.name} (${u.email}) - ${u.approved ? '✅ Approved' : '⏳ Pending'}`);
    });
    
    console.log('\n🛒 CONSUMER USERS:', consumers.length);
    consumers.forEach(u => {
      console.log(`   • ${u.name} (${u.email})`);
    });

    if (admins.length === 0) {
      console.log('\n⚠️  NO ADMIN USER FOUND!');
      console.log('💡 You need to create an admin account to access admin dashboard');
      console.log('📝 Register with role "admin" or run create-admin.js');
    } else {
      console.log('\n✅ Admin user(s) found. Use their credentials to login.');
    }
    
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

checkUsers();
