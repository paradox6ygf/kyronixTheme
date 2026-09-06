#!/usr/bin/env node
/**
 * obsidianTheme pre-install validator.
 *
 * Mirrors the exact checks Blueprint performs in
 * scripts/commands/extensions/install.sh (path existence validation), plus
 * structural sanity checks. Exits non-zero and prints every broken
 * reference instead of letting Blueprint abort with its generic message.
 */
const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || path.resolve(__dirname, '..');
let failed = false;
const fail = (msg) => { failed = true; console.error('  BROKEN: ' + msg); };
const ok = (msg) => console.log('  ok: ' + msg);

function readConf(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const conf = {};
  let section = null;
  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.match(/^\s*/)[0].length;
    const line = raw.trim();
    if (indent === 0 && line.endsWith(':')) { section = line.slice(0, -1); conf[section] = conf[section] || {}; continue; }
    if (indent === 0 && !line.includes(':')) continue;
    if (indent > 0 && line.includes(':') && section) {
      const idx = line.indexOf(':');
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      conf[section][key] = val;
    }
  }
  return conf;
}

console.log(`Validating obsidianTheme extension tree: ${dir}\n`);

// conf.yml must exist
const confPath = path.join(dir, 'conf.yml');
if (!fs.existsSync(confPath)) { console.error('FATAL: conf.yml not found.'); process.exit(1); }
ok('conf.yml exists');

const conf = readConf(confPath);

// Required info fields (Blueprint: install.sh:384-389)
for (const f of ['name', 'identifier', 'description', 'version', 'target']) {
  if (!conf.info || !conf.info[f]) fail(`info.${f} is required by Blueprint but missing/empty.`);
  else ok(`info.${f} = ${conf.info[f]}`);
}
if (!conf.info.identifier || !/^[a-z][a-z0-9]*$/.test(conf.info.identifier)) {
  fail(`info.identifier must be lowercase a-z (got "${conf.info && conf.info.identifier}").`);
}
if (!conf.admin || !conf.admin.view) fail("admin.view is required by Blueprint but missing.");

// Path references validated against the extension root — identical to Blueprint's check at install.sh:417-437
const refs = [
  ['info.icon (file)', conf.info && conf.info.icon, 'file'],
  ['admin.view (file)', conf.admin && conf.admin.view, 'file'],
  ['admin.controller (file)', conf.admin && conf.admin.controller, 'file'],
  ['admin.css (file)', conf.admin && conf.admin.css, 'file'],
  ['admin.wrapper (file)', conf.admin && conf.admin.wrapper, 'file'],
  ['dashboard.css (file)', conf.dashboard && conf.dashboard.css, 'file'],
  ['dashboard.wrapper (file)', conf.dashboard && conf.dashboard.wrapper, 'file'],
  ['dashboard.components (dir)', conf.dashboard && conf.dashboard.components, 'dir'],
  ['data.directory (dir)', conf.data && conf.data.directory, 'dir'],
  ['data.public (dir)', conf.data && conf.data.public, 'dir'],
  ['requests.views (dir)', conf.requests && conf.requests.views, 'dir'],
];
console.log('');
for (const [label, p, type] of refs) {
  if (!p) continue;
  if (p.startsWith('/') || p.includes('..') || p.includes('~') || p.includes('\\')) fail(`${label}: unsafe path "${p}"`);
  const abs = path.join(dir, p);
  if (!fs.existsSync(abs)) fail(`${label}: path does not exist -> ${p}`);
  else if (type === 'file' && !fs.statSync(abs).isFile()) fail(`${label}: not a file -> ${p}`);
  else if (type === 'dir' && !fs.statSync(abs).isDirectory()) fail(`${label}: not a directory -> ${p}`);
  else ok(`${label} -> ${p}`);
}


// Components.yml validation (mirrors Blueprint install.sh:763-770 and 956-960)
if (conf.dashboard && conf.dashboard.components) {
  const compDir = path.join(dir, conf.dashboard.components);
  if (fs.existsSync(compDir) && fs.statSync(compDir).isDirectory()) {
    const compYml = path.join(compDir, 'Components.yml');
    if (fs.existsSync(compYml)) {
      const yml = fs.readFileSync(compYml, 'utf8');
      const comps = [...yml.matchAll(/component:\s*["']?([A-Za-z0-9_/]+)["']?/g)].map((m) => m[1]);
      for (const c of comps) {
        if (c.includes('..') || c.startsWith('/')) fail(`Components.yml: unsafe component path "${c}"`);
        const found = ['.tsx', '.ts', '.jsx', '.js'].some((ext) => fs.existsSync(path.join(compDir, c + ext)));
        if (!found) fail(`Components.yml: component "${c}" does not exist in ${conf.dashboard.components}/`);
        else ok(`Components.yml: component "${c}" found`);
      }
      if (fs.existsSync(path.join(compDir, 'ObsidianCustomizer.tsx')) && fs.existsSync(path.join(compDir, 'ObsidianBootstrap.tsx')) && fs.existsSync(path.join(compDir, 'obsidianConfig.ts'))) {
        ok('Customizer runtime files present (ObsidianCustomizer, ObsidianBootstrap, obsidianConfig)');
      } else {
        fail('Customizer runtime files missing from components folder.');
      }
    }
  }
}
// data.directory scripts must be bash scripts (Blueprint runs private/install.sh)
if (conf.data && conf.data.directory) {
  const dataDir = path.join(dir, conf.data.directory);
  if (fs.existsSync(path.join(dataDir, 'install.sh'))) ok('data/install.sh present (Blueprint custom install script)');
  if (fs.existsSync(path.join(dataDir, 'remove.sh'))) ok('data/remove.sh present (Blueprint custom removal script)');
}
// Structural checks
console.log('');
const css = (conf.dashboard && conf.dashboard.css) || (conf.admin && conf.admin.css);
if (css) {
  const body = fs.readFileSync(path.join(dir, css), 'utf8');
  if (/^\uFEFF/.test(body)) fail(`${css} starts with a UTF-8 BOM.`);
  if (body.trim() === '') fail(`${css} is empty.`);
}
if (conf.admin && conf.admin.view) {
  const view = fs.readFileSync(path.join(dir, conf.admin.view), 'utf8');
  if (/^\uFEFF/.test(view)) fail(`${conf.admin.view} starts with a UTF-8 BOM (breaks Blade compilation).`);
  if (/@extends/.test(view)) fail(`${conf.admin.view} must not use @extends — Blueprint appends it into its own admin template.`);
}
const iconP = conf.info && conf.info.icon;
if (iconP) {
  const buf = fs.readFileSync(path.join(dir, iconP));
  if (!(buf[0] === 0x89 && buf[1] === 0x50) && !(buf[0] === 0xff && buf[1] === 0xd8)) fail(`${iconP} is not a valid PNG/JPEG image.`);
}
// No stray BOMs anywhere in packaged text assets
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === 'blueprint-framework') continue;
    const full = path.join(d, e.name);
    if (e.isDirectory()) { walk(full); continue; }
    if (/\.(css|js|ts|tsx|yml|blade\.php|php|json|md)$/.test(e.name)) {
      const fd = fs.openSync(full, 'r');
      const b = Buffer.alloc(3); fs.readSync(fd, b, 0, 3, 0); fs.closeSync(fd);
      if (b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf) fail(`BOM detected in ${path.relative(dir, full)}`);
    }
  }
}
walk(dir);

console.log('');
if (failed) { console.error('VALIDATION FAILED — fix the references above. Blueprint installation must NOT be started.'); process.exit(1); }
console.log('VALIDATION PASSED — zero broken references.');