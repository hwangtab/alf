#!/usr/bin/env node
/**
 * Fetches newsletter HTML pages and generates summary/badge fields.
 * Usage: node scripts/generate-newsletter-summaries.js [--dry-run] [--all] [--limit N] [--wait MS] [--output path]
 */
const fs = require("fs");
const path = require("path");
const { load } = require("cheerio");

const args = process.argv.slice(2);
const options = parseArgs(args);

const DATA_PATH = path.resolve(__dirname, "../src/data/newsletters.json");
const OUTPUT_PATH = options.output
  ? path.resolve(process.cwd(), options.output)
  : DATA_PATH;
const WAIT_MS = Number.isFinite(options.wait) ? options.wait : 400;
const MAX_SUMMARY_LENGTH = 140;
const MIN_SUMMARY_IDEAL = 80;
const MIN_SUMMARY_FALLBACK = 40;
const IGNORED_SUMMARIES = ["이 메일은 스티비로 만들었습니다"];
const PLACEHOLDER_PATTERNS = [
  /이 메일은 스티비로 만들었습니다/,
  /수신을 원치 않으시면/,
  /이 메일을 받은 기억이 없으신가요/,
  /이 메일[^\n]*안 ?보이시나요/,
  /구 노량진수산시장 예술해방전선입니다\.?/,
  /@media only screen/,
  /예술해방전선 드림/,
];

async function main() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const newsletters = JSON.parse(raw);
  const targets = newsletters.filter((item) => {
    if (!item.link) return false;
    if (!options.onlyMissing) return true;
    return !item.summary || !item.summary.trim();
  });

  const limitedTargets =
    typeof options.limit === "number"
      ? targets.slice(0, options.limit)
      : targets;

  if (limitedTargets.length === 0) {
    console.log("✅ 업데이트할 뉴스레터가 없습니다.");
    return;
  }

  console.log(
    `총 ${limitedTargets.length}건의 뉴스레터에서 요약을 생성합니다${
      options.dryRun ? " (dry run)" : ""
    }.`
  );

  for (let i = 0; i < limitedTargets.length; i += 1) {
    const entry = limitedTargets[i];
    process.stdout.write(
      `\n[${i + 1}/${limitedTargets.length}] ${entry.title} … `
    );
    try {
      const html = await fetchHtml(entry.link);
      const payload = parseNewsletter(html);
      if (!payload.summary) {
        console.log("요약 추출 실패");
        continue;
      }

      if (!options.dryRun) {
        entry.summary = payload.summary;
        if (options.clearBadges && entry.badges) {
          delete entry.badges;
        }
        if (payload.highlights.length > 0) {
          entry.highlights = payload.highlights;
        } else {
          delete entry.highlights;
        }
        if (payload.thumbnail) {
          entry.thumbnail = payload.thumbnail;
        } else {
          delete entry.thumbnail;
        }
      }

      console.log(
        `완료 (${payload.summary.length}자${
          payload.highlights.length ? `, highlights: ${payload.highlights.length}` : ""
        }${payload.thumbnail ? ", thumbnail" : ""})`
      );
      await sleep(WAIT_MS);
    } catch (error) {
      console.log(`오류: ${error.message}`);
    }
  }

  if (!options.dryRun) {
    fs.writeFileSync(
      OUTPUT_PATH,
      `${JSON.stringify(newsletters, null, 2)}\n`,
      "utf8"
    );
    console.log(`\n📝 ${OUTPUT_PATH} 파일을 업데이트했습니다.`);
  } else {
    console.log("\nDry run 모드이므로 파일을 변경하지 않았습니다.");
  }
}

