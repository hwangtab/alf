import newslettersData from "@/data/newsletters.json";
import { migratedIds } from "@/data/newsletterContent";
import NewsList, { type NewsListItem } from "./NewsList";

export default function NewsPage() {
  const items: NewsListItem[] = [...newslettersData]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .map((n) => {
      const isMigrated = migratedIds.includes(n.id);
      return {
        id: n.id,
        title: n.title,
        publishDate: n.publishDate,
        summary: n.summary,
        highlights: n.highlights,
        thumbnail: n.thumbnail,
        href: isMigrated ? `/news/${n.id}` : n.link,
        isMigrated,
      };
    });

  return (
    <div className="container mx-auto pt-28 pb-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white font-giants-inline animate-fade-in-up">
          예술해방전선 활동 보고
        </h1>
      </div>
      <NewsList items={items} />
    </div>
  );
}
