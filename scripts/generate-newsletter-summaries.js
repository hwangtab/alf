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
const IGNORED_SUMMARIES = ["이 메일은 스티비로 만들었습니다"];
const PLACEHOLDER_PATTERNS = [
  /이 메일은 스티비로 만들었습니다/,
  /수신을 원치 않으시면/,
  /이 메일을 받은 기억이 없으신가요/,
  /이 메일[^\n]*안 ?보이시나요/,
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
        if (payload.badges.length > 0) {
          entry.badges = payload.badges;
        } else {
          delete entry.badges;
        }
      }

      console.log(
        `완료 (${payload.summary.length}자${
          payload.badges.length ? `, badges: ${payload.badges.join(", ")}` : ""
        })`
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

const BADGE_RULES = [
  { label: "특집", pattern: /(특집|스페셜)/i },
  { label: "인터뷰", pattern: /인터뷰/ },
  { label: "캠페인", pattern: /(캠페인|연대|행동)/ },
  { label: "공지", pattern: /(공지|안내|알림)/ },
  { label: "행사", pattern: /(행사|이벤트|워크숍)/ },
];

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
  const summarySource =
    metaDescription.trim() ||
    firstContentBlock ||
    fallbackTitle.trim() ||
    "";
  const summary = truncate(cleanText(summarySource), MAX_SUMMARY_LENGTH);
  const badgeTexts = collectTextBlocks(email);
  const badges = BADGE_RULES.filter(({ pattern }) =>
    badgeTexts.some((text) => pattern.test(text))
  ).map(({ label }) => label);

  return {
    summary,
    badges,
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

function collectTextBlocks($doc) {
  const blocks = [];
  $doc("h1, h2, h3, strong, p, span, li").each((_, el) => {
    const text = cleanText($doc(el).text());
    if (text) {
      blocks.push(text);
    }
  });
  return blocks;
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
  return cleaned;
}

function isPlaceholderText(text = "") {
  if (!text) return false;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text));
}

function truncate(text, limit) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trim()}…`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(rawArgs) {
  const opts = {
    dryRun: false,
    onlyMissing: true,
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
    }
  }
  return opts;
}

main().catch((error) => {
  console.error("\n요약 생성 스크립트가 실패했습니다.");
  console.error(error);
  process.exit(1);
});
