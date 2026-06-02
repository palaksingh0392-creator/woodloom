"use client";

import Link from "next/link";

import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { ArrowRight } from "lucide-react";
export default function FooterSection() {
  return (
    <footer
      className="
        bg-[#181512]
        text-white
        mt-24
      "
    >
      {/* TOP NEWSLETTER */}
      <div
        className="
          border-b
          border-white/10
        "
      >
        <div
          className="
            max-w-[1440px]
            mx-auto

            px-6
            lg:px-10

            py-20

            grid
            lg:grid-cols-2
            gap-14
            items-center
          "
        >
          {/* LEFT */}
          <div>
            <p
              className="
                uppercase
                tracking-[4px]
                text-sm
                text-[#c8a27a]
                mb-5
              "
            >
              Stay Inspired
            </p>

            <h2
              className="
                text-4xl
                lg:text-6xl
                leading-[1.05]
                font-serif
                max-w-[620px]
              "
            >
              Join Our World Of Timeless Interiors
            </h2>
          </div>

          {/* RIGHT */}
          <div>
            <p
              className="
                text-white/70
                text-lg
                leading-relaxed
                mb-8
                max-w-[520px]
              "
            >
              Receive curated furniture inspiration, interior styling ideas, and
              exclusive launches directly in your inbox.
            </p>

            {/* INPUT */}
            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-4
              "
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  flex-1

                  h-14
                  px-5

                  rounded-full

                  bg-white/5
                  border
                  border-white/10

                  text-white
                  placeholder:text-white/40

                  outline-none

                  focus:border-[#c8a27a]

                  transition-all
                "
              />

              <button
                className="
                  h-14
                  px-8

                  rounded-full

                  bg-[#c8a27a]
                  text-black

                  uppercase
                  tracking-[2px]
                  text-sm
                  font-medium

                  hover:bg-[#d5b08a]

                  transition-all

                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                Subscribe
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div
        className="
          max-w-[1440px]
          mx-auto

          px-6
          lg:px-10

          py-20

          grid
          lg:grid-cols-12
          gap-16
        "
      >
        {/* BRAND */}
        <div className="lg:col-span-4">
          <Link href="/">
            <h2
              className="
                text-5xl
                font-bold
                tracking-tight
                mb-3
              "
            >
              WOODLOOM
            </h2>
          </Link>

          <p
            className="
              uppercase
              tracking-[5px]
              text-sm
              text-white/40
              mb-8
            "
          >
            Live Beautifully
          </p>

          <p
            className="
              text-white/65
              leading-relaxed
              max-w-[360px]
            "
          >
            Crafted Scandinavian-inspired furniture designed with warmth,
            elegance, and timeless luxury for modern homes.
          </p>

          {/* SOCIALS */}
          <div
            className="
              flex
              items-center
              gap-4
              mt-10
            "
          >
            {/* INSTAGRAM */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-11
                h-11

                rounded-full

                border
                border-white/10

                flex
                items-center
                justify-center

                hover:bg-white
                hover:text-black

                transition-all
              "
            >
              <FaInstagram size={18} />
            </a>

            {/* FACEBOOK */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-11
                h-11

                rounded-full

                border
                border-white/10

                flex
                items-center
                justify-center

                hover:bg-white
                hover:text-black

                transition-all
              "
            >
              <FaFacebookF size={18} />
            </a>

            {/* TWITTER */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-11
                h-11

                rounded-full

                border
                border-white/10

                flex
                items-center
                justify-center

                hover:bg-white
                hover:text-black

                transition-all
              "
            >
              <FaTwitter size={18} />
            </a>

            {/* YOUTUBE */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-11
                h-11

                rounded-full

                border
                border-white/10

                flex
                items-center
                justify-center

                hover:bg-white
                hover:text-black

                transition-all
              "
            >
              <FaYoutube size={18} />
            </a>

            {/* LINKEDIN */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-11
                h-11

                rounded-full

                border
                border-white/10

                flex
                items-center
                justify-center

                hover:bg-white
                hover:text-black

                transition-all
              "
            >
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>

        {/* LINKS */}
        <div
          className="
            lg:col-span-8

            grid
            sm:grid-cols-3
            gap-12
          "
        >
          {/* SHOP */}
          <div>
            <h3
              className="
                text-lg
                font-semibold
                mb-6
              "
            >
              Shop
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                href="/furniture/living-room"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Living Room
              </Link>

              <Link
                href="/furniture/bedroom"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Bedroom
              </Link>

              <Link
                href="/furniture/dining-room"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Dining
              </Link>

              <Link
                href="/furniture/office"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Workspace
              </Link>

              <Link
                href="/furniture/decor"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Decor
              </Link>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3
              className="
                text-lg
                font-semibold
                mb-6
              "
            >
              Company
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                href="/about"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                About Us
              </Link>

              <Link
                href="/blog"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Journal
              </Link>

              <Link
                href="/contact"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Careers
              </Link>

              <Link
                href="/shipping-policy"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h3
              className="
                text-lg
                font-semibold
                mb-6
              "
            >
              Support
            </h3>

            <div className="flex flex-col gap-4">
              <Link
                href="/return-policy"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Shipping
              </Link>

              <Link
                href="/privacy-policy"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Returns
              </Link>

              <Link
                href="/terms-and-conditions"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                href="/"
                className="text-white/60 hover:text-[#c8a27a] transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div
        className="
          border-t
          border-white/10
        "
      >
        <div
          className="
            max-w-[1440px]
            mx-auto

            px-6
            lg:px-10

            py-6

            flex
            flex-col
            md:flex-row

            items-center
            justify-between

            gap-4
          "
        >
          <p
            className="
              text-sm
              text-white/40
            "
          >
            © 2026 WOODLOOM. All rights reserved.
          </p>

          <div
            className="
              flex
              items-center
              gap-6

              text-sm
              text-white/40
            "
          >
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>

            <Link href="/terms-and-conditions" className="hover:text-white">
              Terms
            </Link>

            <Link href="/" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
