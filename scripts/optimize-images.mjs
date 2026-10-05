// Converte as imagens de public/images (.jpg/.jpeg/.png) para WebP (qualidade ~80),
// limitando a largura a 2x o tamanho exibido. Uso: npm run images
import { readdir } from 'node:fs/promises';
import { extname, basename, join } from 'node:path';
import sharp from 'sharp';

const dir = 'public/images';

// Largura máxima (2x a exibida) por imagem; as demais usam o padrão.
const maxWidth = {
  julio: 920,
  'family-desktop': 1800,
  'family-painel': 500,
  'family-familias': 500,
  'lanche-mobile': 380,
  'kaka-mobile': 380,
};
const defaultWidth = 1200;

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));

if (files.length === 0) {
  console.log(`Nenhuma imagem .jpg/.png encontrada em ${dir}.`);
}

for (const file of files) {
  const name = basename(file, extname(file));
  const width = maxWidth[name] ?? defaultWidth;
  const input = join(dir, file);
  const output = join(dir, `${name}.webp`);
  const info = await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
  console.log(`${file} → ${name}.webp (${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
}
