import { envCfg } from "#src/configs/env-config.ts";
import { SESS_EXP_HOURS, type TokenInfo } from "../services/token.service.ts";

class CookieService {
    private SESSION_TOKEN_NAME = "session_token";
    clearToken = (res: Res) =>
        void res.clearCookie(this.SESSION_TOKEN_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
    getToken = (
        req: Req,
        max = 1024,
        min = 16,
        regex = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/,
    ) => {
        const token = req.signedCookies[this.SESSION_TOKEN_NAME];
        if (!token || typeof token !== "string") return null;

        if (token.length < min || token.length > max) return null;

        if (!token.includes(".")) return null;

        const parts = token.split(".");

        if (parts.length !== 2) return null;

        if (regex.test(token)) {
            return {
                selector: token.split(".")[0]!,
                validator_hash: token.split(".")[1]!,
            } satisfies TokenInfo;
        }
        return null;
    };
    setToken = (res: Res, value: str) =>
        void res.cookie(this.SESSION_TOKEN_NAME, value, {
            httpOnly: true,
            secure: envCfg.prod,
            signed: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * SESS_EXP_HOURS,
        });
}

export const cookieSvc = new CookieService();
