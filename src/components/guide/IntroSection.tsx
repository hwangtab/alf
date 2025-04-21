'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Props 타입 정의
interface IntroSectionProps {
  section: { id: string; title: string };
  fadeIn: any;
  staggerContainer: any;
  sectionStyle: string;
  h3Style: string; // h2 대신 h3 사용
  pStyle: string;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  section,
  fadeIn,
  staggerContainer,
  sectionStyle,
  h3Style, // h2 대신 h3 사용
  pStyle,
}) => {
  return (
    <motion.section
      id={section.id}
      className={sectionStyle}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // amount 조정
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h3 variants={fadeIn} className={h3Style}>{section.title}: 예술, 침묵을 깨고 세상 속으로</motion.h3>
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
            src="/images/gallery/DSC05755.webp" // 이미지 경로 유지
            alt="현장 연대 가이드 인트로 이미지"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default IntroSection;