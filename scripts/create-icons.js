/**
 * Run this with Node.js to generate icon files
 * Requires: npm install canvas
 * Usage: node scripts/create-icons. js
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128];
const outputDir = path.join(__dirname, '..', 'assets', 'icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function drawShield(ctx, size) {
  const padding = size * 0.1;
  const centerX = size / 2;
  const centerY = size / 2;
  const width = size - padding * 2;
  const height = size - padding * 2;

  // Shield gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#1d4ed8');

  // Draw shield path
  ctx.beginPath();
  ctx.moveTo(centerX, padding);
  ctx.bezierCurveTo(
    centerX + width * 0.5, padding,
    centerX + width * 0.5, padding + height * 0.1,
    centerX + width * 0.45, padding + height * 0.35
  );
  ctx.bezierCurveTo(
    centerX + width * 0.4, padding + height * 0.65,
    centerX + width * 0.2, padding + height * 0.85,
    centerX, padding + height
  );
  ctx.bezierCurveTo(
    centerX - width * 0.2, padding + height * 0.85,
    centerX - width * 0.4, padding + height * 0.65,
    centerX - width * 0.45, padding + height * 0.35
  );
  ctx. bezierCurveTo(
    centerX - width * 0.5, padding + height * 0.1,
    centerX - width * 0.5, padding,
    centerX, padding
  );
  ctx. closePath();

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = Math.max(1, size * 0.02);
  ctx.stroke();

  // Draw checkmark
  const checkScale = size / 128;
  ctx.beginPath();
  ctx. moveTo(44 * checkScale + padding, 64 * checkScale + padding * 0.5);
  ctx.lineTo(56 * checkScale + padding, 76 * checkScale + padding * 0.5);
  ctx.lineTo(84 * checkScale + padding, 48 * checkScale + padding * 0.5);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(2, 8 * checkScale);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Clear with transparency
  ctx.clearRect(0, 0, size, size);
  
  drawShield(ctx, size);
  
  const buffer = canvas.toBuffer('image/png');
  const filename = `icon${size}.png`;
  fs.writeFileSync(path.join(outputDir, filename), buffer);
  
  console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All icons generated successfully!');
console.log(`📁 Location: ${outputDir}`);