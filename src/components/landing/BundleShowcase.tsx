import { Link } from "@/i18n/navigation";

type Props = {
  orig: string;
  price: string;
  title: string;
  bigSale: string;
  today: string;
};

const items = [
  { label: "Bundle A", value: 147, w: 1 },
  { label: "Bundle B", value: 198, w: 0.9 },
  { label: "Main", value: 298, w: 1.15, main: true },
  { label: "Bundle C", value: 147, w: 0.9 },
  { label: "Bundle D", value: 198, w: 1 },
];

export function BundleShowcase({ orig, price, title, bigSale, today }: Props) {
  return (
    <section className="bg-black py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        <p className="mt-2 text-3xl font-extrabold text-brand-red sm:text-4xl">
          {bigSale}
        </p>
        <div className="relative mt-12 flex h-56 items-end justify-center gap-2 sm:h-64 sm:gap-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="relative flex flex-1 max-w-[120px] flex-col items-center justify-end sm:max-w-[140px]"
              style={{ transform: `translateY(${(2 - i % 2) * 4}px) rotate(${(i - 2) * 3}deg) scale(${it.w})` }}
            >
              <div
                className={`mb-2 rounded-full border border-white/30 bg-zinc-900 px-2 py-0.5 text-xs font-bold sm:text-sm ${
                  it.main ? "text-white" : "text-white/90"
                }`}
              >
                ${it.value} VALUE
              </div>
              <div
                className={`flex h-28 w-full items-center justify-center rounded-2xl border-2 sm:h-32 ${
                  it.main
                    ? "border-brand-red bg-zinc-800 text-lg font-extrabold"
                    : "border-white/20 bg-zinc-900 text-sm"
                }`}
              >
                {it.label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-white/80">
          Normal price: <span className="text-2xl font-bold text-brand-red line-through">{orig} USD</span>
        </p>
        <div className="mt-4">
          <Link
            href="/checkout"
            className="inline-block rounded-full bg-brand-green px-8 py-3 text-lg font-extrabold text-white shadow-lg hover:opacity-90"
          >
            {today}: ${price}
          </Link>
        </div>
      </div>
    </section>
  );
}
