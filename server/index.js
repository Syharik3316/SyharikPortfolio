const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const MEDIA_ROOT = path.resolve(__dirname, '../public_media');

// Простейшие CORS заголовки, чтобы фронтенд на 3000 мог читать API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Раздача статических медиа файлов
app.use('/media', express.static(MEDIA_ROOT));

// Вспомогательная: определить тип по расширению
const getTypeByExt = (ext) => {
  const e = ext.toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(e)) return 'image';
  if (['.mp4', '.webm', '.ogg'].includes(e)) return 'video';
  if (['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'].includes(e)) return 'audio';
  return 'file';
};

// Рекурсивно собрать альбомы: каждый каталог — отдельный альбом по относительному пути
const collectAlbumsRecursively = (baseDir, relativeDir = '', publicBaseUrl = '') => {
  const currentPath = relativeDir ? path.join(baseDir, relativeDir) : baseDir;
  const dirents = fs.readdirSync(currentPath, { withFileTypes: true });

  // Файлы текущего каталога
  const items = dirents
    .filter(d => d.isFile())
    .map(d => {
      const filename = d.name;
      const ext = path.extname(filename);
      const type = getTypeByExt(ext);
      const relSegments = relativeDir ? relativeDir.split(path.sep).map(encodeURIComponent).join('/') : '';
      const pathPart = relSegments
        ? `/media/${relSegments}/${encodeURIComponent(filename)}`
        : `/media/${encodeURIComponent(filename)}`;
      const url = publicBaseUrl ? `${publicBaseUrl}${pathPart}` : pathPart;
      return {
        filename,
        title: filename,
        type,
        url,
      };
    });

  const albums = [];

  // Добавляем альбом для текущего каталога, если есть файлы
  if (items.length) {
    albums.push({ name: relativeDir || 'Корень', items });
  }

  // Рекурсивно обрабатываем подкаталоги
  dirents
    .filter(d => d.isDirectory())
    .forEach(d => {
      const subRelative = relativeDir ? path.join(relativeDir, d.name) : d.name;
      albums.push(...collectAlbumsRecursively(baseDir, subRelative, publicBaseUrl));
    });

  return albums;
};

app.get('/api/gallery', (req, res) => {
  try {
    if (!fs.existsSync(MEDIA_ROOT)) {
      return res.json({ albums: [] });
    }
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const base = `${protocol}://${host}`;
    const albums = collectAlbumsRecursively(MEDIA_ROOT, '', base);
    res.json({ albums });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Media server listening on port ${PORT}`);
});


