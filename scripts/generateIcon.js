/* eslint-disable no-console */
const { execSync } = require('child_process');

const iconsPath = './public/icons';

const sizes = [
  16,
  32,
  48,
  72,
  120,
  144,
  152,
  192,
  512,
];

const svgSizes = [
  16,
  32,
  48,
];

sizes.forEach((size) => {
  console.log(`==x${size}.png==`);
  execSync(`magick convert -size ${size}x${size} ${iconsPath}/icon.svg ${iconsPath}/x${size}.png`);
});

if (svgSizes.every((s) => sizes.includes(s))) {
  console.log('==SVG==');
  execSync(`magick convert ${svgSizes.map((s) => `${iconsPath}/x${s}.png`).join(' ')} ./public/favicon.ico`);
} else {
  console.log('==SVG Failed==');
}

console.log('==END==');
