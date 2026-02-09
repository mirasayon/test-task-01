import { ConflictExc } from "#src/errors/client-exceptions.ts";
import { tokenSvc } from "#src/services/token.service.ts";
import { remoteSvc } from "#src/services/remotes.service.ts";
import { cookieSvc } from "#src/services/cookies.service.ts";

const isLogged = async (req: UserOnlyReq): Promise<bool> => {
    const token = cookieSvc.getToken(req);
    if (!token) return false;
    const fnd = await tokenSvc
        .verify(token.validator_hash, token.selector)
        .catch(() => null);
    if (!fnd) return false;
    return remoteSvc.compareRmts(fnd.session, req);
};

export const guestOnlyMid = async (
    req: UserOnlyReq,
    res: Res,
    next: Next,
): Promise<void> => {
    if (await isLogged(req)) throw new ConflictExc("Already logged in");
    return next();
};
