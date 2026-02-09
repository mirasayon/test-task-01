import { SESS_LIMIT } from "#src/services/token.service.ts";

export const TOO_MANY_SESSIONS = `Too many active sessions (${SESS_LIMIT}). Sign out and retry.`;

export const INVALID_CREDS = "invalid email or password";

export const PASSWORDS_DONT_MATCH = "Passwords do not match";
