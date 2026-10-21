#!/usr/bin/env node
/* eslint-env node */
/**
 * Generates the splash screen logo for Android and iOS: the app logo on a
 * rounded tile, rendered per density from the largest source so nothing
 * is ever upscaled.
 *
 * Usage: node scripts/generate-splash.js [source.png]
 * (defaults to assets/bootsplash_source.png, ideally 512px or larger)
 */
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SOURCE =
  process.argv[2] ?? path.join(ROOT, 'assets/bootsplash_source.png');

// Sizes in dp / pt.
const TILE = 100;
const TILE_RADIUS = 26;
const LOGO = 68;
// Android 12+ draws the splash icon in a 288dp box (inner 192dp circle).
const ANDROID_BOX = 288;
// Theme primaryContainer (src/themes/palette.ts): visible on both the light
// and dark splash backgrounds, so the logo's dark outlines never blend in.
const TILE_COLOR = '#E0E7FF';

const tileSvg = scale =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE * scale}" height="${
      TILE * scale
    }"><rect width="100%" height="100%" rx="${TILE_RADIUS * scale}" ry="${
      TILE_RADIUS * scale
    }" fill="${TILE_COLOR}"/></svg>`,
  );

const renderTile = async scale => {
  const logoPx = Math.round(LOGO * scale);
  const tilePx = Math.round(TILE * scale);
  const logo = await sharp(SOURCE)
    .resize(logoPx, logoPx, {fit: 'contain', background: '#0000'})
    .png()
    .toBuffer();
  const offset = Math.round((tilePx - logoPx) / 2);
  return sharp(tileSvg(scale))
    .resize(tilePx, tilePx)
    .composite([{input: logo, left: offset, top: offset}])
    .png()
    .toBuffer();
};

const writeCentered = async (scale, boxDp, file) => {
  const tile = await renderTile(scale);
  const boxPx = Math.round(boxDp * scale);
  const tilePx = Math.round(TILE * scale);
  const offset = Math.round((boxPx - tilePx) / 2);
  await sharp({
    create: {
      width: boxPx,
      height: boxPx,
      channels: 4,
      background: '#0000',
    },
  })
    .composite([{input: tile, left: offset, top: offset}])
    .png({compressionLevel: 9})
    .toFile(file);
};

const main = async () => {
  const {width, height} = await sharp(SOURCE).metadata();
  const largestScale = 4;
  if (Math.min(width, height) < LOGO * largestScale) {
    console.warn(
      `Source is ${width}x${height}; ${
        LOGO * largestScale
      }px+ avoids upscaling.`,
    );
  }

  const androidRes = path.join(ROOT, 'android/app/src/main/res');
  const androidDensities = {
    mdpi: 1,
    hdpi: 1.5,
    xhdpi: 2,
    xxhdpi: 3,
    xxxhdpi: 4,
  };
  for (const [density, scale] of Object.entries(androidDensities)) {
    await writeCentered(
      scale,
      ANDROID_BOX,
      path.join(androidRes, `drawable-${density}/bootsplash_logo.png`),
    );
  }

  const iosSet = path.join(
    ROOT,
    'ios/levelsCountryListApp/Images.xcassets/BootSplashLogo.imageset',
  );
  const iosFiles = {1: '', 2: '@2x', 3: '@3x'};
  for (const [scale, suffix] of Object.entries(iosFiles)) {
    await writeCentered(
      Number(scale),
      TILE,
      path.join(iosSet, `bootsplash_logo-1t69gl1${suffix}.png`),
    );
  }

  const assetFiles = {1: '', 1.5: '@1,5x', 2: '@2x', 3: '@3x', 4: '@4x'};
  for (const [scale, suffix] of Object.entries(assetFiles)) {
    await writeCentered(
      Number(scale),
      TILE,
      path.join(ROOT, `assets/bootsplash_logo${suffix}.png`),
    );
  }

  console.log('Splash logo generated for Android, iOS and assets/.');
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
