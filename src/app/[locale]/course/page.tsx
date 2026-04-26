import { getTranslations } from "next-intl/server";
import { requireCoursePageAccess } from "@/lib/course-access";
import { prisma } from "@/lib/prisma";
import { CourseView } from "@/components/course/CourseView";
import { LogoutButton } from "@/components/LogoutButton";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ lesson?: string }> | { lesson?: string };
};

export default async function CoursePage({ searchParams }: Props) {
  await requireCoursePageAccess();
  const sp = await Promise.resolve(searchParams);
  const lesson = typeof sp?.lesson === "string" ? sp.lesson : null;
  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: { images: { orderBy: { order: "asc" } } },
      },
    },
  });
  const t = await getTranslations("course");
  const tNav = await getTranslations("nav");
  return (
    <div>
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2">
          <h1 className="text-lg font-extrabold text-ink">{t("title")}</h1>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-brand-red underline">
              {tNav("home")}
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <CourseView modules={modules} initialLessonId={lesson} />
    </div>
  );
}
