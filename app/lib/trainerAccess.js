// Single source of truth for "who is a trainer/admin" — no "use client" directive so it's
// importable from both AuthContext.js (client) and the /api/reports route handlers (server).
// Still just a hardcoded allowlist, not real auth: there's no session/token backing this app,
// so a server route can only trust whatever email the client claims to be. That's an explicit,
// known limitation (documented where the routes use it), not an oversight.
const TRAINER_EMAILS = new Set(["carlosa.canalesjr@gmail.com"]);

export function isTrainerEmail(email) {
  return Boolean(email) && TRAINER_EMAILS.has(email.trim().toLowerCase());
}
