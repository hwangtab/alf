'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Props 타입 정의
interface RecordSectionProps {
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

const RecordSection: React.FC<RecordSectionProps> = ({
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
  const archivingSection = section.subSections?.find(sub => sub.id === 'record-archiving');
  const spreadSection = section.subSections?.find(sub => sub.id === 'record-spread');
  const narrativeSection = section.subSections?.find(sub => sub.id === 'record-narrative');

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
      <h2 id={section.id} className={h2Style}>{section.title}: 목소리 없는 이들의 목소리가 되어</h2>
      <p className={`${pStyle} mb-10`}>
        예술은 현장의 생생한 경험과 절실한 목소리를 기록하고, 그 울림을 현장 너머의 세상으로 <strong>확산시키는 강력한 매체</strong>가 될 수 있습니다. 이는 단순한 정보 전달을 넘어, 공감을 이끌어내고 연대의 지평을 넓히는 중요한 실천입니다.
      </p>

      {archivingSection && (
        <div> {/* motion.div -> div */}
          <h3 id={archivingSection.id} className={h3Style}><span className="mr-2">💾</span>{archivingSection.title}: 사라지는 것들을 붙잡아 미래에게</h3>
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
        </div>
      )}

      {spreadSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={spreadSection.id} className={h3Style}><span className="mr-2">🌐</span>{spreadSection.title}: 고립된 섬들을 연결하는 다리 놓기</h3>
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
        </div>
      )}

      {narrativeSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={narrativeSection.id} className={h3Style}><span className="mr-2">📢</span>{narrativeSection.title}: 보이지 않던 이야기의 힘</h3>
          <p className={pStyle}>
            세상은 종종 권력이나 다수, 혹은 미디어에 의해 만들어진 이야기(주류 서사)를 통해 현실을 인식합니다. 예술은 이러한 주류 서사에 가려지거나 왜곡된 소수자의 목소리와 경험을 드러내고, 새로운 관점과 해석을 제시함으로써 세상에 균열을 내는 역할을 할 수 있습니다.
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
        </div>
      )}
      <blockquote className={quoteStyle}> {/* motion.blockquote -> blockquote */}
        <strong>{'<핵심 질문>'}</strong> 나의 예술은 어떤 이야기를 누구의 목소리로 전하고 있는가? 혹시 나도 모르게 주류의 시각을 답습하고 있지는 않은가? 어떻게 하면 가려진 진실과 목소리를 더 효과적으로 드러낼 수 있을까?
      </blockquote>
    </motion.section>
  );
};

export default RecordSection;