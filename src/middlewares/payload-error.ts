import { finish as f } from "#src/services/responder.ts";
import type { Request, Response, NextFunction } from "express";
export const jsonError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.type === "entity.too.large" || err.status === 413) {
        return f.tooLarge(res);
    }
    if (err instanceof SyntaxError && (err as any).status === 400 && "body" in err) {
        return f.badReq(res, "Invalid JSON");
    }
    return next(err);
};
