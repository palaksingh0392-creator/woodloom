import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={clsx(
        `
        w-full
        px-5
        py-4
        rounded-[20px]
        border
        bg-[var(--surface)]
        outline-none
        transition-default

        focus:ring-2
        focus:ring-[var(--primary)]
        `,
        className,
      )}
      {...props}
    />
  );
}
