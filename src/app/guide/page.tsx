'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // Image 컴포넌트 임포트
import dynamic from 'next/dynamic'; // dynamic 임포트 추가

// 섹션 데이터 정의 (사이드바 및 ID 생성용)
const sections = [
  { id: 'intro', title: '들어가며' },
  { id: 'meeting', title: '1. 첫 만남', subSections: [
    { id: 'meeting-prep', title: '1.1 준비' },
    { id: 'meeting-visit', title: '1.2 첫 방문' },
  ]},
  { id: 'deepening', title: '2. 예술가로서 더 깊어지기', subSections: [
    { id: 'deepening-text', title: '2.1 현장, 창작의 텍스트' },
    { id: 'deepening-identity', title: '2.2 정체성 확장' },
    { id: 'deepening-sustain', title: '2.3 지속가능한 연대' },
  ]},
  { id: 'co-creation', title: '3. 공동 창조', subSections: [
    { id: 'co-creation-planning', title: '3.1 함께 기획/만들기' },
    { id: 'co-creation-language', title: '3.2 현장의 언어/미학' },
    { id: 'co-creation-festival', title: '3.3 함께 만드는 축제' },
  ]},
  { id: 'record', title: '4. 기록과 확산', subSections: [
    { id: 'record-archiving', title: '4.1 예술적 기록/아카이빙' },
    { id: 'record-spread', title: '4.2 경계를 넘어선 확산' },
    { id: 'record-narrative', title: '4.3 대안 서사 만들기' },
  ]},
  { id: 'anarchism', title: '5. 아나키즘적 실천', subSections: [
    { id: 'anarchism-horizontal', title: '5.1 수평적 관계' },
    { id: 'anarchism-mutual', title: '5.2 상호부조/자원 공유' },
    { id: 'anarchism-prefiguration', title: '5.3 프리피규레이션' },
  ]},
  { id: 'culture', title: '6. 지속가능한 연대 문화', subSections: [
    { id: 'culture-network', title: '6.1 연대망 구축' },
    { id: 'culture-generation', title: '6.2 새로운 세대와 동행' },
    { id: 'culture-after', title: '6.3 투쟁, 그 이후의 관계' },
  ]},
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
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }}
    aria-label="Scroll down"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </motion.button>
);

// 동적으로 섹션 컴포넌트 임포트
const IntroSection = dynamic(() => import('@/components/guide/IntroSection'), {
  loading: () => <p className="text-center text-neutral-400">로딩 중...</p>,
});
const MeetingSection = dynamic(() => import('@/components/guide/MeetingSection'), {
  loading: () => <p className="text-center text-neutral-400">로딩 중...</p>,
});
const DeepeningSection = dynamic(() => import('@/components/guide/DeepeningSection'), {
  loading: () => <p className="text-center text-neutral-400">로딩 중...</p>,
});
const CoCreationSection = dynamic(() => import('@/components/guide/CoCreationSection'), {
  loading: () => <p className="text-center text-neutral-400">로딩 중...</p>,
});
const RecordSection = dynamic(() => import('@/components/guide/RecordSection'), {
  loading: () => <p className="text-center text-neutral-400">로딩 중...</p>,
});
const AnarchismSection = dynamic(() => import('@/components/guide/AnarchismSection'), {
  loading: () => <p className="text-center text-neutral-400">로딩 중...</p>,
});
const CultureSection = dynamic(() => import('@/components/guide/CultureSection'), {
  loading: () => <p className="text-center text-neutral-400">로딩 중...</p>,
});
const EpilogueSection = dynamic(() => import('@/components/guide/EpilogueSection'), {
  loading: () => <p className="text-center text-neutral-400">로딩 중...</p>,
});


