#!/usr/bin/env node
/**
 * 폰트 서브셋 생성 스크립트.
 *
 * 1) Gmarket Sans Light(400)/Medium(500)/Bold(700) — 본문
 *    사이트는 font-bold를 광범위하게 쓰는데 Light 한 종류만 있어서 브라우저가
 *    합성 볼드를 만들고 있었다. 실제 웨이트를 추가하되 원본 woff가 각 600KB가 넘어
 *    모바일에 부담이므로 아래 문자의 합집합만 남긴다.
 *      - 현재 src/ 안의 모든 문자
 *      - KS X 1001 상용 한글 2,350자 (앞으로 추가될 본문 대비)
 *      - ASCII
 *
 * 2) SF Hambak (제목)
 *    같은 문자 집합으로 서브셋한다(570KB → 약 170KB). 원본은 재생성용 소스로 남긴다.
 *
 * 3) Giants Inline (히어로/페이지 대제목 전용)
 *    원본이 670KB라 모바일에서 swap이 늦게 일어나 제목이 한 번 바뀌었다.
 *    `.font-giants-inline`으로 실제 렌더되는 문자열은 133자뿐이므로 그것만 남긴다.
 *    문자열은 빌드 산출물(.next/server/app/**\/*.html)에서 뽑는다 → 먼저 `npm run build`.
 *    서브셋에 없는 글자는 다음 폰트(SF Hambak)로 자연스럽게 폴백된다.
 *
 * 원본 저작권:
 *   - Gmarket Sans: Gmarket 무료 배포본. 눈누 미러에서 내려받으며 저장소에 커밋하지 않는다.
 *   - Giants Inline / SF Hambak: public/fonts, src/fonts의 원본 woff2를 소스로 사용한다.
 *
 * 사용법:
 *   npm run subset:fonts            # 전부
 *   npm run subset:fonts -- gmarket # Gmarket만 (네트워크 필요)
 *   npm run subset:fonts -- sf      # SF Hambak만
 *   npm run subset:fonts -- giants  # Giants만 (빌드 필요)
 * 요구사항:
 *   python3 -m pip install --user fonttools brotli
 */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cheerio = require('cheerio');

const ROOT = path.resolve(__dirname, '..');
const TEXT_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.css', '.html']);
const GIANTS_SOURCE = path.join(ROOT, 'public', 'fonts', 'Giants-Inline.woff2');
const GIANTS_OUTPUT = path.join(ROOT, 'public', 'fonts', 'Giants-Inline.subset.woff2');

// 눈누 미러 (Gmarket Sans 공식 배포본과 동일한 파일)
const SOURCES = [
  {
    name: 'GmarketSansTTFLight',
    weight: '400',
    url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansLight.woff',
  },
  {
    name: 'GmarketSansTTFMedium',
    weight: '500',
    url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff',
  },
  {
    name: 'GmarketSansTTFBold',
    weight: '700',
    url: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansBold.woff',
  },
];

// SF Hambak: 원본은 재생성용 소스로 남기고 로딩은 서브셋을 쓴다.
const SF_SOURCE = path.join(ROOT, 'src', 'fonts', 'SFTTF.woff2');
const SF_OUTPUT = path.join(ROOT, 'src', 'fonts', 'SFTTF.subset.woff2');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function addAscii(chars) {
  for (let code = 0x20; code <= 0x7e; code++) chars.add(String.fromCharCode(code));
  chars.delete('\n');
  chars.delete('\r');
  chars.delete('\t');
}

function writeCharset(chars, name) {
  const file = path.join(os.tmpdir(), `alf-fonts-${name}.txt`);
  fs.writeFileSync(file, [...chars].sort().join(''), 'utf8');
  return file;
}

function subset(input, charsetFile, output, features = '*') {
  execFileSync(
    'python3',
    [
      '-m', 'fontTools.subset', input,
      `--text-file=${charsetFile}`,
      '--flavor=woff2',
      `--layout-features=${features}`,
      `--output-file=${output}`,
    ],
    { stdio: 'inherit' },
  );
}

function report(label, input, output) {
  const from = Math.round(fs.statSync(input).size / 1024);
  const to = Math.round(fs.statSync(output).size / 1024);
  console.log(`${label}: ${from}KB → ${to}KB`);
}

// --- 1) Gmarket Sans Light/Medium/Bold -------------------------------------

