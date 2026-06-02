import { requireCustomerSession } from "@/lib/session";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomerSession();

  return children;
}
