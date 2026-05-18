import { ReactNode } from "react";

import Navbar from "./navbar";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <Navbar />

      <main>{children}</main>
    </>
  );
}
