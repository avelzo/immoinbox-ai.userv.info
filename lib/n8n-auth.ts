export function isValidN8nRequest(request: Request): boolean {
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();

  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization")?.trim();
  if (!authHeader) {
    return false;
  }

  return authHeader === `Bearer ${secret}`;
}