function parseNewsletter(html) {
  const root = load(html);
  const emailMarkup = root("div.email-content").html() || html;
  const email = load(emailMarkup);
  const candidateMeta =
    email("meta[name='description']").attr("content") ||
    email("meta[name='twitter:description']").attr("content") ||
    "";
  const metaDescription = sanitizePlaceholder(candidateMeta);
  const fallbackTitle = email("title").text();
  const firstParagraph = findFirstParagraph(email);
  const firstContentBlock = firstParagraph || findFirstContentBlock(email);
  const summary = selectSummary(
    metaDescription,
    firstContentBlock,
    collectContentBlocks(email),
    fallbackTitle
  );

  const highlights = extractHighlights(email);
  const thumbnail = extractThumbnail(email);

  return {
    summary,
    highlights,
    thumbnail,
  };
}

function findFirstParagraph($doc) {
  const paragraphs = $doc("p");
  for (let i = 0; i < paragraphs.length; i += 1) {
    const text = cleanText($doc(paragraphs[i]).text());
    if (text.length >= 10 && !isPlaceholderText(text)) {
      return text;
    }
  }
  return "";
}

function findFirstContentBlock($doc) {
  const elements = $doc("p, span, li, strong, h1, h2, h3, div");
  for (let i = 0; i < elements.length; i += 1) {
    const text = cleanText($doc(elements[i]).text());
    if (text.length >= 10 && !isPlaceholderText(text)) {
      return text;
    }
  }
  return "";
}

function collectContentBlocks($doc) {
  const blocks = [];
  const seen = new Set();
  $doc("p, li, span, div").each((_, el) => {
    const text = cleanText($doc(el).text());
    if (
      text &&
      text.length >= 20 &&
      !isPlaceholderText(text) &&
      !seen.has(text)
    ) {
      blocks.push(text);
      seen.add(text);
    }
  });
  return blocks;
}

function extractHighlights($doc) {
  const highlights = [];
  const seen = new Set();
  const candidates = gatherHeadingNodes($doc);

  candidates.forEach((el) => {
    const text = cleanText($doc(el).text());
    const key = createHighlightKey(text);
    if (!text || seen.has(key)) return;
    if (isHighlightCandidate(text, { forceHeading: true })) {
      highlights.push(text);
      seen.add(key);
    }
  });

  if (highlights.length === 0) {
    const fallbackBlocks = collectContentBlocks($doc);
    return fallbackBlocks.slice(0, 3);
  }

  return highlights.slice(0, 5);
}

function extractThumbnail($doc) {
  const images = $doc("img");
  if (images.length === 0) return "";

  const pick = (start) => {
    for (let i = start; i < images.length; i += 1) {
      const src = normalizeUrl($doc(images[i]).attr("src"));
      if (src) return src;
    }
    return "";
  };

  return pick(1) || pick(0);
}

async function fetchHtml(url, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent":
            "ALF Newsletter Bot (+https://artliberationfront.org)",
          accept: "text/html,application/xhtml+xml",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(250 * (i + 1));
    }
  }
  throw lastError;
}

function cleanText(text = "") {
  return text.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

function sanitizePlaceholder(text = "") {
  const cleaned = cleanText(text);
  if (!cleaned) return "";
  if (IGNORED_SUMMARIES.includes(cleaned)) return "";
  if (isPlaceholderText(cleaned)) return "";
  return cleaned;
}

function isPlaceholderText(text = "") {
  if (!text) return false;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text));
}

function selectSummary(meta, firstContent, blocks, fallbackTitle) {
  const candidates = [
    sanitizePlaceholder(meta),
    firstContent,
    ...blocks,
    fallbackTitle ? cleanText(fallbackTitle) : "",
  ].filter(Boolean);

  const pick = (minLength) =>
    candidates.find(
      (text) => text.length >= minLength && !isPlaceholderText(text)
    );

  const chosen =
    pick(MIN_SUMMARY_IDEAL) ||
    pick(MIN_SUMMARY_FALLBACK) ||
    pick(20) ||
    "";

  return truncate(chosen, MAX_SUMMARY_LENGTH);
}

