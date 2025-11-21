'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // Image 컴포넌트 임포트

// 섹션 데이터 정의 (사이드바 및 ID 생성용)
const sections = [
  { id: 'intro', title: '들어가며' },
  {
    id: 'meeting', title: '1. 첫 만남', subSections: [
      { id: 'meeting-prep', title: '1.1 준비' },
      { id: 'meeting-visit', title: '1.2 첫 방문' },
    ]
  },
  {
    id: 'deepening', title: '2. 예술가로서 더 깊어지기', subSections: [
      { id: 'deepening-text', title: '2.1 현장, 창작의 텍스트' },
      { id: 'deepening-identity', title: '2.2 정체성 확장' },
      { id: 'deepening-sustain', title: '2.3 지속가능한 연대' },
    ]
  },
  {
    id: 'co-creation', title: '3. 공동 창조', subSections: [
      { id: 'co-creation-planning', title: '3.1 함께 기획/만들기' },
      { id: 'co-creation-language', title: '3.2 현장의 언어/미학' },
      { id: 'co-creation-festival', title: '3.3 함께 만드는 축제' },
    ]
  },
  {
    id: 'record', title: '4. 기록과 확산', subSections: [
      { id: 'record-archiving', title: '4.1 예술적 기록/아카이빙' },
      { id: 'record-spread', title: '4.2 경계를 넘어선 확산' },
      { id: 'record-narrative', title: '4.3 대안 서사 만들기' },
    ]
  },
  {
    id: 'anarchism', title: '5. 아나키즘적 실천', subSections: [
      { id: 'anarchism-horizontal', title: '5.1 수평적 관계' },
      { id: 'anarchism-mutual', title: '5.2 상호부조/자원 공유' },
      { id: 'anarchism-prefiguration', title: '5.3 프리피규레이션' },
    ]
  },
  {
    id: 'culture', title: '6. 지속가능한 연대 문화', subSections: [
      { id: 'culture-network', title: '6.1 연대망 구축' },
      { id: 'culture-generation', title: '6.2 새로운 세대와 동행' },
      { id: 'culture-after', title: '6.3 투쟁, 그 이후의 관계' },
    ]
  },
  { id: 'epilogue', title: '마무리' },
];

// 스크롤 다운 버튼 컴포넌트
const ScrollDownButton = ({ targetId }: { targetId: string }) => (
  <motion.button
    className="relative mt-8 mb-16 flex justify-center mx-auto p-2 cursor-pointer"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: [0, 10, 0] }}
    transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
    onClick={() => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }}
    aria-label="Scroll down"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </motion.button>
);

