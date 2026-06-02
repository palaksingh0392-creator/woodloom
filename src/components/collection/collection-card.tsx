import Image from "next/image";

interface CollectionCardProps {
  title: string;
  subtitle: string;
  image: string;
  featured?: boolean;
}

export default function CollectionCard({
  title,
  subtitle,
  image,
  featured = false,
}: CollectionCardProps) {
  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-[20px]
        sm:rounded-[24px]

        ${featured ? "h-[420px] sm:h-[520px]" : "h-[240px]"}
      `}
    >
      {/* IMAGE */}
      <Image
        src={image}
        alt={title}
        fill
        sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "100vw"}
        className="
          absolute
          inset-0
          object-cover

          brightness-[0.92]
          contrast-[1.02]
          saturate-[0.88]

          transition
          duration-700
          group-hover:scale-[1.03]
        "
      />

      {/* OVERLAY */}
      <div
        className="
          absolute
          inset-0

          bg-gradient-to-t
          from-black/60
          via-black/15
          to-transparent
        "
      />

      {/* CONTENT */}
      <div
        className="
          absolute
          bottom-6
          left-6
          sm:bottom-10
          sm:left-10
          z-10
        "
      >
        <p
          className="
            mb-4

            text-[11px]
            uppercase
            tracking-[4px]

            text-white/70
          "
        >
          {subtitle}
        </p>

        <h3
          className={`
            max-w-[320px]
            font-serif
            leading-[0.95]
            tracking-normal
            text-white

            ${featured ? "text-[42px] sm:text-[54px]" : "text-[32px] sm:text-[38px]"}
          `}
        >
          {title}
        </h3>

        <button
          className="
            mt-6

            text-[12px]
            uppercase
            tracking-[3px]

            text-white/90

            transition
            hover:text-white
          "
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
}
