const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images';
const outputDir = './images-webp';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.readdirSync(inputDir).forEach(file => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.split('.')[0] + '.webp');

  sharp(inputPath)
    .webp({ quality: 75 })
    .toFile(outputPath)
    .then(() => console.log(`Convertido: ${file}`));
});