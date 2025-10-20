// Функция для получения размера localStorage
const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

import React, { useState, useEffect } from 'react';
import { uploadFile, getUploadedMedia, deleteMediaFile, updateMediaFile, uploadBackgroundImage, uploadAvatar } from '../api/media';
import './AdminPanel.css';

const AdminPanel = ({ onLogout, siteData, onUpdateSiteData }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [editingData, setEditingData] = useState({ ...siteData });
  const [notes, setNotes] = useState([]);
  const [backups, setBackups] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Загружаем данные из localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    const savedNotes = localStorage.getItem('adminNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    const savedBackups = localStorage.getItem('adminBackups');
    if (savedBackups) {
      setBackups(JSON.parse(savedBackups));
    }
    
    // Загружаем медиа-файлы
    loadUploadedMedia();
  }, []);

  // Загружаем медиа-файлы
  const loadUploadedMedia = async () => {
    const result = await getUploadedMedia();
    if (result.success) {
      setUploadedMedia(result.media);
    }
  };

  // Сохраняем уведомления в localStorage
  const saveNotifications = (newNotifications) => {
    setNotifications(newNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(newNotifications));
  };

  // Добавляем новое уведомление (функция для будущего использования)
  // const addNotification = (notification) => {
  //   const newNotification = {
  //     id: Date.now(),
  //     ...notification,
  //     timestamp: new Date().toLocaleString('ru-RU'),
  //     read: false
  //   };
  //   const updatedNotifications = [newNotification, ...notifications];
  //   saveNotifications(updatedNotifications);
  // };

  // Отмечаем уведомление как прочитанное
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    saveNotifications(updatedNotifications);
  };

  // Удаляем уведомление
  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    saveNotifications(updatedNotifications);
  };

  // Сохраняем изменения
  const handleSave = () => {
    onUpdateSiteData(editingData);
    alert('Изменения сохранены!');
  };

  // Сброс к исходным данным (функция для будущего использования)
  // const handleReset = () => {
  //   setEditingData({ ...siteData });
  // };

  // Сохраняем заметки
  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem('adminNotes', JSON.stringify(newNotes));
  };

  // Добавляем заметку
  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Новая заметка',
      content: '',
      createdAt: new Date().toLocaleString('ru-RU')
    };
    saveNotes([newNote, ...notes]);
  };

  // Удаляем заметку
  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  // Обновляем заметку
  const updateNote = (id, field, value) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, [field]: value } : note
    );
    saveNotes(updatedNotes);
  };

  // Функции для работы с медиа-файлами
  const handleFileUpload = async (file, type) => {
    setUploading(true);
    try {
      const result = await uploadFile(file, type);
      if (result.success) {
        await loadUploadedMedia(); // Перезагружаем список
        alert('Файл успешно загружен!');
      } else {
        alert(`Ошибка загрузки: ${result.error}`);
      }
    } catch (error) {
      alert(`Ошибка загрузки: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (window.confirm('Удалить этот файл?')) {
      const result = await deleteMediaFile(mediaId);
      if (result.success) {
        await loadUploadedMedia(); // Перезагружаем список
        alert('Файл удален!');
      } else {
        alert(`Ошибка удаления: ${result.error}`);
      }
    }
  };

  const handleUpdateMedia = async (mediaId, updates) => {
    const result = await updateMediaFile(mediaId, updates);
    if (result.success) {
      await loadUploadedMedia(); // Перезагружаем список
    } else {
      alert(`Ошибка обновления: ${result.error}`);
    }
  };

  const handleBackgroundUpload = async (file) => {
    setUploading(true);
    try {
      const result = await uploadBackgroundImage(file);
      if (result.success) {
        setEditingData({
          ...editingData,
          backgroundImage: result.backgroundUrl
        });
        alert('Фон успешно загружен!');
      } else {
        alert(`Ошибка загрузки фона: ${result.error}`);
      }
    } catch (error) {
      alert(`Ошибка загрузки фона: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    setUploading(true);
    try {
      const result = await uploadAvatar(file);
      if (result.success) {
        setEditingData({
          ...editingData,
          avatarImage: result.avatarUrl
        });
        alert('Аватар успешно загружен!');
      } else {
        alert(`Ошибка загрузки аватара: ${result.error}`);
      }
    } catch (error) {
      alert(`Ошибка загрузки аватара: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Функция для открытия медиа в модальном окне
  const openMediaModal = (media) => {
    setSelectedMedia(media);
    setShowMediaModal(true);
  };

  // Функция для закрытия модального окна
  const closeMediaModal = () => {
    setShowMediaModal(false);
    setSelectedMedia(null);
  };

  // Создаем бекап
  const createBackup = () => {
    if (backups.length >= 3) {
      alert('Максимум 3 бекапа! Удалите старый бекап перед созданием нового.');
      return;
    }
    
    const backup = {
      id: Date.now(),
      name: `Бекап ${new Date().toLocaleString('ru-RU')}`,
      data: { ...editingData },
      notifications: [...notifications],
      notes: [...notes],
      createdAt: new Date().toLocaleString('ru-RU')
    };
    
    const updatedBackups = [backup, ...backups];
    setBackups(updatedBackups);
    localStorage.setItem('adminBackups', JSON.stringify(updatedBackups));
    alert('Бекап создан!');
  };

  // Загружаем бекап
  const loadBackup = (backup) => {
    if (window.confirm(`Загрузить бекап "${backup.name}"? Текущие изменения будут потеряны.`)) {
      setEditingData(backup.data);
      onUpdateSiteData(backup.data);
      
      // Восстанавливаем сообщения и заметки
      if (backup.notifications) {
        setNotifications(backup.notifications);
        localStorage.setItem('adminNotifications', JSON.stringify(backup.notifications));
      }
      if (backup.notes) {
        setNotes(backup.notes);
        localStorage.setItem('adminNotes', JSON.stringify(backup.notes));
      }
      
      alert('Бекап загружен!');
    }
  };

  // Удаляем бекап
  const deleteBackup = (id) => {
    if (window.confirm('Удалить этот бекап?')) {
      const updatedBackups = backups.filter(backup => backup.id !== id);
      setBackups(updatedBackups);
      localStorage.setItem('adminBackups', JSON.stringify(updatedBackups));
      alert('Бекап удален!');
    }
  };

  // Полный сброс сайта
  const handleFullReset = () => {
    if (resetPassword !== 'admin123') {
      alert('Неверный пароль!');
      return;
    }
    
    if (window.confirm('ВНИМАНИЕ! Это полностью сбросит весь сайт. Все данные будут удалены. Продолжить?')) {
      const emptyData = {
        name: '',
        title: '',
        description: '',
        aboutText: [],
        skills: [],
        projects: [],
        contactInfo: []
      };
      
      setEditingData(emptyData);
      onUpdateSiteData(emptyData);
      setShowResetModal(false);
      setResetPassword('');
      alert('Сайт полностью сброшен!');
    }
  };

  // Редактирование проектов
  const updateProject = (index, field, value) => {
    const updatedProjects = [...editingData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setEditingData({ ...editingData, projects: updatedProjects });
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: "Новый проект",
      description: "Описание проекта",
      tech: ["React"],
      status: "Планируется",
      url: "",
      hasLink: false
    };
    setEditingData({
      ...editingData,
      projects: [...editingData.projects, newProject]
    });
  };

  const deleteProject = (index) => {
    const updatedProjects = editingData.projects.filter((_, i) => i !== index);
    setEditingData({ ...editingData, projects: updatedProjects });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛠 Админ-панель</h1>
        <div className="admin-actions">
          <button className="btn btn-secondary" onClick={createBackup}>
            💾 Бекап
          </button>
          <button className="btn btn-warning" onClick={() => setShowResetModal(true)}>
            ⚠️ Полный сброс
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Сохранить
          </button>
          <button className="btn btn-danger" onClick={() => {
            onLogout();
            window.location.href = '/';
          }}>
            Выйти
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Дашборд
            </button>
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Профиль
            </button>
            <button 
              className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              💼 Проекты
            </button>
            <button 
              className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              🖼️ Галерея
            </button>
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              📨 Сообщения {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            <button 
              className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              📧 Контакты
            </button>
            <button 
              className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              📝 Заметки
            </button>
            <button 
              className={`nav-item ${activeTab === 'backups' ? 'active' : ''}`}
              onClick={() => setActiveTab('backups')}
            >
              💾 Бекапы
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Разное
            </button>
          </nav>
        </div>

        <div className="admin-main">
          {activeTab === 'dashboard' && (
            <div className="dashboard">
              <h2>Дашборд</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Проекты</h3>
                  <p className="stat-number">{Array.isArray(editingData.projects) ? editingData.projects.length : 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Навыки</h3>
                  <p className="stat-number">{Array.isArray(editingData.skills) ? editingData.skills.length : 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Новые сообщения</h3>
                  <p className="stat-number">{unreadCount}</p>
                </div>
                <div className="stat-card">
                  <h3>Всего сообщений</h3>
                  <p className="stat-number">{notifications.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Заметки</h3>
                  <p className="stat-number">{notes.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Бекапы</h3>
                  <p className="stat-number">{backups.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Контакты</h3>
                  <p className="stat-number">{Array.isArray(editingData.contactInfo) ? editingData.contactInfo.length : 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Галерея</h3>
                  <p className="stat-number">{Array.isArray(editingData.gallery) ? editingData.gallery.length : 0}</p>
                </div>
              </div>
              
              <div className="dashboard-charts">
                <div className="chart-section">
                  <h3>📊 Статистика активности</h3>
                  <div className="activity-chart">
                    <div className="chart-item">
                      <div className="chart-bar" style={{height: '60%'}}></div>
                      <span>Пн</span>
                    </div>
                    <div className="chart-item">
                      <div className="chart-bar" style={{height: '80%'}}></div>
                      <span>Вт</span>
                    </div>
                    <div className="chart-item">
                      <div className="chart-bar" style={{height: '45%'}}></div>
                      <span>Ср</span>
                    </div>
                    <div className="chart-item">
                      <div className="chart-bar" style={{height: '90%'}}></div>
                      <span>Чт</span>
                    </div>
                    <div className="chart-item">
                      <div className="chart-bar" style={{height: '70%'}}></div>
                      <span>Пт</span>
                    </div>
                    <div className="chart-item">
                      <div className="chart-bar" style={{height: '30%'}}></div>
                      <span>Сб</span>
                    </div>
                    <div className="chart-item">
                      <div className="chart-bar" style={{height: '20%'}}></div>
                      <span>Вс</span>
                    </div>
                  </div>
                </div>
                
                <div className="chart-section">
                  <h3>🌐 Онлайн статистика</h3>
                  <div className="online-stats">
                    <div className="online-item">
                      <div className="online-indicator online"></div>
                      <span>Текущий онлайн: <strong>{Math.floor(Math.random() * 50) + 10}</strong></span>
                    </div>
                    <div className="online-item">
                      <div className="online-indicator"></div>
                      <span>Сегодня посетителей: <strong>{Math.floor(Math.random() * 200) + 50}</strong></span>
                    </div>
                    <div className="online-item">
                      <div className="online-indicator"></div>
                      <span>За неделю: <strong>{Math.floor(Math.random() * 1000) + 300}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-editor">
              <h2>Редактирование профиля</h2>
              <div className="editor-section">
                <h3>Основная информация</h3>
                <div className="form-group">
                  <label>Имя:</label>
                  <input
                    type="text"
                    value={editingData.name}
                    onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Должность:</label>
                  <input
                    type="text"
                    value={editingData.title}
                    onChange={(e) => setEditingData({...editingData, title: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Описание:</label>
                  <textarea
                    value={editingData.description}
                    onChange={(e) => setEditingData({...editingData, description: e.target.value})}
                    rows="4"
                  />
                </div>
              </div>
              
              <div className="editor-section">
                <h3>Текст "О себе"</h3>
                <div className="about-text-editor">
                  {editingData.aboutText?.map((paragraph, index) => (
                    <div key={index} className="paragraph-editor">
                      <label>Абзац {index + 1}:</label>
                      <textarea
                        value={paragraph}
                        onChange={(e) => {
                          const newAboutText = [...editingData.aboutText];
                          newAboutText[index] = e.target.value;
                          setEditingData({...editingData, aboutText: newAboutText});
                        }}
                        rows="3"
                      />
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const newAboutText = editingData.aboutText.filter((_, i) => i !== index);
                          setEditingData({...editingData, aboutText: newAboutText});
                        }}
                      >
                        Удалить абзац
                      </button>
                    </div>
                  )) || []}
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingData({
                      ...editingData, 
                      aboutText: [...(editingData.aboutText || []), 'Новый абзац']
                    })}
                  >
                    + Добавить абзац
                  </button>
                </div>
              </div>
              
              <div className="editor-section">
                <h3>Навыки</h3>
                <div className="skills-editor">
                  {editingData.skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...editingData.skills];
                          newSkills[index] = e.target.value;
                          setEditingData({...editingData, skills: newSkills});
                        }}
                      />
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const newSkills = editingData.skills.filter((_, i) => i !== index);
                          setEditingData({...editingData, skills: newSkills});
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingData({...editingData, skills: [...editingData.skills, 'Новый навык']})}
                  >
                    + Добавить навык
                  </button>
                </div>
              </div>
              
              <div className="editor-section">
                <h3>Аватар</h3>
                <div className="avatar-upload">
                  <div className="current-avatar">
                    {editingData.avatarImage ? (
                      <img 
                        src={editingData.avatarImage} 
                        alt="Текущий аватар"
                        className="avatar-preview"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <span>👤</span>
                        <p>Нет аватара</p>
                      </div>
                    )}
                  </div>
                  <label className="btn btn-primary">
                    📷 Загрузить аватар
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleAvatarUpload(file);
                      }}
                      disabled={uploading}
                    />
                  </label>
                  {editingData.avatarImage && (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setEditingData({
                          ...editingData,
                          avatarImage: ''
                        });
                      }}
                    >
                      Удалить аватар
                    </button>
                  )}
                </div>
              </div>
              
              <div className="editor-section">
                <h3>Фон сайта</h3>
                <div className="background-upload">
                  <div className="current-background">
                    {editingData.backgroundImage ? (
                      <div className="background-preview">
                        <img 
                          src={editingData.backgroundImage} 
                          alt="Текущий фон"
                          className="background-thumbnail"
                        />
                        <p>Текущий фон загружен</p>
                      </div>
                    ) : (
                      <div className="background-placeholder">
                        <span>🖼️</span>
                        <p>Нет фона</p>
                      </div>
                    )}
                  </div>
                  <label className="btn btn-primary">
                    🖼️ Загрузить фон
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleBackgroundUpload(file);
                      }}
                      disabled={uploading}
                    />
                  </label>
                  {editingData.backgroundImage && (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setEditingData({
                          ...editingData,
                          backgroundImage: ''
                        });
                      }}
                    >
                      Удалить фон
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="projects-editor">
              <h2>Управление проектами</h2>
              <button className="btn btn-primary" onClick={addProject}>
                + Добавить проект
              </button>
              
              <div className="projects-list">
                {editingData.projects.map((project, index) => (
                  <div key={project.id} className="project-editor">
                    <div className="project-header">
                      <h3>Проект #{index + 1}</h3>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteProject(index)}
                      >
                        Удалить
                      </button>
                    </div>
                    
                    <div className="form-group">
                      <label>Название:</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Описание:</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        rows="3"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Статус:</label>
                      <select
                        value={project.status}
                        onChange={(e) => updateProject(index, 'status', e.target.value)}
                      >
                        <option value="Планируется">Планируется</option>
                        <option value="В разработке">В разработке</option>
                        <option value="Завершен">Завершен</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Ссылка на проект:</label>
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) => updateProject(index, 'url', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={project.hasLink}
                          onChange={(e) => updateProject(index, 'hasLink', e.target.checked)}
                        />
                        Проект имеет ссылку
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="gallery-editor">
              <h2>Управление галереей</h2>
              
              {/* Загрузка файлов */}
              <div className="upload-section">
                <h3>Загрузить файлы</h3>
                <div className="upload-buttons">
                  <label className="btn btn-primary">
                    📷 Загрузить изображение
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileUpload(file, 'image');
                      }}
                      disabled={uploading}
                    />
                  </label>
                  <label className="btn btn-secondary">
                    🎥 Загрузить видео
                    <input
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileUpload(file, 'video');
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {uploading && <p className="upload-status">⏳ Загрузка файла...</p>}
              </div>

              {/* Список загруженных файлов */}
              <div className="uploaded-media-section">
                <h3>Загруженные файлы</h3>
                {uploadedMedia.length === 0 ? (
                  <p className="no-media">Нет загруженных файлов</p>
                ) : (
                  <div className="uploaded-media-list">
                    {uploadedMedia.map((media) => (
                      <div key={media.id} className="uploaded-media-item">
                        <div 
                          className="media-preview clickable-media"
                          onClick={() => openMediaModal(media)}
                          title="Нажмите для просмотра в полном размере"
                        >
                          {media.type === 'image' ? (
                            <img 
                              src={media.url} 
                              alt={media.title}
                              className="media-thumbnail"
                            />
                          ) : (
                            <video 
                              src={media.url} 
                              className="media-thumbnail"
                              controls
                            />
                          )}
                        </div>
                        <div className="media-info">
                          <h4>{media.title}</h4>
                          <p>Тип: {media.type}</p>
                          <p>Размер: {(media.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                          <p>Загружен: {new Date(media.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <div className="media-actions">
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              const newTitle = prompt('Введите новое название:', media.title);
                              if (newTitle && newTitle !== media.title) {
                                handleUpdateMedia(media.id, { title: newTitle });
                              }
                            }}
                          >
                            ✏️ Редактировать
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteMedia(media.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Добавление в галерею сайта */}
              <div className="gallery-assignment-section">
                <h3>Добавить в галерею сайта</h3>
                <div className="gallery-list">
                  {(Array.isArray(editingData.gallery) ? editingData.gallery : []).map((item, index) => (
                    <div key={item.id} className="gallery-editor-item">
                      <div className="gallery-header">
                        <h4>Элемент галереи #{index + 1}</h4>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const currentGallery = Array.isArray(editingData.gallery) ? editingData.gallery : [];
                            const newGallery = currentGallery.filter((_, i) => i !== index);
                            setEditingData({...editingData, gallery: newGallery});
                          }}
                        >
                          Удалить
                        </button>
                      </div>
                      
                      <div className="form-group">
                        <label>Выберите файл:</label>
                        <select
                          value={item.mediaId || ''}
                          onChange={(e) => {
                            const currentGallery = Array.isArray(editingData.gallery) ? editingData.gallery : [];
                            const newGallery = [...currentGallery];
                            const selectedMedia = uploadedMedia.find(m => m.id === parseInt(e.target.value));
                            newGallery[index] = { 
                              ...newGallery[index], 
                              mediaId: parseInt(e.target.value),
                              type: selectedMedia?.type || 'image',
                              url: selectedMedia?.url || '',
                              title: selectedMedia?.title || ''
                            };
                            setEditingData({...editingData, gallery: newGallery});
                          }}
                        >
                          <option value="">Выберите файл...</option>
                          {uploadedMedia.map(media => (
                            <option key={media.id} value={media.id}>
                              {media.title} ({media.type})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Название:</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const currentGallery = Array.isArray(editingData.gallery) ? editingData.gallery : [];
                            const newGallery = [...currentGallery];
                            newGallery[index] = { ...newGallery[index], title: e.target.value };
                            setEditingData({...editingData, gallery: newGallery});
                          }}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Описание:</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const currentGallery = Array.isArray(editingData.gallery) ? editingData.gallery : [];
                            const newGallery = [...currentGallery];
                            newGallery[index] = { ...newGallery[index], description: e.target.value };
                            setEditingData({...editingData, gallery: newGallery});
                          }}
                          rows="2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="btn btn-primary" onClick={() => {
                  const newItem = {
                    id: Date.now(),
                    mediaId: null,
                    type: 'image',
                    title: '',
                    description: '',
                    url: ''
                  };
                  const currentGallery = Array.isArray(editingData.gallery) ? editingData.gallery : [];
                  setEditingData({
                    ...editingData,
                    gallery: [...currentGallery, newItem]
                  });
                }}>
                  + Добавить в галерею
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications">
              <h2>Сообщения</h2>
              {notifications.length === 0 ? (
                <p className="no-notifications">Нет уведомлений</p>
              ) : (
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    >
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <div className="notification-message">
                          <div className="message-line">
                            <strong>От:</strong> {notification.message.split('\n')[0].replace('От: ', '')}
                          </div>
                          <div className="message-line">
                            <strong>Сообщение:</strong> {notification.message.split('\n').slice(2).join(' ')}
                          </div>
                        </div>
                        <div className="notification-meta">
                          <span className="timestamp">{notification.timestamp}</span>
                          {notification.email && <span className="email">{notification.email}</span>}
                        </div>
                      </div>
                      <div className="notification-actions">
                        {!notification.read && (
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Прочитано
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="contact-editor">
              <h2>Настройки контактов</h2>
              <button className="btn btn-primary" onClick={() => {
                const newContact = {
                  id: Date.now(),
                  type: 'Новый контакт',
                  value: '',
                  icon: '📞'
                };
                const currentContacts = Array.isArray(editingData.contactInfo) ? editingData.contactInfo : [];
                setEditingData({
                  ...editingData,
                  contactInfo: [...currentContacts, newContact]
                });
              }}>
                + Добавить контакт
              </button>
              
              <div className="contacts-list">
                {(Array.isArray(editingData.contactInfo) ? editingData.contactInfo : []).map((contact, index) => (
                  <div key={contact.id} className="contact-editor-item">
                    <div className="contact-editor-header">
                      <h4>Контакт #{index + 1}</h4>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const currentContacts = Array.isArray(editingData.contactInfo) ? editingData.contactInfo : [];
                          const newContacts = currentContacts.filter((_, i) => i !== index);
                          setEditingData({...editingData, contactInfo: newContacts});
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                    
                    <div className="form-group">
                      <label>Тип контакта:</label>
                      <input
                        type="text"
                        value={contact.type}
                        onChange={(e) => {
                          const currentContacts = Array.isArray(editingData.contactInfo) ? editingData.contactInfo : [];
                          const newContacts = [...currentContacts];
                          newContacts[index] = { ...newContacts[index], type: e.target.value };
                          setEditingData({...editingData, contactInfo: newContacts});
                        }}
                        placeholder="Например: Email, Telegram, GitHub"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Значение:</label>
                      <input
                        type="text"
                        value={contact.value}
                        onChange={(e) => {
                          const currentContacts = Array.isArray(editingData.contactInfo) ? editingData.contactInfo : [];
                          const newContacts = [...currentContacts];
                          newContacts[index] = { ...newContacts[index], value: e.target.value };
                          setEditingData({...editingData, contactInfo: newContacts});
                        }}
                        placeholder="Например: syharik3316@example.com"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Иконка:</label>
                      <input
                        type="text"
                        value={contact.icon}
                        onChange={(e) => {
                          const currentContacts = Array.isArray(editingData.contactInfo) ? editingData.contactInfo : [];
                          const newContacts = [...currentContacts];
                          newContacts[index] = { ...newContacts[index], icon: e.target.value };
                          setEditingData({...editingData, contactInfo: newContacts});
                        }}
                        placeholder="Например: 📧, 💬, 🐙"
                      />
                    </div>
                  </div>
                )) || []}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="notes-editor">
              <h2>Заметки</h2>
              <button className="btn btn-primary" onClick={addNote}>
                + Добавить заметку
              </button>
              
              <div className="notes-list">
                {notes.map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <input
                        type="text"
                        value={note.title}
                        onChange={(e) => updateNote(note.id, 'title', e.target.value)}
                        className="note-title-input"
                      />
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteNote(note.id)}
                      >
                        Удалить
                      </button>
                    </div>
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, 'content', e.target.value)}
                      placeholder="Содержимое заметки..."
                      rows="6"
                      className="note-content"
                    />
                    <div className="note-meta">
                      <span>Создано: {note.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="backups-editor">
              <h2>Управление бекапами</h2>
              <div className="backup-actions">
                <button className="btn btn-primary" onClick={createBackup}>
                  💾 Создать бекап
                </button>
                <p className="backup-info">
                  Максимум 3 бекапа. Бекапы не удаляются при полном сбросе сайта.
                </p>
              </div>
              
              <div className="backups-list">
                {backups.length === 0 ? (
                  <p className="no-backups">Нет сохраненных бекапов</p>
                ) : (
                  backups.map(backup => (
                    <div key={backup.id} className="backup-item">
                      <div className="backup-info">
                        <h4>{backup.name}</h4>
                        <p>Создан: {backup.createdAt}</p>
                      </div>
                      <div className="backup-actions">
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => loadBackup(backup)}
                        >
                          Загрузить
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteBackup(backup.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-editor">
              <h2>Настройки сайта</h2>
              
              <div className="settings-section">
                <h3>Основные настройки</h3>
                <div className="form-group">
                  <label>Название сайта:</label>
                  <input
                    type="text"
                    value={editingData.siteSettings?.siteName || ''}
                    onChange={(e) => {
                      setEditingData({
                        ...editingData,
                        siteSettings: {
                          ...editingData.siteSettings,
                          siteName: e.target.value
                        }
                      });
                    }}
                    placeholder="syharik3316"
                  />
                </div>
                
                <div className="form-group">
                  <label>Фон сайта (URL изображения):</label>
                  <input
                    type="url"
                    value={editingData.backgroundImage || ''}
                    onChange={(e) => {
                      setEditingData({
                        ...editingData,
                        backgroundImage: e.target.value
                      });
                    }}
                    placeholder="https://example.com/background.jpg"
                  />
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Настройки меню</h3>
                <div className="form-group">
                  <label>Главная:</label>
                  <input
                    type="text"
                    value={editingData.siteSettings?.menuItems?.home || ''}
                    onChange={(e) => {
                      setEditingData({
                        ...editingData,
                        siteSettings: {
                          ...editingData.siteSettings,
                          menuItems: {
                            ...editingData.siteSettings?.menuItems,
                            home: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder="Главная"
                  />
                </div>
                
                <div className="form-group">
                  <label>О себе:</label>
                  <input
                    type="text"
                    value={editingData.siteSettings?.menuItems?.about || ''}
                    onChange={(e) => {
                      setEditingData({
                        ...editingData,
                        siteSettings: {
                          ...editingData.siteSettings,
                          menuItems: {
                            ...editingData.siteSettings?.menuItems,
                            about: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder="О себе"
                  />
                </div>
                
                <div className="form-group">
                  <label>Проекты:</label>
                  <input
                    type="text"
                    value={editingData.siteSettings?.menuItems?.projects || ''}
                    onChange={(e) => {
                      setEditingData({
                        ...editingData,
                        siteSettings: {
                          ...editingData.siteSettings,
                          menuItems: {
                            ...editingData.siteSettings?.menuItems,
                            projects: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder="Проекты"
                  />
                </div>
                
                <div className="form-group">
                  <label>Галерея:</label>
                  <input
                    type="text"
                    value={editingData.siteSettings?.menuItems?.gallery || ''}
                    onChange={(e) => {
                      setEditingData({
                        ...editingData,
                        siteSettings: {
                          ...editingData.siteSettings,
                          menuItems: {
                            ...editingData.siteSettings?.menuItems,
                            gallery: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder="Галерея"
                  />
                </div>
                
                <div className="form-group">
                  <label>Контакты:</label>
                  <input
                    type="text"
                    value={editingData.siteSettings?.menuItems?.contact || ''}
                    onChange={(e) => {
                      setEditingData({
                        ...editingData,
                        siteSettings: {
                          ...editingData.siteSettings,
                          menuItems: {
                            ...editingData.siteSettings?.menuItems,
                            contact: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder="Контакты"
                  />
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Управление хранилищем</h3>
                <div className="storage-info">
                  <p>Размер данных в localStorage: <strong>{Math.round(getStorageSize() / 1024)} KB</strong></p>
                  <p>Загруженных медиа-файлов: <strong>{uploadedMedia.length}</strong></p>
                  <div className="storage-actions">
                    <button 
                      className="btn btn-warning"
                      onClick={() => {
                        if (window.confirm('Очистить все загруженные медиа-файлы? Это действие нельзя отменить.')) {
                          localStorage.removeItem('uploaded_media');
                          loadUploadedMedia();
                          alert('Медиа-файлы очищены!');
                        }
                      }}
                    >
                      🗑️ Очистить медиа-файлы
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно полного сброса */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ Полный сброс сайта</h3>
            <p>Это действие полностью сбросит весь сайт. Все данные будут удалены!</p>
            <p>Бекапы останутся нетронутыми.</p>
            <div className="form-group">
              <label>Введите пароль для подтверждения:</label>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="admin123"
              />
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-danger"
                onClick={handleFullReset}
              >
                Подтвердить сброс
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowResetModal(false);
                  setResetPassword('');
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для просмотра медиа */}
      {showMediaModal && selectedMedia && (
        <div className="modal-overlay media-modal-overlay" onClick={closeMediaModal}>
          <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="media-modal-header">
              <h3>{selectedMedia.title}</h3>
              <button className="close-btn" onClick={closeMediaModal}>✕</button>
            </div>
            <div className="media-modal-body">
              {selectedMedia.type === 'image' ? (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.title}
                  className="full-size-media"
                />
              ) : (
                <video 
                  src={selectedMedia.url} 
                  controls 
                  className="full-size-media"
                  autoPlay
                >
                  Ваш браузер не поддерживает видео.
                </video>
              )}
            </div>
            <div className="media-modal-footer">
              <div className="media-details">
                <p><strong>Тип:</strong> {selectedMedia.type}</p>
                <p><strong>Размер файла:</strong> {(selectedMedia.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Загружен:</strong> {new Date(selectedMedia.uploadDate).toLocaleString()}</p>
              </div>
              <div className="media-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    const newTitle = prompt('Введите новое название:', selectedMedia.title);
                    if (newTitle && newTitle !== selectedMedia.title) {
                      handleUpdateMedia(selectedMedia.id, { title: newTitle });
                      setSelectedMedia({...selectedMedia, title: newTitle});
                    }
                  }}
                >
                  ✏️ Редактировать название
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    if (window.confirm('Удалить этот файл?')) {
                      handleDeleteMedia(selectedMedia.id);
                      closeMediaModal();
                    }
                  }}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Removed() { return null; }
