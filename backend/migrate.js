const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import your models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Notification = require('./models/Notification');

async function exportAndImportData() {
  try {
    const localUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freshmandi';

    if (!localUri) {
      throw new Error('MONGO_URI not found in .env file');
    }

    // Connect to local MongoDB
    console.log('📍 Connecting to local MongoDB...');
    await mongoose.connect(localUri);
    console.log('✅ Connected to local MongoDB');

    // Export collections
    const backup = {
      users: await User.find(),
      products: await Product.find(),
      orders: await Order.find(),
      reviews: await Review.find(),
      notifications: await Notification.find()
    };

    console.log('📦 Data exported:');
    console.log(`  - Users: ${backup.users.length}`);
    console.log(`  - Products: ${backup.products.length}`);
    console.log(`  - Orders: ${backup.orders.length}`);
    console.log(`  - Reviews: ${backup.reviews.length}`);
    console.log(`  - Notifications: ${backup.notifications.length}`);

    // Save to file
    const backupPath = path.join(__dirname, 'backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    console.log(`\n💾 Backup saved to: ${backupPath}`);

    // Disconnect from local MongoDB
    console.log('\n🔌 Disconnecting from local MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected from local MongoDB');

    await mongoose.disconnect();
    console.log('\n🎉 Migration complete! Local backup has been refreshed.');

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  }
}

exportAndImportData();
