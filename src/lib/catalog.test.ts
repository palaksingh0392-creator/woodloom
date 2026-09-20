import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCatalogCollectionCard,
  hasDatabaseUrl,
} from "@/lib/catalog";
import { normalizeHomeHeroSlideInput } from "@/lib/home";

test("homepage collection cards are built from category data", () => {
  const card = buildCatalogCollectionCard({
    slug: "living-room",
    name: "Living Room",
    image: "https://example.com/living-room.jpg",
    productCount: 12,
  });

  assert.equal(card.title, "Living Room");
  assert.equal(card.products, "12 Products");
  assert.equal(card.href, "/furniture/living-room");
  assert.equal(card.image, "https://example.com/living-room.jpg");
});

test("database is only used when a real SQL Server URL is configured", () => {
  const original = process.env.DATABASE_URL;

  process.env.DATABASE_URL = "sqlserver://db.example.com:1433;database=woodloom;user=app;password=secret;encrypt=false;trustServerCertificate=true";
  assert.equal(hasDatabaseUrl(), true);

  process.env.DATABASE_URL = "sqlserver://db.example.com:1433;database=woodloom;user=app;password=YOUR_PASSWORD;encrypt=false;trustServerCertificate=true";
  assert.equal(hasDatabaseUrl(), false);

  process.env.DATABASE_URL = "";
  assert.equal(hasDatabaseUrl(), false);

  if (original === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = original;
  }
});

test("homepage hero slide input is normalized without changing the design data", () => {
  const input = normalizeHomeHeroSlideInput({
    eyebrow: " Scandinavian Luxury Furniture ",
    title: " Timeless Furniture For Beautiful Living ",
    subtitle: " Crafted wooden interiors. ",
    imageUrl: "https://images.unsplash.com/test.jpg",
    primaryCtaLabel: " Explore Collection ",
    primaryCtaHref: " /furniture ",
    secondaryCtaLabel: " Book Consultation ",
    secondaryCtaHref: " /contact ",
    isActive: true,
    sortOrder: "3",
  });

  assert.equal(input.eyebrow, "Scandinavian Luxury Furniture");
  assert.equal(input.title, "Timeless Furniture For Beautiful Living");
  assert.equal(input.subtitle, "Crafted wooden interiors.");
  assert.equal(input.primaryCtaLabel, "Explore Collection");
  assert.equal(input.primaryCtaHref, "/furniture");
  assert.equal(input.secondaryCtaLabel, "Book Consultation");
  assert.equal(input.secondaryCtaHref, "/contact");
  assert.equal(input.sortOrder, 3);
});