import type { Metadata } from 'next';
import { metadata } from './metadata';

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  // sectionRefs는 이제 h2와 h3 요소 모두를 참조합니다.
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  // 애니메이션 변수
  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };

  // 스타일 변수
  const sectionStyle = "mb-16 bg-neutral-800 rounded-xl p-8 shadow-lg scroll-mt-40"; // scroll-margin 추가
  const sectionNoBgStyle = "mb-16 scroll-mt-40"; // 배경 없는 섹션 스타일
  const h2Style = "text-3xl font-bold mb-8 text-white font-serif"; // scroll-mt 제거
  const h3Style = "text-2xl font-semibold mb-6 text-white font-serif"; // scroll-mt 제거
  const pStyle = "text-neutral-300 leading-relaxed text-lg mb-6 font-sans";
  const ulStyle = "list-disc list-outside text-neutral-300 space-y-3 text-lg mb-6 pl-5 font-sans"; // list-inside -> list-outside, pl-5 추가
  const quoteStyle = "border-l-4 border-yellow-500 pl-4 italic text-neutral-300 my-8 text-lg bg-neutral-900 p-6 rounded-md font-sans";
  const highlightBoxStyle = "bg-neutral-700 p-6 rounded-lg my-8 border-l-4 border-red-500 text-neutral-200 font-sans";

  // Intersection Observer 설정
  useEffect(() => {
    const options = {
      rootMargin: '-20% 0px -75% 0px', // 뷰포트 상단 20% ~ 25% 영역 기준으로 활성화
      threshold: 0
    };

    observer.current = new IntersectionObserver((entries) => {
      // isIntersecting 상태인 첫 번째 항목을 활성 섹션으로 설정
      const intersectingEntry = entries.find(entry => entry.isIntersecting);
      if (intersectingEntry) {
        setActiveSection(intersectingEntry.target.id);
      }
    }, options);

    // 모든 섹션 요소 관찰 시작 (h2, h3 모두 관찰)
    const elementsToObserve = document.querySelectorAll('h2[id], h3[id]');
    elementsToObserve.forEach((el) => {
      sectionRefs.current.set(el.id, el as HTMLElement);
      observer.current?.observe(el);
    });

    // 컴포넌트 언마운트 시 관찰 중지
    return () => {
      sectionRefs.current.forEach((el) => {
        if (el && observer.current) { // observer.current null 체크 추가
          observer.current.unobserve(el);
        }
      });
    };
  }, []); // 빈 배열로 의존성 설정

  // 현재 활성 섹션 또는 그 상위 섹션 ID 찾기 (하위 섹션 활성화 시 상위 섹션도 활성화)
  const currentActiveOrParentId = useMemo(() => {
    if (!activeSection) return sections[0]?.id; // 기본값으로 첫 섹션 ID

    // 현재 활성 섹션이 하위 섹션인지 확인하고 상위 섹션 ID 반환
    for (const section of sections) {
      if (section.subSections?.some(sub => sub.id === activeSection)) {
        return section.id;
      }
    }
    // 현재 활성 섹션이 상위 섹션이거나 하위 섹션이 없는 경우 그대로 반환
    if (sections.some(section => section.id === activeSection)) {
      return activeSection;
    }

    return sections[0]?.id; // 어떤 경우에도 해당하지 않으면 첫 섹션 ID 반환
  }, [activeSection]);


  return (
    // Flex 레이아웃 적용 (lg 이상 화면에서 사이드바 표시)
    <div className="container mx-auto pt-28 pb-20 px-4 flex flex-col lg:flex-row"> {/* 이전 오류 수정 시도 제거 */}
      {/* 사이드바 */}
      <aside className="w-full lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-24 self-start lg:pr-8 lg:mr-8 lg:border-r border-neutral-700 lg:h-[calc(100vh-10rem)] lg:overflow-y-auto mb-12 lg:mb-0">
        <nav>
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 hidden lg:block">목차</p>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`#${section.id}`}
                  className={`block text-sm font-medium transition-colors ${currentActiveOrParentId === section.id ? 'text-yellow-500 font-semibold' : 'text-neutral-400 hover:text-white'
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const targetEl = document.getElementById(section.id);
                    if (targetEl) {
                      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {section.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 min-w-0">
        {/* 제목과 부제목 */}
        <motion.div
          className="mb-20 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-5xl font-bold mb-6 text-white font-giants-inline">
            현장 연대를 위한 예술가 가이드
          </h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-sans">
            투쟁과 창조, 그 경계에서 함께 걷는 길
          </p>
        </motion.div>

        {/* 들어가며 */}
        <motion.section
          id={sections[0].id} // 섹션에 ID 추가
          className={sectionStyle}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 100px 0px" }}
        >
          {/* 소개 페이지처럼 그리드 레이아웃 적용 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* h2에 ID 추가 */}
              <motion.h2 variants={fadeIn} className={h3Style}>{sections[0].title}: 예술, 침묵을 깨고 세상 속으로</motion.h2>
              <motion.p variants={fadeIn} className={pStyle}>
                혹시 이런 마음을 품어본 적 없으신가요? 캔버스 앞에서, 악기 앞에서, 혹은 빈 종이 앞에서 문득 느껴지는 막막함. "내가 하는 이 작업이 세상과 무슨 상관이 있을까?", "아름다움을 추구하는 것만으로 충분할까?", "저 바깥의 외침과 고통 앞에서 내 예술은 너무 무력한 건 아닐까?" 많은 예술가들이 한 번쯤은 품어봤을 법한 질문이자, 어쩌면 떨쳐내기 어려운 불안일지도 모릅니다.
              </motion.p>
              <motion.p variants={fadeIn} className={pStyle}>
                특히 우리 사회 곳곳에서 벌어지는 부당함 – 일터에서 쫓겨난 노동자들의 절규, 삶의 터전을 송두리째 빼앗길 위기에 놓인 주민들의 눈물, 파괴되는 자연 앞에서 미래를 걱정하는 목소리들 – 을 마주할 때, 예술가로서의 고민은 더욱 깊어집니다. ‘예술’이라는 이름 아래 안전한 작업실에 머물러야 할지, 아니면 저 현장의 일부가 되어야 할지 망설이게 됩니다.
              </motion.p>
              <motion.p variants={fadeIn} className={pStyle}>
                <strong className="text-yellow-500">현장 연대</strong>는 이 망설임과 질문에 대한 하나의 대답이자, 예술가로서 세상과 관계 맺는 또 다른 방식입니다. 이는 단순히 ‘사회 문제에 참여하는 착한 예술가’가 되는 것을 의미하지 않습니다. 오히려, 예술의 본질적인 힘 – 공감하고, 질문하고, 기존의 질서를 낯설게 보게 만들고, 보이지 않던 것을 드러내는 힘 – 을 가장 절실한 삶의 현장에서 발견하고 발휘하는 과정입니다.
              </motion.p>
              <motion.p variants={fadeIn} className={pStyle}>
                이 가이드는 당신이 어떤 장르의 예술가이든, <strong className="text-yellow-500">현장 연대</strong>라는 여정에 조금 더 용기를 내어 발을 디딜 수 있도록 돕기 위해 쓰였습니다. 당신이 가진 예술가로서의 감수성과 표현력이 얼마나 소중한 연대의 자원이 될 수 있는지, 그리고 그 과정에서 당신의 예술과 삶이 어떻게 더 깊어지고 확장될 수 있는지 함께 탐색하고자 합니다. 두려워하지 마세요. 완벽한 준비나 정답은 없습니다. 다만, 열린 마음과 배우려는 자세, 그리고 함께하려는 진심만 있다면 충분합니다. 지금부터 그 여정을 위한 구체적인 안내를 시작합니다.
              </motion.p>
            </div>
            {/* 이미지 추가 */}
            <motion.div variants={fadeIn} className="relative h-[32rem] w-full overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
              <Image
                src="/images/gallery/DSC05755.webp" // 이미지 경로 변경
                alt="예술해방전선 회원들이 연대 현장에서 함께 피켓을 들고 있는 모습"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </div>
        </motion.section>

        <ScrollDownButton targetId={sections[1].id} /> {/* 다음 섹션 ID 전달 */}

        <hr className="border-neutral-700 my-16" />

        {/* 1. 첫 만남 */}
        <motion.section
          id={sections[1].id} // 섹션에 ID 추가
          className={sectionStyle}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 100px 0px" }}
        >
          {/* h2에 ID 추가 */}
          <motion.h2 variants={fadeIn} className={h2Style}>{sections[1].title}: 낯선 문턱을 넘어, 마음으로 다가가기</motion.h2>
          <motion.p variants={fadeIn} className={`${pStyle} mb-10`}>
            현장은 낯설고, 때로는 두렵게 느껴질 수 있습니다. 하지만 그 문턱을 넘어서는 첫걸음이 중요합니다. 조심스럽지만 진솔하게 다가가는 방법을 알아봅니다.
          </motion.p>

          {/* 전체 너비 이미지 */}
          <motion.div variants={fadeIn} className="relative h-[24rem] w-full overflow-hidden rounded-lg mb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/DSC04644.webp"
              alt="집회와 연대 현장에서 함께하는 사람들"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            {/* h3에 ID 추가 */}
            <h3 id={sections[1].subSections![0].id} className={h3Style}><span className="mr-2">🧐</span>{sections[1].subSections![0].title}: 아는 만큼 보이고, 존중하는 만큼 열립니다</h3>
            <p className={pStyle}>
              섣불리 현장에 뛰어들기 전에, 그곳의 이야기를 충분히 듣고 배우려는 노력이 필요합니다. 이는 단순한 정보 습득을 넘어, 연대하고자 하는 이들에 대한 깊은 존중의 표현입니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>무엇을, 왜 알아야 할까요?</p>
            <ul className={ulStyle}>
              <li><strong>사건의 맥락 (역사, 원인, 경과):</strong> 이 투쟁이 왜 시작되었는지, 어떤 과정을 거쳐왔는지 이해하는 것은 피상적인 동정을 넘어 문제의 본질에 다가가는 첫걸음입니다. 배경 지식 없이 던지는 질문이나 행동은 때로 당사자들에게 상처를 주거나 오해를 살 수 있습니다.</li>
              <li><strong>핵심 요구와 쟁점:</strong> 그들이 무엇을 위해 싸우고 있는지 명확히 알아야 합니다. 때로는 언론 보도나 외부 시선에 의해 요구가 왜곡되거나 단순화되기도 합니다. 당사자들이 직접 내세우는 목소리에 귀 기울여야 합니다.</li>
              <li><strong>관계의 지도 (주요 당사자, 이해관계자):</strong> 누가 이 투쟁의 중심에 있는지, 누가 그들을 지지하고 누가 반대하는지 파악하는 것은 현장의 복잡한 역학 관계를 이해하는 데 도움이 됩니다.</li>
              <li><strong>현재 상황과 분위기:</strong> 투쟁의 단계(예: 초기, 교착 상태, 협상 중, 탄압 국면 등)에 따라 현장의 분위기나 필요한 연대의 방식이 달라질 수 있습니다. 현재 어떤 활동이 주로 이루어지고 있는지, 당사자들이 느끼는 가장 큰 어려움은 무엇인지 알아두면 좋습니다.</li>
              <li><strong>기존 연대 활동들:</strong> 이미 어떤 단체나 개인들이 어떤 방식으로 연대하고 있는지 알아보세요. 특히 예술적인 개입이 있었다면 어떤 형태였고 어떤 반응을 얻었는지 참고하면 좋습니다. 중복되거나 불필요한 활동을 피하고, 기존 연대 흐름에 자연스럽게 합류하는 데 도움이 됩니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>어떻게 다가갈 수 있을까요?</p>
            <ul className={ulStyle}>
              <li><strong>다양한 자료 활용:</strong> 관련 뉴스 기사, 심층 보도, 다큐멘터리, 투쟁 주체가 운영하는 SNS나 웹사이트, 관련 단체의 보고서나 성명서, 학술 자료나 책 등을 폭넓게 찾아보세요.</li>
              <li><strong>온라인 커뮤니티:</strong> 관련 이슈를 다루는 온라인 커뮤니티나 포럼 등에서 오가는 이야기들을 살펴보는 것도 현장의 분위기를 감지하는 데 도움이 됩니다.</li>
              <li><strong>공개 행사 참여:</strong> 현장 방문 전, 일반 시민에게 열려 있는 집회, 문화제, 강연회, 간담회 등에 먼저 참여해보는 것이 좋습니다. 직접적인 관계 맺기 전에 멀리서나마 현장의 목소리와 분위기를 익힐 수 있는 좋은 기회입니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>방문 전 마음 점검:</p>
            <ul className={ulStyle}>
              <li><strong>나의 선입견 돌아보기:</strong> 이 투쟁이나 관련 이슈에 대해 내가 이미 가지고 있는 생각이나 편견은 무엇인가? 미디어를 통해 형성된 이미지는 아닐까?</li>
              <li><strong>나의 기대와 두려움:</strong> 현장에서 무엇을 얻고 싶은가? 혹은 무엇이 걱정되는가? (예: 내가 도움이 안 될까 봐, 거부당할까 봐, 감정적으로 힘들까 봐 등) 자신의 마음을 솔직하게 들여다보는 것이 중요합니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="relative h-[24rem] w-full overflow-hidden rounded-lg my-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_9949.webp"
              alt="첫 만남과 현장 방문의 순간"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[1].subSections![1].id} className={h3Style}><span className="mr-2">🤝</span>{sections[1].subSections![1].title}: 예술가 이전에 한 사람의 이웃으로</h3>
            <p className={pStyle}>
              드디어 현장을 방문하기로 마음먹었다면, ‘내가 무엇을 해줄 수 있을까?’라는 생각보다 ‘나는 여기서 무엇을 배우고 함께할 수 있을까?’라는 열린 마음을 가지는 것이 중요합니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>몸과 마음으로 현장 느끼기:</p>
            <ul className={ulStyle}>
              <li><strong>낮은 자세, 열린 귀:</strong> 자신을 드러내려 하기보다, 조용히 현장의 일부가 되어 보세요. 사람들의 표정, 대화 소리, 현장의 소음, 공기의 느낌, 벽에 붙은 구호나 그림들… 오감을 열고 그 공간과 사람들을 있는 그대로 느껴보세요.</li>
              <li><strong>섣부른 개입은 금물:</strong> 처음부터 사진기를 들이대거나, 질문 공세를 하거나, 해결책을 제시하려 하지 마세요. 특히 개인적인 경험이나 트라우마에 대해 함부로 묻는 것은 큰 실례입니다.</li>
              <li><strong>작은 도움부터:</strong> 주변을 둘러보고 혹시 도움이 필요한 일이 있는지 살펴보세요. 무거운 짐을 함께 들거나, 주변 정리를 돕거나, 필요한 물품(따뜻한 음료, 간식 등)을 조용히 건네는 것만으로도 마음을 전할 수 있습니다. ‘무엇이든 시켜만 주십시오’라는 태도보다는, 자연스럽게 할 수 있는 일을 찾아 함께하는 것이 좋습니다.</li>
              <li><strong>‘그냥 있음’의 힘:</strong> 때로는 특별한 무언가를 하지 않고 그저 그 자리에 함께 있어 주는 것만으로도 큰 힘이 됩니다. 당신의 존재 자체가 ‘당신은 혼자가 아니다’라는 메시지를 전달할 수 있습니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>관계 맺기의 시작:</p>
            <ul className={ulStyle}>
              <li><strong>자기소개는 천천히:</strong> 처음 만난 사람에게 자신을 ‘예술가’라고 바로 소개하기보다, ‘관심 있어서 왔다’, ‘지나가다 들렀다’ 등 편안하게 다가가세요. 관계가 조금씩 쌓이면 자연스럽게 자신이 하는 일에 대해 이야기할 기회가 생길 것입니다.</li>
              <li><strong>경청의 중요성:</strong> 사람들이 자신의 이야기를 할 때, 판단하거나 평가하지 않고 진심으로 귀 기울여 들어주세요. 질문은 상대방이 편안하게 느낄 때, 조심스럽게 시작하는 것이 좋습니다. “괜찮으시다면, 조금 더 자세히 이야기해주실 수 있을까요?” 와 같은 방식으로 상대방의 의사를 존중하며 대화를 이어가세요.</li>
              <li><strong>꾸준함과 인내:</strong> 신뢰는 하루아침에 쌓이지 않습니다. 한 번의 방문으로 모든 것을 이해하거나 관계를 맺으려 하기보다, 꾸준히 관심을 가지고 다시 찾아가는 것이 중요합니다. 때로는 거절당하거나 오해받을 수도 있습니다. 실망하지 않고 진정성 있는 태도를 유지하는 것이 필요합니다.</li>
            </ul>
          </motion.div>
          <motion.blockquote variants={fadeIn} className={quoteStyle}>
            <strong>&lt;핵심 질문&gt;</strong> 나는 지금 현장의 이야기를 들으러 왔는가, 아니면 내 이야기를 하러 왔는가? 나의 존재가 그들에게 부담이 되지는 않는가?
          </motion.blockquote>
        </motion.section>
        <ScrollDownButton targetId={sections[2].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 2. 예술가로서 더 깊어지기 (배경 제거) */}
        <motion.section
          id={sections[2].id} // 섹션에 ID 추가
          className={sectionStyle} // 배경 스타일 다시 적용
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 100px 0px" }}
        >
          {/* h2에 ID 추가 */}
          <motion.h2 variants={fadeIn} className={h2Style}>{sections[2].title}: 연대는 나를 성장시키는 또 다른 작업실</motion.h2>
          <motion.p variants={fadeIn} className={`${pStyle} mb-10`}>
            <strong className="text-yellow-500">현장 연대</strong>는 당신의 예술적 감수성과 표현력을 필요로 하지만, 동시에 당신에게 예술적 영감과 성찰의 기회를 제공하는 살아있는 작업실이 될 수 있습니다. 소진되지 않고 이 관계를 지속하며 함께 성장하는 방법을 고민해봅니다.
          </motion.p>

          {/* 전체 너비 이미지 */}
          <motion.div variants={fadeIn} className="relative h-[28rem] w-full overflow-hidden rounded-lg mb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_3829.webp"
              alt="예술가들의 공동 작업과 창작 활동"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            {/* h3에 ID 추가 */}
            <h3 id={sections[2].subSections![0].id} className={h3Style}><span className="mr-2">✍️</span>{sections[2].subSections![0].title}: 창작의 살아있는 텍스트가 되다</h3>
            <p className={pStyle}>
              투쟁 현장은 고통과 갈등만이 아니라, 강인한 삶의 의지, 예상치 못한 유머, 독특한 공동체 문화, 그리고 새로운 미적 감각이 꿈틀대는 곳입니다. 예술가는 이 생생한 텍스트를 읽어내는 독자이자, 새로운 의미를 부여하는 창작자가 될 수 있습니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>오감을 벼리는 관찰:</p>
            <ul className={ulStyle}>
              <li><strong>시각:</strong> 현수막의 색깔과 글씨체, 사람들의 옷차림과 표정, 공간의 배치와 변화, 빛과 그림자. (시각 예술가는 여기서 새로운 구도나 색 조합, 상징적 이미지를 발견할 수 있습니다.)</li>
              <li><strong>청각:</strong> 투쟁 구호의 리듬, 발언자들의 목소리 톤 변화, 집회 현장의 소음과 음악 소리, 일상적인 대화의 말씨와 억양, 침묵의 순간. (음악가는 여기서 새로운 리듬, 멜로디, 음색, 혹은 음악적 구조에 대한 영감을 얻을 수 있습니다.)</li>
              <li><strong>후각/미각:</strong> 함께 나누는 음식의 냄새, 현장의 공기, 계절의 변화. (이는 글쓰기나 퍼포먼스 등에서 현장감을 살리는 중요한 요소가 될 수 있습니다.)</li>
              <li><strong>촉각:</strong> 거친 바닥의 느낌, 차가운 바람, 서로 맞잡은 손의 온기. (설치 미술이나 퍼포먼스에서 질감이나 신체 감각을 활용하는 데 영감을 줄 수 있습니다.)</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>기록과 내면화, 그리고 거리두기:</p>
            <ul className={ulStyle}>
              <li><strong>다양한 기록:</strong> 스케치, 메모, 녹음, 사진, 영상 등 자신에게 익숙하고 편안한 방식으로 현장의 인상과 감정을 기록하세요. 이는 단순한 자료 수집이 아니라, 경험을 소화하고 의미를 부여하는 과정입니다.</li>
              <li><strong>성찰의 시간:</strong> 현장에서 느낀 감정(분노, 슬픔, 연민, 희망, 혼란 등)과 생각들을 일기나 작업 노트에 적으며 정리해보세요. “이 경험이 나에게 어떤 질문을 던지는가?”, “내 기존 작업 방식이나 세계관에 어떤 영향을 미치는가?” 스스로에게 질문하며 내면화하는 시간이 필요합니다.</li>
              <li><strong>의식적인 거리두기:</strong> 때로는 현장의 감정에 너무 깊이 몰입되지 않도록 의식적으로 거리를 두는 연습도 필요합니다. 객관적인 시각을 유지하고, 예술적 언어로 번역하기 위한 성찰의 공간을 확보하기 위함입니다. 모든 경험을 즉시 예술로 만들어야 한다는 부담감을 내려놓으세요.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>예술적 언어로의 번역:</p>
            <ul className={ulStyle}>
              <li><strong>새로운 형식 실험:</strong> 현장의 경험은 기존의 정형화된 예술 형식에 담기 어려울 수 있습니다. 현장 자체를 활용한 설치나 퍼포먼스, 다큐멘터리적 요소와 허구적 상상력을 결합한 글쓰기, 현장의 소리를 이용한 사운드 아트, 참여자들과 함께 만드는 워크숍 기반 작업 등 새로운 형식을 탐색하고 실험해보세요.</li>
              <li><strong>은유와 상징 찾기:</strong> 현장의 구체적인 사건이나 인물을 넘어서, 그 안에 담긴 보편적인 의미(예: 부당함에 대한 저항, 인간 존엄성, 연대의 가치, 상실과 치유 등)를 포착하고 이를 예술적 은유나 상징으로 표현하는 방법을 고민해보세요.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="relative h-[24rem] w-full overflow-hidden rounded-lg my-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_9946.webp"
              alt="예술가로서 현장에서 깊어지는 경험"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[2].subSections![1].id} className={h3Style}><span className="mr-2">🦋</span>{sections[2].subSections![1].title}: 경계를 넘어 확장되다</h3>
            <p className={pStyle}>
              <strong className="text-yellow-500">현장 연대</strong>는 ‘예술가’라는 정체성을 위협하는 것이 아니라, 오히려 그 의미를 더욱 풍부하고 단단하게 만들어줄 수 있습니다. 사회와 유리된 순수 예술가라는 신화에서 벗어나, 세상 속에서 호흡하는 예술가로 거듭나는 과정입니다.
            </p>
            <ul className={ulStyle}>
              <li><strong>‘무엇을 위한 예술인가’ 질문하기:</strong> 현장의 경험은 예술의 사회적 역할과 책임에 대해 근본적인 질문을 던지게 합니다. 미학적 완성도와 사회적 메시지 사이의 긴장, 예술의 자율성과 사회적 개입 사이의 고민은 당신의 예술 철학을 더욱 깊게 만들 것입니다. 정답을 찾기보다, 이 질문들과 씨름하는 과정 자체가 예술적 성장의 동력이 됩니다.</li>
              <li><strong>다중적인 역할 수용하기:</strong> 현장에서 예술가는 때로는 창작자, 때로는 기록자, 때로는 워크숍 진행자, 때로는 집회 참가자, 때로는 그저 이야기를 들어주는 친구가 될 수 있습니다. 이 다양한 역할 사이를 유연하게 오가며, ‘예술가’라는 고정된 정체성에 갇히지 않고 상황에 따라 필요한 역할을 수행하는 법을 배우게 됩니다. 이는 예술가로서의 역량을 확장시키는 기회가 됩니다.</li>
              <li><strong>협업, 다름 속에서 배우기:</strong> 다른 배경을 가진 예술가, 활동가, 현장 당사자들과의 협업은 필연적으로 갈등과 조율의 과정을 동반합니다. 하지만 서로 다른 관점과 기술이 만나 부딪히고 융합되는 과정에서 예상치 못한 창의적인 결과가 탄생하기도 합니다. 타인의 목소리에 귀 기울이고, 자신의 아이디어를 설득하며, 함께 목표를 향해 나아가는 경험은 예술가로서뿐 아니라 한 인간으로서 성장하는 소중한 기회입니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[2].subSections![2].id} className={h3Style}><span className="mr-2">❤️‍🩹</span>{sections[2].subSections![2].title}: 나를 태우지 않고 불을 지피는 법</h3>
            <p className={pStyle}>
              열정만으로는 오래가기 어렵습니다. <strong className="text-yellow-500">현장 연대</strong>는 때로 깊은 감정 소모와 좌절감을 안겨줄 수 있습니다. 지속가능한 연대를 위해서는 자기 자신과 동료들을 돌보는 지혜가 필요합니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>나의 리듬과 한계 존중하기:</p>
            <ul className={ulStyle}>
              <li><strong>에너지 관리:</strong> 자신이 감당할 수 있는 시간과 에너지의 양을 현실적으로 파악하세요. 매일 현장에 나가지 못하더라도 죄책감을 느낄 필요는 없습니다. 짧더라도 집중해서 함께하거나, 다른 방식으로(예: 온라인 홍보, 후원) 기여할 수도 있습니다.</li>
              <li><strong>‘아니오’라고 말할 용기:</strong> 모든 요청에 응하거나 모든 역할를 수행해야 한다는 부담감에서 벗어나세요. 자신의 상태를 살피고, 감당하기 어려운 요구에는 정중하게 거절할 수 있어야 합니다. 이는 이기적인 것이 아니라, 오래 함께하기 위한 책임감 있는 태도입니다.</li>
              <li><strong>의식적인 휴식:</strong> 현장의 긴장감에서 벗어나 재충전하는 시간을 의식적으로 가지세요. 예술 작업 외에 자신을 즐겁게 하는 활동(취미, 운동, 친구 만나기 등)을 통해 에너지 균형을 맞추는 것이 중요합니다.</li>
            </ul>
            {/* 강조 블록 예시 */}
            <motion.div variants={fadeIn} className={highlightBoxStyle}>
              <p className="font-semibold mb-2">기억하세요:</p>
              <p>자신의 에너지와 한계를 존중하고 '아니오'라고 말할 용기를 가지는 것은 이기적인 것이 아니라, 오래도록 지치지 않고 함께하기 위한 책임감 있는 태도입니다.</p>
            </motion.div>
            <p className={`${pStyle} font-semibold text-white`}>함께 지키는 지속가능성:</p>
            <ul className={ulStyle}>
              <li><strong>역할 분담과 협력:</strong> 모든 짐을 혼자 지려 하지 마세요. 함께하는 동료 예술가나 활동가들과 솔직하게 어려움을 나누고 역할을 분담하세요. 서로의 강점을 활용하고 약점을 보완하는 협력 체계를 만드는 것이 중요합니다.</li>
              <li><strong>정기적인 소통과 점검:</strong> 함께 연대하는 그룹 내에서 정기적으로 만나 서로의 안부를 묻고 활동을 평가하며 앞으로의 계획을 논의하는 시간을 가지세요. 감정적인 어려움을 터놓고 이야기하고 지지받을 수 있는 안전한 공간을 확보하는 것이 중요합니다.</li>
              <li><strong>작은 성공 축하하기:</strong> 투쟁은 길고 지루한 싸움일 수 있습니다. 그 과정에서 얻는 작은 성과나 긍정적인 변화들을 함께 나누고 축하하며 서로를 격려하는 것이 지속적인 동기 부여에 도움이 됩니다.</li>
            </ul>
          </motion.div>
          <motion.blockquote variants={fadeIn} className={quoteStyle}>
            <strong>&lt;핵심 질문&gt;</strong> 나의 연대 활동은 나 자신과 동료들에게 에너지를 주는가, 아니면 고갈시키는가? 어떻게 하면 더 건강하고 지속 가능하게 함께할 수 있을까?
          </motion.blockquote>
        </motion.section>
        <ScrollDownButton targetId={sections[3].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 3. 공동 창조 */}
        <motion.section
          id={sections[3].id} // 섹션에 ID 추가
          className={sectionStyle}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 100px 0px" }}
        >
          {/* h2에 ID 추가 */}
          <motion.h2 variants={fadeIn} className={h2Style}>{sections[3].title}: 예술, 투쟁의 언어가 되고 투쟁, 예술의 영감이 되다</motion.h2>
          <motion.p variants={fadeIn} className={`${pStyle} mb-10`}>
            <strong className="text-yellow-500">현장 연대</strong> 예술의 진정한 의미는 예술가가 일방적으로 무언가를 ‘선사’하는 것이 아니라, 현장의 당사자들과 <strong>함께 새로운 의미와 형식을 빚어가는 공동 창조</strong>의 과정에 있습니다. 이는 예술과 투쟁이 서로에게 영감을 주고 영향을 미치며 함께 성장하는 역동적인 과정입니다.
          </motion.p>

          {/* 전체 너비 이미지 */}
          <motion.div variants={fadeIn} className="relative h-[28rem] w-full overflow-hidden rounded-lg mb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/DSC05730.webp"
              alt="함께하는 공동 창작과 축제의 현장"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            {/* h3에 ID 추가 */}
            <h3 id={sections[3].subSections![0].id} className={h3Style}><span className="mr-2">🎨</span>{sections[3].subSections![0].title}: 모두가 예술가 되는 순간</h3>
            <p className={pStyle}>
              예술 프로젝트의 시작부터 마무리까지, 당사자들의 목소리가 중심이 되고 그들의 참여가 자연스럽게 이루어질 때, 예술은 진정한 연대의 도구가 될 수 있습니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>아이디어, 현장에서 움트다:</p>
            <ul className={ulStyle}>
              <li><strong>필요 기반 기획:</strong> "어떤 예술이 지금 우리에게 필요할까?", "우리의 이야기를 세상에 알리는 데 어떤 예술적 방식이 도움이 될까?" 와 같은 질문을 당사자들과 함께 나누며 프로젝트의 방향을 설정하세요. 예술가의 아이디어를 제시하더라도, 그것이 현장의 맥락과 필요에 부합하는지 끊임없이 확인하고 수정하는 열린 자세가 중요합니다.</li>
              <li><strong>참여 방식의 다양성:</strong> 모든 사람이 그림을 그리거나 노래를 부를 필요는 없습니다. 이야기 나누기, 글쓰기, 사진 찍기, 소품 만들기, 아이디어 회의 참여 등 각자가 편안하고 의미 있게 참여할 수 있는 다양한 방식을 고안하고 제안하세요.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>수평적 창작 환경 조성:</p>
            <ul className={ulStyle}>
              <li><strong>‘전문가’라는 이름표 내려놓기:</strong> 예술가는 기술이나 경험 면에서 더 능숙할 수 있지만, 그것이 우월함을 의미하지는 않습니다. 당사자들의 경험과 직관, 아이디어를 존중하고 경청하며, 서로 배우고 가르치는 평등한 관계를 지향하세요.</li>
              <li><strong>안전하고 즐거운 분위기:</strong> 창의성은 비난이나 평가에 대한 두려움이 없을 때 발현됩니다. 실수해도 괜찮고, 서툴러도 괜찮다는 격려의 말과 분위기를 만들어 모두가 자신의 생각과 감정을 자유롭게 표현할 수 있도록 도와주세요. 때로는 함께 웃고 즐기는 과정 자체가 중요한 치유와 연대의 경험이 됩니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>과정은 그 자체로 결과:</p>
            <ul className={ulStyle}>
              <li><strong>결과보다 관계:</strong> 최종 결과물의 미적 완성도에만 집착하기보다, 함께 만들어가는 과정에서 형성되는 관계, 나누는 대화, 서로에게 미치는 긍정적인 영향에 더 큰 의미를 두세요. 그 과정 자체가 이미 공동체의 힘을 키우고 투쟁에 활력을 불어넣는 예술적 실천일 수 있습니다.</li>
              <li><strong>과정의 기록과 공유:</strong> 함께 작업하는 모습, 나누는 이야기, 만들어지는 중간 결과물들을 사진이나 영상, 글로 기록하고 공유하는 것은 참여자들에게 성취감을 주고 연대 의식을 높이는 좋은 방법입니다. 이 기록물 자체가 또 다른 예술 작품이 될 수도 있습니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="relative h-[24rem] w-full overflow-hidden rounded-lg my-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_0045.webp"
              alt="함께 만드는 공동 창작의 과정"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[3].subSections![1].id} className={h3Style}><span className="mr-2">🗣️</span>{sections[3].subSections![1].title}: 발견하고 증폭하기</h3>
            <p className={pStyle}>
              모든 투쟁 현장에는 그곳만의 고유한 분위기, 상징, 언어, 리듬이 존재합니다. 예술가는 이를 섬세하게 포착하여 <strong>현장의 목소리를 더욱 풍부하고 힘있게 만드는 촉매</strong>가 될 수 있습니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>현장의 '미적 요소' 채집하기:</p>
            <ul className={ulStyle}>
              <li><strong>시각적 상징:</strong> 손으로 쓴 피켓의 글씨체, 투쟁의 역사를 담은 사진들, 농성장의 임시 구조물, 당사자들이 즐겨 입는 옷이나 사용하는 물건 등 현장을 구성하는 시각적 요소들에 주목하세요.</li>
              <li><strong>청각적 풍경:</strong> 반복되는 구호의 운율, 집회에서 불리는 노래, 당사자들의 독특한 말투나 자주 쓰는 표현, 현장에서 들리는 기계 소음이나 자연의 소리 등을 주의 깊게 들어보세요.</li>
              <li><strong>이야기와 서사:</strong> 당사자들이 공유하는 개인적인 경험담, 집단적인 기억, 미래에 대한 희망이나 불안 등 현장에 흐르는 이야기들을 경청하세요.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>자연스러운 표현 존중하기:</p>
            <ul className={ulStyle}>
              <li><strong>‘날것’의 아름다움:</strong> 투쟁 과정에서 당사자들이 즉흥적으로 만들어내는 노래나 율동, 그림, 글 등에는 꾸미지 않은 진솔함과 강력한 에너지가 담겨 있습니다. 이를 ‘세련되게’ 다듬으려 하기보다, 그 자체의 가치를 인정하고 존중하는 태도가 중요합니다.</li>
              <li><strong>함께 발전시키기:</strong> 만약 당사자들이 원한다면, 그들의 표현을 바탕으로 함께 발전시켜나갈 수 있습니다. 예를 들어, 함께 가사를 다듬거나, 그림을 더 크게 그리거나, 이야기를 더 많은 사람에게 전달할 방법을 함께 고민하는 방식입니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>예술적 변용과 확장:</p>
            <ul className={ulStyle}>
              <li><strong>낯설게 하기:</strong> 현장에서 발견한 요소들을 새로운 맥락에 배치하거나 다른 형식과 결합하여 익숙한 것을 낯설게 보이게 함으로써, 문제의 본질에 대해 다시 한번 생각하게 만들 수 있습니다. (예: 투쟁 구호를 클래식 음악 형식으로 편곡하기, 폐품을 이용해 투쟁의 상징물을 만들기)</li>
              <li><strong>의미 증폭하기:</strong> 현장의 언어와 이미지를 활용하여, 그 안에 담긴 의미(예: 저항, 희망, 연대, 존엄)를 더욱 강력하고 감동적으로 전달하는 예술 작품을 창조할 수 있습니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[3].subSections![2].id} className={h3Style}><span className="mr-2">🎉</span>{sections[3].subSections![2].title}: 함께 만드는 축제</h3>
            <p className={pStyle}>
              현장에서의 예술 활동은 예술가와 관객이라는 이분법을 넘어, <strong>모두가 주인공이 되고 함께 참여하며 서로에게 힘을 주는 공동체적 축제</strong>가 될 수 있습니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>공간의 재구성:</p>
            <ul className={ulStyle}>
              <li><strong>열린 무대:</strong> 무대와 객석의 경계를 허물거나 아예 없애고, 모두가 서로의 얼굴을 보며 함께할 수 있는 공간(예: 원형 배치)을 만듭니다. 현장의 지형지물이나 특성을 창의적으로 활용하여 무대 배경이나 설치물로 삼을 수도 있습니다.</li>
              <li><strong>찾아가는 예술:</strong> 고정된 무대가 아니라, 현장의 여러 장소를 이동하며 짧은 공연을 하거나 워크숍을 진행하는 등, 예술이 사람들의 일상 속으로 직접 찾아가는 방식을 시도할 수 있습니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>참여를 디자인하다:</p>
            <ul className={ulStyle}>
              <li><strong>쉬운 참여:</strong> 함께 따라 부를 수 있는 쉬운 노래, 간단한 율동, 다 같이 외치는 구호, 짧은 글귀 이어가기 등 누구나 부담 없이 참여할 수 있는 요소를 포함합니다.</li>
              <li><strong>목소리 내기:</strong> 공연 중간중간 당사자들이나 참여자들이 자유롭게 자신의 생각이나 느낌, 경험을 이야기할 수 있는 시간을 마련합니다. 정해진 대본 없이 즉흥적인 발언과 이야기가 오가는 열린 구조를 지향합니다.</li>
              <li><strong>공동 작업:</strong> 공연의 일부로 함께 그림을 그리거나, 메시지를 적은 천을 이어 붙이거나, 작은 상징물을 만드는 등 공동의 결과물을 만들어내는 과정을 포함할 수 있습니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>예술을 넘어 관계로:</p>
            <ul className={ulStyle}>
              <li><strong>시작과 끝:</strong> 공연이나 예술 활동 전후로 함께 음식을 나누거나 차를 마시며 자연스럽게 이야기를 나눌 수 있는 시간을 마련합니다. 이는 단순한 행사를 넘어, 서로의 마음을 나누고 관계를 다지는 중요한 계기가 됩니다.</li>
              <li><strong>지속적인 만남:</strong> 일회성 이벤트로 끝나지 않고, 정기적인 문화제나 워크숍, 소모임 등을 통해 만남을 이어가며 연대의 끈을 더욱 단단하게 만듭니다.</li>
            </ul>
          </motion.div>
          <motion.blockquote variants={fadeIn} className={quoteStyle}>
            <strong>&lt;핵심 질문&gt;</strong> 나의 예술 활동은 현장의 에너지를 끌어올리고 사람들을 연결하는가? 아니면 일방적인 보여주기에 그치는가? 어떻게 하면 더 많은 사람이 즐겁게 참여하고 주인이 될 수 있을까?
          </motion.blockquote>
        </motion.section>
        <ScrollDownButton targetId={sections[4].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 4. 투쟁의 기록과 확산 (배경 제거) */}
        <motion.section
          id={sections[4].id} // 섹션에 ID 추가
          className={sectionStyle} // 배경 스타일 다시 적용
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 100px 0px" }}
        >
          {/* h2에 ID 추가 */}
          <motion.h2 variants={fadeIn} className={h2Style}>{sections[4].title}: 목소리 없는 이들의 목소리가 되어</motion.h2>
          <motion.p variants={fadeIn} className={`${pStyle} mb-10`}>
            예술은 현장의 생생한 경험과 절실한 목소리를 기록하고, 그 울림을 현장 너머의 세상으로 <strong>확산시키는 강력한 매체</strong>가 될 수 있습니다. 이는 단순한 정보 전달을 넘어, 공감을 이끌어내고 연대의 지평을 넓히는 중요한 실천입니다.
          </motion.p>

          {/* 전체 너비 이미지 */}
          <motion.div variants={fadeIn} className="relative h-[28rem] w-full overflow-hidden rounded-lg mb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_9984.webp"
              alt="현장 기록과 아카이빙 활동"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            {/* h3에 ID 추가 */}
            <h3 id={sections[4].subSections![0].id} className={h3Style}><span className="mr-2">💾</span>{sections[4].subSections![0].title}: 사라지는 것들을 붙잡아 미래에게</h3>
            <p className={pStyle}>
              투쟁의 순간들은 빠르게 지나가고 잊히기 쉽습니다. 예술적 기록은 그 순간의 의미를 포착하고 보존하여, <strong>현재의 투쟁에 힘을 보태고 미래 세대에게 역사의 교훈을 전달</strong>하는 역할을 합니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>기록의 윤리와 책임:</p>
            <ul className={ulStyle}>
              <li><strong>‘대상화’ 경계:</strong> 당사자들을 단순한 ‘피사체’나 ‘취재 대상’으로 여기지 않도록 주의해야 합니다. 그들의 존엄성을 존중하고, 기록 과정에서 그들이 주체적으로 참여하고 목소리를 낼 수 있도록 노력해야 합니다. 기록물을 완성한 후에도 당사자들과 내용을 공유하고 피드백을 받는 것이 좋습니다.</li>
              <li><strong>맥락의 중요성:</strong> 기록된 이미지나 이야기가 원래의 맥락에서 벗어나 오용되거나 왜곡될 가능성을 항상 염두에 두어야 합니다. 기록물의 배포와 활용에 신중을 기해야 합니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>다양한 기록의 방식:</p>
            <ul className={ulStyle}>
              <li><strong>시각 기록:</strong> 사진, 영상, 드로잉, 만화 등은 현장의 분위기와 감정을 직관적으로 전달하는 데 효과적입니다. 객관적 기록뿐 아니라 예술가의 주관적 해석이 담긴 표현도 가능합니다.</li>
              <li><strong>청각 기록:</strong> 인터뷰 녹음, 현장 소리 채집(사운드스케이프), 구술사 기록 등은 당사자들의 생생한 목소리와 현장의 분위기를 보존하는 데 중요합니다.</li>
              <li><strong>문자 기록:</strong> 인터뷰 기사, 르포, 에세이, 시, 소설 등은 사건의 맥락과 인물의 내면을 깊이 있게 전달하고 성찰을 유도하는 데 강점이 있습니다.</li>
              <li><strong>참여적 아카이빙:</strong> 당사자들이 직접 자신의 이야기를 기록하거나(예: 일기 쓰기 워크숍, 휴대폰 사진/영상 촬영) 기록물 수집 및 정리에 참여하는 방식을 통해, 아카이브 자체가 공동의 기억 저장소가 되도록 할 수 있습니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>기록물의 생명력 부여:</p>
            <ul className={ulStyle}>
              <li><strong>체계적인 정리:</strong> 수집된 기록물을 주제별, 시간별 등으로 분류하고 설명(메타데이터)을 덧붙여 체계적으로 정리합니다. 이는 이후의 활용을 용이하게 합니다.</li>
              <li><strong>접근성 높이기:</strong> 정리된 기록물을 온라인 아카이브, 블로그, 독립 출판물, 전시, 상영회 등 다양한 형태로 가공하여 더 많은 사람이 쉽게 접하고 활용할 수 있도록 합니다. 저작권 및 이용 정책을 명확히 설정하는 것이 중요합니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="relative h-[24rem] w-full overflow-hidden rounded-lg my-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_5901.webp"
              alt="현장의 기록과 확산"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[4].subSections![1].id} className={h3Style}><span className="mr-2">🌐</span>{sections[4].subSections![1].title}: 고립된 섬들을 연결하는 다리 놓기</h3>
            <p className={pStyle}>
              현장에서 만들어진 예술과 이야기는 현장 안에만 머물러서는 안 됩니다. 세상과 소통하고 다른 이들의 마음을 움직여 <strong>연대의 물결을 더 넓고 깊게</strong> 만들어야 합니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>‘번역’의 기술:</p>
            <ul className={ulStyle}>
              <li><strong>공감의 언어 찾기:</strong> 현장의 특수한 맥락이나 용어를 잘 모르는 사람들도 쉽게 이해하고 공감할 수 있도록, 보편적인 감성이나 경험에 호소하는 언어와 표현을 사용하는 것이 중요합니다. 복잡한 이슈를 개인의 이야기나 감동적인 순간을 통해 전달하는 것이 효과적일 수 있습니다.</li>
              <li><strong>다양한 매체 활용:</strong> 전달하려는 메시지와 대상에 맞는 매체를 선택해야 합니다. 젊은 층에게는 SNS나 짧은 영상이, 깊이 있는 논의를 위해서는 강연이나 출판물이, 감성적 접근에는 공연이나 전시가 더 효과적일 수 있습니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>새로운 만남 주선하기:</p>
            <ul className={ulStyle}>
              <li><strong>찾아가는 예술:</strong> 갤러리나 공연장뿐 아니라, 거리, 공원, 학교, 지역 커뮤니티 공간 등 예상치 못한 장소에서 전시나 공연을 열어 우연한 만남을 통해 새로운 관객과 소통할 수 있습니다.</li>
              <li><strong>온라인 플랫폼 활용:</strong> 웹사이트, 블로그, 유튜브, 팟캐스트, SNS 등을 통해 시공간의 제약 없이 투쟁의 이야기를 확산시키고, 댓글이나 온라인 모임을 통해 소통과 토론을 이어갈 수 있습니다.</li>
              <li><strong>다른 이슈와의 연결:</strong> 특정 투쟁의 이야기를 다루면서도, 이와 유사한 다른 사회 문제(예: 다른 지역의 강제 철거 문제, 비정규직 노동 문제, 환경 파괴 문제)와 연결하여 연대의 지평을 넓힐 수 있습니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>지속적인 소통 노력:</p>
            <ul className={ulStyle}>
              <li><strong>일회성이 아닌 꾸준함:</strong> 한 번의 공연이나 전시로 끝나지 않고, 꾸준히 새로운 작업물을 발표하고 소식을 전하며 사람들의 관심과 참여를 지속적으로 유도하는 것이 중요합니다.</li>
              <li><strong>피드백과 대화:</strong> 작품이나 활동에 대한 사람들의 반응과 질문에 귀 기울이고 적극적으로 소통하며 대화를 이어가려는 노력이 필요합니다. 이를 통해 오해를 해소하고 이해의 깊이를 더할 수 있습니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[4].subSections![2].id} className={h3Style}><span className="mr-2">📢</span>{sections[4].subSections![2].title}: 보이지 않던 이야기의 힘</h3>
            <p className={pStyle}>
              세상은 종종 권력이나 다수, 혹은 미디어에 의해 만들어진 이야기(주류 서사)를 통해 현실을 인식합니다. 예술은 이러한 주류 서사에 가려지거나 왜곡된 <strong>소수자의 목소리와 경험을 드러내고, 새로운 관점과 해석을 제시</strong>함으로써 세상에 균열을 내는 역할을 할 수 있습니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>‘프레임’ 깨뜨리기:</p>
            <ul className={ulStyle}>
              <li><strong>이면 드러내기:</strong> 언론 보도나 공식 발표 뒤에 숨겨진 진실, 당사자들이 겪는 구체적인 고통과 부당함을 예술적 언어로 생생하게 드러냅니다. (예: ‘개발’이라는 이름 뒤에 가려진 폭력성, ‘효율성’이라는 명분 아래 희생되는 인간의 존엄성)</li>
              <li><strong>복잡성 보여주기:</strong> 세상을 선과 악, 가해자와 피해자라는 단순한 이분법으로 나누는 대신, 문제의 복잡한 맥락과 다양한 인물들의 입체적인 모습을 섬세하게 그려냄으로써 깊이 있는 이해를 유도합니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>개인적인 것이 가장 정치적인 것:</p>
            <ul className={ulStyle}>
              <li><strong>미시 서사의 힘:</strong> 거대 담론이나 추상적인 통계 대신, 한 개인의 구체적인 삶의 이야기, 사소해 보이는 일상의 경험을 통해 사회 구조적인 문제를 설득력 있게 보여줍니다. 독자나 관객이 감정적으로 이입하고 공감할 수 있는 통로를 만듭니다.</li>
              <li><strong>감정의 정치학:</strong> 분노, 슬픔, 두려움뿐 아니라 사랑, 희망, 자부심, 유머 등 투쟁 현장에 존재하는 다양한 감정들을 섬세하게 포착하고 표현함으로써, 인간적인 공감대를 형성하고 연대의 감정을 불러일으킵니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>저항과 희망의 씨앗 뿌리기:</p>
            <ul className={ulStyle}>
              <li><strong>피해자를 넘어 주체로:</strong> 어려움 속에서도 좌절하지 않고 자신의 존엄성을 지키며 저항하는 이들의 능동적인 모습, 서로 돕고 의지하며 공동체를 이루어가는 과정을 그림으로써, 단순한 동정심을 넘어 존경과 연대의 마음을 이끌어냅니다.</li>
              <li><strong>대안적 상상력:</strong> 현실의 문제를 고발하는 것을 넘어, 우리가 꿈꾸는 더 나은 세상의 모습, 대안적인 관계와 삶의 방식을 예술적 상상력을 통해 제시함으로써 희망의 가능성을 보여줍니다.</li>
            </ul>
          </motion.div>
          <motion.blockquote variants={fadeIn} className={quoteStyle}>
            <strong>&lt;핵심 질문&gt;</strong> 나의 예술은 어떤 이야기를 누구의 목소리로 전하고 있는가? 혹시 나도 모르게 주류의 시각을 답습하고 있지는 않은가? 어떻게 하면 가려진 진실과 목소리를 더 효과적으로 드러낼 수 있을까?
          </motion.blockquote>
        </motion.section>
        <ScrollDownButton targetId={sections[5].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 5. 아나키즘적 예술 실천 */}
        <motion.section
          id={sections[5].id} // 섹션에 ID 추가
          className={sectionStyle}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 100px 0px" }}
        >
          {/* h2에 ID 추가 */}
          <motion.h2 variants={fadeIn} className={h2Style}>{sections[5].title}: 위계 없이 자유롭게, 서로 도우며 함께 성장하기</motion.h2>
          <motion.p variants={fadeIn} className={`${pStyle} mb-10`}>
            "아나키즘"이라는 단어가 조금 낯설거나 과격하게 들릴 수도 있습니다. 하지만 여기서 말하는 아나키즘적 실천은 거창한 이념 투쟁이 아니라, 우리가 현장에서 관계 맺고 함께 작업하는 방식에 대한 <strong>근본적인 질문이자 대안적인 태도</strong>입니다. 이는 권위적인 명령이나 위계적인 질서 대신, <strong>개인의 자율성과 상호 존중, 그리고 자발적인 협력(<span className="text-yellow-500">상호부조</span>)</strong>을 바탕으로 모두가 평등하고 자유롭게 연대하고 창조하는 방식을 모색하는 것입니다. <strong className="text-yellow-500">현장 연대</strong>는 종종 기존 사회의 불평등한 권력 관계에 맞서는 일이기에, 우리의 연대 방식 자체에서부터 평등과 자유의 가치를 실현하려는 노력은 매우 중요합니다.
          </motion.p>

          {/* 전체 너비 이미지 */}
          <motion.div variants={fadeIn} className="relative h-[24rem] w-full overflow-hidden rounded-lg mb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_3425.webp"
              alt="수평적 관계와 상호부조의 현장"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            {/* h3에 ID 추가 */}
            <h3 id={sections[5].subSections![0].id} className={h3Style}><span className="mr-2">⚖️</span>{sections[5].subSections![0].title}: '리더' 없이 모두가 주인이 되는 길</h3>
            <p className={pStyle}>
              우리는 알게 모르게 위계적인 관계에 익숙합니다. 리더가 있고, 전문가가 있고, 지시하고 따르는 역할 분담. 하지만 <strong className="text-yellow-500">현장 연대</strong>에서는 이러한 익숙한 방식이 오히려 소통을 막고, 특정인의 목소리만 커지게 하며, 참여자들의 자발성을 위축시킬 수 있습니다. 수평적 관계는 <strong>모든 참여자의 경험과 지혜가 동등하게 존중받고, 의사결정 과정에 동등하게 참여</strong>하는 것을 목표로 합니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>왜 수평성이 중요할까요?</p>
            <ul className={ulStyle}>
              <li><strong>진정한 참여 보장:</strong> 위계가 없거나 약할 때, 사람들은 더 자유롭게 자신의 의견을 내고 적극적으로 참여하게 됩니다. 이는 더 창의적이고 다양한 아이디어를 가능하게 합니다.</li>
              <li><strong>권력 집중 방지:</strong> 특정 개인이나 소수 그룹에게 권한이 집중되는 것을 막고, 책임과 역할을 공유함으로써 더 민주적이고 건강한 관계를 만들 수 있습니다.</li>
              <li><strong>연대의 내적 민주주의:</strong> 우리가 싸우는 대상이 불평등한 권력 구조라면, 우리의 연대 방식 자체에서부터 평등의 가치를 실현하려는 노력이 필요합니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>어떻게 실천할 수 있을까요?</p>
            <ul className={ulStyle}>
              <li><strong>모두의 목소리 듣기:</strong> 회의나 논의 시, 발언 기회를 독점하는 사람이 없도록 하고, 모든 사람이 편안하게 말할 수 있는 분위기를 만듭니다. 돌아가며 발언하기, 발언 시간 제한 두기, 조용한 사람에게 먼저 의견 묻기 등의 방법을 활용할 수 있습니다.</li>
              <li><strong>합의 기반 의사결정:</strong> 다수결보다는 시간이 걸리더라도 모든 참여자가 동의하거나 최소한 수용할 수 있는 결정을 내리려고 노력합니다(컨센서스). 이는 소수의 의견도 존중하고, 결정에 대한 공동의 책임감을 높입니다.</li>
              <li><strong>역할 순환과 공유:</strong> 특정한 직책(대표, 총무 등)을 고정하기보다, 필요에 따라 역할을 나누어 맡고 주기적으로 순환하는 방식을 시도합니다. 이는 특정인에게 부담이 쏠리는 것을 막고, 모두가 다양한 경험을 통해 성장할 기회를 제공합니다.</li>
              <li><strong>‘암묵적 위계’ 경계하기:</strong> 공식적인 직책이 없더라도 경력, 나이, 성별, 학력, 발언 능력 등에 따라 보이지 않는 위계가 형성될 수 있습니다. 이러한 역학 관계를 민감하게 인식하고, 평등한 소통을 위해 의식적으로 노력해야 합니다.</li>
            </ul>
            {/* 강조 블록 예시 */}
            <motion.div variants={fadeIn} className={highlightBoxStyle}>
              <p className="font-semibold mb-2">중요한 점:</p>
              <p>수평적 관계는 때로 비효율적이고 어려울 수 있습니다. 완벽함보다는 더 평등한 관계를 향해 끊임없이 성찰하고 소통하려는 지속적인 노력이 중요합니다.</p>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn} className="relative h-[24rem] w-full overflow-hidden rounded-lg my-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_5423.webp"
              alt="수평적 관계와 상호부조의 실천"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[5].subSections![1].id} className={h3Style}><span className="mr-2">🤲</span>{sections[5].subSections![1].title}: 경쟁 대신 협력으로, 각자도생 대신 함께 살기로</h3>
            <p className={pStyle}>
              <strong className="text-yellow-500">상호부조</strong>는 시혜나 동정이 아니라, <strong>'너의 문제가 곧 나의 문제'라는 인식 아래 서로 돕고 자원을 나누며 함께 어려움을 헤쳐나가는 연대의 원리</strong>입니다. 이는 경쟁과 효율성을 강조하는 자본주의 사회의 논리와는 다른, 인간적인 협력의 가치를 실현하는 방식입니다. 예술가들의 <strong className="text-yellow-500">현장 연대</strong>에서도 <strong className="text-yellow-500">상호부조</strong>는 매우 중요하고 실질적인 힘이 됩니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>상호부조는 왜 중요할까요?</p>
            <ul className={ulStyle}>
              <li><strong>자원의 한계 극복:</strong> 예술가 개개인이나 투쟁 현장이 가진 자원은 부족한 경우가 많습니다. 서로 가진 것을 나누고 힘을 합칠 때, 더 많은 일을 해낼 수 있습니다.</li>
              <li><strong>소속감과 안정감:</strong> 서로 돕고 돌보는 관계망 속에서 예술가들은 정서적 지지와 안정감을 얻고, 고립감이나 소진을 예방할 수 있습니다.</li>
              <li><strong>자율성과 독립성 강화:</strong> 외부 지원이나 시장 논리에 의존하기보다, 내부적인 협력을 통해 필요한 것을 스스로 충족시키는 경험은 공동체의 자율성과 독립성을 키워줍니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>어떤 것들을 나누고 도울 수 있을까요?</p>
            <ul className={ulStyle}>
              <li><strong>물질적 자원:</strong> 악기, 음향 장비, 미술 도구, 작업 공간, 차량 등을 공동으로 사용하거나 빌려줄 수 있습니다. 남는 재료나 물품을 필요한 곳에 기증할 수도 있습니다.</li>
              <li><strong>지식과 기술:</strong> 포스터 디자인, 영상 촬영/편집, 글쓰기, 번역, 법률 자문, 행사 기획, 홍보 등 각자가 가진 전문 기술이나 지식을 필요한 동료나 현장에 기꺼이 제공하고 가르쳐줄 수 있습니다. 스터디 그룹이나 기술 워크숍을 함께 열 수도 있습니다.</li>
              <li><strong>시간과 노동:</strong> 현장의 집회 준비, 농성장 지킴이, 전단지 배포, 식사 준비 등 직접적인 노동력을 제공할 수 있습니다. 동료 예술가의 작업이나 행사를 돕는 것도 상호부조의 중요한 실천입니다.</li>
              <li><strong>정서적 지원:</strong> 서로의 이야기에 귀 기울여주고, 공감하고, 격려하는 것은 매우 중요한 <strong className="text-yellow-500">상호부조</strong>입니다. 함께 활동하며 겪는 어려움이나 감정을 솔직하게 나누고 지지하는 관계를 만듭니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>어떻게 시스템을 만들 수 있을까요?</p>
            <ul className={ulStyle}>
              <li><strong>자원 목록 공유:</strong> 각자가 기여할 수 있는 자원(물질, 기술, 시간 등)의 목록을 만들어 공유하고, 필요할 때 서로에게 요청하고 연결하는 시스템을 만들 수 있습니다. (예: 온라인 공유 문서, 메신저 그룹 활용)</li>
              <li><strong>공동 기금 마련:</strong> 작은 회비를 모으거나 공동 프로젝트 수익금 등으로 공동 기금을 마련하여, 긴급한 필요(벌금, 치료비, 활동비 등)가 발생했을 때 지원하는 방안도 고려해볼 수 있습니다.</li>
              <li><strong>정기적인 돌봄 모임:</strong> 활동 공유뿐 아니라, 서로의 안부를 묻고 정서적 지지를 나누는 모임을 정기적으로 가지는 것이 좋습니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[5].subSections![2].id} className={h3Style}><span className="mr-2">🌱</span>{sections[5].subSections![2].title}: 우리가 꿈꾸는 세상을 지금 여기서 살아내기</h3>
            <p className={pStyle}>
              <strong className="text-yellow-500">프리피규레이션(Prefiguration)</strong>은 조금 어려운 말처럼 들리지만, 그 의미는 간단합니다. <strong>"우리가 최종적으로 도달하고 싶은 이상적인 사회의 모습(예: 평등, 자유, 연대, 생태)을 먼 미래의 목표로만 두는 것이 아니라, 바로 지금 여기, 우리의 관계 맺는 방식과 활동 과정 속에서 미리 구현하고 실천한다"</strong>는 뜻입니다. 즉, 과정 자체가 목적의 일부가 되는 것입니다. <strong className="text-yellow-500">현장 연대</strong> 예술은 바로 이 <strong className="text-yellow-500">프리피규레이션</strong>의 중요한 실험장이 될 수 있습니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>왜 프리피규레이션이 중요할까요?</p>
            <ul className={ulStyle}>
              <li><strong>과정과 목적의 일치:</strong> 우리가 만드는 예술의 내용뿐 아니라, 그것을 만드는 과정 자체가 우리가 지향하는 가치를 담고 있을 때 그 메시지는 더욱 강력해집니다.</li>
              <li><strong>대안의 실현 가능성 증명:</strong> 우리가 꿈꾸는 다른 관계 맺기와 사회 운영 방식이 단지 이상이 아니라 현실에서 가능하다는 것을 작은 규모로나마 직접 보여줌으로써, 변화에 대한 희망과 영감을 줄 수 있습니다.</li>
              <li><strong>내적 동기 부여와 의미:</strong> 단순히 투쟁의 '수단'으로서 예술 활동을 하는 것을 넘어, 활동 과정 자체가 의미 있고 보람찰 때, 우리는 더 즐겁고 지속적으로 연대할 수 있습니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>어떻게 예술 활동 속에서 실천할 수 있을까요?</p>
            <ul className={ulStyle}>
              <li><strong>협업 과정:</strong> 예술 작품을 기획하고 창작하는 과정 자체를 위계 없이 수평적으로, 서로의 의견을 존중하며 합의를 통해 진행하는 것은 평등한 사회를 미리 살아보는 연습입니다.</li>
              <li><strong>자원 분배:</strong> 프로젝트 예산이나 수익금을 투명하게 공개하고, 참여자들의 기여와 필요에 따라 공정하게 분배하는 원칙을 세우고 실천합니다.</li>
              <li><strong>돌봄의 문화:</strong> 작업 과정에서 서로의 감정과 상태를 살피고, 경쟁보다는 격려와 지지를 우선하는 문화를 만듭니다. 마감이나 결과보다 사람을 중심에 둡니다.</li>
              <li><strong>생태적 감수성:</strong> 작품 제작이나 행사 진행 시, 환경에 미치는 영향을 고려하고 쓰레기를 줄이려는 노력을 함께 실천합니다.</li>
              <li><strong>예술의 내용:</strong> 우리가 꿈꾸는 대안적인 사회의 모습, 새로운 관계 맺기, 희망의 가능성 등을 예술 작품의 주제나 내용으로 다루는 것 자체도 프리피규레이션의 일부입니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>작은 실천의 힘:</p>
            <p className={pStyle}>
              <strong className="text-yellow-500">프리피규레이션</strong>은 거창한 것이 아닐 수 있습니다. 회의를 민주적으로 진행하는 방식, 함께 식사를 준비하고 나누는 방식, 서로의 실수를 너그럽게 받아들이는 방식 등, 우리가 일상적으로 관계 맺고 활동하는 모든 순간에 우리가 원하는 미래의 가치를 담으려는 의식적인 노력이 바로 <strong className="text-yellow-500">프리피규레이션</strong>의 시작입니다.
            </p>
          </motion.div>
          <motion.blockquote variants={fadeIn} className={quoteStyle}>
            <strong>&lt;핵심 질문&gt;</strong> 우리의 연대와 예술 활동 방식은 단지 목표를 위한 수단인가, 아니면 그 자체가 우리가 만들고 싶은 세상의 작은 조각인가? 우리의 관계와 과정 속에 우리가 비판하는 사회의 모습이 반복되고 있지는 않은가?
          </motion.blockquote>
        </motion.section>
        <ScrollDownButton targetId={sections[6].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 6. 지속가능한 연대 문화 만들기 (배경 제거) */}
        <motion.section
          id={sections[6].id} // 섹션에 ID 추가
          className={sectionStyle} // 배경 스타일 다시 적용
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 100px 0px" }}
        >
          {/* h2에 ID 추가 */}
          <motion.h2 variants={fadeIn} className={h2Style}>{sections[6].title}: 홀로 외롭지 않게, 함께 멀리 가기 위하여</motion.h2>
          <motion.p variants={fadeIn} className={`${pStyle} mb-10`}>
            한두 명의 열정적인 예술가만으로는 <strong className="text-yellow-500">현장 연대</strong>를 지속하기 어렵습니다. 더 많은 예술가들이 서로에게 배우고, 의지하며, 함께 성장할 수 있는 <strong>지지적인 문화와 커뮤니티를 만드는 것</strong>이 중요합니다. 이는 단지 활동의 효율성을 높이는 것을 넘어, 예술가들이 고립되지 않고 오랫동안 지치지 않으며 연대의 길을 걸어갈 수 있도록 돕는 안전망이자 자양분입니다. 아나키즘적 가치를 바탕으로 한 자율적이고 협력적인 예술 생태계를 함께 가꾸어 나가는 과정입니다.
          </motion.p>

          {/* 전체 너비 이미지 */}
          <motion.div variants={fadeIn} className="relative h-[28rem] w-full overflow-hidden rounded-lg mb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_3823.webp"
              alt="다양한 세대가 함께하는 지속가능한 연대 문화"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            {/* h3에 ID 추가 */}
            <h3 id={sections[6].subSections![0].id} className={h3Style}><span className="mr-2">🔗</span>{sections[6].subSections![0].title}: 점들을 이어 별자리를 그리다</h3>
            <p className={pStyle}>
              비슷한 고민과 지향을 가진 예술가들이 서로 연결될 때, 개인이 느끼는 부담감은 줄어들고 집단적인 지혜와 힘은 커집니다. 느슨하지만 필요할 때 서로에게 든든한 버팀목이 되어주는 <strong>유연하고 탄력적인 네트워크</strong>를 만들어가는 것이 중요합니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>왜 네트워크가 필요할까요?</p>
            <ul className={ulStyle}>
              <li><strong>정보와 자원 공유:</strong> 각자 알고 있는 정보, 가지고 있는 기술이나 장비, 현장 경험 등을 나누며 서로의 활동을 돕고 효율성을 높일 수 있습니다.</li>
              <li><strong>정서적 지지와 교류:</strong> 비슷한 고민을 하는 동료들과 소통하며 위로받고 격려하며 고립감을 해소할 수 있습니다. 함께 활동하며 느끼는 어려움이나 보람을 나눌 때 연대는 더욱 즐거워집니다.</li>
              <li><strong>집단적 목소리:</strong> 개인이 내기 어려운 목소리를 네트워크의 이름으로 함께 냄으로써 사회적 영향력을 높일 수 있습니다. (예: 공동 성명 발표, 공동 프로젝트 기획)</li>
              <li><strong>새로운 협력 기회:</strong> 네트워크를 통해 다른 분야의 예술가나 활동가들을 만나 새로운 협업 프로젝트를 구상하고 시도해볼 수 있습니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>어떤 네트워크를 만들 수 있을까요?</p>
            <ul className={ulStyle}>
              <li><strong>형식에 얽매이지 않기:</strong> 거창한 조직이나 단체를 만들 필요는 없습니다. 몇몇 친구들과의 정기적인 스터디 모임, 특정 이슈에 관심 있는 예술가들의 임시 프로젝트 그룹, 온라인 기반의 정보 공유 커뮤니티 등 다양한 형태가 가능합니다. 중요한 것은 형식보다 실질적인 교류와 협력입니다.</li>
              <li><strong>느슨함과 유연함:</strong> 참여와 탈퇴가 자유롭고, 각자의 상황에 맞게 참여 수준을 조절할 수 있는 유연한 구조가 좋습니다. 의무감보다는 자발성에 기반한 참여를 존중하는 문화를 만듭니다.</li>
              <li><strong>소통 채널 확보:</strong> 정기적인 오프라인 모임 외에도, 온라인 메신저 그룹, 메일링 리스트, 웹사이트/블로그 등을 활용하여 지속적으로 소통하고 정보를 공유할 수 있는 채널을 마련합니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>네트워크를 가꾸는 방법:</p>
            <ul className={ulStyle}>
              <li><strong>신뢰 쌓기:</strong> 활동 이야기뿐 아니라, 서로의 일상과 고민을 나누며 인간적인 유대감을 쌓는 것이 중요합니다. 함께 식사하거나 차를 마시는 등 비공식적인 교류의 시간을 자주 갖습니다.</li>
              <li><strong>작은 성공 나누기:</strong> 각자의 활동에서 얻은 작은 성과나 보람을 함께 나누고 축하하며 서로에게 긍정적인 에너지를 줍니다.</li>
              <li><strong>갈등 다루기:</strong> 서로 다른 의견이나 관점을 가질 수 있습니다. 갈등이 발생했을 때 회피하거나 비난하기보다, 솔직하게 대화하고 서로의 입장을 이해하려 노력하며 건설적으로 해결해나가는 방법을 함께 연습합니다.</li>
              <li><strong>환대의 문화:</strong> 새로운 사람이 네트워크에 들어왔을 때 따뜻하게 환영하고, 쉽게 적응하고 참여할 수 있도록 돕는 문화를 만듭니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="relative h-[24rem] w-full overflow-hidden rounded-lg my-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_3717.webp"
              alt="지속가능한 연대와 교류"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[6].subSections![1].id} className={h3Style}><span className="mr-2">🧑‍🤝‍🧑</span>{sections[6].subSections![1].title}: 경험을 나누고 미래를 함께 열기</h3>
            <p className={pStyle}>
              <strong className="text-yellow-500">현장 연대</strong>의 경험과 지혜는 소중한 자산입니다. 이것이 특정 세대에게만 머무르지 않고 <strong>다음 세대의 예술가들에게 자연스럽게 흘러가고 공유</strong>될 때, 연대의 역사는 더욱 풍부해지고 미래는 더 밝아질 수 있습니다. 이는 단순한 '가르침'이 아니라, 서로에게 배우고 영감을 주고받는 <strong>상호적인 동행</strong>의 과정입니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>왜 세대 간 연결이 중요할까요?</p>
            <ul className={ulStyle}>
              <li><strong>지속성 확보:</strong> 경험 많은 세대의 지혜와 노하우가 새로운 세대에게 전수될 때, 연대 활동의 지속성이 확보됩니다. 과거의 시행착오를 반복하지 않고 더 나은 방향으로 나아갈 수 있습니다.</li>
              <li><strong>새로운 활력과 관점:</strong> 새로운 세대는 기존의 방식에 도전하는 신선한 아이디어와 에너지를 불어넣을 수 있습니다. 다른 세대의 경험과 관점이 만날 때 혁신적인 발상이 가능해집니다.</li>
              <li><strong>역사의식 함양:</strong> 과거의 투쟁과 연대 역사를 배우는 것은 현재 우리가 발 딛고 있는 자리를 이해하고 미래를 전망하는 데 중요한 토대가 됩니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>어떻게 함께 걸어갈 수 있을까요?</p>
            <ul className={ulStyle}>
              <li><strong>배움의 장 마련:</strong> 현장 연대의 역사, 철학, 윤리, 방법론 등을 함께 공부하는 스터디 그룹이나 워크숍을 정기적으로 엽니다. 경험 많은 예술가들이 자신의 경험담과 노하우를 나누는 자리를 마련합니다.</li>
              <li><strong>멘토링과 파트너십:</strong> 경험 많은 예술가와 신진 예술가가 짝을 이루어 함께 현장을 방문하거나 프로젝트를 진행하며 자연스럽게 배우고 교류하는 기회를 만듭니다. 이는 일방적인 지도가 아니라, 서로에게 배우는 파트너십의 형태가 될 수 있습니다.</li>
              <li><strong>안전한 실험 공간:</strong> 신진 예술가들이 부담 없이 질문하고, 자신의 아이디어를 실험하고, 때로는 실수도 할 수 있는 안전하고 지지적인 환경을 제공합니다. 결과보다는 배우고 성장하는 과정 자체를 격려합니다.</li>
              <li><strong>열린 기록과 공유:</strong> 과거 연대 활동의 자료(사진, 영상, 글, 작품 등)를 잘 아카이빙하고 쉽게 접근할 수 있도록 하여, 새로운 세대가 과거의 경험으로부터 배울 수 있도록 돕습니다.</li>
              <li><strong>세대 간 대화의 자리:</strong> 서로 다른 세대의 예술가들이 편안하게 만나 각자의 경험, 고민, 예술적 언어를 나누고 서로를 이해하는 자리를 의식적으로 마련합니다.</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            {/* h3에 ID 추가 */}
            <h3 id={sections[6].subSections![2].id} className={h3Style}><span className="mr-2">➡️</span>{sections[6].subSections![2].title}: 마침표가 아닌 쉼표, 그리고 새로운 시작</h3>
            <p className={pStyle}>
              모든 투쟁에는 시작과 끝이 있습니다. 때로는 승리하기도 하고, 때로는 패배하거나 다른 국면으로 전환되기도 합니다. 중요한 것은 투쟁의 특정 국면이 마무리된 후에도 <strong>현장에서 만난 당사자들과의 관계를 어떻게 이어갈 것인가</strong> 하는 점입니다. 진정한 연대는 단기적인 목표 달성을 넘어선, <strong>지속적이고 인간적인 관계 맺음</strong>에 있습니다.
            </p>
            <p className={`${pStyle} font-semibold text-white`}>왜 관계의 지속성이 중요할까요?</p>
            <ul className={ulStyle}>
              <li><strong>진정성 있는 연대:</strong> 투쟁이 끝났다고 관계를 단절하는 것은 그동안의 연대가 도구적이거나 일시적이었음을 보여줄 수 있습니다. 관계의 지속은 우리의 연대가 진심이었음을 보여주는 증거입니다.</li>
              <li><strong>상호 치유와 성장:</strong> 투쟁 과정은 모두에게 깊은 상처와 트라우마를 남길 수 있습니다. 투쟁 이후에도 서로의 안부를 묻고 지지하며 함께 회복해나가는 과정은 매우 중요합니다. 또한 투쟁의 경험을 함께 성찰하며 의미를 부여하는 것은 집단적인 성장의 기회가 됩니다.</li>
              <li><strong>미래를 위한 자산:</strong> 투쟁 과정에서 맺어진 신뢰와 연대의 경험은 이후 다른 사회적 실천이나 공동체 활동으로 이어질 수 있는 소중한 자산입니다.</li>
            </ul>
            <p className={`${pStyle} font-semibold text-white`}>어떻게 관계를 이어갈 수 있을까요?</p>
            <ul className={ulStyle}>
              <li><strong>미리 이야기 나누기:</strong> 투쟁이 한창일 때부터 '만약 투쟁이 끝난다면 우리는 어떻게 될까?'에 대한 이야기를 나누며 이후의 관계에 대한 기대를 공유하고 준비할 수 있습니다.</li>
              <li><strong>새로운 협력 모색:</strong> 투쟁의 경험을 바탕으로 새로운 공동 프로젝트를 기획할 수 있습니다. (예: 투쟁 기록집 발간, 기념 전시/공연, 지역 문화 활동 공동 기획, 다른 현장을 위한 연대 활동 함께하기 등)</li>
              <li><strong>일상적인 교류 유지:</strong> 공식적인 활동이 없더라도, 정기적으로 연락하고 만나며 서로의 삶을 나누는 친구이자 동료로서 관계를 이어갑니다. 명절이나 기념일 등 특별한 날을 함께 챙기거나, 기쁜 일과 슬픈 일을 나눌 수 있는 사이가 됩니다.</li>
              <li><strong>승리와 패배의 의미 함께 찾기:</strong> 투쟁의 결과를 함께 평가하고, 그 과정에서 얻은 교훈과 의미를 함께 정리하고 기록하는 작업을 통해 경험을 공유 자산으로 만듭니다. 승리했다면 그 기쁨을 함께 나누고 기록하며, 설령 패배했더라도 그 의미를 함께 성찰하며 다음을 기약합니다.</li>
            </ul>
          </motion.div>
          <motion.blockquote variants={fadeIn} className={quoteStyle}>
            <strong>&lt;핵심 질문&gt;</strong> 우리의 연대는 특정 이슈나 목표에만 묶여 있는가, 아니면 사람과 사람 사이의 깊은 관계로 발전하고 있는가? 투쟁 이후, 우리는 서로에게 어떤 존재가 될 수 있을까?
          </motion.blockquote>
        </motion.section>
        <ScrollDownButton targetId={sections[7].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 마무리 */}
        <motion.section
          id={sections[7].id} // 섹션에 ID 추가
          className={sectionStyle}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "0px 0px 100px 0px" }}
        >
          {/* h2에 ID 추가 */}
          <motion.h2 variants={fadeIn} className={h3Style}>{sections[7].title}: 예술과 투쟁의 경계에서, 당신의 자리를 찾아서</motion.h2>
          <motion.p variants={fadeIn} className={`${pStyle} mb-10`}>
            지금까지 현장 연대라는 낯설지만 의미 있는 길에 대해 길게 이야기 나누었습니다. 이 가이드가 제시한 내용들이 때로는 너무 이상적이거나 어렵게 느껴졌을 수도 있습니다. 어쩌면 ‘과연 내가 할 수 있을까?’ 하는 두려움이나 망설임이 여전히 남아있을지도 모릅니다.
          </motion.p>

          {/* 전체 너비 이미지 */}
          <motion.div variants={fadeIn} className="relative h-[28rem] w-full overflow-hidden rounded-lg mb-10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/IMG_7341.webp"
              alt="예술과 투쟁의 경계에서 함께하는 모습"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.p variants={fadeIn} className={pStyle}>
            하지만 기억해주세요. <strong className="text-yellow-500">현장 연대</strong>는 완벽한 영웅이나 투사를 요구하는 것이 아닙니다. 정해진 매뉴얼이나 성공 공식이 있는 것도 아닙니다. 중요한 것은 <strong>세상의 아픔에 공감하는 마음, 불의에 함께 분노하고 연대하려는 의지, 그리고 예술가로서 자신이 가진 고유한 감수성과 표현력으로 기꺼이 그 여정에 동참하려는 용기</strong>입니다.
          </motion.p>
          <motion.p variants={fadeIn} className={pStyle}>
            이 길은 분명 쉽지 않을 것입니다. 때로는 깊은 무력감과 좌절을 경험할 수도 있고, 예상치 못한 오해나 갈등에 부딪힐 수도 있습니다. 당신의 예술이 즉각적인 변화를 만들어내지 못하는 것처럼 보일 수도 있습니다.
          </motion.p>
          <motion.p variants={fadeIn} className={pStyle}>
            그러나 그 모든 어려움에도 불구하고, <strong className="text-yellow-500">현장 연대</strong>는 당신에게 무엇과도 바꿀 수 없는 소중한 경험을 선사할 것입니다. 당신은 교과서나 뉴스에서는 결코 배울 수 없는 살아있는 삶의 이야기들을 만나게 될 것입니다. 당신의 예술은 상아탑을 벗어나 세상의 가장 절실한 목소리들과 공명하며 새로운 깊이와 울림을 얻게 될 것입니다. 그리고 무엇보다, 당신은 혼자가 아니라는 사실, 고통 속에서도 희망을 만들고 서로에게 기댈 어깨가 되어주는 사람들의 존재를 온몸으로 확인하게 될 것입니다.
          </motion.p>
          <motion.p variants={fadeIn} className={pStyle}>
            이 가이드가 당신의 첫걸음을 위한 작은 디딤돌이 되기를 바랍니다. 처음부터 모든 것을 잘하려고 애쓰기보다, 작은 관심에서 시작하여 천천히, 꾸준히, 그리고 진솔하게 다가가 보세요. 당신의 예술이, 당신의 존재 자체가 누군가에게는 따뜻한 위로가 되고, 용기가 되고, 함께 꾸는 꿈이 될 수 있습니다.
          </motion.p>
          <motion.blockquote variants={fadeIn} className={`${quoteStyle} text-center font-semibold`}> {/* 강조 스타일 */}
            "예술로 투쟁을 도와주는 게 아니라, 예술 자체가 투쟁이고, 그걸 함께 만드는 경험이 해방이다."
          </motion.blockquote>
          <motion.p variants={fadeIn} className={pStyle}>
            이 말처럼, 당신의 예술이 단지 투쟁의 '도구'가 아니라, 그 자체로 해방을 향한 여정의 일부가 되기를, 그리고 그 여정 속에서 당신 자신이 더욱 자유롭고 충만한 예술가로, 그리고 인간으로 성장하기를 진심으로 응원합니다. 이제, 당신의 자리에서, 당신만의 방식으로 연대의 첫걸음을 내딛어 보세요.
          </motion.p>
        </motion.section>

      </main> {/* 메인 콘텐츠 끝 */}
    </div>
  );
}