export default function GuidePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  // 애니메이션 변수
  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };

  // 스타일 변수
  const sectionStyle = "mb-16 bg-neutral-800 rounded-xl p-8 shadow-lg";
  const sectionNoBgStyle = "mb-16";
  const h2Style = "text-3xl font-bold mb-8 text-white scroll-mt-40";
  const h3Style = "text-2xl font-semibold mb-6 text-white scroll-mt-40";
  const pStyle = "text-neutral-300 leading-relaxed text-lg mb-6";
  const ulStyle = "list-disc list-outside text-neutral-300 space-y-3 text-lg mb-6 pl-5";
  const quoteStyle = "border-l-4 border-yellow-500 pl-4 italic text-neutral-300 my-8 text-lg bg-neutral-900 p-6 rounded-md";
  const highlightBoxStyle = "bg-neutral-700 p-6 rounded-lg my-8 border-l-4 border-red-500 text-neutral-200";

  // Intersection Observer 설정
  useEffect(() => {
    const options = {
      rootMargin: '-10% 0px -60% 0px', // 모바일 환경 고려하여 마진 조정
      threshold: 0
    };

    observer.current = new IntersectionObserver((entries) => {
      const intersectingEntry = entries.find(entry => entry.isIntersecting);
      if (intersectingEntry) {
        setActiveSection(intersectingEntry.target.id);
      }
    }, options);

    const elementsToObserve = document.querySelectorAll('h2[id], h3[id]');
    elementsToObserve.forEach((el) => {
      sectionRefs.current.set(el.id, el as HTMLElement);
      observer.current?.observe(el);
    });

    return () => {
      sectionRefs.current.forEach((el) => {
        if (el && observer.current) {
           observer.current.unobserve(el);
        }
      });
    };
  }, []);

   // 현재 활성 섹션 또는 그 상위 섹션 ID 찾기
   const currentActiveOrParentId = useMemo(() => {
     if (!activeSection) return sections[0]?.id;

     for (const section of sections) {
       if (section.subSections?.some(sub => sub.id === activeSection)) {
         return section.id;
       }
     }
     if (sections.some(section => section.id === activeSection)) {
        return activeSection;
     }

     return sections[0]?.id;
   }, [activeSection]);


  return (
    <div className="container mx-auto py-20 px-4 flex flex-col lg:flex-row">
      {/* 사이드바 */}
      <aside className="w-full lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-24 self-start lg:pr-8 lg:mr-8 lg:border-r border-neutral-700 lg:h-[calc(100vh-10rem)] lg:overflow-y-auto mb-12 lg:mb-0">
        <nav>
          <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 hidden lg:block">목차</p>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`#${section.id}`}
                  className={`block text-sm font-medium transition-colors ${
                    currentActiveOrParentId === section.id ? 'text-yellow-500 font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const targetElement = document.getElementById(section.id);
                    if (targetElement) {
                      const headerOffset = 100;
                      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                      const offsetPosition = elementPosition - headerOffset;

                      window.scrollTo({
                           top: offsetPosition,
                           behavior: "smooth"
                      });
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
      <main className="flex-1 min-w-0 isolate">
        {/* 제목과 부제목 */}
        <motion.div
          className="mb-20 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-5xl font-bold mb-6 text-white">
            현장 연대를 위한 예술가 가이드
          </h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto">
            투쟁과 창조, 그 경계에서 함께 걷는 길
          </p>
        </motion.div>

        {/* 들어가며 (동적 임포트) */}
        <IntroSection
          section={sections[0]}
          fadeIn={fadeIn}
          staggerContainer={staggerContainer}
          sectionStyle={sectionStyle}
          h3Style={h3Style}
          pStyle={pStyle}
        />

        <ScrollDownButton targetId={sections[1].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 1. 첫 만남 (동적 임포트) */}
        <MeetingSection
          section={sections[1]}
          fadeIn={fadeIn}
          sectionStyle={sectionStyle}
          h2Style={h2Style}
          h3Style={h3Style}
          pStyle={pStyle}
          ulStyle={ulStyle}
          quoteStyle={quoteStyle}
        />
        <ScrollDownButton targetId={sections[2].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 2. 예술가로서 더 깊어지기 (동적 임포트) */}
        <DeepeningSection
          section={sections[2]}
          fadeIn={fadeIn}
          sectionStyle={sectionStyle}
          h2Style={h2Style}
          h3Style={h3Style}
          pStyle={pStyle}
          ulStyle={ulStyle}
          quoteStyle={quoteStyle}
          highlightBoxStyle={highlightBoxStyle}
        />
        <ScrollDownButton targetId={sections[3].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 3. 공동 창조 (동적 임포트) */}
        <CoCreationSection
          section={sections[3]}
          fadeIn={fadeIn}
          sectionStyle={sectionStyle}
          h2Style={h2Style}
          h3Style={h3Style}
          pStyle={pStyle}
          ulStyle={ulStyle}
          quoteStyle={quoteStyle}
        />
        <ScrollDownButton targetId={sections[4].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 4. 기록과 확산 (동적 임포트) */}
        <RecordSection
          section={sections[4]}
          fadeIn={fadeIn}
          sectionStyle={sectionStyle}
          h2Style={h2Style}
          h3Style={h3Style}
          pStyle={pStyle}
          ulStyle={ulStyle}
          quoteStyle={quoteStyle}
        />
        <ScrollDownButton targetId={sections[5].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 5. 아나키즘적 실천 (동적 임포트) */}
        <AnarchismSection
          section={sections[5]}
          fadeIn={fadeIn}
          sectionStyle={sectionStyle}
          h2Style={h2Style}
          h3Style={h3Style}
          pStyle={pStyle}
          ulStyle={ulStyle}
          quoteStyle={quoteStyle}
          highlightBoxStyle={highlightBoxStyle}
        />
        <ScrollDownButton targetId={sections[6].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 6. 지속가능한 연대 문화 (동적 임포트) */}
        <CultureSection
          section={sections[6]}
          fadeIn={fadeIn}
          sectionStyle={sectionStyle}
          h2Style={h2Style}
          h3Style={h3Style}
          pStyle={pStyle}
          ulStyle={ulStyle}
          quoteStyle={quoteStyle}
        />
        <ScrollDownButton targetId={sections[7].id} />

        <hr className="border-neutral-700 my-16" />

        {/* 마무리 (동적 임포트) */}
        <EpilogueSection
          section={sections[7]}
          fadeIn={fadeIn}
          staggerContainer={staggerContainer}
          sectionStyle={sectionStyle} // sectionNoBgStyle -> sectionStyle
          h2Style={h2Style}
          pStyle={pStyle}
        />
      </main>
    </div>
  );
}