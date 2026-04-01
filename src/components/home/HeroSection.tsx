import Image from 'next/image';
import Button from '@/components/ui/Button';
import ScrollToButton from '@/components/ui/ScrollToButton';

type HeroSectionProps = {
  title: string;
  subtitle: string;
};

const HeroSection = ({ title, subtitle }: HeroSectionProps) => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <Image
        src="/images/hero/hero-background.webp"
        alt="노량진수산시장 상인들과 예술가들"
        fill
        className="object-cover z-[-1] opacity-30"
        priority
        quality={75} // 85 -> 75로 추가 최적화 (육안상 차이 미미)
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/55 to-black/80 z-[-1]" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-primary-red to-primary-orange opacity-10 blur-3xl" />

      <div className="container mx-auto px-4 z-10 text-center relative">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-normal font-giants-inline">
          <span className="text-gradient block">{title}</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-neutral-200 font-sans">
          {subtitle}
        </p>

        <div>
          <Button
            href="/about"
            variant="secondary"
            size="md"
            className="btn-revolution"
          >
            우리의 연대
          </Button>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <ScrollToButton
          targetId="latest-activities"
          ariaLabel="주요 활동 소개로 스크롤"
          className="p-2 cursor-pointer text-white hover:text-yellow-400 transition-colors"
        />
      </div>
    </section>
  );
};

export default HeroSection;
