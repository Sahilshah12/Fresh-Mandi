const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Handle SSL certificate validation (needed for Atlas)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Import your models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Notification = require('./models/Notification');

async function exportAndImportData() {
  try {
    // Get Atlas URI before connecting
    const atlasUri = process.env.MONGO_URI;
    console.log(`📌 Atlas URI found: ${atlasUri ? atlasUri.substring(0, 50) + '...' : 'NOT FOUND'}`);
    
    if (!atlasUri) {
      throw new Error('MONGO_URI not found in .env file');
    }

    // Connect to local MongoDB
    console.log('📍 Connecting to local MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/freshmandi');
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

    // Connect to MongoDB Atlas with SSL options
    console.log('\n🌐 Connecting to MongoDB Atlas...');
    const mongooseOptions = {
      ssl: true,
      retryWrites: true,
      w: 'majority'
    };
    await mongoose.connect(atlasUri, mongooseOptions);
    console.log('✅ Connected to MongoDB Atlas');

    // Import data
    console.log('\n📤 Importing data to MongoDB Atlas...');
    if (backup.users.length > 0) await User.insertMany(backup.users);
    if (backup.products.length > 0) await Product.insertMany(backup.products);
    if (backup.orders.length > 0) await Order.insertMany(backup.orders);
    if (backup.reviews.length > 0) await Review.insertMany(backup.reviews);
    if (backup.notifications.length > 0) await Notification.insertMany(backup.notifications);

    console.log('✅ Data successfully imported to MongoDB Atlas!');
    
    await mongoose.disconnect();
    console.log('\n🎉 Migration complete! All data is now on MongoDB Atlas.');

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  }
}

exportAndImportData();
