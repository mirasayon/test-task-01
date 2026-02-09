import { validateEnvironment, builtInSchemas as v } from "safest-env";
const env = validateEnvironment({
    PASSWORD_HASH_PEPPER: v.string(),
    SESSION_TOKEN_HMAC_SECRET: v.string(),
    NODE_ENV: v.enum(["development", "test", "production"] as const),
    HOSTNAME: v.string(),
    DATABASE_URL: v.string(),
    FRONTEND_URL: v.string(),
    COOKIE_SIGNING_SECRET: v.string(),
    PORT: v.integer(),
});
export const envCfg = {
    mode: env.NODE_ENV,
    frontendUrl: env.FRONTEND_URL,
    dev: env.NODE_ENV === "development",
    test: env.NODE_ENV === "test",
    prod: env.NODE_ENV === "production",
    passwHashPepper: env.PASSWORD_HASH_PEPPER,
    dbUrl: env.DATABASE_URL,
    tokenHmacSecret: env.SESSION_TOKEN_HMAC_SECRET,
    cookieSignSecret: env.COOKIE_SIGNING_SECRET,
    port: env.PORT,
    host: env.HOSTNAME,
};
