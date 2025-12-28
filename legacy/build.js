const fs = require('fs');
const path = require('path');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy directories
const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

console.log('Building legacy Space Invaders...');

// Copy all necessary files
copyDir(path.join(__dirname, 'css'), path.join(distDir, 'css'));
copyDir(path.join(__dirname, 'js'), path.join(distDir, 'js'));
copyDir(path.join(__dirname, 'images'), path.join(distDir, 'images'));
copyDir(path.join(__dirname, 'media'), path.join(distDir, 'media'));

// Copy main.html as index.html
fs.copyFileSync(
  path.join(__dirname, 'main.html'),
  path.join(distDir, 'index.html')
);

console.log('✓ Build complete! Output in legacy/dist/');
