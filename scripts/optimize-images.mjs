#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_WIDTH = 1600;
const INPUT_DIR = process.argv[2] || "public/images/raw";
const OUTPUT_DIR = process.argv[3] || "public/images/gallery";

const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png", ".tiff", ".webp"]);

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTS.has(ext)) return null;

  const baseName = path.basename(filePath, ext);
  const inputBuffer = await fs.readFile(filePath);
  const originalSize = inputBuffer.length;

  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  console.log(
    `\nProcessing: ${path.basename(filePath)} (${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(1)} KB)`
  );

  // Target width capped at 1600px
  const targetWidth =
    metadata.width && metadata.width > MAX_WIDTH ? MAX_WIDTH : undefined;

  // 1. Generate WebP
  const webpBuffer = await sharp(inputBuffer)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: 80, effort: 4 })
    .toBuffer();

  const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
  await fs.writeFile(webpPath, webpBuffer);
  const webpSavings = (
    ((originalSize - webpBuffer.length) / originalSize) *
    100
  ).toFixed(1);
  console.log(
    `  ✓ WebP: ${webpPath} (${(webpBuffer.length / 1024).toFixed(1)} KB, -${webpSavings}%)`
  );

  // 2. Generate AVIF
  const avifBuffer = await sharp(inputBuffer)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .avif({ quality: 65, effort: 4 })
    .toBuffer();

  const avifPath = path.join(OUTPUT_DIR, `${baseName}.avif`);
  await fs.writeFile(avifPath, avifBuffer);
  const avifSavings = (
    ((originalSize - avifBuffer.length) / originalSize) *
    100
  ).toFixed(1);
  console.log(
    `  ✓ AVIF: ${avifPath} (${(avifBuffer.length / 1024).toFixed(1)} KB, -${avifSavings}%)`
  );

  // 3. Generate Low-Quality Image Placeholder (LQIP) base64 data URL
  const blurBuffer = await sharp(inputBuffer)
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer();

  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
  console.log(`  ✓ Blur Data URL generated (${blurDataURL.length} chars)`);

  return {
    id: baseName,
    src: `/images/gallery/${baseName}.webp`,
    avifSrc: `/images/gallery/${baseName}.avif`,
    width: targetWidth || metadata.width,
    height: Math.round(
      ((targetWidth || metadata.width) / metadata.width) * metadata.height
    ),
    blurDataURL,
  };
}

async function main() {
  console.log("=== BJWS Image Optimization Tool ===");
  console.log(`Input Directory:  ${INPUT_DIR}`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);
  console.log(`Max Width:        ${MAX_WIDTH}px`);

  await ensureDir(INPUT_DIR);
  await ensureDir(OUTPUT_DIR);

  const files = await fs.readdir(INPUT_DIR);
  if (files.length === 0) {
    console.log(
      `\nNo files found in "${INPUT_DIR}". Place high-res photos there and re-run.`
    );
    return;
  }

  const results = [];
  for (const file of files) {
    const fullPath = path.join(INPUT_DIR, file);
    const stat = await fs.stat(fullPath);
    if (stat.isFile()) {
      const res = await optimizeImage(fullPath);
      if (res) results.push(res);
    }
  }

  console.log(`\nOptimization complete! Processed ${results.length} images.`);
}

main().catch((err) => {
  console.error("Error optimizing images:", err);
  process.exit(1);
});
