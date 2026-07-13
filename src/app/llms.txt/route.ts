import newslettersData from '@/data/newsletters.json';
import { migratedIds } from '@/data/newsletterContent';

export const dynamic = 'force-static';

const baseUrl = 'https://alf.seoul.kr';

/** 요약문에 상세 목록을 반영할 최근 소식지 수. 이보다 오래된 호는 제목만 나열한다. */
const RECENT_COUNT = 12;

interface NewsletterMeta {
  id: number;
  title: string;
  publishDate: string;
  summary: string;
}

const migrated = new Set(migratedIds);

/** 실제 /news/{id} 페이지가 존재하는 소식지만, 최신순으로 */
const newsletters = (newslettersData as NewsletterMeta[])
  .filter((n) => migrated.has(n.id))
  .sort((a, b) => b.publishDate.localeCompare(a.publishDate));

const latest = newsletters[0];

const intro = `# 예술해방전선 (Art Liberation Front, ALF)

> 예술해방전선은 2019년 10월 구 노량진수산시장 강제 철거 현장에서 출발한 한국의 실천적 예술 네트워크입니다. 예술을 통해 사회적 불평등에 저항하고, 삶의 터전에서 밀려난 이들과 연대하며, 모두가 존엄하게 살아갈 수 있는 세상을 만드는 데 기여합니다.

예술해방전선은 거대 조직이 아니라 현장의 목소리에 귀 기울이고 함께 행동하는 자발적 예술가 연대체입니다. 이름에는 두 가지 뜻이 담겨 있습니다. 억압받는 이들을 부조리한 현실로부터 해방시키려는 의지, 그리고 자본과 소비주의에 갇힌 예술 자체를 본연의 모습으로 해방시키려는 열망입니다.

- **설립**: 2019년 10월, 구 노량진수산시장 강제 철거 현장
- **활동 방식**: 현장 연대 공연, 음반 제작, 기록·영상 촬영, 예술가 네트워크 조직
- **주요 연대 현장**: 구 노량진수산시장, 동서울터미널 등 강제 철거·노동 현장
- **핵심 가치**: 연대(함께 걷는 길), 저항(침묵하지 않는 목소리), 실험(새로운 길을 찾는 용기), 포용(다름을 안는 마음)
- **활동 보고**: 2021년 9월 창간, 매월 발행. 현재 ${newsletters.length}호까지 공개${latest ? ` (최신: ${latest.title})` : ''}. 회계 내역 전액 공개
- **언어**: 한국어 (ko_KR)
- **웹사이트**: ${baseUrl}

## 핵심 페이지

- [소개](${baseUrl}/about): 예술해방전선의 설립 배경, 지향하는 세상, 네 가지 핵심 가치(연대·저항·실험·포용)
- [활동](${baseUrl}/activities): 음반 발매와 공연, 현장 연대, 네트워크·조직 활동, 아티스트 지원 및 협업 등 활동 영역
- [활동 보고](${baseUrl}/news): 2021년 9월 창간 이후 매월 발행하는 활동 보고. 활동 기록과 함께 수입·지출·잔액 회계 내역을 전액 공개
- [예술가 현장 연대 가이드](${baseUrl}/guide): 현장 연대를 처음 시작하는 예술가를 위한 안내서. 수평적 연대와 상호부조의 원칙을 다룸
- [회원 가입 / 후원](${baseUrl}/support): 정기 후원 회원 신청. CMS 자동이체 방식

## 작품과 기록

- [음반 및 작품](${baseUrl}/albums): 현장에서 만들어진 음반과 예술 작업물
- [비디오](${baseUrl}/videos): 현장 연대 활동 영상 기록
- [갤러리](${baseUrl}/gallery): 현장 사진 아카이브

## 자주 묻는 질문

**예술해방전선은 어떤 단체인가요?**
2019년 10월 구 노량진수산시장 강제 철거 현장에서 결성된 한국의 예술 활동가 네트워크입니다. 음악 공연, 영상 기록, 음반 제작 등 예술 활동을 통해 강제 철거·노동 현장에서 사회적 약자와 연대합니다.

**단체 이름의 뜻은 무엇인가요?**
예술을 무기 삼아 억압받는 이들을 해방시킨다는 뜻과, 자본·소비주의에 갇힌 예술 자체를 해방시킨다는 뜻을 함께 담고 있습니다.

**어떻게 후원할 수 있나요?**
[회원 가입 페이지](${baseUrl}/support)에서 정기 후원 회원으로 가입할 수 있습니다. 월 후원 금액과 출금일을 직접 정하는 CMS 자동이체 방식입니다.

**후원금은 어떻게 쓰이나요?**
매월 발행하는 [활동 보고](${baseUrl}/news)에 수입·지출·잔액 전 항목을 공개합니다.

**예술가로 연대에 참여하려면?**
[예술가 현장 연대 가이드](${baseUrl}/guide)에 현장 연대를 시작하는 방법과 수평적 연대·상호부조의 원칙을 정리해 두었습니다.`;

/** 한 줄로 접기 — 요약문에 줄바꿈이 섞이면 링크 목록 형식이 깨진다. */
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

function renderNewsletters(): string {
  if (newsletters.length === 0) return '';

  const recent = newsletters.slice(0, RECENT_COUNT);
  const archive = newsletters.slice(RECENT_COUNT);

  const recentSection = [
    `## 활동 보고 (최근 ${recent.length}호)`,
    '',
    ...recent.map(
      (n) => `- [${n.title}](${baseUrl}/news/${n.id}) — ${n.publishDate}: ${oneLine(n.summary)}`
    ),
  ].join('\n');

  if (archive.length === 0) return recentSection;

  const archiveSection = [
    '',
    '## 활동 보고 아카이브',
    '',
    ...archive.map((n) => `- [${n.title}](${baseUrl}/news/${n.id}) — ${n.publishDate}`),
  ].join('\n');

  return recentSection + '\n' + archiveSection;
}

const outro = `## 참고

- [사이트맵](${baseUrl}/sitemap.xml)
- 문의: alf.seoul.kr@gmail.com`;

export function GET() {
  const body = [intro, renderNewsletters(), outro].filter(Boolean).join('\n\n') + '\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
