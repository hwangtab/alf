import HeroSection from "@/components/home/HeroSection";
import LatestActivities from "@/components/home/LatestActivities";
// import SupportCTA from "@/components/home/SupportCTA"; // 사용하지 않으므로 제거

export default function Home() {
  return (
    // Remove default padding/margins, let sections control their spacing
    <div>
      <HeroSection
        title="예술해방전선 아카이브"
        subtitle="우리가 함께 걸어온 예술 해방의 여정"
      />
      <LatestActivities />
      {/* 활동 종료로 SupportCTA 및 NewsletterSignup 제거 */}
    </div>
  );
}
