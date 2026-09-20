"use client";

type GlobalErrorProps = {
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "#1f1b18",
            color: "#f3ede7",
            fontFamily:
              "Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          }}
        >
          <section style={{ maxWidth: "520px", textAlign: "center" }}>
            <p
              style={{
                marginBottom: "16px",
                color: "#c49a6a",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              Shissoo
            </p>
            <h1
              style={{
                marginBottom: "16px",
                fontSize: "clamp(36px, 8vw, 64px)",
                lineHeight: 1,
              }}
            >
              Something went wrong
            </h1>
            <p style={{ marginBottom: "28px", color: "#b8ada1", lineHeight: 1.7 }}>
              The page could not load correctly. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                border: 0,
                borderRadius: "999px",
                background: "#c49a6a",
                color: "#1f1b18",
                cursor: "pointer",
                fontWeight: 700,
                padding: "14px 22px",
              }}
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
