import activitiesData from "@/data/activities.json";
import { Card } from '@/components/ui/Card';

// 데이터 구조 변경에 맞춰 타입 업데이트 (date 제거)
type Activity = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
};

const structuredDataUrl = 'https://alf.seoul.kr/activities';

export default function ActivitiesPage() {
  const activities: Activity[] = activitiesData;
  const isValidData = Array.isArray(activities) && activities.length > 0;

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "예술해방전선 활동",
    description: "예술해방전선이 진행한 주요 예술 연대 및 기록 활동 목록",
    url: structuredDataUrl,
    numberOfItems: activities.length,
    itemListElement: activities.map((activity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: activity.title,
        description: activity.description,
        image: `https://alf.seoul.kr${activity.image}`,
        url: `${structuredDataUrl}?activity=${activity.id}`
      }
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
      />
      <div className="container mx-auto pt-28 pb-20 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white font-giants-inline animate-fade-in-up">
            예술해방전선의 활동
          </h1>
        </div>

        {isValidData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <Card
                key={activity.id}
                imageUrl={activity.image}
                title={activity.title}
                description={activity.description}
                imageAlt={`${activity.title} 대표 이미지: ${activity.description}`}
                tags={activity.tags}
                index={index}
                loadingPriority={index < 3}
                tagLimit={4}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-neutral-400 py-10">
            활동 데이터를 불러오는 데 문제가 발생했거나 데이터가 없습니다.
          </div>
        )}
      </div>
    </>
  );
}
