import { RoleEnum } from "#orm";
import { ForbidExc } from "#src/errors/client-exceptions.ts";
import { valReq } from "#src/utils/validate-request.ts";
export const adminGuard = (req: UserOnlyReq, res: Res, next: Next) => {
    const { role } = valReq(req, ["sess"]).sess;
    if (role === RoleEnum.ADMIN) return next();
    throw new ForbidExc();
};
