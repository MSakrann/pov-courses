import { requireCoursePageAccess } from "@/lib/course-access";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { CourseView } from "@/components/course/CourseView";

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
  return (
    <div>
      <Navbar />
      <CourseView modules={modules} initialLessonId={lesson} />
    </div>
  );
}
