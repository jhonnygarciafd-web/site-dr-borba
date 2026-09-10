const fs = require('fs');
const path = require('path');

const parts = [
  'site00.txt',
  'p10.txt','p11.txt','p12.txt','p13.txt','p14.txt',
  'p20.txt','p21.txt','p22.txt','p23.txt'
];

const html = parts.map(name =>
  fs.readFileSync(path.join(__dirname, 'restore', name), 'utf8')
).join('');

const dist = path.join(__dirname, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'assets'), { recursive: true });
fs.writeFileSync(path.join(dist, 'index.html'), html, 'utf8');

if (fs.existsSync(path.join(__dirname, '_headers'))) {
  fs.copyFileSync(path.join(__dirname, '_headers'), path.join(dist, '_headers'));
}

for (const name of fs.readdirSync(path.join(__dirname, 'assets'))) {
  const src = path.join(__dirname, 'assets', name);
  const dst = path.join(dist, 'assets', name);
  if (fs.statSync(src).isFile()) fs.copyFileSync(src, dst);
}

console.log(`Built ${html.length} characters into dist/index.html using repository assets directly`);
