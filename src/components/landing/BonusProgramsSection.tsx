import Image from "next/image";

/** Drop assets as: `public/images/bonuses/card-1.png` … `card-3.png` */
const BONUS_CARD_IMAGES = [
  "/images/bonuses/card-1.png",
  "/images/bonuses/card-2.png",
  "/images/bonuses/card-3.png",
] as const;

/** Display box for bonus card art (550×310). Source PNGs may be larger; contained inside this ratio. */
const BONUS_CARD_IMAGE_WIDTH = 550;
const BONUS_CARD_IMAGE_HEIGHT = 310;

export type BonusProgramCard = {
  title: string;
  imageAlt: string;
  bullets: string[];
};

function BonusCard({
  src,
  title,
  imageAlt,
  bullets,
  sizes,
}: {
  src: string;
  title: string;
  imageAlt: string;
  bullets: string[];
  /** Layout width hint for correct srcset (retina); avoid under-shooting or images look soft. */
  sizes: string;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/10 ring-1 ring-black/[0.06]">
      <div className="mx-auto aspect-[550/310] w-full max-w-[550px] shrink-0 overflow-hidden rounded-t-3xl bg-[#ecf0f1]">
        <Image
          src={src}
          alt={imageAlt}
          width={BONUS_CARD_IMAGE_WIDTH}
          height={BONUS_CARD_IMAGE_HEIGHT}
          sizes={sizes}
          quality={90}
          priority={false}
          className="h-full w-full object-contain object-center"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
          {title}
        </h3>
        <ul className="mt-4 flex flex-1 flex-col gap-2.5 text-start text-base leading-relaxed text-ink/85 sm:text-[17px]">
          {bullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span
                className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-sm font-semibold leading-none text-green-600"
                aria-hidden
              >
                ✔
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** ~half column inside `max-w-6xl` + padding + gap — don’t undershoot or Next/Image serves a slug too small (soft on retina). */
const SIZES_BONUS_CARD =
  "(max-width: 767px) 100vw, (max-width: 1152px) calc((100vw - 2rem - 1.5rem) / 2), 620px";

export function BonusProgramsSection({ cards }: { cards: BonusProgramCard[] }) {
  const a = cards[0];
  const b = cards[1];
  const c = cards[2];
  if (!a || !b || !c) return null;

  return (
    <section className="bg-black py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6">
          <BonusCard
            src={BONUS_CARD_IMAGES[0]}
            title={a.title}
            imageAlt={a.imageAlt}
            bullets={a.bullets}
            sizes={SIZES_BONUS_CARD}
          />
          <BonusCard
            src={BONUS_CARD_IMAGES[1]}
            title={b.title}
            imageAlt={b.imageAlt}
            bullets={b.bullets}
            sizes={SIZES_BONUS_CARD}
          />
          <div className="md:col-span-2 flex justify-center">
            <div className="w-full md:max-w-[calc(50%-0.75rem)]">
              <BonusCard
                src={BONUS_CARD_IMAGES[2]}
                title={c.title}
                imageAlt={c.imageAlt}
                bullets={c.bullets}
                sizes={SIZES_BONUS_CARD}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
