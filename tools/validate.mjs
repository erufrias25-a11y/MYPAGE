import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { gallery } from '../dist/gallery-data.js';

const project = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('curation.json', project), 'utf8'));
const legacy = JSON.parse(await readFile(new URL('docs/legacy-photo-ids.json', project), 'utf8'));
const audit = JSON.parse(await readFile(new URL('docs/selection-audit.json', project), 'utf8'));
const permitted = new Set(['Photos-1-001', ...Array.from({ length: 13 }, (_, index) => `Photos-1-001 (${index + 1})`), 'Photos Jazm 2', 'Photos say', 'Photos-3-001', ...Array.from({ length: 5 }, (_, index) => `sesion ${index + 16}`), 'sesion 21 poner de primera', 'sesion 22', 'sesion 23']);
assert.equal(gallery.sessions.length, manifest.sessions.length, 'Regenerate gallery-data.js after changing curation.json');
assert.equal(gallery.photos.length, manifest.sessions.reduce((total, session) => total + session.files.length, 0));
assert.equal(new Set(gallery.photos.map((photo) => photo.id)).size, gallery.photos.length);
assert.equal(new Set(gallery.sessions.map((session) => session.id)).size, gallery.sessions.length);
let bytes = 0;
const selectedSources = new Map();
for (const session of manifest.sessions) {
  assert.ok(permitted.has(session.folder), `Unapproved source: ${session.folder}`);
  assert.ok(session.files.length > 0 && session.files.length <= 20, `${session.id}: each album must contain at most 20 photographs`);
  assert.deepEqual(gallery.sessions.find((entry) => entry.id === session.id)?.title, session.title);
  for (const entry of session.files) {
    assert.ok(entry.alt.trim().length > 15);
    const folder = entry.folder || session.folder;
    assert.ok(permitted.has(folder), `Unapproved image source: ${folder}`);
    assert.ok(!/[\\/]/.test(entry.file), 'Only direct files in authorized sibling folders are allowed');
    assert.ok(entry.id.startsWith(`${session.id}-`), `${session.id}: missing stable photo ID`);
    assert.ok(!selectedSources.has(entry.id), `Repeated ID: ${entry.id}`);
    if (session.id === 'retrato-cotidiano') assert.equal(folder, 'Photos-1-001 (3)');
    selectedSources.set(entry.id, { folder, file: entry.file, session: session.id });
  }
  assert.deepEqual(gallery.photos.filter((photo) => photo.session === session.id).map((photo) => photo.id), session.files.map((entry) => entry.id));
}
assert.deepEqual(gallery.sessions.filter((session) => legacy.sessions.some((entry) => entry.id === session.id)).map((session) => session.id), legacy.sessions.map((session) => session.id), 'Preserve the existing 15 sessions and their relative order');
assert.equal(gallery.sessions[0].id, 'sesion-21', 'Session 21 is intentionally first in the index');
assert.equal(gallery.sessions.length, 23, 'Eight new sessions should be included');
for (const session of legacy.sessions) {
  assert.equal(gallery.sessions.find((entry) => entry.id === session.id).cover, session.cover);
  for (const photo of session.photos) assert.deepEqual(selectedSources.get(photo.id), { folder: photo.folder, file: photo.file, session: session.id }, `Legacy link changed: ${photo.id}`);
}
assert.equal(audit.maximum_per_session, 20);
for (const session of manifest.sessions.filter((entry) => /^sesion-(1[6-9]|2[0-3])$/.test(entry.id))) {
  const expected = session.id === 'sesion-22' ? 15 : session.id === 'sesion-21' ? 19 : 20;
  assert.equal(session.files.length, expected, `${session.id}: unexpected curated photo count`);
}
assert.equal(audit.photos.length, selectedSources.size);
assert.equal(new Set(audit.photos.map((photo) => photo.sha256)).size, audit.photos.length, 'The selected source files must have unique SHA-256 contents');
for (const photo of audit.photos) assert.deepEqual(selectedSources.get(photo.id), { folder: photo.folder, file: photo.file, session: photo.session });
const application = await readFile(new URL('dist/app.js', project), 'utf8');
const featured = JSON.parse(application.match(/const featuredIds = (\[[^;]+\]);/)[1].replaceAll("'", '"'));
assert.deepEqual(featured, legacy.featured, 'Preserve the six featured photographs');
for (const photo of gallery.photos) {
  assert.ok(gallery.sessions.some((session) => session.id === photo.session));
  assert.ok(photo.width > 0 && photo.height > 0);
  for (const size of [480, 960, 1920]) {
    const image = await stat(new URL(`dist/assets/photos/${photo.id}-${size}.webp`, project));
    assert.ok(image.size > 500);
    bytes += image.size;
  }
}
const pages = ['index.html', 'sesiones.html', 'sobre-mi.html', 'contacto.html'];
for (const page of pages) {
  const html = await readFile(new URL(`dist/${page}`, project), 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (/^(https?:|mailto:)/.test(match[1])) continue;
    assert.ok(!match[1].startsWith('/'), 'Use relative paths for repository subdirectories');
    await stat(new URL(`dist/${match[1].split('#')[0]}`, project));
  }
  for (const destination of pages) assert.ok(html.includes(`href="${destination}"`), `${page}: missing navigation to ${destination}`);
  assert.match(html, /<html lang="es">/);
  assert.match(html, /<dialog[^>]*aria-labelledby=/);
  assert.ok(!html.includes('{{'), `${page}: unresolved template`);
  assert.ok(!html.includes('https://'), 'The portfolio should not request external assets');
  const identifiers = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(identifiers).size, identifiers.length, `${page}: duplicate HTML identifiers`);
  for (const match of html.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]+)"/g)) {
    for (const identifier of match[1].split(/\s+/)) assert.ok(identifiers.includes(identifier), `${page}: missing ARIA target ${identifier}`);
  }
  for (const match of html.matchAll(/data-open="([^"]+)"/g)) assert.ok(gallery.photos.some((photo) => photo.id === match[1]), `${page}: photograph is not in the curated selection`);
}
for (const file of ['dist/app.js', 'dist/gallery-data.js', 'dist/site-config.js']) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(file, project))], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
console.log(`OK: ${gallery.sessions.length} sessions, ${gallery.photos.length} photographs, ${gallery.photos.length * 3} assets (${(bytes / 1024 / 1024).toFixed(1)} MB).`);
console.log('Four HTML pages, approved sources, unique identifiers, assets, relative navigation and JavaScript syntax verified.');
console.log('Maximum 20 per album, zero duplicate source hashes, all 53 legacy IDs, 23 session covers and six featured photographs preserved.');