function truncate(text, limit) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trim()}…`;
}

function isHighlightCandidate(text = "", options = {}) {
  if (!text) return false;
  const normalized = text.trim();
  if (normalized.length < 6 || normalized.length > 90) return false;
  if (isPlaceholderText(normalized)) return false;
  if (/https?:\/\//i.test(normalized)) return false;
  if (HIGHLIGHT_STOPWORDS.some((pattern) => pattern.test(normalized))) {
    return false;
  }
  if (HIGHLIGHT_EXCLUSION_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return false;
  }
  if (!/[A-Za-z가-힣]/.test(normalized)) return false;
  if (/^[-•·◦]/.test(normalized)) return false;

  if (options.forceHeading) {
    return true;
  }

  const numbered = /^\d+[\.\)]\s*/.test(normalized);
  if (numbered) return true;

  const colonSeparated = /^\S[\s\S]+[:：]\s+\S/.test(normalized);
  const keywords = /(연대|보고|특집|인터뷰|캠페인|앨범|프로젝트|행사|워크숍|공연|회의)/i.test(
    normalized
  );

  return colonSeparated && keywords;
}

function gatherHeadingNodes($doc) {
  const nodes = [];
  $doc("h1, h2, h3, h4").each((_, el) => nodes.push(el));
  $doc("[style*='font-size']").each((_, el) => {
    const style = el.attribs?.style || "";
    const fontSize = parseFontSize(style);
    const fontWeight = parseFontWeight(style);
    if (fontSize >= 26 || (fontSize >= HEADING_FONT_SIZE && fontWeight >= 500)) {
      nodes.push(el);
    }
  });

  return nodes;
}

function parseFontSize(style = "") {
  const match = style.match(/font-size\s*:\s*([0-9.]+)px/i);
  return match ? Number(match[1]) : 0;
}

function parseFontWeight(style = "") {
  const numericMatch = style.match(/font-weight\s*:\s*([0-9]+)/i);
  if (numericMatch) return Number(numericMatch[1]);
  if (/font-weight\s*:\s*(bold|bolder)/i.test(style)) return 700;
  return 0;
}

function createHighlightKey(text = "") {
  return text
    .toLowerCase()
    .replace(/[\s"'.,!?-]/g, "")
    .replace(/동지$/i, "")
    .trim();
}

function normalizeUrl(src = "") {
  if (!src) return "";
  if (src.startsWith("//")) return `https:${src}`;
  if (/^https?:\/\//i.test(src)) return src;
  return "";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(rawArgs) {
  const opts = {
    dryRun: false,
    onlyMissing: true,
    clearBadges: false,
  };
  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
    if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg === "--all") {
      opts.onlyMissing = false;
    } else if (arg === "--limit") {
      opts.limit = Number(rawArgs[i + 1]);
      i += 1;
    } else if (arg === "--wait") {
      opts.wait = Number(rawArgs[i + 1]);
      i += 1;
    } else if (arg === "--output") {
      opts.output = rawArgs[i + 1];
      i += 1;
    } else if (arg === "--clear-badges") {
      opts.clearBadges = true;
    }
  }
  return opts;
}

main().catch((error) => {
  console.error("\n요약 생성 스크립트가 실패했습니다.");
  console.error(error);
  process.exit(1);
});
const HIGHLIGHT_STOPWORDS = [
  /^함께 연대하며/i,
  /^함께 연대/i,
  /^with solidarity/i,
  /^후원계좌/i,
  /^일시\s*:?$/i,
  /^장소\s*:?$/i,
  /^주제\s*:?$/i,
];
const HEADING_FONT_SIZE = 18;
const HEADING_FONT_WEIGHT = 600;
const HIGHLIGHT_EXCLUSION_PATTERNS = [
  /^\d+(\.\d+)?\s*x\s*\d+(\.\d+)?$/i,
  /^이번 소식지 어떠셨나요/i,
  /^존경하는\s+/i,
  /^함께하고 계신/i,
];
