import "server-only";

type AuthEmailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendAuthEmail(input: AuthEmailInput) {
  // Development fallback. A real SMTP/Resend provider can be connected here.
  console.info(`[WOODLOOM email] To: ${input.to}`);
  console.info(`[WOODLOOM email] Subject: ${input.subject}`);
  console.info(`[WOODLOOM email] ${input.text}`);

  return { delivered: false };
}
