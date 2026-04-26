import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getCourseAccess } from "@/lib/course-access";
import { LoginForm } from "@/components/auth/LoginForm";
import { Navbar } from "@/components/Navbar";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string } };

export default async function LoginPage({ params: { locale } }: Props) {
  const access = await getCourseAccess();
  if (access.ok) {
    redirect(`/${locale}/course`);
  }
  const t = await getTranslations("auth");
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-center text-3xl font-extrabold text-ink">{t("loginTitle")}</h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
