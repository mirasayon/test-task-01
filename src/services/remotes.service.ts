import { UnauthExc, ForbidExc } from "#src/errors/client-exceptions.ts";
import { isDeepStrictEqual } from "node:util";
import { authModel } from "#src/app/auth/auth.model.ts";
import { type CountryResponse, open as mmOpen } from "maxmind";
import { fsCfg } from "#src/configs/fs-config.ts";
import { UAParser } from "ua-parser-js";
import type { Session } from "#orm";
const maxmindIpDbInit = await mmOpen<CountryResponse>(fsCfg.mmCountries);
class RequestRemoteService {
    ipInfo = (ip: str) => {
        const data = maxmindIpDbInit.get(ip);
        return { ip_country: data?.country?.names?.ru ?? null, ip };
    };
    uaInfo = (ua: str | null) => {
        const p = ua ? new UAParser(ua) : null;
        const browser = p?.getBrowser();
        const os = p?.getOS();
        const device = p?.getDevice();
        return {
            agent: ua,
            device_type: (device?.type ?? null) as str | null,
            device_model: device?.model ?? null,
            os: os?.name ?? null,
            os_version: os?.version ?? null,
            browser: browser?.name ?? null,
            browser_version: browser?.version ?? null,
        };
    };
    fromSess = (sess: Session): Remote => {
        return { ip: sess.ip, agent: sess.agent };
    };
    fromReq = (req: Req): Remote => {
        if (!req.ip) throw new ForbidExc("Client IP unknown");
        return {
            ip: req.ip,
            agent: req.headers["user-agent"] ?? null,
        };
    };

    validateRmts = async (se: Session, rq: Req): Promise<void> => {
        const std = this.fromSess(se);
        const req = this.fromReq(rq);
        if (isDeepStrictEqual(std, req)) return;
        if (std.agent === req.agent) {
            return void (await authModel.updSessIp(se.id, req.ip));
        }
        if (std.ip === req.ip) {
            return void (await authModel.updSessUA(se.id, req.agent));
        }
        throw new UnauthExc();
    };
    compareRmts = (s: Session, rq: Req) => {
        const strd = this.fromSess(s);
        const reqRmt = this.fromReq(rq);
        return isDeepStrictEqual(strd, reqRmt);
    };
}
export const remoteSvc = new RequestRemoteService();
