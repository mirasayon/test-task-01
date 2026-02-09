import { finish } from "#src/services/responder.ts";
export const useHttpsGuard = (req: Req, res: Res, next: Next) => {
    if (!(req.secure || req.get("x-forwarded-proto") === "https")) {
        return finish.useHttps(res, "Use Secure HTTP");
    }
    return next();
};
