import React, { useState, useEffect } from 'react';
import './App.css';

// Компонент навигации
const Navigation = ({ currentPage, setCurrentPage, siteData }) => {
  const menuItems = [
    { id: 'home', label: siteData.siteSettings?.menuItems?.home || 'Главная', icon: '🏠' },
    { id: 'about', label: siteData.siteSettings?.menuItems?.about || 'О себе', icon: '👤' },
    { id: 'projects', label: siteData.siteSettings?.menuItems?.projects || 'Проекты', icon: '💼' },
    { id: 'gallery', label: siteData.siteSettings?.menuItems?.gallery || 'Галерея', icon: '🖼️' },
    { id: 'contact', label: siteData.siteSettings?.menuItems?.contact || 'Контакты', icon: '📧' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="logo">
          <button 
            className="logo-button"
            onClick={() => setCurrentPage('home')}
            title="Перейти на главную"
          >
            <span className="logo-text">{siteData.siteSettings?.siteName || 'Устаревший сайт!!!'}</span>
          </button>
        </div>
        <ul className="nav-menu">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Компонент главной страницы
const HomePage = ({ setCurrentPage, siteData }) => {
  return (
    <div className="page home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Привет, я</span>
              <span className="title-line highlight">{siteData.name}</span>
            </h1>
            <p className="hero-subtitle">
              {siteData.description}
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => setCurrentPage('projects')}
              >
                Мои проекты
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentPage('contact')}
              >
                Связаться
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="profile-card">
              <div 
                className="profile-avatar clickable-avatar"
                onClick={() => setCurrentPage('about')}
                title="Нажми, чтобы узнать больше обо мне"
              >
                {siteData.avatarImage ? (
                  <img 
                    src={siteData.avatarImage} 
                    alt="Аватар"
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">👨‍💻</div>
                )}
              </div>
              <div className="profile-info">
                <h3>{siteData.name}</h3>
                <p>{siteData.title}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Дополнительные секции */}
        <div className="home-sections">
          <div className="section">
            <h3>Мои навыки</h3>
            <div className="skills-preview">
              {siteData.skills?.slice(0, 6).map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          
          <div className="section">
            <h3>Последние проекты</h3>
            <div className="projects-preview">
              {siteData.projects?.slice(0, 4).map((project, index) => (
                <div
                  key={index}
                  className="project-card-mini"
                  onClick={() => project.url && window.open(project.url, '_blank')}
                  style={{ cursor: project.url ? 'pointer' : 'default' }}
                >
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="section">
            <h3>Статистика</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{siteData.projects?.length || 0}</div>
                <div className="stat-label">Проектов</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{siteData.skills?.length || 0}</div>
                <div className="stat-label">Навыков</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1+</div>
                <div className="stat-label">Года опыта</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">6</div>
                <div className="stat-label">Хакатонов посетил</div>
              </div>
                <div className="stat-item">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Часов в доте</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">люблю</div>
                  <div className="stat-label">сухарики</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент страницы галереи с альбомами
const GalleryPage = ({ galleryData, onItemClick }) => {
  const [activeAlbum, setActiveAlbum] = useState('Все');
  const albums = galleryData?.albums || [];
  const allItems = albums.flatMap(a => a.items);
  const visibleItems = activeAlbum === 'Все' ? allItems : (albums.find(a => a.name === activeAlbum)?.items || []);

  return (
    <div className="page gallery-page">
      <div className="page-content">
        <h2 className="page-title">Галерея</h2>
        <div className="gallery-content">
          <div className="albums-tabs" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Все', ...albums.map(a => a.name)].map(name => (
              <button
                key={name}
                className={`btn ${activeAlbum === name ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveAlbum(name)}
              >
                {name}
              </button>
            ))}
          </div>

          {visibleItems && visibleItems.length > 0 ? (
            <div className="gallery-grid">
              {visibleItems.map((item, index) => (
                <div
                  key={`${item.url}-${index}`}
                  className="gallery-item clickable-gallery-item"
                  onClick={() => onItemClick(item)}
                  title="Нажмите для просмотра в полном размере"
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.title || `Изображение ${index + 1}`}
                      className="gallery-image"
                    />
                  ) : item.type === 'video' ? (
                    <div className="gallery-video-thumb">
                      <video
                        src={item.url}
                        playsInline
                        preload="metadata"
                        muted
                        className="gallery-video"
                      />
                      <div className="play-badge">▶</div>
                    </div>
                  ) : item.type === 'audio' ? (
                    <div className="audio-tile">
                      <div className="audio-icon">🎵</div>
                      <div className="audio-title">
                        {item.title?.replace(/\.[^.]+$/, '') || item.filename?.replace(/\.[^.]+$/, '') || `Аудио ${index + 1}`}
                      </div>
                      <div className="audio-sub">Нажмите, чтобы открыть</div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-gallery">
              <div className="empty-icon">🖼️</div>
              <h3>Нет медиа</h3>
              <p>Если данный раздел пуст, и вы это видите, сообщите мне!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент страницы "О себе"
const AboutPage = ({ siteData }) => {
  return (
    <div className="page about-page">
      <div className="page-content">
        <h2 className="page-title">О себе</h2>
        <div className="about-content">
          <div className="about-text">
            {siteData.aboutText?.map((paragraph, index) => (
              paragraph && <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="skills-section">
            <h3>Навыки</h3>
            <div className="skills-grid">
              {siteData.skills?.map((skill, index) => (
                <div key={index} className="skill-item">{skill}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент страницы проектов
const ProjectsPage = ({ siteData }) => {
  const projects = siteData.projects;

  const handleProjectClick = (project) => {
    if (project.hasLink && project.url) {
      window.open(project.url, '_blank');
    }
  };

  return (
    <div className="page projects-page">
      <div className="page-content">
        <h2 className="page-title">Мои проекты</h2>
        <div className="projects-grid">
          {projects.map(project => (
            <div 
              key={project.id} 
              className={`project-card ${project.hasLink ? 'clickable-project' : ''}`}
              onClick={() => handleProjectClick(project)}
              style={{ cursor: project.hasLink ? 'pointer' : 'default' }}
            >
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <span className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              {project.hasLink && (
                <div className="project-link-hint">
                  <span className="link-icon">🔗</span>
                  <span>Нажми, чтобы открыть проект</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Компонент страницы контактов
const ContactPage = ({ siteData }) => {
  const buildContactHref = (type, value) => {
    const v = String(value || '').trim();
    const lowerType = String(type || '').toLowerCase();
    if (lowerType.includes('email')) return `mailto:${v}`;
    if (lowerType.includes('telegram')) {
      const handle = v.startsWith('@') ? v.slice(1) : v.replace(/^https?:\/\/t\.me\//i, '');
      return `https://t.me/${handle}`;
    }
    if (lowerType.includes('github')) {
      return v.startsWith('http') ? v : `https://${v}`;
    }
    if (lowerType.includes('вконтакте') || lowerType.includes('vk')) {
      return v.startsWith('http') ? v : `https://${v}`;
    }
    if (lowerType.includes('steam')) {
      return v.startsWith('http') ? v : `https://${v}`;
    }
    return v.startsWith('http') ? v : `https://${v}`;
  };
  return (
    <div className="page contact-page">
      <div className="page-content">
        <h2 className="page-title">Связь со мной</h2>
        <div className="contact-content">
          <div className="contact-info">
            {(Array.isArray(siteData.contactInfo) ? siteData.contactInfo : []).map((contact, index) => (
              <div key={contact.id || index} className="contact-item">
                <div className="contact-icon">{contact.icon}</div>
                <div className="contact-details">
                  <h4>{contact.type}</h4>
                  <a
                    href={buildContactHref(contact.type, contact.value)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {contact.value}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Главный компонент приложения
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [galleryData, setGalleryData] = useState({ albums: [] });
  
  // Данные сайта
  const [siteData, setSiteData] = useState({
    name: 'syharik3316',
    title: 'Системный администратор',
    description: 'Сис админ, увлечённый всякими питонами и нейронками',
    aboutText: [
      'Устаревший сайт!!! Информация не обновляется.',
      'Привет! Моё настоящее имя - Данил. Проживаю в городе Ростов-на-Дону.',
      'В настоящее время работаю на должности системного администратора.',
      'Не смотря на мою специальность, я увлекаюсь программированием и часто участвую на хакатонах или форумах.',
      'Участвовал в таких хакатонах как: Хакатон Осень 2024, Весна 2025, Осень 2025. Hakaton DDOS-Guard, Human Hack Pro 2025 и Хакатон при РИНХ',
      'В данный момент учусь в РКСИ на втором курсе.',
      '',
     'По жизни люблю новые знакомства, любимый цвет - фиолетовый и красный',
     'Аниме не смотрю. Но единственное любимое есть. Это Girls und Panzer',
     'Любимый исполнитель - pyrokinesis.',
      'К сожалению сейчас имею мало свободного времени в связи с учёбой и работой одновременно D:'
    ],
    skills: ['Python', 'Node.js', 'HTML/CSS', 'Docker', 'Dota 2', 'DeepSeek'],
    contactInfo: [
      { id: 1, type: 'Email', value: 'syharik3316@mail.ru', icon: '📧' },
      { id: 2, type: 'Telegram', value: '@syharik3316', icon: '💬' },
      { id: 3, type: 'GitHub', value: 'github.com/syharik3316', icon: '🐙' },
      { id: 4, type: 'Вконтакте', value: 'vk.com/syharik3316', icon: '💬' },
      { id: 5, type: 'Steam', value: 'steamcommunity.com/id/Syharik3316', icon: '🎮' }
    ],
    projects: [
      {
        id: 1,
        title: "SyharikFW V2.0",
        description: "Приложение firewall для Linux",
        tech: ["JS", "C", "HTML", "CSS"],
        status: "Завершен",
        url: "https://github.com/Syharik3316/SyharikFW-V2.0",
        hasLink: true
      },
      {
        id: 2,
        title: "SyharikDP V2.0",
        description: "Автоматическое подключение к ОС. Улучшенная версия",
        tech: ["C++"],
        status: "Завершен",
        url: "https://github.com/Syharik3316/SyharikDP_V2.0",
        hasLink: true
      },
      {
        id: 3,
        title: "SyharikHost",
        description: "Хостинг для ваших файлов",
        tech: ["PHP", "JS", "CSS", "HTML"],
        status: "Завершен",
        url: "https://syharikhost.ru",
        hasLink: true
      },
      {
        id: 4,
        title: "SyharikCheck",
        description: "Проверка интернет ресурсов на доступость",
        tech: ["Go", "React", "Redis", "PostgreSQL", "Docker", "C++"],
        status: "В разработке",
        url: "https://github.com/Syharik3316/SyharikCheck",
        hasLink: true
      },
      {
        id: 5,
        title: "SyharikDP",
        description: "Автоматическое подключение к ОС",
        tech: ["Python", "tkinter"],
        status: "Завершен",
        url: "https://github.com/Syharik3316/Desktop2Proxy",
        hasLink: true
      },
      {
        id: 6,
        title: "SyharikBot",
        description: "Удобное управление вашим личным VDS с помощью Telegram-бота",
        tech: ["Python"],
        status: "Завершен",
        url: "https://github.com/Syharik3316/syharikbot",
        hasLink: true
      }
    ],
    avatarImage: 'https://syharikhost.ru/download.php?token=222a6100-0af3-4cc1-be53-e434e19395ee',
    gallery: [],
    backgroundImage: 'https://syharikhost.ru/download.php?token=d9157236-6211-47f6-87e2-233044e880f9',
    siteSettings: {
      siteName: 'Syharik3316',
      menuItems: {
        home: 'Главная',
        about: 'О себе',
        projects: 'Проекты',
        gallery: 'Галерея',
        contact: 'Контакты'
      }
    }
  });

  // Загружаем галерею из статичного файла (без собственного API)
  useEffect(() => {
    const load = async () => {
      try {
        // 1) Пытаемся получить динамический список через PHP (обновляется при каждом запросе)
        try {
          const resPhp = await fetch('gallery.php', { cache: 'no-store' });
          if (resPhp.ok) {
            const dataPhp = await resPhp.json();
            setGalleryData(dataPhp);
            return;
          }
        } catch (_) {}

        // 2) Фолбэк на статичный список, сгенерированный при сборке
        try {
          const res = await fetch('gallery.json', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            setGalleryData(data);
          }
        } catch (_) {}
      } catch (e) {
        // тихо падаем — просто пустая галерея
      }
    };
    load();
  }, []);

  // Обработка отправки сообщений
  const handleSubmitMessage = (messageData) => {
    console.log('Новое сообщение:', messageData);
  };

  // Функции для работы с модальным окном галереи
  const openGalleryModal = (item) => {
    setSelectedGalleryItem(item);
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setSelectedGalleryItem(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} siteData={siteData} />;
      case 'about':
        return <AboutPage siteData={siteData} />;
      case 'projects':
        return <ProjectsPage siteData={siteData} />;
      case 'gallery':
        return <GalleryPage galleryData={galleryData} onItemClick={openGalleryModal} />;
      case 'contact':
        return <ContactPage siteData={siteData} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} siteData={siteData} />;
    }
  };

  return (
    <div 
      className="App" 
      style={{
        backgroundImage: siteData.backgroundImage ? `url(${siteData.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        siteData={siteData}
      />
      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div>
            © {new Date().getFullYear()} {siteData.siteSettings?.siteName || 'syharik3316'}. Все права защищены.
            <p class="footer-email">e-mail: <a href="mailto:admin@syharik.ru" class="email-link">admin@syharik.ru</a></p>
          </div>
        </div>
      </footer>

      {/* Модальное окно для просмотра галереи */}
      {showGalleryModal && selectedGalleryItem && (
        <div className="modal-overlay gallery-modal-overlay" onClick={closeGalleryModal}>
          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-modal-header">
              <h3>{selectedGalleryItem.title || 'Медиа'}</h3>
              <button className="close-btn" onClick={closeGalleryModal}>✕</button>
            </div>
            <div className={`gallery-modal-body ${selectedGalleryItem.type === 'audio' ? 'audio-modal' : ''}`}>
              {selectedGalleryItem.type === 'image' ? (
                <img 
                  src={selectedGalleryItem.url} 
                  alt={selectedGalleryItem.title || 'Изображение'}
                  className="full-size-gallery-media"
                />
              ) : selectedGalleryItem.type === 'video' ? (
                <video 
                  src={selectedGalleryItem.url} 
                  controls 
                  playsInline
                  preload="metadata"
                  className="full-size-gallery-media"
                >
                  Ваш браузер не поддерживает видео.
                </video>
              ) : selectedGalleryItem.type === 'audio' ? (
                <div style={{ width: '100%', maxWidth: 600 }}>
                  <div style={{ textAlign: 'center', marginBottom: 12, fontWeight: 600 }}>
                    {selectedGalleryItem.title?.replace(/\.[^.]+$/, '') || selectedGalleryItem.filename?.replace(/\.[^.]+$/, '') || 'Аудио'}
                  </div>
                  <audio 
                    src={selectedGalleryItem.url}
                    controls
                    preload="metadata"
                    style={{ width: '100%' }}
                  />
                </div>
              ) : null}
            </div>
            {selectedGalleryItem.description && (
              <div className="gallery-modal-footer">
                <p>{selectedGalleryItem.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
