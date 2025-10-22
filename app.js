const scrollArea = document.getElementById('scrollArea');
const navButtons = document.querySelectorAll('.bottom-nav button');

/* Профиль пользователя.
   Данные будут перезаписаны из Telegram или localStorage */
let profile = {
  username: null,
  photo_url: null,
  wallet: '—'
};

// Пытаемся считать сохранённые данные профиля из localStorage
const saved = JSON.parse(localStorage.getItem('nuvateProfile'));
if (saved) {
  profile = { ...profile, ...saved };
}

// Пытаемся получить данные из Telegram WebApp
try {
  const tg = window.Telegram.WebApp;
  tg.expand();
  const user = tg.initDataUnsafe?.user;
  if (user) {
    profile.username = user.username
      ? '@' + user.username
      : `${user.first_name || ''} ${user.last_name || ''}`.trim();
    profile.photo_url = user.photo_url || profile.photo_url;
    localStorage.setItem('nuvateProfile', JSON.stringify(profile));
  }
} catch (e) {
  console.log('Telegram WebApp недоступен, данные профиля из LocalStorage.');
}

// === Функции для отображения страниц ===
function showHome() {
  scrollArea.innerHTML = `
    <header>
      <h1 class="logo">Nuvate</h1>
      <div class="banner-scroll">
        <div class="banner-card"></div>
        <div class="banner-card"></div>
        <div class="banner-card"></div>
      </div>
    </header>
    <main>
      <h2>Коллекции стикеров</h2>
      <div class="grid">
        <div class="sticker"></div>
        <div class="sticker"></div>
        <div class="sticker"></div>
        <div class="sticker"></div>
      </div>
    </main>
  `;
}

function showCollections() {
  scrollArea.innerHTML = `
    <h2>Каталог коллекций</h2>
    <div class="grid">
      <div class="sticker"></div>
      <div class="sticker"></div>
      <div class="sticker"></div>
      <div class="sticker"></div>
    </div>
  `;
}

function showProfile() {
  const name = profile.username || '<span style="opacity:0.5">(без имени)</span>';
  const avatarURL = profile.photo_url || 'https://i.postimg.cc/pV4fxpZk/avatar.jpg';
  scrollArea.innerHTML = `
    <div class="profile">
      <img src="${avatarURL}" class="avatar" alt="Аватар">
      <div class="nickname">${name}</div>
      <div class="wallet">${profile.wallet}</div>
      <h2 class="section-title">Ваши коллекции</h2>
      <div class="grid">
        <div class="sticker"></div>
        <div class.sticker"></div>
        <div class="sticker"></div>
        <div class="sticker"></div>
      </div>
    </div>
  `;
}

// === Обработчики переключения вкладок ===
navButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (index === 0) showHome();
    if (index === 1) showCollections();
    if (index === 2) showProfile();
  });
});

// Отображаем главную по умолчанию
showHome();
