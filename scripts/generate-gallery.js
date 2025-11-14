/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const MEDIA_ROOT = path.resolve(__dirname, '../media');
const BUILD_DIR = path.resolve(__dirname, '../build');

function getTypeByExt(ext) {
  const e = String(ext || '').toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(e)) return 'image';
  if (['.mp4', '.webm', '.ogg'].includes(e)) return 'video';
  if (['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'].includes(e)) return 'audio';
  return 'file';
}

function collectAlbumsRecursively(baseDir, relativeDir = '') {
  const currentPath = relativeDir ? path.join(baseDir, relativeDir) : baseDir;
  const dirents = fs.existsSync(currentPath)
    ? fs.readdirSync(currentPath, { withFileTypes: true })
    : [];

  const items = dirents
    .filter(d => d.isFile())
    .map(d => {
      const filename = d.name;
      const ext = path.extname(filename);
      const type = getTypeByExt(ext);
      const relSegments = relativeDir ? relativeDir.split(path.sep).map(encodeURIComponent).join('/') : '';
      const pathPart = relSegments
        ? `media/${relSegments}/${encodeURIComponent(filename)}`
        : `media/${encodeURIComponent(filename)}`;
      return {
        filename,
        title: filename,
        type,
        url: pathPart,
      };
    });

  const albums = [];
  if (items.length) {
    albums.push({ name: relativeDir || 'Корень', items });
  }

  dirents
    .filter(d => d.isDirectory())
    .forEach(d => {
      const subRelative = relativeDir ? path.join(relativeDir, d.name) : d.name;
      albums.push(...collectAlbumsRecursively(baseDir, subRelative));
    });

  return albums;
}

function main() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('Build directory not found. Run `npm run build` first.');
    process.exit(0);
  }

  const data = { albums: [] };
  if (fs.existsSync(MEDIA_ROOT)) {
    data.albums = collectAlbumsRecursively(MEDIA_ROOT, '');
  }

  const outFile = path.join(BUILD_DIR, 'gallery.json');
  fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Generated ${path.relative(process.cwd(), outFile)} with ${data.albums.length} album(s).`);
}

main();


