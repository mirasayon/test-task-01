import { BadReqExc } from "#src/errors/client-exceptions.ts";
import type { infer as Infer, ZodType } from "zod";
export const newPipe = <
    R extends Req & { dto?: Infer<S>; session?: SessDto },
    S extends ZodType = ZodType,
    A extends any = any,
>(
    schema: S,
    getSrc?: (req: R) => A,
) => {
    return async (req: R, res: Res, next: Next) => {
        let src = undefined;
        if (getSrc && typeof getSrc === "function") src = getSrc(req);
        const result = await schema.safeParseAsync(src);
        if (result.success) {
            req.dto = result.data;
            return next();
        }
        const errLs = result.error.issues.map(({ path, message }) => {
            if (path.length) return `${path.toString()}: ${message}`;
            return message;
        });
        throw new BadReqExc(errLs.join(", "));
    };
};
