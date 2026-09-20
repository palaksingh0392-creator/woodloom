import FooterSection from "./footer";
import Navbar from "./navbar";
import Topbar from "./topbar";
import { listNavigationCategories, listNavigationLinks } from "@/lib/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigationLinks, navigationCategories] = await Promise.all([
    listNavigationLinks({ activeOnly: true }),
    listNavigationCategories(),
  ]);

  return (
    <>
      <Topbar />

      <Navbar links={navigationLinks} categories={navigationCategories} />

      <main>{children}</main>

      <FooterSection />
    </>
  );
}
