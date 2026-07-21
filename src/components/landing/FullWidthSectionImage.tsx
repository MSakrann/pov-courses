import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Outer section classes (defaults to black bar like reference) */
  className?: string;
  /** First visible hero only — avoid preloading every full-width strip */
  priority?: boolean;
  /** Cap strip height (px), e.g. grey course showcase at 600 */
  maxInnerHeight?: number;
};

/**
 * Full-bleed image block for landing sections.
 * Drop assets into `public/images/sections/` and pass `/images/sections/your-file.png`.
 */
export function FullWidthSectionImage({
  src,
  alt,
  className = "bg-black",
  priority = false,
  maxInnerHeight,
}: Props) {
  const capped = typeof maxInnerHeight === "number" && maxInnerHeight > 0;
  const maxH = capped && maxInnerHeight ? `${maxInnerHeight}px` : undefined;

  return (
    <section className={className} aria-label={alt}>
      <div
        className={
          capped
            ? "relative w-full overflow-hidden max-md:min-h-0"
            : "relative w-full overflow-hidden max-md:min-h-[min(62vw,_420px)] md:min-h-0"
        }
        style={maxH ? { maxHeight: maxH } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={960}
          className={
            capped
              ? "relative mx-auto block h-auto max-w-full object-contain object-center"
              : "absolute inset-0 z-0 h-full w-full object-cover object-[50%_28%] md:relative md:inset-auto md:z-auto md:block md:h-auto md:w-full md:object-center"
          }
          style={
            maxH
              ? {
                  maxHeight: maxH,
                  width: "auto",
                  maxWidth: "100%",
                }
              : undefined
          }
          sizes="100vw"
          priority={priority}
        />
      </div>
    </section>
  );
}
