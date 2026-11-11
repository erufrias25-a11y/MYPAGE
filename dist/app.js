import { gallery } from './gallery-data.js?content-20261111';
import { siteConfig } from './site-config.js?content-20261111';

for (const session of gallery.sessions) {
  const details = siteConfig.sessionDetails?.[session.id];
  if (details?.title) session.title = details.title;
  if (details?.description) session.description = details.description;
}

const select = (selector) => document.querySelector(selector);
const photoById = new Map(gallery.photos.map((photo) => [photo.id, photo]));
const sessionById = new Map(gallery.sessions.map((session) => [session.id, session]));
const dialog = select('#lightbox');
let currentPhotos = [];
let currentIndex = 0;
let touchStart;
let lastTrigger;
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
let masonryFrame;
let masonryColumns = 0;
let collectionGridColumns = 0;
let currentCollectionPhotos = [];

function reduceMotion() {
  return motionPreference.matches;
}

function applyMotionPreference() {
  document.documentElement.classList.toggle('motion-reduced', reduceMotion());
  if (reduceMotion()) {
    document.getAnimations().forEach((animation) => animation.cancel());
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
    select('.reveal-scene')?.style.removeProperty('--reveal-x');
    select('.reveal-scene')?.style.removeProperty('--reveal-y');
  } else {
    revealContent(document);
  }
}

function revealContent(container) {
  if (reduceMotion() || !('IntersectionObserver' in window)) return;
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.06 });
  }
  container.querySelectorAll('.section-heading, .photo-card, .about-content').forEach((element, index) => {
    if (element.classList.contains('reveal')) return;
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
    revealObserver.observe(element);
  });
}

