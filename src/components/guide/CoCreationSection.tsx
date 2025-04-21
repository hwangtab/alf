'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Props 타입 정의
interface CoCreationSectionProps {
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

const CoCreationSection: React.FC<CoCreationSectionProps> = ({
  section,
  fadeIn,
  sectionStyle,
  h2Style,
  h3Style,
  pStyle,
  ulStyle,
  quoteStyle,
}) => {
  // 하위 섹션 데이터 추출
  const planningSection = section.subSections?.find(sub => sub.id === 'co-creation-planning');
  const languageSection = section.subSections?.find(sub => sub.id === 'co-creation-language');
  const festivalSection = section.subSections?.find(sub => sub.id === 'co-creation-festival');

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
      <h2 id={section.id} className={h2Style}>{section.title}: 예술, 투쟁의 언어가 되고 투쟁, 예술의 영감이 되다</h2>
      <p className={`${pStyle} mb-10`}>
        <strong className="text-yellow-500">현장 연대</strong> 예술의 진정한 의미는 예술가가 일방적으로 무언가를 ‘선사’하는 것이 아니라, 현장의 당사자들과 <strong>함께 새로운 의미와 형식을 빚어가는 공동 창조</strong>의 과정에 있습니다. 이는 예술과 투쟁이 서로에게 영감을 주고 영향을 미치며 함께 성장하는 역동적인 과정입니다.
      </p>

      {planningSection && (
        <div> {/* motion.div -> div */}
          <h3 id={planningSection.id} className={h3Style}><span className="mr-2">🎨</span>{planningSection.title}: 모두가 예술가 되는 순간</h3>
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
        </div>
      )}

      {languageSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={languageSection.id} className={h3Style}><span className="mr-2">🗣️</span>{languageSection.title}: 발견하고 증폭하기</h3>
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
        </div>
      )}

      {festivalSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={festivalSection.id} className={h3Style}><span className="mr-2">🎉</span>{festivalSection.title}: 함께 만드는 축제</h3>
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
        </div>
      )}
      <blockquote className={quoteStyle}> {/* motion.blockquote -> blockquote */}
        <strong>{'<핵심 질문>'}</strong> 나의 예술 활동은 현장의 에너지를 끌어올리고 사람들을 연결하는가? 아니면 일방적인 보여주기에 그치는가? 어떻게 하면 더 많은 사람이 즐겁게 참여하고 주인이 될 수 있을까?
      </blockquote>
    </motion.section>
  );
};

export default CoCreationSection;