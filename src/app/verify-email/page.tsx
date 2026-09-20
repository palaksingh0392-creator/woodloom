import Link from "next/link";
import { redirect } from "next/navigation";

import { verifySignedToken } from "@/lib/auth";
import { verifyEmailVerificationToken } from "@/lib/email-verification";

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams;
  if (!token) {
    return <VerificationResult message="This verification link is missing or invalid." />;
  }

  const decoded = verifySignedToken<{ email?: string }>(token);
  if (!decoded?.email || !verifyEmailVerificationToken(token, decoded.email)) {
    return <VerificationResult message="This verification link has expired or is invalid." />;
  }

  redirect(`/register?verifiedEmail=${encodeURIComponent(decoded.email)}&verificationToken=${encodeURIComponent(token)}`);
}

function VerificationResult({ message }: { message: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-4xl">Email verification</h1>
      <p className="mt-4 text-[var(--text-secondary)]">{message}</p>
      <Link href="/register" className="mt-8 rounded-full bg-[var(--primary)] px-6 py-3 text-sm text-white">Return to registration</Link>
    </main>
  );
}
