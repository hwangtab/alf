'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Props 타입 정의
interface AnarchismSectionProps {
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
  highlightBoxStyle: string;
}

const AnarchismSection: React.FC<AnarchismSectionProps> = ({
  section,
  fadeIn,
  sectionStyle,
  h2Style,
  h3Style,
  pStyle,
  ulStyle,
  quoteStyle,
  highlightBoxStyle,
}) => {
  // 하위 섹션 데이터 추출
  const horizontalSection = section.subSections?.find(sub => sub.id === 'anarchism-horizontal');
  const mutualSection = section.subSections?.find(sub => sub.id === 'anarchism-mutual');
  const prefigurationSection = section.subSections?.find(sub => sub.id === 'anarchism-prefiguration');

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
      <h2 id={section.id} className={h2Style}>{section.title}: 위계 없이 자유롭게, 서로 도우며 함께 성장하기</h2>
      <p className={`${pStyle} mb-10`}>
        "아나키즘"이라는 단어가 조금 낯설거나 과격하게 들릴 수도 있습니다. 하지만 여기서 말하는 아나키즘적 실천은 거창한 이념 투쟁이 아니라, 우리가 현장에서 관계 맺고 함께 작업하는 방식에 대한 근본적인 질문이자 대안적인 태도입니다. 이는 권위적인 명령이나 위계적인 질서 대신, 개인의 자율성과 상호 존중, 그리고 자발적인 협력(상호부조)을 바탕으로 모두가 평등하고 자유롭게 연대하고 창조하는 방식을 모색하는 것입니다. 현장 연대는 종종 기존 사회의 불평등한 권력 관계에 맞서는 일이기에, 우리의 연대 방식 자체에서부터 평등과 자유의 가치를 실현하려는 노력은 매우 중요합니다.
      </p>

      {horizontalSection && (
        <div> {/* motion.div -> div */}
          <h3 id={horizontalSection.id} className={h3Style}><span className="mr-2">⚖️</span>{horizontalSection.title}: '리더' 없이 모두가 주인이 되는 길</h3>
           <p className={pStyle}>
             우리는 알게 모르게 위계적인 관계에 익숙합니다. 리더가 있고, 전문가가 있고, 지시하고 따르는 역할 분담. 하지만 현장 연대에서는 이러한 익숙한 방식이 오히려 소통을 막고, 특정인의 목소리만 커지게 하며, 참여자들의 자발성을 위축시킬 수 있습니다. 수평적 관계는 모든 참여자의 경험과 지혜가 동등하게 존중받고, 의사결정 과정에 동등하게 참여하는 것을 목표로 합니다.
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
           <p className={`${pStyle} font-semibold text-white`}>중요한 점:</p>
           <ul className={ulStyle}>
             <li>수평적 관계는 때로 비효율적이고 어려울 수 있습니다. 완벽함보다는 더 평등한 관계를 향해 끊임없이 성찰하고 소통하려는 지속적인 노력이 중요합니다.</li>
           </ul>
        </div>
      )}

      {mutualSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={mutualSection.id} className={h3Style}><span className="mr-2">🤲</span>{mutualSection.title}: 경쟁 대신 협력으로, 각자도생 대신 함께 살기로</h3>
           <p className={pStyle}>
             상호부조는 시혜나 동정이 아니라, '너의 문제가 곧 나의 문제'라는 인식 아래 서로 돕고 자원을 나누며 함께 어려움을 헤쳐나가는 연대의 원리입니다. 이는 경쟁과 효율성을 강조하는 자본주의 사회의 논리와는 다른, 인간적인 협력의 가치를 실현하는 방식입니다. 예술가들의 현장 연대에서도 상호부조는 매우 중요하고 실질적인 힘이 됩니다.
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
            <li><strong>정서적 지원:</strong> 서로의 이야기에 귀 기울여주고, 공감하고, 격려하는 것은 매우 중요한 상호부조입니다. 함께 활동하며 겪는 어려움이나 감정을 솔직하게 나누고 지지하는 관계를 만듭니다.</li>
          </ul>
          <p className={`${pStyle} font-semibold text-white`}>어떻게 시스템을 만들 수 있을까요?</p>
          <ul className={ulStyle}>
            <li><strong>자원 목록 공유:</strong> 각자가 기여할 수 있는 자원(물질, 기술, 시간 등)의 목록을 만들어 공유하고, 필요할 때 서로에게 요청하고 연결하는 시스템을 만들 수 있습니다. (예: 온라인 공유 문서, 메신저 그룹 활용)</li>
            <li><strong>공동 기금 마련:</strong> 작은 회비를 모으거나 공동 프로젝트 수익금 등으로 공동 기금을 마련하여, 긴급한 필요(벌금, 치료비, 활동비 등)가 발생했을 때 지원하는 방안도 고려해볼 수 있습니다.</li>
            <li><strong>정기적인 돌봄 모임:</strong> 활동 공유뿐 아니라, 서로의 안부를 묻고 정서적 지지를 나누는 모임을 정기적으로 가지는 것이 좋습니다.</li>
          </ul>
        </div>
      )}

      {prefigurationSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={prefigurationSection.id} className={h3Style}><span className="mr-2">🌱</span>{prefigurationSection.title}: 우리가 꿈꾸는 세상을 지금 여기서 살아내기</h3>
           <p className={pStyle}>
             프리피규레이션(Prefiguration)은 조금 어려운 말처럼 들리지만, 그 의미는 간단합니다. "우리가 최종적으로 도달하고 싶은 이상적인 사회의 모습(예: 평등, 자유, 연대, 생태)을 먼 미래의 목표로만 두는 것이 아니라, 바로 지금 여기, 우리의 관계 맺는 방식과 활동 과정 속에서 미리 구현하고 실천한다"는 뜻입니다. 즉, 과정 자체가 목적의 일부가 되는 것입니다. 현장 연대 예술은 바로 이 프리피규레이션의 중요한 실험장이 될 수 있습니다.
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
           <ul className={ulStyle}>
             <li>프리피규레이션은 거창한 것이 아닐 수 있습니다. 회의를 민주적으로 진행하는 방식, 함께 식사를 준비하고 나누는 방식, 서로의 실수를 너그럽게 받아들이는 방식 등, 우리가 일상적으로 관계 맺고 활동하는 모든 순간에 우리가 원하는 미래의 가치를 담으려는 의식적인 노력이 바로 프리피규레이션의 시작입니다.</li>
           </ul>
        </div>
      )}
      <blockquote className={quoteStyle}> {/* motion.blockquote -> blockquote */}
        <strong>{'<핵심 질문>'}</strong> 우리의 연대와 예술 활동 방식은 단지 목표를 위한 수단인가, 아니면 그 자체가 우리가 만들고 싶은 세상의 작은 조각인가? 우리의 관계와 과정 속에 우리가 비판하는 사회의 모습이 반복되고 있지는 않은가?
      </blockquote>
    </motion.section>
  );
};

export default AnarchismSection;