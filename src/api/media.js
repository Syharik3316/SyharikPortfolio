// API для загрузки и управления медиа-файлами
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Конвертируем файл в base64 для хранения в localStorage
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Сжимаем изображение
const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Вычисляем новые размеры
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Рисуем сжатое изображение
      ctx.drawImage(img, 0, 0, width, height);
      
      // Конвертируем в base64 с заданным качеством
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Проверяем доступное место в localStorage
const checkStorageQuota = () => {
  try {
    const testKey = 'test_storage_quota';
    const testData = 'x'.repeat(1024 * 1024); // 1MB тестовых данных
    
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Загружаем файл (изображение или видео)
export const uploadFile = async (file, type = 'image') => {
  try {
    // Проверяем доступное место в localStorage
    if (!checkStorageQuota()) {
      throw new Error('Недостаточно места в локальном хранилище. Очистите старые файлы.');
    }
    
    // Проверяем размер файла (увеличенные лимиты)
    const maxSize = type === 'image' ? 50 * 1024 * 1024 : 30 * 1024 * 1024; // 50MB для изображений, 30MB для видео
    if (file.size > maxSize) {
      throw new Error(`Файл слишком большой. Максимальный размер: ${type === 'image' ? '50MB' : '30MB'}`);
    }
    
    // Проверяем тип файла
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      throw new Error('Неподдерживаемый формат изображения. Разрешены: JPEG, PNG, GIF, WebP');
    }
    
    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      throw new Error('Неподдерживаемый формат видео. Разрешены: MP4, WebM, OGG');
    }
    
    // Обрабатываем файл в зависимости от типа
    let base64Data;
    if (type === 'image') {
      // Сжимаем изображения
      base64Data = await compressImage(file, 800, 0.7);
    } else {
      // Для видео используем оригинальный размер, но с предупреждением
      base64Data = await fileToBase64(file);
      
      // Проверяем размер после конвертации
      const base64Size = (base64Data.length * 3) / 4; // Примерный размер в байтах
      if (base64Size > 20 * 1024 * 1024) { // 20MB
        throw new Error('Видео слишком большое после конвертации. Попробуйте файл меньшего размера.');
      }
    }
    
    // Создаем объект медиа-файла
    const mediaItem = {
      id: Date.now(),
      type: type,
      title: file.name.split('.')[0], // Имя файла без расширения
      description: '',
      url: base64Data, // Храним base64 данные
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    const existingMedia = JSON.parse(localStorage.getItem('uploaded_media') || '[]');
    existingMedia.push(mediaItem);
    localStorage.setItem('uploaded_media', JSON.stringify(existingMedia));
    
    return { success: true, mediaItem };
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    return { success: false, error: error.message };
  }
};

// Получаем все загруженные медиа-файлы
export const getUploadedMedia = async () => {
  try {
    const media = JSON.parse(localStorage.getItem('uploaded_media') || '[]');
    return { success: true, media };
  } catch (error) {
    console.error('Ошибка получения медиа-файлов:', error);
    return { success: false, error: error.message };
  }
};

// Удаляем медиа-файл
export const deleteMediaFile = async (mediaId) => {
  try {
    const existingMedia = JSON.parse(localStorage.getItem('uploaded_media') || '[]');
    const updatedMedia = existingMedia.filter(item => item.id !== mediaId);
    localStorage.setItem('uploaded_media', JSON.stringify(updatedMedia));
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    return { success: false, error: error.message };
  }
};

// Обновляем информацию о медиа-файле
export const updateMediaFile = async (mediaId, updates) => {
  try {
    const existingMedia = JSON.parse(localStorage.getItem('uploaded_media') || '[]');
    const updatedMedia = existingMedia.map(item => 
      item.id === mediaId ? { ...item, ...updates } : item
    );
    localStorage.setItem('uploaded_media', JSON.stringify(updatedMedia));
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления файла:', error);
    return { success: false, error: error.message };
  }
};

// Загружаем фон сайта
export const uploadBackgroundImage = async (file) => {
  try {
    // Проверяем доступное место
    if (!checkStorageQuota()) {
      throw new Error('Недостаточно места в локальном хранилище.');
    }
    
    const maxSize = 30 * 1024 * 1024; // 30MB для фона
    if (file.size > maxSize) {
      throw new Error('Файл фона слишком большой. Максимальный размер: 30MB');
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Неподдерживаемый формат изображения для фона');
    }
    
    // Сжимаем изображение фона
    const base64Data = await compressImage(file, 1200, 0.6);
    
    // Сохраняем фон в localStorage
    localStorage.setItem('site_background', base64Data);
    
    return { success: true, backgroundUrl: base64Data };
  } catch (error) {
    console.error('Ошибка загрузки фона:', error);
    return { success: false, error: error.message };
  }
};

// Загружаем аватар
export const uploadAvatar = async (file) => {
  try {
    // Проверяем доступное место
    if (!checkStorageQuota()) {
      throw new Error('Недостаточно места в локальном хранилище.');
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB для аватара
    if (file.size > maxSize) {
      throw new Error('Аватар слишком большой. Максимальный размер: 10MB');
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Неподдерживаемый формат изображения для аватара');
    }
    
    // Сжимаем аватар
    const base64Data = await compressImage(file, 400, 0.8);
    
    // Сохраняем аватар в localStorage
    localStorage.setItem('user_avatar', base64Data);
    
    return { success: true, avatarUrl: base64Data };
  } catch (error) {
    console.error('Ошибка загрузки аватара:', error);
    return { success: false, error: error.message };
  }
};
