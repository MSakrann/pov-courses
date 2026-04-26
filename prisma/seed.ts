import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const moduleTitles = [
  {
    order: 1,
    title_en: "How to Unlock Cinematic Smartphone Settings",
    title_ar: "كيف تفتح إعدادات التصوير السينمائي في الهاتف",
  },
  {
    order: 2,
    title_en: "Mastering your iPhone or Android Cameras",
    title_ar: "إتقان كاميرات آيفون أو أندرويد",
  },
  {
    order: 3,
    title_en: "Best Smartphone Camera Gear & Accessories",
    title_ar: "أفضل عتاد وملحقات كاميرا الهاتف",
  },
  {
    order: 4,
    title_en: "Beautiful Composition... Explained!",
    title_ar: "التكوين الجميل... بشرح واضح",
  },
  {
    order: 5,
    title_en: "Cinematic Camera Movements",
    title_ar: "حركات كاميرا سينمائية",
  },
  {
    order: 6,
    title_en: "Hollywood Lighting Techniques (Made Fast & Easy)",
    title_ar: "تقنيات إضاءة هوليوود (بسرعة وسهولة)",
  },
  {
    order: 7,
    title_en: "Recording Clean Audio On Your Smartphone",
    title_ar: "تسجيل صوت نظيف على هاتفك",
  },
  {
    order: 8,
    title_en: "Storytelling & Viral Videos",
    title_ar: "السرد القصصي وفيديوهات الفيرال",
  },
  {
    order: 9,
    title_en: "Cinematic Smartphone Editing",
    title_ar: "مونتاج سينمائي على الهاتف",
  },
  {
    order: 10,
    title_en: "Mastering Your Editing Apps",
    title_ar: "إتقان تطبيقات المونتاج",
  },
  {
    order: 11,
    title_en: "How to Edit on Your Computer",
    title_ar: "كيف تعدّل على الكمبيوتر",
  },
  {
    order: 12,
    title_en: "Youtube Mastery",
    title_ar: "إتقان يوتيوب",
  },
  {
    order: 13,
    title_en: "Social Media Superstar",
    title_ar: "نجم وسائل التواصل",
  },
  {
    order: 14,
    title_en: "Commercial Content Creator",
    title_ar: "صانع محتوى إعلاني",
  },
] as const;

async function main() {
  // Explicitly keep a clean slate for auth data.
  await prisma.purchase.deleteMany();
  await prisma.user.deleteMany();

  for (const m of moduleTitles) {
    const module = await prisma.module.upsert({
      where: { order: m.order },
      update: {
        title_en: m.title_en,
        title_ar: m.title_ar,
      },
      create: {
        order: m.order,
        title_en: m.title_en,
        title_ar: m.title_ar,
      },
    });

    const videoLesson = await prisma.lesson.upsert({
      where: {
        moduleId_order: {
          moduleId: module.id,
          order: 1,
        },
      },
      update: {
        title_en: `Day ${m.order}: Video Lesson`,
        title_ar: `اليوم ${m.order}: درس فيديو`,
        type: "video",
        vdoId: process.env.VDOCIPHER_DEMO_ID || `placeholder-vdo-day-${m.order}`,
      },
      create: {
        moduleId: module.id,
        order: 1,
        title_en: `Day ${m.order}: Video Lesson`,
        title_ar: `اليوم ${m.order}: درس فيديو`,
        type: "video",
        vdoId: process.env.VDOCIPHER_DEMO_ID || `placeholder-vdo-day-${m.order}`,
      },
    });

    const imagesLesson = await prisma.lesson.upsert({
      where: {
        moduleId_order: {
          moduleId: module.id,
          order: 2,
        },
      },
      update: {
        title_en: `Day ${m.order}: Slides & Notes`,
        title_ar: `اليوم ${m.order}: الشرائح والملاحظات`,
        type: "images",
        vdoId: null,
      },
      create: {
        moduleId: module.id,
        order: 2,
        title_en: `Day ${m.order}: Slides & Notes`,
        title_ar: `اليوم ${m.order}: الشرائح والملاحظات`,
        type: "images",
        vdoId: null,
      },
    });

    await prisma.image.upsert({
      where: {
        lessonId_order: {
          lessonId: imagesLesson.id,
          order: 1,
        },
      },
      update: {
        filename: `day-${m.order}-slide-1.webp`,
      },
      create: {
        lessonId: imagesLesson.id,
        order: 1,
        filename: `day-${m.order}-slide-1.webp`,
      },
    });

    await prisma.image.upsert({
      where: {
        lessonId_order: {
          lessonId: imagesLesson.id,
          order: 2,
        },
      },
      update: {
        filename: `day-${m.order}-slide-2.webp`,
      },
      create: {
        lessonId: imagesLesson.id,
        order: 2,
        filename: `day-${m.order}-slide-2.webp`,
      },
    });

    console.log("seeded module", m.order, module.id, videoLesson.id, imagesLesson.id);
  }
  console.log("seed ok");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
