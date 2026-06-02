import { Truck, ShieldCheck, BadgeCheck } from "lucide-react";

export default function Topbar() {
  return (
    <div
      className="
        hidden
        lg:flex

        h-11

        bg-[#2b2118]
        text-[#f3ede7]

        items-center
        justify-center
      "
    >
      <div
        className="
          container-main

          flex
          items-center
          justify-center
          gap-10

          text-sm
          tracking-wide
        "
      >
        <div className="flex items-center gap-2 opacity-90">
          <Truck size={15} />

          <span>Free Delivery Across Selected Cities</span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        <div className="flex items-center gap-2 opacity-90">
          <ShieldCheck size={15} />

          <span>7-Day Easy Returns</span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        <div className="flex items-center gap-2 opacity-90">
          <BadgeCheck size={15} />

          <span>Premium Wooden Craftsmanship</span>
        </div>
      </div>
    </div>
  );
}
