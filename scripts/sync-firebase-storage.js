const fs = require('fs');
const path = require('path');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { getFirestore } = require('firebase-admin/firestore');

// Load environment from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0 && !line.startsWith('#')) {
      const key = line.substring(0, idx).trim();
      let val = line.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      env[key] = val;
    }
  });
}

if (!env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error('Error: FIREBASE_SERVICE_ACCOUNT_KEY missing in .env.local');
  process.exit(1);
}

const serviceAccount = JSON.parse(Buffer.from(env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'));
const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
      storageBucket: env.FIREBASE_STORAGE_BUCKET || `${env.FIREBASE_PROJECT_ID}.firebasestorage.app`
    })
  : getApps()[0];

const db = getFirestore(app);
const storage = getStorage(app);

async function syncToFirebaseStorage() {
  const bucketName = env.FIREBASE_STORAGE_BUCKET || `${env.FIREBASE_PROJECT_ID}.firebasestorage.app`;
  const bucket = storage.bucket(bucketName);

  console.log(`Checking bucket "${bucket.name}"...`);
  const [exists] = await bucket.exists();
  if (!exists) {
    console.error(`\nBucket "${bucket.name}" is not yet active.`);
    console.error(`Please visit https://console.firebase.google.com/project/${env.FIREBASE_PROJECT_ID}/storage`);
    console.error(`Click "Get started" to provision your free Firebase Storage bucket, then re-run this script.\n`);
    process.exit(1);
  }

  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.error('No public/uploads directory found.');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`Found ${files.length} local files in public/uploads. Uploading to Firebase Storage...`);

  const urlMap = {};

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const localFilePath = path.join(uploadsDir, filename);
    const destination = `gallery/${filename}`;

    const contentType = filename.endsWith('.webp')
      ? 'image/webp'
      : filename.endsWith('.jpeg') || filename.endsWith('.jpg')
      ? 'image/jpeg'
      : filename.endsWith('.png')
      ? 'image/png'
      : 'application/octet-stream';

    await bucket.upload(localFilePath, {
      destination,
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000'
      }
    });

    // Make public or use download URL
    await bucket.file(destination).makePublic().catch(() => {});
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    urlMap[`/uploads/${filename}`] = publicUrl;
    console.log(`[${i + 1}/${files.length}] Uploaded ${filename}`);
  }

  console.log('\nUpdating Firestore documents with Firebase Storage URLs...');
  const collections = ['gallery_images', 'hero_banners', 'articles', 'team_members'];
  let totalDocsUpdated = 0;

  for (const col of collections) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data();
      let changed = false;
      const updated = { ...data };

      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string' && urlMap[val]) {
          updated[key] = urlMap[val];
          changed = true;
        }
      }

      if (changed) {
        await db.collection(col).doc(doc.id).set(updated, { merge: true });
        totalDocsUpdated++;
      }
    }
  }

  console.log(`Done! ${files.length} files synced to Firebase Storage and ${totalDocsUpdated} Firestore records updated.`);
}

syncToFirebaseStorage().catch(console.error);

