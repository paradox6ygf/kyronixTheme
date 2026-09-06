#!/usr/bin/env node
/**
 * obsidianTheme packager — builds a valid Blueprint .blueprint archive.
 *
 * Produces obsidiantheme.blueprint (a zip whose contents Blueprint's
 * extract_extension() can unpack into .blueprint/tmp with conf.yml at the
 * root). Runs the validator on the staged tree BEFORE zipping so a broken
 * package can never be produced.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const STAGE = path.join(ROOT, '.stage');
const OUT = path.join(ROOT, 'obsidiantheme.blueprint');

const INCLUDE = [
  'conf.yml',
  'assets',
  'views',
  'resources/css',
  'resources/scripts/obsidianTheme/tailwind',
  'components',
  'data',
  'resources/views/admin/obsidiantheme',
  'LICENSE',
];

// ---- stage ----
fs.rmSync(STAGE, { recursive: true, force: true });
fs.mkdirSync(STAGE, { recursive: true });
for (const rel of INCLUDE) {
  const src = path.join(ROOT, rel);
  if (!fs.existsSync(src)) { console.error(`FATAL: packaging input missing: ${rel}`); process.exit(1); }
  const dst = path.join(STAGE, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.cpSync(src, dst, { recursive: true });
}

// ---- validate staged tree before packaging ----
try {
  execFileSync(process.execPath, [path.join(__dirname, 'validate.js'), STAGE], { stdio: 'inherit' });
} catch {
  console.error('Packaging aborted: staged extension failed validation.');
  process.exit(1);
}

// ---- normalize scripts to LF and set exec hints (Linux target) ----
function fixScript(p) {
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
  if (!c.startsWith('#!')) c = '#!/usr/bin/env bash\n' + c;
  fs.writeFileSync(p, c);
}
fixScript(path.join(STAGE, 'data', 'install.sh'))
fixScript(path.join(STAGE, 'data', 'remove.sh'))

// ---- minimal zip writer (deflate) ----
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return t;
})();
function crc32(buf) { let c = -1; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; }

function listFiles(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listFiles(path.join(dir, e.name), rel));
    else out.push(rel);
  }
  return out;
}

const files = listFiles(STAGE);
const entries = [];
let offset = 0;
const local = [];
for (const rel of files) {
  const data = fs.readFileSync(path.join(STAGE, rel));
  const deflated = zlib.deflateRawSync(data, { level: 9 });
  const useDeflate = deflated.length < data.length;
  const body = useDeflate ? deflated : data;
  const method = useDeflate ? 8 : 0;
  const name = Buffer.from(rel, 'utf8');
  const crc = crc32(data);
  const lh = Buffer.alloc(30);
  lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(0, 6);
  lh.writeUInt16LE(method, 8); lh.writeUInt16LE(0, 10); lh.writeUInt16LE(0x548c, 12);
  lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(body.length, 18); lh.writeUInt32LE(data.length, 22);
  lh.writeUInt16LE(name.length, 26); lh.writeUInt16LE(0, 28);
  local.push(lh, name, body);
  entries.push({ name, crc, csize: body.length, usize: data.length, method, offset });
  offset += lh.length + name.length + body.length;
}
const central = [];
let cdSize = 0;
for (const e of entries) {
  const ch = Buffer.alloc(46);
  ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6);
  ch.writeUInt16LE(0, 8); ch.writeUInt16LE(e.method, 10); ch.writeUInt16LE(0, 12); ch.writeUInt16LE(0x548c, 14);
  ch.writeUInt32LE(e.crc, 16); ch.writeUInt32LE(e.csize, 20); ch.writeUInt32LE(e.usize, 24);
  ch.writeUInt16LE(e.name.length, 28);
  ch.writeUInt32LE(e.offset, 42);
  central.push(ch, e.name);
  cdSize += ch.length + e.name.length;
}
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(entries.length, 8); eocd.writeUInt16LE(entries.length, 10);
eocd.writeUInt32LE(cdSize, 12); eocd.writeUInt32LE(offset, 16);
fs.writeFileSync(OUT, Buffer.concat([...local, ...central, eocd]));
fs.rmSync(STAGE, { recursive: true, force: true });

console.log(`\nPackaged ${entries.length} files -> ${path.basename(OUT)} (${fs.statSync(OUT).size} bytes)`);
console.log('Package contents:');
for (const rel of files) console.log('  ' + rel);