import { requireCustomerSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomerSession();

  return children;
}
