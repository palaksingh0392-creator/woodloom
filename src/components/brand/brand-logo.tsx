import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  size?: "compact" | "standard" | "wide";
};

const logoSizes = {
  compact: {
    className: "h-12 w-[154px]",
    sizes: "154px",
  },
  standard: {
    className: "h-14 w-[190px] sm:h-16 sm:w-[220px]",
    sizes: "(min-width: 640px) 220px, 190px",
  },
  wide: {
    className:
      "h-[52px] w-[170px] sm:h-20 sm:w-[260px] lg:h-24 lg:w-[320px]",
    sizes: "(min-width: 1024px) 320px, (min-width: 640px) 260px, 170px",
  },
};

export default function BrandLogo({
  className = "",
  imageClassName = "",
  priority = false,
  size = "standard",
}: BrandLogoProps) {
  const selectedSize = logoSizes[size];

  return (
    <span className={`relative block ${selectedSize.className} ${className}`}>
      <Image
        src="/brand/brand-logo.png"
        alt="Shissoo brand logo"
        fill
        priority={priority}
        sizes={selectedSize.sizes}
        className={`object-contain ${imageClassName}`}
      />
    </span>
  );
}
