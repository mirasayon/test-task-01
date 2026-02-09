import { type ResBody } from "#src/shared/responses.ts";
import { STATUSES, type DataAndMsg } from "#src/shared/responses.ts";
const send = <T>(rs: Res, { status, msg, ok = false, data = null }: ResBody<T>) =>
    void rs.status(status).json({ status, msg, ok, data });

class Finish {
    ok = <T>(res: Res, { msg = "OK", data }: DataAndMsg<T>) =>
        send(res, {
            status: STATUSES.OK,
            msg,
            data,
            ok: true,
        });
    created = <T>(res: Res, { msg = "Created", data }: DataAndMsg<T>) =>
        send(res, {
            status: STATUSES.CREATED,
            msg,
            data,
            ok: true,
        });

    accepted = <T>(res: Res, { data, msg = "Accepted" }: DataAndMsg<T>) =>
        send(res, {
            status: STATUSES.ACCEPTED,
            msg,
            data,
            ok: true,
        });
    deleted = <T>(res: Res, { data, msg = "Deleted" }: DataAndMsg<T>) =>
        send(res, {
            status: STATUSES.DELETED,
            msg,
            data,
            ok: true,
        });
    badReq = (res: Res, msg: str) =>
        send(res, {
            status: STATUSES.BAD_REQUEST,
            msg,
        });

    useHttps = (res: Res, msg: str) =>
        send(res, {
            status: STATUSES.USE_HTTPS,
            msg,
        });

    unauth = (res: Res, msg: str) =>
        send(res, {
            status: STATUSES.UNAUTH,
            msg,
        });

    tooLarge = (res: Res) =>
        send(res, {
            status: STATUSES.PAYLOAD_TOO_LARGE,
            msg: "Payload too large",
        });

    forbidden = (res: Res, msg: str) =>
        send(res, {
            status: STATUSES.FORBIDDEN,
            msg,
        });

    notFound = (res: Res, msg: str) =>
        send(res, {
            status: STATUSES.NOT_FOUND,
            msg,
        });

    conflict = (res: Res, msg: str) =>
        send(res, {
            status: STATUSES.CONFLICT,
            msg,
        });

    tooManyReqs = (res: Res, msg: str) =>
        send(res, {
            status: STATUSES.TOO_MANY_REQ,
            msg,
        });

    serverErr = (res: Res) =>
        send(res, {
            status: STATUSES.SERVER_ERR,
            msg: "Internal Server Error",
        });
}
export const finish = new Finish();
