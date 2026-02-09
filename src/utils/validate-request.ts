import { ServerErrorExc } from "#src/errors/server-exceptions.ts";
export const valReq = <R extends Req, K extends ("dto" | "sess")[]>(rq: R, keys: K) => {
    for (const k of keys) {
        if (!Object.hasOwn(rq, k)) {
            throw new ServerErrorExc(`Misconfig, no ${k}`);
        }
    }
    return rq as Required<R>;
};
