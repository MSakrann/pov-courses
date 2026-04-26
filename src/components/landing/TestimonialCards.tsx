/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

const posts = [
  {
    name: "Alex M.",
    date: "Mar 2, 2024",
    text: "I went from shaky home clips to clean B-roll in two weeks. The daily exercises are the difference.",
  },
  {
    name: "Sara K.",
    date: "Jan 18, 2024",
    text: "Finally a curriculum that is actually structured. My reels look 10X more intentional now.",
  },
] as const;

function FacebookCard() {
  const p = posts[0];
  return (
    <article className="mx-auto max-w-[700px] overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 text-ink shadow-xl">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 text-sm">
        <div className="h-9 w-9 overflow-hidden rounded-full">
          <Image
            width={36}
            height={36}
            className="h-full w-full object-cover"
            src="https://i.pravatar.cc/100?u=1"
            alt=""
          />
        </div>
        <div>
          <div className="font-bold">{p.name}</div>
          <div className="text-xs text-zinc-500">{p.date} · 🌐 · ···</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink/90">{p.text}</p>
      <div className="mt-4">
        <div className="sm:hidden">
          <div className="relative w-full max-w-2xl">
            <div className="grid gap-0">
              <div className="relative h-32 w-full overflow-hidden rounded-t-lg">
                <img
                  src="https://placehold.co/800x200/cccccc/333333?text=BEFORE"
                  alt="Before"
                  className="h-full w-full object-cover"
                />
                <span className="absolute start-2 top-2 rounded bg-white/80 px-2 text-xs font-bold text-red-600">
                  BEFORE
                </span>
              </div>
              <div className="flex justify-center py-1" aria-hidden>
                <span className="text-2xl">↓</span>
              </div>
              <div className="relative h-32 w-full overflow-hidden rounded-b-lg">
                <img
                  src="https://placehold.co/800x200/4CAF50/ffffff?text=AFTER"
                  alt="After"
                  className="h-full w-full object-cover"
                />
                <span className="absolute start-2 top-2 rounded bg-white/80 px-2 text-xs font-bold text-green-700">
                  AFTER
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex sm:max-w-2xl sm:items-center sm:gap-2 sm:pt-0">
          <img
            className="h-32 flex-1 rounded-lg object-cover"
            width={400}
            height={200}
            src="https://placehold.co/400x200/cccccc/333333?text=BEFORE"
            alt="Before"
          />
          <span className="text-2xl">→</span>
          <img
            className="h-32 flex-1 rounded-lg object-cover"
            width={400}
            height={200}
            src="https://placehold.co/400x200/2D3E50/fff?text=AFTER"
            alt="After"
          />
        </div>
      </div>
    </article>
  );
}

function XCard() {
  const p = posts[1];
  return (
    <article className="mx-auto max-w-[700px] overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 text-ink shadow-xl">
      <div className="flex items-start gap-2 text-sm">
        <Image
          width={40}
          height={40}
          className="rounded-full"
          src="https://i.pravatar.cc/100?u=2"
          alt=""
        />
        <div>
          <div className="font-bold">@{p.name.toLowerCase().replace(/\s/g, "")}</div>
          <p className="mt-1 text-sm text-ink/90">{p.text}</p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialCards() {
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-10 px-4">
      <FacebookCard />
      <XCard />
    </div>
  );
}
