/* ========== 1. 헤더 ========== */
const header      = document.querySelector('.header');
const menuItems   = document.querySelectorAll('.menu-item');
const searchPanel = document.querySelector('.search-panel');
const searchInput = searchPanel.querySelector('input');

function updateHeader() {
  const somethingOpen = document.querySelector('.menu-item.open') || searchPanel.classList.contains('open')
                     || document.querySelector('.allmenu.open');
  header.classList.toggle('solid', !!somethingOpen || window.scrollY > 80);
}

function closeSubs() {
  menuItems.forEach(function (item) { item.classList.remove('open'); });
}

menuItems.forEach(function (item) {
  function open() {
    closeSubs();
    item.classList.add('open');
    updateHeader();
  }
  item.addEventListener('mouseenter', open);
  item.addEventListener('focusin', open);

  item.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      closeSubs();
      updateHeader();
    });
  });
});
header.addEventListener('mouseleave', function () { closeSubs(); updateHeader(); });

function toggleSearch(on) {
  searchPanel.classList.toggle('open', on);
  if (on) {
    toggleAllmenu(false);
    setTimeout(function () { searchInput.focus(); }, 0);
  }
  updateHeader();
}
document.querySelector('.search-open').addEventListener('click', function () {
  toggleSearch(!searchPanel.classList.contains('open'));
});
document.querySelector('.search-close').addEventListener('click', function () { toggleSearch(false); });

searchPanel.querySelectorAll('.keywords button').forEach(function (btn) {
  btn.addEventListener('click', function () {
    searchInput.value = btn.textContent.replace('#', '');
    searchInput.focus();
  });
});

const allmenu    = document.querySelector('.allmenu');
const allmenuBtn = document.querySelector('.allmenu-open');
menuItems.forEach(function (item) {
  const col = document.createElement('div');
  col.className = 'allmenu-col';
  col.innerHTML = '<a href="#" class="allmenu-title">' + item.querySelector('.menu-link').textContent + '</a>'
                + item.querySelector('.sub').outerHTML.replace('class="sub"', 'class="allmenu-list"');
  allmenu.querySelector('.allmenu-inner').appendChild(col);

  col.querySelector('.allmenu-title').addEventListener('click', function (e) {
    if (window.innerWidth > 767) return;
    e.preventDefault();
    const willOpen = !col.classList.contains('open');
    allmenu.querySelectorAll('.allmenu-col').forEach(function (c) { c.classList.remove('open'); });
    col.classList.toggle('open', willOpen);
  });
});
const allmenuDim = document.querySelector('.allmenu-dim');
function toggleAllmenu(on) {
  allmenu.classList.toggle('open', on);
  allmenuDim.classList.toggle('open', on);
  allmenuBtn.setAttribute('aria-expanded', on);
  document.body.classList.toggle('menu-open', on && window.innerWidth <= 767);
  if (on) searchPanel.classList.remove('open');
  updateHeader();
}
allmenuBtn.addEventListener('click', function () {
  toggleAllmenu(!allmenu.classList.contains('open'));
});
document.querySelector('.allmenu-close').addEventListener('click', function () { toggleAllmenu(false); });
allmenuDim.addEventListener('click', function () { toggleAllmenu(false); });
window.matchMedia('(min-width: 1200px)').addEventListener('change', function (e) {
  if (e.matches) toggleAllmenu(false);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') { closeSubs(); toggleSearch(false); toggleAllmenu(false); }
});

const topBtn = document.querySelector('.top-btn');
let lastY = window.scrollY;
window.addEventListener('scroll', function () {
  updateHeader();

  const y = window.scrollY;
  const isMobile = window.innerWidth <= 767;
  const panelOpen = searchPanel.classList.contains('open') || allmenu.classList.contains('open');
  const scrollingDown = y > lastY;
  header.classList.toggle('hidden', isMobile && !panelOpen && scrollingDown && y > 70);
  topBtn.classList.toggle('show', y > 400 && (!isMobile || !scrollingDown));
  lastY = y;

}, { passive: true });
updateHeader();

