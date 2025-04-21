'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Props 타입 정의
interface MeetingSectionProps {
  section: {
    id: string;
    title: string;
    subSections?: { id: string; title: string }[];
  };
  fadeIn: any;
  sectionStyle: string;
  h2Style: string;
  h3Style: string;
  pStyle: string;
  ulStyle: string;
  quoteStyle: string;
}

const MeetingSection: React.FC<MeetingSectionProps> = ({
  section,
  fadeIn,
  sectionStyle,
  h2Style,
  h3Style,
  pStyle,
  ulStyle,
  quoteStyle,
}) => {
  // 하위 섹션 데이터 추출 (타입 가드)
  const prepSection = section.subSections?.find(sub => sub.id === 'meeting-prep');
  const visitSection = section.subSections?.find(sub => sub.id === 'meeting-visit');

  return (
    <motion.section
      id={section.id}
      className={sectionStyle}
      variants={fadeIn} // variants 추가
      initial="hidden" // initial 추가
      whileInView="visible" // whileInView 추가
      viewport={{ once: true, amount: 0.1 }} // amount 조정
    >
      {/* h2와 하위 요소들의 variants 제거 (상위에서 제어) */}
      <h2 id={section.id} className={h2Style}>{section.title}: 낯선 문턱을 넘어, 마음으로 다가가기</h2>
      <p className={`${pStyle} mb-10`}>
        현장은 낯설고, 때로는 두렵게 느껴질 수 있습니다. 하지만 그 문턱을 넘어서는 첫걸음이 중요합니다. 조심스럽지만 진솔하게 다가가는 방법을 알아봅니다.
      </p>

      {/* 조건부 렌더링 블록 수정 */}
      {prepSection && (
        <div>
          <h3 id={prepSection.id} className={h3Style}><span className="mr-2">🧐</span>{prepSection.title}: 아는 만큼 보이고, 존중하는 만큼 열립니다</h3>
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
        </div>
      )}

      {/* 조건부 렌더링 블록 수정 */}
      {visitSection && (
        <div className="mt-12">
          <h3 id={visitSection.id} className={h3Style}><span className="mr-2">🤝</span>{visitSection.title}: 예술가 이전에 한 사람의 이웃으로</h3>
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
        </div>
      )}

      <blockquote className={quoteStyle}> {/* motion.blockquote -> blockquote */}
        <strong>{'<핵심 질문>'}</strong> 나는 지금 현장의 이야기를 들으러 왔는가, 아니면 내 이야기를 하러 왔는가? 나의 존재가 그들에게 부담이 되지는 않는가?
      </blockquote>
    </motion.section>
  );
};

export default MeetingSection;