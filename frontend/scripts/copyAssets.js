// @ts-nocheck
/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Copy Leaflet marker icons
const leafletPath = path.join(__dirname, '..', 'node_modules', 'leaflet', 'dist', 'images');
const files = [
  'marker-icon.png',
  'marker-icon-2x.png',
  'marker-shadow.png'
];

files.forEach(file => {
  fs.copyFileSync(
    path.join(leafletPath, file),
    path.join(publicDir, file)
  );
});

console.log('Assets copied successfully!');