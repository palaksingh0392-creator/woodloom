export async function readAdminResponse<T extends Record<string, unknown>>(
  response: Response,
): Promise<T> {
  const text = await response.text();

  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    const detail = text.replace(/\s+/g, " ").trim().slice(0, 160);
    throw new Error(
      detail
        ? `The request failed (${response.status}): ${detail}`
        : `The request failed (${response.status}).`,
    );
  }
}