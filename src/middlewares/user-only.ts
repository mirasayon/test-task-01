import { UnauthExc } from "#src/errors/client-exceptions.ts";
import { tokenSvc } from "#src/services/token.service.ts";
import { remoteSvc } from "#src/services/remotes.service.ts";
import { cookieSvc } from "#src/services/cookies.service.ts";
export const userOnlyMid = async (
    req: UserOnlyReq,
    res: Res,
    next: Next,
): Promise<void> => {
    const token = cookieSvc.getToken(req);
    if (!token) throw new UnauthExc();
    const fnd = await tokenSvc.verify(token.validator_hash, token.selector);
    await remoteSvc.validateRmts(fnd.session, req);
    req.sess = fnd.dto;
    return next();
};
