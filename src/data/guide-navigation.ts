export type GuideSection = {
  id: string;
  title: string;
  subSections?: Array<{
    id: string;
    title: string;
  }>;
};

export const guideSections: GuideSection[] = [
  { id: 'intro', title: '들어가며' },
  {
    id: 'meeting',
    title: '1. 첫 만남',
    subSections: [
      { id: 'meeting-prep', title: '1.1 준비' },
      { id: 'meeting-visit', title: '1.2 첫 방문' },
    ],
  },
  {
    id: 'deepening',
    title: '2. 예술가로서 더 깊어지기',
    subSections: [
      { id: 'deepening-text', title: '2.1 현장, 창작의 텍스트' },
      { id: 'deepening-identity', title: '2.2 정체성 확장' },
      { id: 'deepening-sustain', title: '2.3 지속가능한 연대' },
    ],
  },
  {
    id: 'co-creation',
    title: '3. 공동 창조',
    subSections: [
      { id: 'co-creation-planning', title: '3.1 함께 기획/만들기' },
      { id: 'co-creation-language', title: '3.2 현장의 언어/미학' },
      { id: 'co-creation-festival', title: '3.3 함께 만드는 축제' },
    ],
  },
  {
    id: 'record',
    title: '4. 기록과 확산',
    subSections: [
      { id: 'record-archiving', title: '4.1 예술적 기록/아카이빙' },
      { id: 'record-spread', title: '4.2 경계를 넘어선 확산' },
      { id: 'record-narrative', title: '4.3 대안 서사 만들기' },
    ],
  },
  {
    id: 'anarchism',
    title: '5. 아나키즘적 실천',
    subSections: [
      { id: 'anarchism-horizontal', title: '5.1 수평적 관계' },
      { id: 'anarchism-mutual', title: '5.2 상호부조/자원 공유' },
      { id: 'anarchism-prefiguration', title: '5.3 프리피규레이션' },
    ],
  },
  {
    id: 'culture',
    title: '6. 지속가능한 연대 문화',
    subSections: [
      { id: 'culture-network', title: '6.1 연대망 구축' },
      { id: 'culture-generation', title: '6.2 새로운 세대와 동행' },
      { id: 'culture-after', title: '6.3 투쟁, 그 이후의 관계' },
    ],
  },
  { id: 'epilogue', title: '마무리' },
];
