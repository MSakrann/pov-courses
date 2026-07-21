import Image from "next/image";

export type SaleBonusRow = {
  title: string;
  imageAlt: string;
  bullets: string[];
};

/** Add PNGs: `public/images/bonuses/sale-bonus-01.png` … `sale-bonus-17.png`. */
export function saleBonusRowImageSrc(index: number): string {
  return `/images/bonuses/sale-bonus-${String(index + 1).padStart(2, "0")}.png`;
}

const IMAGE_AREA_MAX_W = 440;

/** Slight zoom so box art fills the frame; PNGs often have extra margin around the mockup. */
const IMAGE_ZOOM_CLASS = "origin-center scale-[1.24] sm:scale-[1.28]";

/** Layout width hint for optimizer (× DPR handled by Next). */
const SIZES_SALE_BOX = `(max-width: 1023px) min(92vw, 480px), ${IMAGE_AREA_MAX_W}px`;

export function SaleBonusesRowsSection({
  sectionTitle,
  rows,
}: {
  sectionTitle: string;
  rows: SaleBonusRow[];
}) {
  if (!rows.length) return null;

  return (
    <div className="w-full">
      <div className="bg-white px-4 pb-10 pt-14 sm:pt-16">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink sm:text-[40px] sm:leading-tight">
          {sectionTitle}
        </h2>
      </div>
      <div className="space-y-0">
        {rows.map((row, idx) => {
          const stripeWhite = idx % 2 === 0;
          const rowBg = stripeWhite ? "bg-white" : "bg-[#ecf0f1]";
          const cardBg = stripeWhite ? "bg-[#ecf0f1]" : "bg-white";
          const src = saleBonusRowImageSrc(idx);

          return (
            <section
              key={`${idx}-${row.title}`}
              className={`${rowBg} px-4 py-10 sm:py-14`}
              aria-labelledby={`sale-bonus-title-${idx}`}
            >
              <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-stretch lg:gap-12 xl:gap-16">
                <div className="order-1 flex w-full justify-center lg:h-full lg:min-h-0 lg:justify-end lg:self-stretch lg:pe-4">
                  <div
                    className="relative h-[420px] w-full bg-transparent sm:h-[460px] lg:h-full lg:min-h-[260px] [filter:drop-shadow(0_20px_38px_-6px_rgba(0,0,0,0.26))]"
                    style={{ maxWidth: IMAGE_AREA_MAX_W }}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={src}
                        alt={row.imageAlt}
                        fill
                        sizes={SIZES_SALE_BOX}
                        quality={90}
                        loading={idx === 0 ? "eager" : "lazy"}
                        priority={idx === 0}
                        className={`object-contain object-center ${IMAGE_ZOOM_CLASS}`}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`order-2 flex flex-col lg:min-h-0 lg:self-stretch rounded-3xl p-8 sm:p-10 ${cardBg} shadow-inner shadow-black/[0.04] ring-1 ring-black/[0.04]`}
                >
                  <h3
                    id={`sale-bonus-title-${idx}`}
                    className="text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px] lg:text-[36px]"
                  >
                    {row.title}
                  </h3>
                  <ul className="mt-6 space-y-3 text-[17px] leading-relaxed text-ink/92 sm:text-lg">
                    {row.bullets.map((text) => (
                      <li key={text} className="flex gap-3 text-start">
                        <span
                          className="mt-[3px] inline-flex h-5 w-5 shrink-0 items-center justify-center text-base font-bold leading-none text-ink"
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
