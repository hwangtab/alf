'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Props 타입 정의
interface DeepeningSectionProps {
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

const DeepeningSection: React.FC<DeepeningSectionProps> = ({
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
  const textSection = section.subSections?.find(sub => sub.id === 'deepening-text');
  const identitySection = section.subSections?.find(sub => sub.id === 'deepening-identity');
  const sustainSection = section.subSections?.find(sub => sub.id === 'deepening-sustain');

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
      <h2 id={section.id} className={h2Style}>{section.title}: 연대는 나를 성장시키는 또 다른 작업실</h2>
      <p className={`${pStyle} mb-10`}>
        <strong className="text-yellow-500">현장 연대</strong>는 당신의 예술적 감수성과 표현력을 필요로 하지만, 동시에 당신에게 예술적 영감과 성찰의 기회를 제공하는 살아있는 작업실이 될 수 있습니다. 소진되지 않고 이 관계를 지속하며 함께 성장하는 방법을 고민해봅니다.
      </p>

      {textSection && (
        <div> {/* motion.div -> div */}
          <h3 id={textSection.id} className={h3Style}><span className="mr-2">✍️</span>{textSection.title}: 창작의 살아있는 텍스트가 되다</h3>
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
        </div>
      )}

      {identitySection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={identitySection.id} className={h3Style}><span className="mr-2">🦋</span>{identitySection.title}: 경계를 넘어 확장되다</h3>
          <p className={pStyle}>
            <strong className="text-yellow-500">현장 연대</strong>는 ‘예술가’라는 정체성을 위협하는 것이 아니라, 오히려 그 의미를 더욱 풍부하고 단단하게 만들어줄 수 있습니다. 사회와 유리된 순수 예술가라는 신화에서 벗어나, 세상 속에서 호흡하는 예술가로 거듭나는 과정입니다.
          </p>
          <ul className={ulStyle}>
            <li><strong>‘무엇을 위한 예술인가’ 질문하기:</strong> 현장의 경험은 예술의 사회적 역할과 책임에 대해 근본적인 질문을 던지게 합니다. 미학적 완성도와 사회적 메시지 사이의 긴장, 예술의 자율성과 사회적 개입 사이의 고민은 당신의 예술 철학을 더욱 깊게 만들 것입니다. 정답을 찾기보다, 이 질문들과 씨름하는 과정 자체가 예술적 성장의 동력이 됩니다.</li>
            <li><strong>다중적인 역할 수용하기:</strong> 현장에서 예술가는 때로는 창작자, 때로는 기록자, 때로는 워크숍 진행자, 때로는 집회 참가자, 때로는 그저 이야기를 들어주는 친구가 될 수 있습니다. 이 다양한 역할 사이를 유연하게 오가며, ‘예술가’라는 고정된 정체성에 갇히지 않고 상황에 따라 필요한 역할을 수행하는 법을 배우게 됩니다. 이는 예술가로서의 역량을 확장시키는 기회가 됩니다.</li>
            <li><strong>협업, 다름 속에서 배우기:</strong> 다른 배경을 가진 예술가, 활동가, 현장 당사자들과의 협업은 필연적으로 갈등과 조율의 과정을 동반합니다. 하지만 서로 다른 관점과 기술이 만나 부딪히고 융합되는 과정에서 예상치 못한 창의적인 결과가 탄생하기도 합니다. 타인의 목소리에 귀 기울이고, 자신의 아이디어를 설득하며, 함께 목표를 향해 나아가는 경험은 예술가로서뿐 아니라 한 인간으로서 성장하는 소중한 기회입니다.</li>
          </ul>
        </div>
      )}

      {sustainSection && (
        <div className="mt-12"> {/* motion.div -> div */}
          <h3 id={sustainSection.id} className={h3Style}><span className="mr-2">❤️‍🩹</span>{sustainSection.title}: 나를 태우지 않고 불을 지피는 법</h3>
          <p className={pStyle}>
            열정만으로는 오래가기 어렵습니다. <strong className="text-yellow-500">현장 연대</strong>는 때로 깊은 감정 소모와 좌절감을 안겨줄 수 있습니다. 지속가능한 연대를 위해서는 자기 자신과 동료들을 돌보는 지혜가 필요합니다.
          </p>
          <p className={`${pStyle} font-semibold text-white`}>나의 리듬과 한계 존중하기:</p>
          <ul className={ulStyle}>
            <li><strong>에너지 관리:</strong> 자신이 감당할 수 있는 시간과 에너지의 양을 현실적으로 파악하세요. 매일 현장에 나가지 못하더라도 죄책감을 느낄 필요는 없습니다. 짧더라도 집중해서 함께하거나, 다른 방식으로(예: 온라인 홍보, 후원) 기여할 수도 있습니다.</li>
            <li><strong>‘아니오’라고 말할 용기:</strong> 모든 요청에 응하거나 모든 역할를 수행해야 한다는 부담감에서 벗어나세요. 자신의 상태를 살피고, 감당하기 어려운 요구에는 정중하게 거절할 수 있어야 합니다. 이는 이기적인 것이 아니라, 오래 함께하기 위한 책임감 있는 태도입니다.</li>
            <li><strong>의식적인 휴식:</strong> 현장의 긴장감에서 벗어나 재충전하는 시간을 의식적으로 가지세요. 예술 작업 외에 자신을 즐겁게 하는 활동(취미, 운동, 친구 만나기 등)을 통해 에너지 균형을 맞추는 것이 중요합니다.</li>
          </ul>
          <div className={highlightBoxStyle}> {/* motion.div -> div */}
            <p className="font-semibold mb-2">기억하세요:</p>
            <p>자신의 에너지와 한계를 존중하고 '아니오'라고 말할 용기를 가지는 것은 이기적인 것이 아니라, 오래도록 지치지 않고 함께하기 위한 책임감 있는 태도입니다.</p>
          </div>
          <p className={`${pStyle} font-semibold text-white`}>함께 지키는 지속가능성:</p>
          <ul className={ulStyle}>
            <li><strong>역할 분담과 협력:</strong> 모든 짐을 혼자 지려 하지 마세요. 함께하는 동료 예술가나 활동가들과 솔직하게 어려움을 나누고 역할을 분담하세요. 서로의 강점을 활용하고 약점을 보완하는 협력 체계를 만드는 것이 중요합니다.</li>
            <li><strong>정기적인 소통과 점검:</strong> 함께 연대하는 그룹 내에서 정기적으로 만나 서로의 안부를 묻고 활동을 평가하며 앞으로의 계획을 논의하는 시간을 가지세요. 감정적인 어려움을 터놓고 이야기하고 지지받을 수 있는 안전한 공간을 확보하는 것이 중요합니다.</li>
            <li><strong>작은 성공 축하하기:</strong> 투쟁은 길고 지루한 싸움일 수 있습니다. 그 과정에서 얻는 작은 성과나 긍정적인 변화들을 함께 나누고 축하하며 서로를 격려하는 것이 지속적인 동기 부여에 도움이 됩니다.</li>
          </ul>
        </div>
      )}
      <blockquote className={quoteStyle}> {/* motion.blockquote -> blockquote */}
        <strong>{'<핵심 질문>'}</strong> 나의 연대 활동은 나 자신과 동료들에게 에너지를 주는가, 아니면 고갈시키는가? 어떻게 하면 더 건강하고 지속 가능하게 함께할 수 있을까?
      </blockquote>
    </motion.section>
  );
};

export default DeepeningSection;