topBtn.addEventListener('click', function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealItems = document.querySelectorAll('.event .inner, .support .inner, .space .inner, .news .inner, .sns .inner');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('shown');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(function (el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}


/* ========== 2. 메인 비주얼 ========== */
const slides   = document.querySelectorAll('.slide');
const bar      = document.querySelector('.progress span');
const pauseBtn = document.querySelector('.pause');
const TIME     = 7000;

let current = 0;
let passed  = 0;
let paused  = false;

function showSlide(n) {
  slides.forEach(function (s) { s.classList.remove('before'); });
  slides[current].classList.add('before');
  slides[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  passed = 0;
  bar.style.width = '0%';
}

const hero = document.querySelector('.hero');
let heroVisible = true;
new IntersectionObserver(function (entries) {
  heroVisible = entries[0].isIntersecting;
}).observe(hero);

setInterval(function () {
  if (paused || !heroVisible || document.hidden) return;
  passed += 50;
  bar.style.width = (passed / TIME * 100) + '%';
  if (passed >= TIME) showSlide(current + 1);
}, 50);

document.querySelector('.prev').addEventListener('click', function () { showSlide(current - 1); });
document.querySelector('.next').addEventListener('click', function () { showSlide(current + 1); });

pauseBtn.addEventListener('click', function () {
  paused = !paused;
  pauseBtn.classList.toggle('paused', paused);
});

let heroStartX = null;
hero.addEventListener('pointerdown', function (e) {
  if (e.target.closest('a, button')) return;
  heroStartX = e.clientX;
});
hero.addEventListener('pointerup', function (e) {
  if (heroStartX === null) return;
  const move = e.clientX - heroStartX;
  heroStartX = null;
  if (move < -50) showSlide(current + 1);
  if (move > 50)  showSlide(current - 1);
});
hero.addEventListener('pointercancel', function () { heroStartX = null; });

requestAnimationFrame(function () {
  requestAnimationFrame(function () { hero.classList.add('ready'); });
});


/* ========== 3. 문화행사 ========== */
// 행사 목록
const events = [
  {
    filter: '공연',
    category: '공연', status: '오늘 종료', statusColor: 'pink',
    title: '제29회 원주민족예술제',
    info: ['일시 : 2026. 10. 02.(금) 17:00~19:00', '장소 : 치악예술관 공연장'],
    reserve: false,
    poster: 'images/event-1.jpg'
  },
  {
    filter: '공연',
    category: '공연', status: '오늘 종료', statusColor: 'pink',
    title: '연극 인생배달부',
    info: ['예매기간 : 2026. 09. 28 ~ 2026. 10. 02', '일시 : 2026. 10. 02.(금) 19:30', '장소 : 원주문화원'],
    reserve: true,
    poster: 'images/event-2.jpg'
  },
  {
    filter: '전시',
    category: '전시', status: '진행 예정', statusColor: 'purple',
    title: '윤기원 개인전',
    info: ['기간 : 2026. 10. 03.(토) ~ 2026. 10. 10.(토)', '시간 : 11:00 - 17:00', '장소 : 후 미술관'],
    reserve: false,
    poster: 'images/event-3.jpg'
  },
  {
    filter: '',
    category: '공연', status: '진행 예정', statusColor: 'purple',
    title: '권호빈 피아노 리사이틀:<br>멈춰진 시간, 생동하는 축제',
    info: ['일시 : 2026. 10. 05.(월) 15:00', '장소 : 백운아트홀'],
    reserve: false,
    poster: 'images/event-4.jpg'
  },
  {
    filter: '교육·체험',
    category: '교육·체험', status: '신청 가능', statusColor: 'purple',
    title: '2026년 다색판화로 표현하는<br>전통산수화',
    info: ['신청기간 : 2026. 09. 22 ~ 2026. 10. 05', '교육기간 : 2026. 10. 06. ~ 2026. 10. 27', '장소 : 원주전통문화교육원 수수재'],
    reserve: true,
    poster: 'images/event-5.jpg'
  },
  {
    filter: '전시',
    category: '전시', status: '진행 예정', statusColor: 'purple',
    title: '빛의 잔상 –<br>눈을 감으면 보이는 것들',
    info: ['기간 : 2026. 10. 03.(토) ~ 2026. 10. 10.(토)', '시간 : 11:00 - 17:00', '장소 : 후 미술관'],
    reserve: false,
    poster: 'images/event-6.jpg'
  },
  {
    filter: '',
    category: '공연', status: '신청 가능', statusColor: 'purple',
    title: "배여진 피아노 리사이틀<br>'Portrait of Latin' 라틴의 초상",
    info: ['예매기간 : 2026. 09. 13 ~ 2026. 10. 07', '일시 : 2026. 10. 07.(수) 19:30', '장소 : 치악예술관'],
    reserve: true,
    poster: 'images/event-7.jpg'
  },
  {
    filter: '교육·체험',
    category: '교육·체험', status: '신청 가능', statusColor: 'purple',
    title: '10월 한땀한땀 임산부수강생모집',
    info: ['신청기간 : 2026-09-19 ~ 2026-10-06', '교육기간 : 2026-10-07 ~ 2026-10-28', '장소 : 원주전통문화교육원 담소실'],
    reserve: true,
    poster: 'images/event-8.jpg'
  }
];

const eventBox   = document.querySelector('.event-box');
const eventTop   = document.querySelector('.event-top');
const posterArea = document.querySelector('.event-posters');
const pagerBar   = document.querySelector('.pager-bar');
const filterBtns = document.querySelectorAll('.filter button');

let list = events;
let eventNow = 0;
let posters = [];
let pagerLines = [];
let dragged = false;

function build() {
  posterArea.innerHTML = '';
  pagerBar.innerHTML = '';

  list.forEach(function (ev, i) {
    const div = document.createElement('div');
    div.className = 'poster';
    div.innerHTML = '<img src="' + ev.poster + '" alt="' + ev.title.replace('<br>', ' ') + '" draggable="false" loading="lazy">';
    div.addEventListener('click', function () {
      if (!dragged && i !== eventNow) showEvent(i);
    });
    posterArea.appendChild(div);

    const line = document.createElement('span');
    line.addEventListener('click', function () { showEvent(i); });
    pagerBar.appendChild(line);
  });

  posters = posterArea.querySelectorAll('.poster');
  pagerLines = pagerBar.querySelectorAll('span');

  eventBox.classList.toggle('empty', list.length === 0);
  if (list.length === 0) return;

  eventNow = 0;
  drawText();
  placePosters();
}

function drawText() {
  const ev = list[eventNow];
  let html = '';
  html += '<div class="tags">';
  html += '<span class="tag">' + ev.category + '</span>';
  html += '<span class="tag tag-' + ev.statusColor + '">' + ev.status + '</span>';
  html += '</div>';
  html += '<h3>' + ev.title + '</h3>';
  html += '<ul class="event-info">';
  ev.info.forEach(function (line) { html += '<li>' + line + '</li>'; });
  html += '</ul>';
  html += '<div class="btn-group">';
  html += '<a href="#" class="btn btn-line-dark">자세히 보기</a>';
  if (ev.reserve) html += '<a href="#" class="btn btn-pink">신청·예매</a>';
  html += '</div>';
  eventTop.innerHTML = html;
}

const SPOT = (function () {
  const W = 265, s1 = 0.857, s2 = 0.698, overlap = 32, front = 24;
  const second = front + W - overlap;
  const third  = second + W * s1 - overlap;
  const toX = function (left, s) { return left - W * (1 - s) / 2; };
  return {
    front:  { x: front,            scale: 1 },
    second: { x: toX(second, s1),  scale: s1 },
    third:  { x: toX(third, s2),   scale: s2 },
    out:    { x: front - W * 1.36, scale: s2 }
  };
})();
let dragX = 0;

function placePostersCenter() {
  const count = list.length;
  const A = posterArea.clientWidth;
  const W = posters.length ? posters[0].offsetWidth : 265;
  const GAP = W * 0.78;
  const center = (A - W) / 2;

  posters.forEach(function (p, i) {
    let off = (i - eventNow + count) % count;
    if (off > count / 2) off -= count;

    const near = Math.abs(off) === 1;
    p.style.transform = 'translate(' + (center + off * GAP + dragX) + 'px, -50%) scale(' + (off === 0 ? 1 : 0.82) + ')';
    p.style.opacity = off === 0 ? 1 : near ? 0.5 : 0;
    p.style.zIndex = 10 - Math.abs(off);
    p.style.pointerEvents = (off === 0 || near) ? '' : 'none';
    p.className = 'poster' + (near ? ' clickable' : '');
  });
  pagerLines.forEach(function (line, i) {
    line.classList.toggle('active', i === eventNow);
  });
}

function placePosters() {
  if (window.innerWidth < 1024) { placePostersCenter(); return; }
  const count = list.length;
  posters.forEach(function (p, i) {
    let order = (i - eventNow + count) % count;
    if (order === count - 1 && count > 2) order = -1;

    let spot, opacity = 1, look = '';
    if (order === 0)       { spot = SPOT.front; }
    else if (order === 1)  { spot = SPOT.second; look = 'back-1'; }
    else if (order === 2)  { spot = SPOT.third;  look = 'back-2'; }
    else if (order === -1) {
      spot = SPOT.out; look = 'back-2';
      opacity = dragX > 0 ? Math.min(1, dragX / 200) : 0;
    }
    else { spot = { x: SPOT.third.x + (order - 2) * 140, scale: 0.6 }; opacity = 0; look = 'back-2'; }

    const move = dragX * (order === 0 || order === -1 ? 1 : 0.6);
    p.style.transform = 'translate(' + (spot.x + move) + 'px, -50%) scale(' + spot.scale + ')';
    p.style.opacity = opacity;
    p.style.zIndex = order === 0 ? 4 : order === 1 ? 3 : order === 2 ? 2 : 1;
    p.style.pointerEvents = opacity === 0 ? 'none' : '';
    p.className = 'poster ' + look + (order === 1 || order === 2 ? ' clickable' : '');
  });
  pagerLines.forEach(function (line, i) {
    line.classList.toggle('active', i === eventNow);
  });
}

function showEvent(n) {
  if (list.length < 2) return;
  eventNow = (n + list.length) % list.length;
  placePosters();
  eventTop.classList.add('hide');
  setTimeout(function () {
    drawText();
    eventTop.classList.remove('hide');
  }, 200);
}

filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    const name = btn.textContent.trim();
    if (name === '전체') {
      list = events;
    } else {
      list = events.filter(function (ev) { return ev.filter === name; });
    }
    build();
  });
});