function animateCollection() {
  if (reduceMotion()) return;
  select('.collection-heading').animate([
    { opacity: 0, transform: 'translateY(14px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 480, easing: 'cubic-bezier(.2,.65,.3,1)' });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function icon(name) {
  return `<svg class="ui-icon" aria-hidden="true" focusable="false"><use href="assets/icons/lucide.svg#${name}"/></svg>`;
}

function asset(photo, size) {
  return `assets/photos/${photo.id}-${size}.webp`;
}

function sourceSet(photo, sizes) {
  return sizes.map((size) => `${asset(photo, size)} ${Math.round(photo.width * Math.min(1, size / Math.max(photo.width, photo.height)))}w`).join(', ');
}

function photoCard(photo, showCaption = true, linkToSession = false) {
  const session = sessionById.get(photo.session);
  const caption = showCaption && session ? `<div class="photo-caption"><h3>${escapeHtml(session.title)}</h3></div>` : '';
  const imageSizes = '(max-width:700px) calc((100vw - 52px) / 2), (max-width:1050px) calc((100vw - 88px) / 2), (max-width:1440px) calc((100vw - 160px) / 3), 426px';
  const opener = linkToSession
    ? `<a class="photo-image-button" href="sesiones.html#sesion=${session.id}" aria-label="Ver todas las fotos de ${escapeHtml(session.title)}">`
    : `<button class="photo-image-button" data-open="${photo.id}" aria-label="Ampliar: ${escapeHtml(photo.alt)}">`;
  const closer = linkToSession ? '</a>' : '</button>';
  return `<article class="photo-card">${opener}<img src="${asset(photo, 480)}" srcset="${sourceSet(photo, [480, 960, 1920])}" sizes="${imageSizes}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${escapeHtml(photo.alt)}"><span class="image-expand" aria-hidden="true">${icon('arrow-up-right')}</span>${closer}${caption}</article>`;
}

const featuredIds = ['mar-y-cielo-01', 'azul-estudio-01', 'luz-natural-01', 'quince-primaveras-01', 'a-fuego-lento-01', 'primeros-dias-01'];
if (select('#featured-grid')) select('#featured-grid').innerHTML = featuredIds.map((identifier) => photoCard(photoById.get(identifier), true, true)).join('');

function renderCollectionGrid() {
  const grid = select('#collection-grid');
  if (!grid || !currentCollectionPhotos.length) return;
  const width = grid.clientWidth;
  if (!width) return;
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const tablet = !mobile && window.matchMedia('(max-width: 1050px)').matches;
  const count = mobile || tablet ? 2 : 3;
  if (collectionGridColumns === count && grid.children.length) return;
  const gap = mobile ? 14 : tablet ? 18 : 24;
  const columnWidth = (width - gap * (count - 1)) / count;
  const columns = Array.from({ length: count }, () => ({ items: [], height: 0 }));
  currentCollectionPhotos.forEach((photo) => {
    const column = columns.reduce((shortest, current) => current.height < shortest.height ? current : shortest);
    column.items.push(photoCard(photo, false));
    column.height += columnWidth * photo.height / photo.width + gap;
  });
  grid.innerHTML = columns.map((column) => `<div class="collection-column">${column.items.join('')}</div>`).join('');
  collectionGridColumns = count;
}

function renderSessions() {
  const grid = select('#sessions-grid');
  if (!grid) return;
  const additionalIds = ['luz-natural-04', 'mar-y-cielo-03'];
  const remaining = [...gallery.sessions.map((session) => photoById.get(session.cover)), ...additionalIds.map((id) => photoById.get(id))].filter(Boolean);
  const mosaicPhotos = [];
  const firstSessionPhoto = remaining.findIndex((photo) => photo.session === 'sesion-21');
  if (firstSessionPhoto >= 0) {
    const [first] = remaining.splice(firstSessionPhoto, 1);
    mosaicPhotos.push(first);
  }
  let preferLandscape = mosaicPhotos.length ? mosaicPhotos[0].width <= mosaicPhotos[0].height : false;
  while (remaining.length) {
    const index = remaining.findIndex((photo) => preferLandscape === (photo.width > photo.height));
    mosaicPhotos.push(...remaining.splice(index < 0 ? 0 : index, 1));
    preferLandscape = !preferLandscape;
  }
  const width = grid.clientWidth;
  if (!width) return;
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const tablet = !mobile && window.matchMedia('(max-width: 1050px)').matches;
  const count = mobile ? 2 : tablet ? 3 : 4;
  if (masonryColumns === count && grid.children.length) return;
  const gap = mobile ? 8 : tablet ? 10 : 12;
  const columnWidth = (width - gap * (count - 1)) / count;
  const columns = Array.from({ length: count }, () => ({ items: [], height: 0 }));
  const tints = ['blue', 'navy', 'cyan', 'white'];

  mosaicPhotos.forEach((photo, index) => {
    const column = columns.reduce((shortest, current) => current.height < shortest.height ? current : shortest);
    const session = sessionById.get(photo.session);
    const image = `<a class="session-card" data-tint="${tints[index % tints.length]}" data-shape="${photo.width > photo.height ? 'landscape' : 'portrait'}" href="#sesion=${session.id}" aria-label="Ver todas las fotos de ${escapeHtml(session.title)}"><img src="${asset(photo, 480)}" srcset="${sourceSet(photo, [480, 960, 1920])}" sizes="${Math.ceil(columnWidth)}px" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${escapeHtml(photo.alt)}"><span class="session-card__content"><strong class="session-card__title">${escapeHtml(session.title)}</strong><span class="session-card__cta"><span>Ver sesión completa</span><span class="session-card__arrow" aria-hidden="true">${icon('arrow-up-right')}</span></span></span></a>`;
    column.items.push(image);
    column.height += columnWidth * photo.height / photo.width + gap;
  });

  grid.innerHTML = columns.map((column) => `<div class="session-column">${column.items.join('')}</div>`).join('');
  masonryColumns = count;
}

renderSessions();
window.addEventListener('resize', () => {
  cancelAnimationFrame(masonryFrame);
  masonryFrame = requestAnimationFrame(() => {
    renderSessions();
    collectionGridColumns = 0;
    renderCollectionGrid();
  });
});

function renderRoute({ focus = true } = {}) {
  if (!select('#collection-view')) return;
  if (dialog.open) dialog.close();
  const fragment = location.hash.slice(1);
  const params = new URLSearchParams(fragment);
  const session = sessionById.get(params.get('sesion'));
  const collection = Boolean(session);
  select('#session-index-view').hidden = collection;
  select('#collection-view').hidden = !collection;
  const details = siteConfig.sessionDetails?.[session?.id] || {};
  const detailEntries = [['Lugar', details.location], ['Fecha', details.date], ['La historia', details.context]].filter((entry) => entry[1]);
  select('#session-details').hidden = detailEntries.length === 0;
  select('#session-details').innerHTML = detailEntries.map(([label, value]) => `<dt>${label}</dt><dd>${escapeHtml(value)}</dd>`).join('');
  document.title = `${session ? session.title : 'Sesiones'} — ${siteConfig.photographerName || siteConfig.brandName || 'Archivo visual'}`;
  if (collection) {
    select('#collection-category').textContent = session.category;
    select('#collection-title').textContent = session.title;
    select('#collection-description').textContent = session.description;
    const photos = gallery.photos.filter((photo) => photo.session === session.id);
    currentCollectionPhotos = photos;
    collectionGridColumns = 0;
    renderCollectionGrid();
    select('#collection-count').textContent = `${String(photos.length).padStart(2, '0')} FOTOGRAFÍAS / UNA HISTORIA`;
    const position = gallery.sessions.indexOf(session);
    const previous = gallery.sessions[(position - 1 + gallery.sessions.length) % gallery.sessions.length];
    const next = gallery.sessions[(position + 1) % gallery.sessions.length];
    select('#session-pagination').innerHTML = `<a href="#sesion=${previous.id}"><small>${icon('arrow-left')} HISTORIA ANTERIOR</small><span>${escapeHtml(previous.title)}</span></a><a href="#sesion=${next.id}"><small>SIGUIENTE HISTORIA ${icon('arrow-right')}</small><span>${escapeHtml(next.title)}</span></a>`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    revealContent(select('#collection-grid'));
    animateCollection();
    if (focus) select('#collection-title').focus({ preventScroll: true });
    const linkedPhoto = photoById.get(params.get('foto'));
    if (linkedPhoto && linkedPhoto.session === session?.id) openPhoto(linkedPhoto.id);
  } else {
    const anchor = document.getElementById(fragment);
    if (!fragment || fragment === 'inicio') window.scrollTo({ top: 0, behavior: 'instant' });
    else if (anchor) requestAnimationFrame(() => anchor.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
}

function openPhoto(identifier, trigger) {
  const photo = photoById.get(identifier);
  if (!photo) return;
  lastTrigger = trigger || document.activeElement;
  currentPhotos = gallery.photos.filter((entry) => entry.session === photo.session);
  currentIndex = currentPhotos.findIndex((entry) => entry.id === identifier);
  select('#lightbox-title').textContent = sessionById.get(photo.session).title;
  showPhoto();
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
  select('#close-lightbox').focus();
}

function showPhoto() {
  const photo = currentPhotos[currentIndex];
  const image = select('#lightbox-image');
  select('#image-error').hidden = true;
  image.alt = photo.alt;
  image.src = asset(photo, 1920);
  select('#lightbox-position').textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentPhotos.length).padStart(2, '0')}`;
  const next = currentPhotos[(currentIndex + 1) % currentPhotos.length];
  const preload = new Image();
  preload.src = asset(next, 1920);
}

function movePhoto(direction) {
  currentIndex = (currentIndex + direction + currentPhotos.length) % currentPhotos.length;
  showPhoto();
}

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-scroll-top]')) {
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'instant' : 'smooth' });
    return;
  }
  if (event.target.closest('.skip-link')) {
    event.preventDefault();
    select('#main-content').focus();
    select('#main-content').scrollIntoView();
    return;
  }
  const open = event.target.closest('[data-open]');
  if (open) openPhoto(open.dataset.open, open);
});

select('#close-lightbox').addEventListener('click', () => dialog.close());
select('#previous-photo').addEventListener('click', () => movePhoto(-1));
select('#next-photo').addEventListener('click', () => movePhoto(1));
select('#lightbox-image').addEventListener('error', () => { select('#image-error').hidden = false; });
select('#lightbox-image').addEventListener('load', () => {
  if (reduceMotion() || !dialog.open) return;
  select('#lightbox-image').animate([{ opacity: 0, transform: 'scale(1.012)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' });
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  if (lastTrigger?.isConnected && !lastTrigger.closest('[hidden]')) lastTrigger.focus({ preventScroll: true });
});
dialog.addEventListener('click', (event) => {
  if (event.target === dialog || event.target.classList.contains('lightbox-stage')) dialog.close();
});
dialog.addEventListener('keydown', (event) => {
  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowLeft') movePhoto(-1);
  if (event.key === 'ArrowRight') movePhoto(1);
  if (event.key === 'Home') { currentIndex = 0; showPhoto(); }
  if (event.key === 'End') { currentIndex = currentPhotos.length - 1; showPhoto(); }
});
select('#lightbox-image').addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') touchStart = { horizontal: event.clientX, vertical: event.clientY };
});
select('#lightbox-image').addEventListener('pointerup', (event) => {
  if (!touchStart) return;
  const horizontal = event.clientX - touchStart.horizontal;
  const vertical = event.clientY - touchStart.vertical;
  if (Math.abs(horizontal) > 55 && Math.abs(horizontal) > Math.abs(vertical)) movePhoto(horizontal < 0 ? 1 : -1);
  touchStart = undefined;
});
select('#lightbox-image').addEventListener('pointercancel', () => { touchStart = undefined; });
if (siteConfig.photographerName) {
  select('#footer-credit').textContent = `Fotografía de ${siteConfig.photographerName}`;
  select('.wordmark-sub').textContent = siteConfig.photographerName.toUpperCase();
}
if (siteConfig.heroTitle && select('#hero-title')) {
  select('#hero-title').innerHTML = siteConfig.heroTitle.split('\n').map((line) => `<span>${escapeHtml(line)}</span>`).join('');
}
if (siteConfig.heroDescription && select('.hero-description')) select('.hero-description').textContent = siteConfig.heroDescription;
if (siteConfig.aboutHeading && select('#about-title')) select('#about-title').textContent = siteConfig.aboutHeading;
if (siteConfig.biography && select('#about-intro')) {
  select('#about-intro').textContent = siteConfig.biography;
  select('#about-description').hidden = true;
  select('#about-draft').hidden = true;
}
if (Array.isArray(siteConfig.services) && siteConfig.services.length && select('#services-list')) {
  select('#services-list').innerHTML = siteConfig.services.map((service) => `<li>${escapeHtml(service)}</li>`).join('');
  select('#services-list').hidden = false;
}
const draftCredit = select('#draft-credit');
if (draftCredit) draftCredit.hidden = Boolean(siteConfig.biography) && gallery.sessions.every((session) => siteConfig.sessionDetails?.[session.id]?.description);
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.contactEmail) && select('#contact-link')) {
  select('#contact-link').href = `mailto:${siteConfig.contactEmail}`;
  select('#contact-link').hidden = false;
  if (select('#contact-pending')) select('#contact-pending').hidden = true;
}
window.addEventListener('hashchange', () => renderRoute());
renderRoute({ focus: false });
applyMotionPreference();
if (select('.reveal-scene')) {
  const scene = select('.reveal-scene');
  const pairs = [...scene.querySelectorAll('.reveal-scene__pair')];
  const backdropImages = [...document.querySelectorAll('.home-photo-backdrop__image')];
  const revealPhotos = gallery.photos.filter((photo) => photo.width > photo.height && photo.id !== 'sesion-21-06');
  const shuffle = (photos) => {
    const shuffled = [...photos];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
    }
    return shuffled;
  };
  let photoDeck = shuffle(revealPhotos);
  let activePair = 0;
  let changing = false;
  const drawPhoto = (excludeSession = '') => {
    let index = photoDeck.findIndex((photo) => photo.session !== excludeSession);
    if (index < 0) {
      photoDeck = shuffle(revealPhotos.filter((photo) => photo.session !== excludeSession));
      index = 0;
    }
    if (index < 0 || !photoDeck.length) {
      photoDeck = shuffle(revealPhotos);
      index = 0;
    }
    return photoDeck.splice(index, 1)[0];
  };
  const nextPair = () => {
    const base = drawPhoto();
    return [base, drawPhoto(base.session)];
  };
  const setImage = (element, photo) => {
    element.src = asset(photo, 960);
    element.srcset = sourceSet(photo, [480, 960, 1920]);
    element.sizes = '(max-width: 700px) 100vw, min(1040px, 86vw)';
    element.width = photo.width;
    element.height = photo.height;
    element.alt = photo.alt;
  };
  const setPair = (pairElement, photos) => {
    const [base, alternate] = pairElement.querySelectorAll('img');
    setImage(base, photos[0]);
    setImage(alternate, photos[1]);
  };
  const setBackdrop = (image, photo) => {
    image.src = asset(photo, 960);
    image.srcset = sourceSet(photo, [480, 960, 1920]);
    image.sizes = '100vw';
    image.width = photo.width;
    image.height = photo.height;
  };
  const decodePair = (pairElement, backdropImage) => Promise.all(
    [...pairElement.querySelectorAll('img'), backdropImage].map((image) => image.decode().catch(() => undefined)),
  );
  const pairPhotos = [nextPair(), nextPair()];
  pairs.forEach((pair, index) => {
    setPair(pair, pairPhotos[index]);
    setBackdrop(backdropImages[index], pairPhotos[index][0]);
  });

  scene.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || scene.dataset.pinned === 'true') return;
    const rectangle = scene.getBoundingClientRect();
    scene.style.setProperty('--reveal-x', `${event.clientX - rectangle.left}px`);
    scene.style.setProperty('--reveal-y', `${event.clientY - rectangle.top}px`);
    scene.dataset.revealing = 'true';
  });
  scene.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse' || scene.dataset.pinned === 'true') return;
    scene.dataset.revealing = 'false';
  });
  const togglePinnedImage = () => {
    const pinned = scene.dataset.pinned !== 'true';
    scene.dataset.pinned = String(pinned);
    scene.dataset.revealing = String(pinned);
    scene.setAttribute('aria-pressed', String(pinned));
  };
  scene.addEventListener('click', (event) => {
    if (event.detail > 0) togglePinnedImage();
  });
  scene.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePinnedImage();
    }
  });

  window.setInterval(async () => {
    if (document.hidden || reduceMotion() || changing || revealPhotos.length < 2) return;
    changing = true;
    const incomingIndex = 1 - activePair;
    const incoming = pairs[incomingIndex];
    await decodePair(incoming, backdropImages[incomingIndex]);
    if (document.hidden || reduceMotion()) { changing = false; return; }
    incoming.dataset.active = 'true';
    incoming.removeAttribute('aria-hidden');
    backdropImages[incomingIndex].dataset.active = 'true';
    pairs[activePair].dataset.active = 'false';
    pairs[activePair].setAttribute('aria-hidden', 'true');
    backdropImages[activePair].dataset.active = 'false';
    activePair = incomingIndex;
    window.setTimeout(() => {
      const stagedIndex = 1 - activePair;
      pairPhotos[stagedIndex] = nextPair();
      setPair(pairs[stagedIndex], pairPhotos[stagedIndex]);
      setBackdrop(backdropImages[stagedIndex], pairPhotos[stagedIndex][0]);
      changing = false;
    }, 950);
  }, 4000);
}
document.addEventListener('focusin', (event) => event.target.closest('.reveal')?.classList.add('is-visible'));
motionPreference.addEventListener('change', applyMotionPreference);
