import {
    BadReqExc,
    ConflictExc,
    ForbidExc,
    NotFoundExc,
    UnauthExc,
} from "#src/errors/client-exceptions.ts";
import { finish as f } from "../services/responder.ts";
export const clientErrHandler = (err: unknown, rq: Req, res: Res, next: Next) => {
    if (err instanceof SyntaxError) return f.badReq(res, "Invalid payload");
    if (err instanceof BadReqExc) return f.badReq(res, err.msg);
    if (err instanceof ConflictExc) return f.conflict(res, err.msg);
    if (err instanceof ForbidExc) return f.forbidden(res, err.msg);
    if (err instanceof NotFoundExc) return f.notFound(res, err.msg);
    if (err instanceof UnauthExc) return f.unauth(res, err.msg);

    return next(err);
};
