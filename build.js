const fs = require('fs');
const path = require('path');

const parts = [
  'site00.txt',
  'p10.txt','p11.txt','p12.txt','p13.txt','p14.txt',
  'p20.txt','p21.txt','p22.txt','p23.txt'
];

let html = parts.map(name =>
  fs.readFileSync(path.join(__dirname, 'restore', name), 'utf8')
).join('');

// Lê diretamente o JPEG binário válido do repositório e converte para Base64 no build.
// Isso elimina dependência de arquivos Base64 manuais/corrompidos e também evita problema de caminho/cache.
const doctorPhotoPath = path.join(__dirname, 'assets', 'dr-borba.jpg');
if (!fs.existsSync(doctorPhotoPath)) {
  throw new Error('Foto do Dr. Borba não encontrada em assets/dr-borba.jpg');
}
const doctorPhotoBuffer = fs.readFileSync(doctorPhotoPath);
if (doctorPhotoBuffer.length < 4 || doctorPhotoBuffer[0] !== 0xFF || doctorPhotoBuffer[1] !== 0xD8) {
  throw new Error('assets/dr-borba.jpg não é um JPEG válido');
}
const doctorPhotoBase64 = doctorPhotoBuffer.toString('base64');
html = html.replace('assets/dr-borba.jpg', `data:image/jpeg;base64,${doctorPhotoBase64}`);

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

console.log(`Built ${html.length} characters into dist/index.html with embedded Dr. Borba photo from binary JPEG`);
