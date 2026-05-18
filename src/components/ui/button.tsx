import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        `
        px-6
        py-3
        rounded-[20px]
        font-medium
        transition-default
        cursor-pointer
        `,
        variant === "primary" &&
          `
          bg-[var(--primary)]
          text-white
          hover:opacity-90
          `,
        variant === "secondary" &&
          `
          card-surface
          hover:bg-black/5
          dark:hover:bg-white/5
          `,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
