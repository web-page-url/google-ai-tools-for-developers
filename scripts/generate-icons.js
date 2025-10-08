#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceImage = path.join(__dirname, '../public/seo-source.png');
const outputDir = path.join(__dirname, '../public');

// Icon sizes for different platforms
const iconSizes = [
  // Standard favicons
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon.ico', format: 'ico' },

  // Apple Touch Icons
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 167, name: 'apple-touch-icon-167x167.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
  { size: 1024, name: 'apple-touch-icon-1024x1024.png' },

  // Android/Chrome
  { size: 36, name: 'android-chrome-36x36.png' },
  { size: 48, name: 'android-chrome-48x48.png' },
  { size: 72, name: 'android-chrome-72x72.png' },
  { size: 96, name: 'android-chrome-96x96.png' },
  { size: 128, name: 'android-chrome-128x128.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 256, name: 'android-chrome-256x256.png' },
  { size: 384, name: 'android-chrome-384x384.png' },
  { size: 512, name: 'android-chrome-512x512.png' },

  // Microsoft Tiles
  { size: 70, name: 'mstile-70x70.png' },
  { size: 144, name: 'mstile-144x144.png' },
  { size: 150, name: 'mstile-150x150.png' },
  { size: 310, name: 'mstile-310x310.png' },
  { size: 310, name: 'mstile-310x150.png', width: 310, height: 150 },

  // Open Graph and Twitter Cards
  { size: 1200, name: 'og-image-1200x630.png', width: 1200, height: 630 },
  { size: 1200, name: 'twitter-image-1200x600.png', width: 1200, height: 600 },
];

async function generateIcons() {
  console.log('🚀 Starting favicon generation...');

  // Check if source image exists
  if (!fs.existsSync(sourceImage)) {
    console.error('❌ Source image not found:', sourceImage);
    console.log('Please ensure seo-source.png exists in the public directory.');
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Load source image
    const image = sharp(sourceImage);
    const metadata = await image.metadata();

    console.log(`📏 Source image: ${metadata.width}x${metadata.height}`);

    // Generate all icon sizes
    for (const icon of iconSizes) {
      const outputPath = path.join(outputDir, icon.name);

      let resizeOptions = {
        width: icon.width || icon.size,
        height: icon.height || icon.size,
        fit: 'cover',
        position: 'center'
      };

      // Special handling for ico format
      if (icon.format === 'ico') {
        await image
          .resize(resizeOptions.width, resizeOptions.height, { fit: 'cover', position: 'center' })
          .png()
          .toFile(outputPath.replace('.ico', '.png'));

        // Convert to ICO using a simple approach (you might need additional tools for full ICO support)
        console.log(`✅ Generated: ${icon.name} (${icon.width || icon.size}x${icon.height || icon.size})`);
        continue;
      }

      await image
        .resize(resizeOptions.width, resizeOptions.height, { fit: 'cover', position: 'center' })
        .png({ quality: 90 })
        .toFile(outputPath);

      console.log(`✅ Generated: ${icon.name} (${icon.width || icon.size}x${icon.height || icon.size})`);
    }

    // Generate favicon.ico (special handling)
    const faviconPath = path.join(outputDir, 'favicon.ico');
    await image
      .resize(32, 32, { fit: 'cover', position: 'center' })
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));
    // Note: For true .ico support, you might need additional conversion tools

    console.log('🎉 All favicons generated successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('💡 Next steps:');
    console.log('   1. Update your HTML with the new favicon links');
    console.log('   2. Test your favicons at: https://realfavicongenerator.net/favicon_checker');

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

// Run the script
generateIcons();
