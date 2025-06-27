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

      {/* h2 제목을 section 바깥으로 이동 */}
      <motion.h2
        className="text-3xl font-bold mb-8 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={mobileViewportSettings}
        variants={fadeIn}
      >
        우리의 시작: 새벽의 외침, 연대의 불씨
      </motion.h2>
      <motion.section
        className="mb-24 bg-neutral-800 rounded-xl p-8 shadow-lg"
        initial="hidden"
        whileInView="visible"
        viewport={mobileViewportSettings}
        variants={fadeIn}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center"> {/* items-start를 items-center로 변경 */}
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
          <div className="relative h-[32rem] w-full overflow-hidden rounded-lg"> {/* 높이 다시 늘림: h-96 -> h-[32rem] */}
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

      {/* 스크롤 다운 표시 개선 - 모바일 최적화 */}
      <motion.button
        className="relative mt-8 mb-16 flex justify-center mx-auto p-3 cursor-pointer text-white hover:text-yellow-400 transition-colors" // 패딩 증가, 호버 효과 추가
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, y: [0, 8, 0] }} // animate를 whileInView로 변경
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
        id="our-dream" // 섹션에 ID 추가
        className="mb-24 scroll-mt-20" // 스크롤 마진 추가
        initial="hidden"
        whileInView="visible"
        viewport={mobileViewportSettings}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-8 text-white">우리가 꿈꾸는 세상</h2>
        <div className="bg-neutral-800 rounded-xl p-8 shadow-lg">
          <p className="text-neutral-300 leading-relaxed text-lg mb-6 font-sans">
            우리가 꿈꾸는 세상은 화려한 청사진이나 이상적인 구호 속에 머물지 않습니다. 예술해방전선은 예술이라는 섬세하고도 강인한 언어를 통해, 우리 사회의 가장 깊숙한 그늘에 따스한 빛을 드리우고, 견고해 보이는 불평등의 벽에 용감하게 균열을 내며, 세상의 변두리로 밀려난 소외된 이들과 조용히 어깨를 나란히 하는 그런 세상을 마음 깊이 그립니다. 모든 존재가 어떠한 차별과 억압 없이 자신의 고유한 존엄성을 온전히 지키며, 서로의 다름을 존중하고 함께 어우러져 살아갈 수 있는 세상. 그것이야말로 우리가 서툰 몸짓이나마 예술로써 다가가고자 하는 세상의 본질적인 모습입니다. 우리는 예술이 더 이상 상아탑이나 미술관, 혹은 값비싼 갤러리 안에 고고하게 갇힌 감상의 대상을 넘어, 치열한 삶의 현장인 거리와 광장에서, 삶의 터전이 속절없이 무너져 내리는 바로 그 자리에서, 세상을 바꾸는 뜨거운 실천이자 살아 숨 쉬는 저항의 언어가 될 수 있다고 굳게, 아주 굳게 믿습니다.
          </p>
           <p className="text-neutral-300 leading-relaxed text-lg mb-6 font-sans">
            물론, 광장을 가득 메운 드높은 함성 역시 세상을 움직이는 거대한 힘이 될 수 있음을 우리는 알고 있습니다. 하지만 우리는 진정한 변화의 씨앗은, 우리 사회 곳곳, 이름조차 희미한 사람들의 삶이 속절없이 부서지고 고통 속에 신음하는 바로 그 구체적인 '현장'에서 뿌려지고, 눈물과 땀으로 적셔져 마침내 싹을 틔운다고 믿습니다. 재개발이라는 거대한 톱니바퀴 아래 힘없이 스러져가는 오래된 골목길의 애틋한 기억들, 이윤이라는 끝없는 탐욕의 괴물에게 마지막 남은 생존권마저 위협받는 노동자들의 처절한 절규, 국가 안보라는 견고하고 차가운 논리 앞에 속절없이 무너져 내리는 평화로운 삶에 대한 소박하고 간절한 열망. 이러한 시대의 깊은 모순과 우리 사회의 아픈 부조리가 가장 날카롭게, 가장 시리게 드러나는 곳이 바로 우리가 두 발 딛고 선 '현장'입니다. 그래서 우리는 망설임 없이 그곳으로 달려갑니다. 고통받는 이들의 메마른 목소리에 가만히 귀 기울이고, 그들의 지친 눈물을 조용히 닦아주며, 폭풍우 속에서 위태롭게 흔들리는 그들의 곁을 묵묵히 지키고자 합니다. 그것이 우리가 할 수 있는 최소한의 예의이자, 예술가로서의 책무라고 여깁니다.
          </p>
           <p className="text-neutral-300 leading-relaxed text-lg mb-6 font-sans">
            수많은 현장에서 넘어지고 부딪히고 깨지면서도 서로의 손을 놓지 않고 연대해 온 경험들은 우리에게 무엇과도 바꿀 수 없는 값진 지혜를 선물했습니다. 우리는 깨달았습니다. 딱딱하게 굳어버린 조직의 틀보다는, 현장의 절박한 필요와 변화하는 상황에 따라 마치 강물처럼 유연하게 흘러넘치며 연대하는 네트워크 방식이 훨씬 더 강한 생명력을 지니고 효과적이라는 것을. 저마다 다른 빛깔과 향기, 다른 생각과 재능을 지닌 예술가들이 현장의 위기 앞에 하나의 마음으로 뭉쳐 공동으로 대응하고, 거센 폭풍우가 지나가거나 상황이 변화하면 또다시 미련 없이 흩어져 각자의 자리로 돌아가 새로운 씨앗을 뿌리는 방식. 이것은 때로 외부의 부당한 간섭이나 교묘한 정치적 이용의 위험으로부터 연대하는 우리 자신을 보호하는 현명하고 슬기로운 방패가 되어주기도 합니다. 우리에게는 조직의 이름이나 외형적인 세력 확장보다, 바로 지금 눈앞의 현장에서 벌어지고 있는 구체적인 문제를 해결하고 고통받는 이들과 함께 아파하는 것이 언제나 가장 중요하고 우선적인 가치입니다. 오늘날 우리는 공연, 전시, 앨범 발매 등 다양한 예술 활동을 통해 예술해방전선의 정신을 발휘하고 있으며, 새로운 형태의 자발적 연대와 창의적인 실험을 계속해 나가고 있습니다.
           </p>
           <blockquote className="border-l-4 border-neutral-600 pl-4 italic text-neutral-400 my-8"> {/* 인용구 스타일 적용 */}
            <p className="leading-relaxed text-lg"> {/* 내부 p 태그 스타일 조정 */}
              '예술해방'이라는 우리의 깃발 아래, 우리는 그 말의 참된 의미를 끊임없이 곱씹고 되새기며 걸어갑니다. 현장에서 피어나는 예술은 결코 사회 운동을 위한 단순한 도구나 예쁜 장식품으로 머물러서는 안 된다고 생각합니다. 예술은 그 자체로 억압으로부터의 해방을 노래하는 자유로운 언어가 되어야 하며, 우리가 미처 보지 못했던 세상을 새롭게 상상하고 바라보게 하는 투명한 창이 되어야 한다고 믿습니다. 투쟁의 현장에서 만난 평범한 사람들의 소박한 삶과 눈물 어린 이야기가 우리의 예술을 통해 새로운 의미와 깊은 감동으로 다시 태어나고, 그렇게 진심으로 피어난 예술이 다시 현장에 지친 이들에게 작은 위로와 따뜻한 공감, 새로운 상상력과 다시 일어설 용기를 불어넣을 때. 바로 그때, 비로소 진정한 변화의 씨앗이 뿌려지고 단단하게 움틀 수 있다고 우리는 확신합니다. 우리는 예술의 힘으로 세상의 부조리를 용감하게 고발하고, 아무도 감히 꿈꾸지 못했던 대안적인 미래를 자유롭게 상상하며, 깊은 상처를 입은 공동체의 치유와 회복을 돕는 활동을 단 한 순간도 멈추지 않습니다. 예술은 세상을 향한 우리의 가장 뜨겁고 간절한 외침이며, 더 정의롭고 아름다운 세상을 향한 우리의 포기할 수 없는 실천이자, 영원히 꺼지지 않을 희망의 등불입니다.
            </p>
          </blockquote>
        </div>
      </motion.section>

      {/* 스크롤 다운 표시 개선 - 모바일 최적화 */}
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
        <h2 id="our-values" className="text-3xl font-bold mb-8 text-white scroll-mt-20">우리가 지켜온 가치</h2> {/* ID 추가 및 스크롤 마진 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={fadeIn} className="bg-neutral-800 rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <h3 className="text-xl font-bold mb-3 text-white">함께 걷는 길, 연대</h3>
            <p className="text-neutral-300 leading-relaxed font-sans"> {/* leading-relaxed 추가 */}
              우리는 결코 홀로 서지 않습니다. 노량진 수산시장, 동서울 터미널 등 삶의 터전에서 밀려나고 억압받는 사회적 약자들과 소외된 이들의 곁을 묵묵히 지키고 있습니다. 음악가, 미술가, 사진가, 작가 등 다양한 분야의 예술가들이 어깨를 걸고 함께 아파하며, 그들의 목소리가 세상에 울려 퍼지도록 예술로써 힘을 보태고 있습니다. 연대는 우리의 가장 따뜻한 무기입니다.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-neutral-800 rounded-xl p-6 shadow-lg border-l-4 border-red-500">
            <h3 className="text-xl font-bold mb-3 text-white">침묵하지 않는 목소리, 저항</h3>
            <p className="text-neutral-300 leading-relaxed font-sans"> {/* leading-relaxed 추가 */}
              우리는 부당한 권력과 거대한 자본, 억압적인 구조 앞에서 결코 침묵하지 않습니다. 예술은 우리의 가장 날카로운 저항의 언어입니다. 때로는 서늘한 분노로, 때로는 뜨거운 외침으로 사회의 깊은 모순과 부조리를 드러내고 비판합니다. 침묵을 강요하는 세상에 맞서, 예술로써 당당히 우리의 목소리를 세상에 외치는 것, 그것이 우리가 걸어가는 저항의 방식입니다.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-neutral-800 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
            <h3 className="text-xl font-bold mb-3 text-white">새로운 길을 찾는 용기, 실험</h3>
            <p className="text-neutral-300 leading-relaxed font-sans"> {/* leading-relaxed 추가 */}
              우리는 정해진 길, 익숙한 방식에 안주하기를 거부합니다. 언제나 기존의 틀을 넘어서는 창의적인 상상력과 두려움 없는 실험 정신으로 새로운 예술적 언어를 찾아 나섭니다. 때로는 거칠고 투박할지라도, 현장의 생생한 목소리와 시대의 아픔을 담아내는 우리만의 표현 방식을 끊임없이 모색하며 예술의 경계를 스스로 넓혀가고자 합니다.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-neutral-800 rounded-xl p-6 shadow-lg border-l-4 border-amber-500">
            <h3 className="text-xl font-bold mb-3 text-white">다름을 안는 마음, 포용</h3>
            <p className="text-neutral-300 leading-relaxed font-sans"> {/* leading-relaxed 추가 */}
              우리는 서로의 다름이 틀림이 아님을 믿습니다. 다양한 배경과 정체성, 각기 다른 생각과 목소리를 가진 모든 존재를 존중하며 따뜻하게 품고자 합니다. 어떤 차별도 없이 모든 목소리가 동등하게 소중히 여겨지고 자유롭게 울려 퍼지는 포용적인 예술 공동체. 그것이 우리가 함께 만들고 지켜나가고자 하는 소중한 가치입니다.
            </p>
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
}
