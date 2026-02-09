import { userOnlyMid } from "#src/middlewares/user-only.ts";
import { newRtr } from "#src/utils/new-router.ts";
import { authCtrlr as c } from "#src/app/auth/auth.controller.ts";
import { authPipes as p } from "#src/app/auth/auth.pipes.ts";
import { endpoints as e } from "#src/shared/endpoints.ts";
import { guestOnlyMid } from "#src/middlewares/guest-only.ts";

export const authRtr = newRtr()
    .patch(e.auth.updPassword, p.updPassw, userOnlyMid, c.updPassword)
    .post(e.auth.register, p.register, guestOnlyMid, c.register)
    .post(e.auth.login, p.login, guestOnlyMid, c.login)
    .get(e.auth.whoami, userOnlyMid, c.whoami)
    .delete(e.auth.endOtherSess, userOnlyMid, c.endOtherSess)
    .delete(
        e.auth.end1Session(":session_id"),
        p.endSessById,
        userOnlyMid,
        c.endSessionById,
    )
    .get(e.auth.sessionsList, userOnlyMid, c.sessions)
    .delete(e.auth.logout, userOnlyMid, c.logout);