document.querySelector('.event-prev').addEventListener('click', function () { showEvent(eventNow - 1); });
document.querySelector('.event-next').addEventListener('click', function () { showEvent(eventNow + 1); });

let startX = null;
posterArea.addEventListener('pointerdown', function (e) {
  startX = e.clientX;
  dragged = false;
  dragX = 0;
  posterArea.classList.add('grabbing');
});
window.addEventListener('pointermove', function (e) {
  if (startX === null) return;
  dragX = Math.max(-240, Math.min(240, e.clientX - startX));
  if (Math.abs(dragX) > 5) dragged = true;
  placePosters();
});
window.addEventListener('pointerup', function () {
  if (startX === null) return;
  const move = dragX;
  startX = null;
  dragX = 0;
  posterArea.classList.remove('grabbing');
  if (move < -50) showEvent(eventNow + 1);
  else if (move > 50) showEvent(eventNow - 1);
  else placePosters();
  setTimeout(function () { dragged = false; }, 0);
});

window.addEventListener('resize', placePosters);

build();


/* ========== 4. 공간대관 ========== */
// 공간 정보
const spaces = [
  { bg: 'images/space-1.jpg',   // 남산골문화센터
    desc: '과거와 현재, 미래가 공존하는 원주의 복합문화공간',
    address: '원주시 향교길 77 남산골문화센터', rooms: '전시실 · 프로그램실 · 연습실', phone: '033-760-9837' },
  { bg: 'images/space-2.jpg',   // 치악예술관
    desc: '음악·무용·연극·국악을 아우르는 원주 대표 공연장',
    address: '원주시 서원대로 331 치악예술관', rooms: '공연장 · 전시실 · 세미나실', phone: '시설별 상이 (상세 안내 참고)' },
  { bg: 'images/space-3.jpg',   // 댄싱공연장
    desc: '공연과 축제가 펼쳐지는 세계 유일의 마칭 전용 야외공연장',
    address: '원주시 단구로 170', rooms: '댄싱공연장 · 야외소공연장 · 연습실', phone: '033-760-9858' },
  { bg: 'images/space-4.jpg',   // 원주생활문화센터
    desc: '원주시민 누구나 자유롭게 이용할 수 있는 생활문화공간',
    address: '원주시 원일로 139 건강문화센터', rooms: '야외공연장 · 전시실 · 연습실', phone: '033-731-5311~2' },
  { bg: 'images/space-5.jpg',   // 아르코공연연습센터
    desc: '예술단체와 동호회의 연습과 창작을 지원하는 공연예술공간',
    address: '원주시 향교길 77 남산골문화센터 금란관', rooms: '연습실 (대 · 중 · 소)', phone: '033-760-9835' },
  { bg: 'images/space-6.jpg',   // 태장공연장
    desc: '무대와 객석이 가까워 공연의 몰입감을 높이는 원주 북부권 대표 공연장',
    address: '원주시 치악로 2068-6 태장공연장', rooms: '공연장', phone: '033-737-0516' },
  { bg: 'images/space-7.jpg',   // 원주아트갤러리
    desc: '다양한 미술 작품과 일상 속 휴식을 만나는 도심 속 작은 미술관',
    address: '원주시 서원대로 472-24', rooms: '전시실', phone: '033-760-9835' }
];

