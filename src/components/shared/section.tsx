import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Section({ children, className }: Props) {
  return (
    <section className={clsx("section-spacing", className)}>{children}</section>
  );
}