function bodyCharset() {
  const chars = new Set();
  for (const file of walk(path.join(ROOT, 'src'))) {
    if (!TEXT_EXTS.has(path.extname(file))) continue;
    for (const ch of fs.readFileSync(file, 'utf8')) chars.add(ch);
  }

  // KS X 1001 상용 한글 (EUC-KR 0xB0A1 ~ 0xC8FE)
  const decoder = new TextDecoder('euc-kr');
  for (let hi = 0xb0; hi <= 0xc8; hi++) {
    for (let lo = 0xa1; lo <= 0xfe; lo++) {
      const ch = decoder.decode(Uint8Array.from([hi, lo]));
      if (ch.length === 1 && ch !== '\uFFFD') chars.add(ch);
    }
  }
  addAscii(chars);
  return chars;
}

const GMARKET_FAMILY = {
  '400': 'Gmarket Sans TTF Light',
  '500': 'Gmarket Sans TTF Medium',
  '700': 'Gmarket Sans TTF Bold',
};

async function buildGmarket() {
  const chars = bodyCharset();
  const charsetFile = writeCharset(chars, 'gmarket');
  console.log(`Gmarket charset: ${chars.size}자`);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'alf-fonts-'));

  try {
    for (const source of SOURCES) {
      const woffPath = path.join(tmp, `${source.name}.woff`);
      const res = await fetch(source.url);
      if (!res.ok) throw new Error(`${source.url} → HTTP ${res.status}`);
      fs.writeFileSync(woffPath, Buffer.from(await res.arrayBuffer()));

      const outPath = path.join(ROOT, 'src', 'fonts', `${source.name}.woff2`);
      subset(woffPath, charsetFile, outPath);

      // 눈누 배포본에는 패밀리 이름(nameID 1)이 없어 DevTools에 "OTS derived font"로
      // 보인다. 디버깅이 가능하도록 이름을 채워 넣는다.
      const family = GMARKET_FAMILY[source.weight];
      execFileSync('python3', [
        '-c',
        [
          'from fontTools.ttLib import TTFont',
          `f = TTFont(${JSON.stringify(outPath)})`,
          'n = f["name"]',
          'for pid, eid, lid in ((3, 1, 0x409), (1, 0, 0)):',
          `    n.setName(${JSON.stringify(family)}, 1, pid, eid, lid)`,
          `    n.setName(${JSON.stringify(family)}, 4, pid, eid, lid)`,
          'f.flavor = "woff2"',
          `f.save(${JSON.stringify(outPath)})`,
        ].join('\n'),
      ]);

      report(source.name, woffPath, outPath);
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// --- 2) SF Hambak (제목) ----------------------------------------------------

function buildSF() {
  const chars = bodyCharset();
  const charsetFile = writeCharset(chars, 'sf');
  console.log(`SF Hambak charset: ${chars.size}자`);

  subset(SF_SOURCE, charsetFile, SF_OUTPUT);
  report('SF_HambakSnow', SF_SOURCE, SF_OUTPUT);
}

// --- 3) Giants Inline (대제목 전용) ----------------------------------------

function buildGiants() {
  const htmlRoot = path.join(ROOT, '.next', 'server', 'app');
  if (!fs.existsSync(htmlRoot)) {
    throw new Error('Giants 서브셋은 빌드 결과가 필요합니다. 먼저 `npm run build`를 실행하세요.');
  }

  const strings = new Set();
  for (const file of walk(htmlRoot)) {
    if (!file.endsWith('.html')) continue;
    const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
    $('.font-giants-inline').each((_, el) => {
      const text = $(el).text().trim();
      if (text) strings.add(text);
    });
  }

  if (strings.size === 0) {
    throw new Error('.font-giants-inline 요소를 빌드 산출물에서 찾지 못했습니다.');
  }

  const chars = new Set();
  for (const text of strings) for (const ch of text) chars.add(ch);
  addAscii(chars);

  const charsetFile = writeCharset(chars, 'giants');
  console.log(`Giants: ${strings.size}개 문자열 / ${chars.size}자`);

  // 대제목용이라 합자/대체 글리프는 필요 없다. 커닝만 남겨 용량을 줄인다.
  subset(GIANTS_SOURCE, charsetFile, GIANTS_OUTPUT, 'kern');
  report('Giants-Inline', GIANTS_SOURCE, GIANTS_OUTPUT);
}

// --- entry -----------------------------------------------------------------

async function main() {
  const target = process.argv[2] || 'all';
  if (!['all', 'gmarket', 'sf', 'giants'].includes(target)) {
    throw new Error(`알 수 없는 대상: ${target} (all | gmarket | sf | giants)`);
  }
  if (target === 'all' || target === 'gmarket') await buildGmarket();
  if (target === 'all' || target === 'sf') buildSF();
  if (target === 'all' || target === 'giants') buildGiants();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
