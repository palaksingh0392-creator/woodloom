import net from "node:net";
import tls from "node:tls";
import { randomUUID } from "node:crypto";

type AuthEmailInput = {
  to: string;
  subject: string;
  text: string;
};

const placeholderPasswordPatterns = [/your-16-char-app-password/i, /replace-me/i, /changeme/i];

export async function sendAuthEmail(input: AuthEmailInput) {
  if (process.env.EMAIL_DELIVERY_MODE === "smtp") {
    if (isPlaceholderSmtpSetup()) {
      throw new Error(
        "SMTP is enabled but real SMTP credentials are not configured.",
      );
    }

    await sendSmtpEmail(input);
    return { delivered: true };
  }

  console.info(`[Shissoo email] To: ${input.to}`);
  console.info(`[Shissoo email] Subject: ${input.subject}`);
  console.info(`[Shissoo email] ${input.text}`);

  return { delivered: false };
}

function isPlaceholderSmtpSetup() {
  const pass = process.env.SMTP_PASS ?? "";
  const host = process.env.SMTP_HOST ?? "";
  const user = process.env.SMTP_USER ?? "";

  const hasPlaceholderPassword = placeholderPasswordPatterns.some((pattern) =>
    pattern.test(pass),
  );

  return Boolean(
    !host ||
      !user ||
      !pass ||
      hasPlaceholderPassword ||
      pass.includes("YOUR_") ||
      pass.includes("your-"),
  );
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !user || !pass || !from) {
    throw new Error(
      "SMTP is enabled but SMTP_HOST, SMTP_USER, SMTP_PASS, or SMTP_FROM is missing.",
    );
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
  };
}

function encodeBase64(value: string) {
  return Buffer.from(value).toString("base64");
}

function formatAddress(value: string) {
  return value.includes("<") ? value : `<${value}>`;
}

function buildMessage(input: AuthEmailInput, from: string) {
  const senderDomain = from.split("@")[1]?.replace(/[>]/g, "") ?? "shissoo.com";
  const headers = [
    `From: Shissoo ${formatAddress(from)}`,
    `To: ${formatAddress(input.to)}`,
    `Reply-To: ${formatAddress(from)}`,
    `Subject: ${input.subject.replace(/\r?\n/g, " ")}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${randomUUID()}@${senderDomain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
  ];

  return `${headers.join("\r\n")}\r\n\r\n${input.text}\r\n.`;
}

async function readSmtpResponse(socket: net.Socket | tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";

    function cleanup() {
      socket.off("data", onData);
      socket.off("error", onError);
    }

    function onData(chunk: Buffer) {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines[lines.length - 1];

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(buffer);
      }
    }

    function onError(error: Error) {
      cleanup();
      reject(error);
    }

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function writeCommand(
  socket: net.Socket | tls.TLSSocket,
  command: string,
) {
  socket.write(`${command}\r\n`);
  const response = await readSmtpResponse(socket);
  const code = Number(response.slice(0, 3));

  if (code >= 400) {
    throw new Error(`SMTP command failed: ${response.trim()}`);
  }

  return response;
}

async function connectSmtp(config: ReturnType<typeof getSmtpConfig>) {
  return new Promise<net.Socket | tls.TLSSocket>((resolve, reject) => {
    const socket = config.secure
      ? tls.connect(config.port, config.host, {
          servername: config.host,
        })
      : net.connect(config.port, config.host);

    socket.once("connect", () => resolve(socket));
    socket.once("error", reject);
  });
}

async function upgradeToTls(socket: net.Socket, host: string) {
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const secureSocket = tls.connect({
      socket,
      servername: host,
    });

    secureSocket.once("secureConnect", () => resolve(secureSocket));
    secureSocket.once("error", reject);
  });
}

async function sendSmtpEmail(input: AuthEmailInput) {
  const config = getSmtpConfig();
  let socket = await connectSmtp(config);

  try {
    await readSmtpResponse(socket);
    await writeCommand(socket, `EHLO ${process.env.SMTP_HELO_HOST ?? config.host}`);

    if (!config.secure) {
      await writeCommand(socket, "STARTTLS");
      socket = await upgradeToTls(socket as net.Socket, config.host);
      await writeCommand(socket, `EHLO ${process.env.SMTP_HELO_HOST ?? config.host}`);
    }

    await writeCommand(socket, "AUTH LOGIN");
    await writeCommand(socket, encodeBase64(config.user));
    await writeCommand(socket, encodeBase64(config.pass));
    await writeCommand(socket, `MAIL FROM:<${config.from}>`);
    await writeCommand(socket, `RCPT TO:<${input.to}>`);
    await writeCommand(socket, "DATA");
    await writeCommand(socket, buildMessage(input, config.from));
    await writeCommand(socket, "QUIT");
  } finally {
    socket.end();
  }
}
