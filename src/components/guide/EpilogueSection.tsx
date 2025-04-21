'use client';

import React from 'react';
import { motion } from 'framer-motion';
// Link import 제거

// Props 타입 정의
interface EpilogueSectionProps {
  section: {
    id: string;
    title: string;
  };
  fadeIn: any;
  staggerContainer: any;
  sectionStyle: string; // sectionNoBgStyle -> sectionStyle
  h2Style: string;
  pStyle: string;
}

const EpilogueSection: React.FC<EpilogueSectionProps> = ({
  section,
  fadeIn,
  staggerContainer,
  sectionStyle, // sectionNoBgStyle -> sectionStyle
  h2Style,
  pStyle,
}) => {
  return (
    <motion.section
      id={section.id}
      className={sectionStyle} // sectionNoBgStyle -> sectionStyle
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // amount 조정
    >
      <motion.h2 id={section.id} variants={fadeIn} className={h2Style}>{section.title}: 예술과 투쟁의 경계에서, 당신의 자리를 찾아서</motion.h2> {/* 제목 수정 */}
      <motion.p variants={fadeIn} className={pStyle}>
        지금까지 현장 연대라는 낯설지만 의미 있는 길에 대해 길게 이야기 나누었습니다. 이 가이드가 제시한 내용들이 때로는 너무 이상적이거나 어렵게 느껴졌을 수도 있습니다. 어쩌면 ‘과연 내가 할 수 있을까?’ 하는 두려움이나 망설임이 여전히 남아있을지도 모릅니다.
      </motion.p>
      <motion.p variants={fadeIn} className={pStyle}>
        하지만 기억해주세요. 현장 연대는 완벽한 영웅이나 투사를 요구하는 것이 아닙니다. 정해진 매뉴얼이나 성공 공식이 있는 것도 아닙니다. 중요한 것은 세상의 아픔에 공감하는 마음, 불의에 함께 분노하고 연대하려는 의지, 그리고 예술가로서 자신이 가진 고유한 감수성과 표현력으로 기꺼이 그 여정에 동참하려는 용기입니다.
      </motion.p>
       <motion.p variants={fadeIn} className={pStyle}>
        이 길은 분명 쉽지 않을 것입니다. 때로는 깊은 무력감과 좌절을 경험할 수도 있고, 예상치 못한 오해나 갈등에 부딪힐 수도 있습니다. 당신의 예술이 즉각적인 변화를 만들어내지 못하는 것처럼 보일 수도 있습니다.
      </motion.p>
       <motion.p variants={fadeIn} className={pStyle}>
        그러나 그 모든 어려움에도 불구하고, 현장 연대는 당신에게 무엇과도 바꿀 수 없는 소중한 경험을 선사할 것입니다. 당신은 교과서나 뉴스에서는 결코 배울 수 없는 살아있는 삶의 이야기들을 만나게 될 것입니다. 당신의 예술은 상아탑을 벗어나 세상의 가장 절실한 목소리들과 공명하며 새로운 깊이와 울림을 얻게 될 것입니다. 그리고 무엇보다, 당신은 혼자가 아니라는 사실, 고통 속에서도 희망을 만들고 서로에게 기댈 어깨가 되어주는 사람들의 존재를 온몸으로 확인하게 될 것입니다.
      </motion.p>
       <motion.p variants={fadeIn} className={pStyle}>
        이 가이드가 당신의 첫걸음을 위한 작은 디딤돌이 되기를 바랍니다. 처음부터 모든 것을 잘하려고 애쓰기보다, 작은 관심에서 시작하여 천천히, 꾸준히, 그리고 진솔하게 다가가 보세요. 당신의 예술이, 당신의 존재 자체가 누군가에게는 따뜻한 위로가 되고, 용기가 되고, 함께 꾸는 꿈이 될 수 있습니다.
      </motion.p>
       <motion.p variants={fadeIn} className={`${pStyle} mt-8 italic text-center text-yellow-500`}> {/* 인용구 스타일 추가 */}
        "예술로 투쟁을 도와주는 게 아니라, 예술 자체가 투쟁이고, 그걸 함께 만드는 경험이 해방이다."
      </motion.p>
       <motion.p variants={fadeIn} className={pStyle}>
        이 말처럼, 당신의 예술이 단지 투쟁의 '도구'가 아니라, 그 자체로 해방을 향한 여정의 일부가 되기를, 그리고 그 여정 속에서 당신 자신이 더욱 자유롭고 충만한 예술가로, 그리고 인간으로 성장하기를 진심으로 응원합니다. 이제, 당신의 자리에서, 당신만의 방식으로 연대의 첫걸음을 내딛어 보세요.
      </motion.p>
      {/* Link 버튼 제거됨 */}
    </motion.section>
  );
};

export default EpilogueSection;