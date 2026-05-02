const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function isObjectIdString(s) {
  return typeof s === 'string' && /^[0-9a-fA-F]{24}$/.test(s);
}

function convertDatesAndIds(obj) {
  if (Array.isArray(obj)) return obj.map(convertDatesAndIds);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (k === '_id' && isObjectIdString(v)) {
        out._id = new mongoose.Types.ObjectId(v);
        continue;
      }
      if ((k.toLowerCase().endsWith('at') || k.toLowerCase().includes('date')) && typeof v === 'string') {
        const d = new Date(v);
        out[k] = isNaN(d.getTime()) ? v : d;
        continue;
      }
      out[k] = convertDatesAndIds(v);
    }
    return out;
  }
  return obj;
}

async function importBackup(mongoUri) {
  if (!mongoUri) {
    console.error('Usage: node importBackup.js <MONGO_URI>');
    process.exit(1);
  }

  const filePath = path.join(__dirname, 'backup.json');
  if (!fs.existsSync(filePath)) {
    console.error('backup.json not found in backend/');
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse backup.json:', err.message);
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection.db;
  try {
    for (const [collName, docs] of Object.entries(data)) {
      if (!Array.isArray(docs) || docs.length === 0) {
        console.log(`Skipping empty collection: ${collName}`);
        continue;
      }
      const col = db.collection(collName);
      console.log(`Importing ${docs.length} documents into '${collName}'...`);
      const converted = docs.map(convertDatesAndIds);
      // Clear existing documents in collection to avoid duplicates
      await col.deleteMany({});
      await col.insertMany(converted, { ordered: false });
      console.log(`Imported ${converted.length} into ${collName}`);
    }
    console.log('Import completed successfully.');
  } catch (err) {
    console.error('Import error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

const uri = process.argv[2] || process.env.MONGO_URI;
importBackup(uri).catch(err => {
  console.error(err);
  process.exit(1);
});
