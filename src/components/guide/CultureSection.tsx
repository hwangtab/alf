'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Props 타입 정의
interface CultureSectionProps {
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

const CultureSection: React.FC<CultureSectionProps> = ({
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
  const networkSection = section.subSections?.find(sub => sub.id === 'culture-network');
  const generationSection = section.subSections?.find(sub => sub.id === 'culture-generation');
  const afterSection = section.subSections?.find(sub => sub.id === 'culture-after');

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
      <h2 id={section.id} className={h2Style}>{section.title}: 홀로 외롭지 않게, 함께 멀리 가기 위하여</h2>
      <p className={`${pStyle} mb-10`}>
        한두 명의 열정적인 예술가만으로는 현장 연대를 지속하기 어렵습니다. 더 많은 예술가들이 서로에게 배우고, 의지하며, 함께 성장할 수 있는 지지적인 문화와 커뮤니티를 만드는 것이 중요합니다. 이는 단지 활동의 효율성을 높이는 것을 넘어, 예술가들이 고립되지 않고 오랫동안 지치지 않으며 연대의 길을 걸어갈 수 있도록 돕는 안전망이자 자양분입니다. 아나키즘적 가치를 바탕으로 한 자율적이고 협력적인 예술 생태계를 함께 가꾸어 나가는 과정입니다.
      </p>

      {networkSection && (
        <div> {/* motion.div -> div */}
          <h3 id={networkSection.id} className={h3Style}><span className="mr-2">🔗</span>{networkSection.title}: 점들을 이어 별자리를 그리다</h3>
          <p className={pStyle}>
            비슷한 고민과 지향을 가진 예술가들이 서로 연결될 때, 개인이 느끼는 부담감은 줄어들고 집단적인 지혜와 힘은 커집니다. 느슨하지만 필요할 때 서로에게 든든한 버팀목이 되어주는 유연하고 탄력적인 네트워크를 만들어가는 것이 중요합니다.
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
        </div>
      )}

      {generationSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={generationSection.id} className={h3Style}><span className="mr-2">🧑‍🤝‍🧑</span>{generationSection.title}: 경험을 나누고 미래를 함께 열기</h3>
          <p className={pStyle}>
            현장 연대의 경험과 지혜는 소중한 자산입니다. 이것이 특정 세대에게만 머무르지 않고 다음 세대의 예술가들에게 자연스럽게 흘러가고 공유될 때, 연대의 역사는 더욱 풍부해지고 미래는 더 밝아질 수 있습니다. 이는 단순한 '가르침'이 아니라, 서로에게 배우고 영감을 주고받는 상호적인 동행의 과정입니다.
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
        </div>
      )}

      {afterSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={afterSection.id} className={h3Style}><span className="mr-2">➡️</span>{afterSection.title}: 마침표가 아닌 쉼표, 그리고 새로운 시작</h3>
          <p className={pStyle}>
            모든 투쟁에는 시작과 끝이 있습니다. 때로는 승리하기도 하고, 때로는 패배하거나 다른 국면으로 전환되기도 합니다. 중요한 것은 투쟁의 특정 국면이 마무리된 후에도 현장에서 만난 당사자들과의 관계를 어떻게 이어갈 것인가 하는 점입니다. 진정한 연대는 단기적인 목표 달성을 넘어선, 지속적이고 인간적인 관계 맺음에 있습니다.
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
            <li><strong>일상적인 교류 유지:</strong> 공식적인 활동이 없더라도, 함께했던 사람들과 개인적인 연락을 유지하고 서로의 안부를 묻고 지지하는 일상적인 관계를 이어갑니다. 명절이나 기념일 등 특별한 날을 함께 챙기거나, 기쁜 일과 슬픈 일을 나눌 수 있는 사이가 됩니다.</li>
            <li><strong>승리와 패배의 의미 함께 찾기:</strong> 투쟁의 결과를 함께 평가하고, 그 과정에서 얻은 교훈과 의미를 함께 정리하고 기록하는 작업을 통해 경험을 공유 자산으로 만듭니다. 승리했다면 그 기쁨을 함께 나누고 기록하며, 설령 패배했더라도 그 의미를 함께 성찰하며 다음을 기약합니다.</li>
          </ul>
        </div>
      )}
      <blockquote className={quoteStyle}> {/* motion.blockquote -> blockquote */}
        <strong>{'<핵심 질문>'}</strong> 우리의 연대는 특정 이슈나 목표에만 묶여 있는가, 아니면 사람과 사람 사이의 깊은 관계로 발전하고 있는가? 투쟁 이후, 우리는 서로에게 어떤 존재가 될 수 있을까?
      </blockquote>
    </motion.section>
  );
};

export default CultureSection;