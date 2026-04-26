import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.image.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  for (let d = 1; d <= 14; d += 1) {
    const mod = await prisma.module.create({
      data: {
        title_en: `Day ${d} — Smartphone`,
        title_ar: `اليوم ${d} — الهاتف`,
        order: d,
        lessons: {
          create: {
            title_en: `Day ${d} main lesson`,
            title_ar: `الدرس الرئيسي — اليوم ${d}`,
            type: "video",
            order: 1,
            vdoId: process.env.VDOCIPHER_DEMO_ID || "demo",
          },
        },
      },
    });
    console.log("module", d, mod.id);
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