const spaceTabs = document.querySelectorAll('.space-tab button');
const spaceBg   = document.querySelector('.space-bg');
const spaceTabRow = document.querySelector('.space-tab');

document.querySelector('.space-arrow-left').addEventListener('click', function () {
  spaceTabRow.scrollBy({ left: -200, behavior: 'smooth' });
});
document.querySelector('.space-arrow-right').addEventListener('click', function () {
  spaceTabRow.scrollBy({ left: 200, behavior: 'smooth' });
});

spaces.forEach(function (s, i) {
  const img = document.createElement('img');
  img.src = s.bg;
  img.alt = '';
  img.loading = 'lazy';
  if (i === 0) img.className = 'active';
  spaceBg.appendChild(img);
});
const spaceImgs = spaceBg.querySelectorAll('img');

function selectSpace(n) {
  spaceTabs.forEach(function (t, i) { t.setAttribute('aria-selected', i === n); });
  spaceImgs.forEach(function (img, i) { img.classList.toggle('active', i === n); });

  const tab = spaceTabs[n];
  spaceTabRow.scrollTo({ left: tab.offsetLeft - (spaceTabRow.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });

  const content = document.querySelector('.space-content');
  content.classList.add('hide');
  clearTimeout(content.timer);
  content.timer = setTimeout(function () {
    const s = spaces[n];
    document.querySelector('.space-name').textContent = spaceTabs[n].textContent;
    setText('.space-desc', s.desc);
    setText('.space-address', s.address);
    setText('.space-rooms', s.rooms);
    setText('.space-phone', s.phone);
    content.classList.remove('hide');
  }, 200);
}

function setText(selector, text) {
  const el = document.querySelector(selector);
  (el.querySelector('.text') || el).textContent = text;
}

spaceTabs.forEach(function (tab, i) {
  tab.addEventListener('click', function () { selectSpace(i); });

  tab.addEventListener('keydown', function (e) {
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % spaceTabs.length;
    if (e.key === 'ArrowLeft')  next = (i - 1 + spaceTabs.length) % spaceTabs.length;
    if (next !== null) { selectSpace(next); spaceTabs[next].focus(); }
  });
});


/* ========== 5. 소식공고 ========== */
// 소식 목록
const news = [
  [ // 공지사항
    { title: '재단 직원 사칭 사기피해 주의', date: '2026.04.06', important: true },
    { title: '2026 원주만두축제 푸드부스 선정 공고', date: '2026.09.10' },
    { title: '2026 원주 댄싱카니발 프레스 발급 공고', date: '2026.09.03' },
    { title: '2026 원주만두축제 제2회 웰만두 경연대회 수상자 공고', date: '2026.08.20' },
    { title: '2026 원주댄싱카니발 랜덤플레이댄스곡 공개', date: '2026.08.18' }
  ],
  [ // 외부소식
    { title: '2026 지역관광추진조직(DMO) 육성지원사업 한산한 밤', date: '2026.09.30' },
    { title: '충주 반값여행 참여 안내', date: '2026.09.30' },
    { title: '2026 포천 산정호수 명성산 &lt;억새꽃축제&gt;', date: '2026.09.30' },
    { title: 'SORIRO(소리로) 전국 5개 권역 오픈클래스', date: '2026.09.23' },
    { title: '2026 부안 &lt;해뜰마루 정원축제&gt;', date: '2026.09.22' }
  ],
  [ // 보도자료
    { title: '춤추는 도시, 머무르는 축제 구현', date: '2026.09.21' },
    { title: '2026 원주 댄싱카니발 18일 개막', date: '2026.09.16' },
    { title: '온라인 문화소식 원주문화정보 9월호 발행', date: '2026.09.15' },
    { title: '원주문화재단, ‘2026 놀러와요, 아트 숲’ 성황리에 마무리', date: '2026.09.15' },
    { title: '문화와 예술이 있는 여름 숲으로 초대합니다', date: '2026.09.01' }
  ],
  [ // 채용공고
    { title: '2026년 (재)원주문화재단 신규직원 채용공고', date: '2026.09.03' },
    { title: '2026 원주문화재단 축제 비상임 예술감독 합격자 공고', date: '2026.04.02' },
    { title: '2026 원주문화재단 축제 비상임 예술감독 모집 1차 서류심사 합격자 공고', date: '2026.03.27' },
    { title: '2026년 원주문화재단 기간제근로자 채용 최종합격자 공고', date: '2026.03.24' },
    { title: '2026 원주문화재단 기간제근로자 채용 서류전형 합격자 공고', date: '2026.03.17' }
  ]
];

const newsTabs = document.querySelectorAll('.news-tab button');
const newsBar  = document.querySelector('.news-bar');
const newsList = document.querySelector('.news-list');
let newsNow = 0;

function moveNewsBar() {
  const tab = newsTabs[newsNow];
  newsBar.style.left  = tab.offsetLeft + 'px';
  newsBar.style.width = tab.offsetWidth + 'px';
}

function selectNews(n) {
  newsNow = n;
  newsTabs.forEach(function (t, i) { t.setAttribute('aria-selected', i === n); });
  moveNewsBar();

  if (newsList.children.length === 0) { fillNews(n); return; }
  newsList.classList.add('hide');
  clearTimeout(newsList.timer);
  newsList.timer = setTimeout(function () {
    fillNews(n);
    newsList.classList.remove('hide');
  }, 200);
}

function fillNews(n) {
  const items = news[n];
  let html = '';
  items.forEach(function (item) {
    html += '<li>';
    if (item.important) html += '<span class="important">중요</span>';
    html += '<a href="#">' + item.title + '</a>';
    html += '<span class="date">' + item.date + '</span>';
    html += '</li>';
  });
  newsList.innerHTML = html;
}

newsTabs.forEach(function (tab, i) {
  tab.addEventListener('click', function () { selectNews(i); });

  tab.addEventListener('keydown', function (e) {
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % newsTabs.length;
    if (e.key === 'ArrowLeft')  next = (i - 1 + newsTabs.length) % newsTabs.length;
    if (next !== null) { selectNews(next); newsTabs[next].focus(); }
  });
});

window.addEventListener('resize', moveNewsBar);
document.fonts.ready.then(moveNewsBar);
selectNews(0);


/* ========== 6. 패밀리 사이트 ========== */
const family    = document.querySelector('.family');
const familyBtn = document.querySelector('.family-site');

function toggleFamily(on) {
  family.classList.toggle('open', on);
  familyBtn.setAttribute('aria-expanded', on);
}
familyBtn.addEventListener('click', function () {
  toggleFamily(!family.classList.contains('open'));
});
document.addEventListener('click', function (e) {
  if (!family.contains(e.target)) toggleFamily(false);
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') toggleFamily(false);
});


/* ========== 7. 빈 링크 ========== */
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href="#"]');
  if (link && !link.matches('.top-btn, .logo')) e.preventDefault();
});
