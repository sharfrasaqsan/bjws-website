const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

function createIco(images) {
  // images: Array<{ width, height, buffer: Buffer }>
  const numImages = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(numImages, 4);

  let offset = 6 + numImages * 16;
  const directoryEntries = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Image data size
    entry.writeUInt32LE(offset, 12); // Image data offset
    directoryEntries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([
    header,
    ...directoryEntries,
    ...images.map((i) => i.buffer),
  ]);
}

async function run() {
  const rootDir = path.resolve(__dirname, "..");
  const svgPath = path.join(rootDir, "public", "brand", "logo.svg");
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate ICO sizes (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map(async (size) => ({
      width: size,
      height: size,
      buffer: await sharp(svgBuffer).resize(size, size).png().toBuffer(),
    }))
  );

  const icoBuffer = createIco(icoPngs);

  // Target paths for ICO
  const srcAppIco = path.join(rootDir, "src", "app", "favicon.ico");
  const pubIco = path.join(rootDir, "public", "favicon.ico");

  fs.writeFileSync(srcAppIco, icoBuffer);
  fs.writeFileSync(pubIco, icoBuffer);
  console.log("Successfully wrote BJWS favicon.ico to:", srcAppIco, pubIco);

  // 2. Generate Apple Touch Icon (180x180)
  const appleTouchPath = path.join(rootDir, "public", "apple-touch-icon.png");
  await sharp(svgBuffer).resize(180, 180).png().toFile(appleTouchPath);
  console.log("Successfully wrote apple-touch-icon.png to:", appleTouchPath);

  // 3. Generate icon-192 and icon-512 for PWA
  const icon192Path = path.join(rootDir, "public", "icon-192.png");
  const icon512Path = path.join(rootDir, "public", "icon-512.png");
  await sharp(svgBuffer).resize(192, 192).png().toFile(icon192Path);
  await sharp(svgBuffer).resize(512, 512).png().toFile(icon512Path);
  console.log("Successfully generated PWA icon-192 and icon-512.");
}

run().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
