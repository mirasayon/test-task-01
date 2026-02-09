import {
    ServerErrorExc,
    type ServerSideExceptions,
} from "../errors/server-exceptions.ts";
import { finish } from "../services/responder.ts";

export const serverErrHandler = (
    err: ServerSideExceptions,
    req: Req,
    res: Res,
    n: Next,
) => {
    if (err instanceof ServerErrorExc) return finish.serverErr(res);
    console.error("Unknown error:", err);
    return finish.serverErr(res);
};
