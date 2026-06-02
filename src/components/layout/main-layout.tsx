import FooterSection from "./footer";
import Navbar from "./navbar";
import Topbar from "./topbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Topbar />

      <Navbar />

      <main>{children}</main>

      <FooterSection />
    </>
  );
}
