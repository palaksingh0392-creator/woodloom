import type { InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function AuthField({ label, id, ...props }: AuthFieldProps) {
  return (
    <label className="grid gap-2" htmlFor={id}>
      <span className="text-sm font-medium">{label}</span>
      <input
        id={id}
        className="
          h-14
          rounded-full
          border
          border-[var(--border)]
          bg-transparent
          px-5
          outline-none
          transition-colors
          placeholder:text-[var(--text-secondary)]
          focus:border-[var(--primary)]
        "
        {...props}
      />
    </label>
  );
}
