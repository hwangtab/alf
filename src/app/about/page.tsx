'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function AboutPage() {
  // 모바일 뷰포트 높이 최적화
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // 스크롤 함수
  const scrollToElement = (elementId: string, offset: number = 60) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // 애니메이션 변수 - 모바일 최적화
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // 모바일 친화적 뷰포트 설정 - 직접 framer-motion 설정 사용
  const mobileViewportSettings = {
    once: false, // 여러 번 트리거 가능
    amount: 0.01, // 1%만 보여도 트리거
    margin: "0px 0px -300px 0px" // 매우 일찍 트리거
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-16 text-center"
      >
        <h1 className="text-5xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-red-600 font-test-serif">예술해방전선</h1>
        <p className="text-xl text-neutral-300 max-w-3xl mx-auto font-test-sans">
          우리가 걸어온 예술 해방의 발자취
        </p>
      </motion.div>

      <motion.section
        className="mb-24 bg-neutral-800 rounded-xl p-8 shadow-lg"
        initial="hidden"
        whileInView="visible"
        viewport={mobileViewportSettings}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-8 text-white font-serif">
          우리의 시작: 새벽의 외침, 연대의 불씨
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mb-4 text-neutral-300 leading-relaxed text-lg font-sans">
              2019년 10월, 차가운 바람이 스산하게 불던 구 노량진수산시장. 그곳에서는 삶의 터전을 지키려는 상인들의 절박한 외침과, 이를 무자비하게 짓밟는 폭력적인 강제 철거가 뒤엉켜 있었습니다. 특히 수십 년간 시장을 일궈온 고령의 여성 상인들이 속수무책으로 스러지는 모습을 목격하며, 우리 예술가들의 가슴에는 깊은 슬픔과 함께 뜨거운 분노가 용암처럼 들끓었습니다. 이것은 결코 남의 일이 아니었습니다. 인간의 존엄성이 무참히 짓밟히는 현실 앞에서, 예술가로서 우리는 무엇을 할 수 있을까, 무엇을 해야만 하는가. 그 처절한 질문과 절박한 마음들이 하나로 모여 '예술해방전선'이라는 이름 아래, 우리는 서로의 손을 맞잡았습니다. 그렇게 우리의 자발적인 연대는 시작되었습니다.
            </p>
            <p className="mb-4 text-neutral-300 leading-relaxed text-lg font-sans">
              우리는 거창한 조직을 꿈꾸지 않았습니다. 다만 현장의 목소리에 귀 기울이고, 그들의 아픔에 깊이 공감하며, 우리가 가진 예술이라는 언어로 함께 행동하는 실천적 예술 네트워크를 그리고자 합니다. '예술해방전선'이라는 이름에는 우리의 간절한 염원이 담겨 있습니다. 예술을 무기 삼아 억압받는 이들을 지키고 부조리한 현실로부터 해방시키려는 굳은 의지. 자본과 소비주의의 화려한 껍데기에 갇힌 예술 자체를 본연의 순수한 모습으로 해방시키고자 하는 뜨거운 열망. 그리고 우리의 작은 몸짓들이 모이고 모여, 마침내 세상을 조금이라도 더 나은 곳으로 바꿀 수 있다는 소박하지만 단단한 믿음. 이 모든 것이 우리의 출발점이자 나침반입니다.
            </p>
            <p className="text-neutral-300 leading-relaxed text-lg font-sans">
              억압받는 이들의 곁에서 우리는 함께 노래하고, 그리고, 그들의 이야기를 우리의 작품 속에 소중히 기록하며 연대하고 있습니다. 이곳은 바로 그 뜨겁고 치열한 시간들의 기록이자, 깊은 절망 속에서도 끝끝내 피워 올리는 희망의 노래입니다. 우리의 활동은 계속되고 있으며, 예술을 통해 세상을 바꾸고자 하는 연대의 정신은 이곳에서 계속 이어지며, 또 다른 누군가에게 작은 용기와 깊은 영감이 되기를 간절히 소망합니다.
            </p>
          </div>
          <div className="relative h-[32rem] w-full overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 z-10"></div>
            <Image
              src="/images/gallery/DSC05594.webp"
              alt="노량진수산시장에서 열린 예술해방전선 연대 활동 모습"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
              className="object-cover transition-transform duration-700 hover:scale-105"
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
              loading="lazy"
            />
          </div>
        </div>
      </motion.section>

      {/* 스크롤 다운 표시 */}
      <motion.button
        className="relative mt-8 mb-16 flex justify-center mx-auto p-3 cursor-pointer text-white hover:text-yellow-400 transition-colors"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, y: [0, 8, 0] }}
        viewport={{ once: false }}
        transition={{ duration: 1.2, repeat: Infinity }}
        onClick={() => scrollToElement('our-dream', 60)}
        aria-label="다음 섹션으로 스크롤"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      <motion.section
        id="our-dream"
        className="mb-24 bg-neutral-800 rounded-xl p-8 shadow-lg scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={mobileViewportSettings}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-8 text-white font-serif">우리가 꿈꾸는 세상</h2>
        <div>
          <p className="text-neutral-300 leading-relaxed text-lg mb-6 font-sans">
            우리가 꿈꾸는 세상은 화려한 청사진이나 이상적인 구호 속에 머물지 않습니다. 예술해방전선은 예술이라는 섬세하고도 강인한 언어를 통해, 우리 사회의 가장 깊숙한 그늘에 따스한 빛을 드리우고, 견고해 보이는 불평등의 벽에 용감하게 균열을 내며, 세상의 변두리로 밀려난 소외된 이들과 조용히 어깨를 나란히 하는 그런 세상을 마음 깊이 그립니다. 모든 존재가 어떠한 차별과 억압 없이 자신의 고유한 존엄성을 온전히 지키며, 서로의 다름을 존중하고 함께 어우러져 살아갈 수 있는 세상. 그것이야말로 우리가 서툰 몸짓이나마 예술로써 다가가고자 하는 세상의 본질적인 모습입니다.
          </p>
          <p className="text-neutral-300 leading-relaxed text-lg mb-6 font-sans">
            물론, 광장을 가득 메운 드높은 함성 역시 세상을 움직이는 거대한 힘이 될 수 있음을 우리는 알고 있습니다. 하지만 우리는 진정한 변화의 씨앗은, 우리 사회 곳곳, 이름조차 희미한 사람들의 삶이 속절없이 부서지고 고통 속에 신음하는 바로 그 구체적인 '현장'에서 뿌려지고, 눈물과 땀으로 적셔져 마침내 싹을 틔운다고 믿습니다.
          </p>
          <blockquote className="border-l-4 border-neutral-600 pl-4 italic text-neutral-400 my-8">
            <p className="leading-relaxed text-lg">
              '예술해방'이라는 우리의 깃발 아래, 우리는 그 말의 참된 의미를 끊임없이 곱씹고 되새기며 걸어갑니다. 현장에서 피어나는 예술은 결코 사회 운동을 위한 단순한 도구나 예쁜 장식품으로 머물러서는 안 된다고 생각합니다. 예술은 그 자체로 억압으로부터의 해방을 노래하는 자유로운 언어가 되어야 하며, 우리가 미처 보지 못했던 세상을 새롭게 상상하고 바라보게 하는 투명한 창이 되어야 한다고 믿습니다.
            </p>
          </blockquote>
        </div>
      </motion.section>

      {/* 스크롤 다운 표시 */}
      <motion.button
        className="relative mt-8 mb-16 flex justify-center mx-auto p-3 cursor-pointer text-white hover:text-yellow-400 transition-colors"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, y: [0, 8, 0] }}
        viewport={{ once: false }}
        transition={{ duration: 1.2, repeat: Infinity }}
        onClick={() => scrollToElement('our-values', 60)}
        aria-label="다음 섹션으로 스크롤"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={mobileViewportSettings}
        variants={staggerContainer}
      >
        <div className="bg-neutral-800 rounded-xl p-6 pb-4 shadow-lg">
          <h2 id="our-values" className="text-3xl font-bold mb-8 text-white scroll-mt-20 font-serif text-center">우리가 지켜온 가치</h2>
          
          {/* 타임라인 레이아웃 */}
          <div className="relative">
            {/* 중앙 세로선 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-yellow-500 via-red-500 via-orange-500 to-amber-500"></div>
            
            <div className="space-y-12">
              {/* 연대 */}
              <motion.div variants={fadeIn} className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                    <div className="flex items-center justify-end mb-4">
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-serif mr-3">함께 걷는 길, 연대</h3>
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-sans text-sm">
                      우리는 결코 홀로 서지 않습니다. 노량진 수산시장, 동서울 터미널 등 삶의 터전에서 밀려나고 억압받는 사회적 약자들과 소외된 이들의 곁을 묵묵히 지키고 있습니다. 연대는 우리의 가장 따뜻한 무기입니다.
                    </p>
                  </div>
                </div>
                {/* 중앙 포인트 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full border-4 border-neutral-800 z-10"></div>
                <div className="w-1/2"></div>
              </motion.div>

              {/* 저항 */}
              <motion.div variants={fadeIn} className="flex items-center">
                <div className="w-1/2"></div>
                {/* 중앙 포인트 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-4 border-neutral-800 z-10"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-8 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-serif">침묵하지 않는 목소리, 저항</h3>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-sans text-sm">
                      우리는 부당한 권력과 거대한 자본, 억압적인 구조 앞에서 결코 침묵하지 않습니다. 예술은 우리의 가장 날카로운 저항의 언어입니다. 침묵을 강요하는 세상에 맞서, 예술로써 당당히 우리의 목소리를 세상에 외치는 것이 우리의 저항입니다.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 실험 */}
              <motion.div variants={fadeIn} className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-8 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                    <div className="flex items-center justify-end mb-4">
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-serif mr-3">새로운 길을 찾는 용기, 실험</h3>
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-sans text-sm">
                      우리는 정해진 길, 익숙한 방식에 안주하기를 거부합니다. 언제나 기존의 틀을 넘어서는 창의적인 상상력과 두려움 없는 실험 정신으로 새로운 예술적 언어를 찾아 나섭니다.
                    </p>
                  </div>
                </div>
                {/* 중앙 포인트 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-neutral-800 z-10"></div>
                <div className="w-1/2"></div>
              </motion.div>

              {/* 포용 */}
              <motion.div variants={fadeIn} className="flex items-center">
                <div className="w-1/2"></div>
                {/* 중앙 포인트 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-neutral-800 z-10"></div>
                <div className="w-1/2 pl-8">
                  <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-xl p-8 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-white font-serif">다름을 안는 마음, 포용</h3>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-sans text-sm">
                      우리는 서로의 다름이 틀림이 아님을 믿습니다. 다양한 배경과 정체성, 각기 다른 생각과 목소리를 가진 모든 존재를 존중하며 따뜻하게 품고자 합니다. 포용적인 예술 공동체가 우리의 소중한 가치입니다.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
