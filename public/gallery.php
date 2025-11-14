<?php
header('Content-Type: application/json; charset=utf-8');

function getTypeByExt($ext) {
  $e = strtolower($ext);
  if (in_array($e, ['.jpg','.jpeg','.png','.gif','.webp'])) return 'image';
  if (in_array($e, ['.mp4','.webm','.ogg'])) return 'video';
  if (in_array($e, ['.mp3','.wav','.ogg','.aac','.flac','.m4a'])) return 'audio';
  return 'file';
}

function encodePathSegments($path) {
  if ($path === '' || $path === null) return '';
  $parts = preg_split('#[\\/]#', $path, -1, PREG_SPLIT_NO_EMPTY);
  $parts = array_map('rawurlencode', $parts);
  return implode('/', $parts);
}

function collectAlbums($baseDir, $relative = '') {
  $dir = $relative ? ($baseDir . DIRECTORY_SEPARATOR . $relative) : $baseDir;
  if (!is_dir($dir)) return [];

  $entries = @scandir($dir) ?: [];

  // Файлы текущего каталога
  $items = [];
  foreach ($entries as $name) {
    if ($name === '.' || $name === '..') continue;
    $path = $dir . DIRECTORY_SEPARATOR . $name;
    if (is_file($path)) {
      $ext = '.' . strtolower(pathinfo($name, PATHINFO_EXTENSION));
      $type = getTypeByExt($ext);
      $relSegments = $relative ? encodePathSegments($relative) : '';
      $fileUrl = $relSegments !== ''
        ? 'media/' . $relSegments . '/' . rawurlencode($name)
        : 'media/' . rawurlencode($name);
      $items[] = [
        'filename' => $name,
        'title' => $name,
        'type' => $type,
        'url' => $fileUrl,
      ];
    }
  }

  $albums = [];
  if (count($items) > 0) {
    $albums[] = [ 'name' => ($relative !== '' ? $relative : 'Корень'), 'items' => $items ];
  }

  // Рекурсивно по подкаталогам
  foreach ($entries as $name) {
    if ($name === '.' || $name === '..') continue;
    $path = $dir . DIRECTORY_SEPARATOR . $name;
    if (is_dir($path)) {
      $subRel = $relative !== '' ? ($relative . DIRECTORY_SEPARATOR . $name) : $name;
      $albums = array_merge($albums, collectAlbums($baseDir, $subRel));
    }
  }

  return $albums;
}

$mediaPath = __DIR__ . DIRECTORY_SEPARATOR . 'media';
$result = [ 'albums' => collectAlbums($mediaPath, '') ];
echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
