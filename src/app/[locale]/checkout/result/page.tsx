import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-cookies";
import { Navbar } from "@/components/Navbar";
import { PaymentResultClient } from "@/components/checkout/PaymentResultClient";

export const dynamic = "force-dynamic";

type Props = {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
};

function pick(v: string | string[] | undefined) {
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

export default async function CheckoutResultPage({
  params: { locale },
  searchParams,
}: Props) {
  const s = await getSessionFromCookies();
  if (!s?.sub) {
    redirect(`/${locale}/login`);
  }

  const raw = pick(searchParams.status) || "error";
  const status =
    raw === "success" || raw === "pending" || raw === "failed" || raw === "error"
      ? raw
      : "error";
  const orderId = pick(searchParams.orderId) || null;

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-xl px-4 py-16">
        <PaymentResultClient initialStatus={status} orderId={orderId} />
      </div>
    </div>
  );
}
