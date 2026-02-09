import { userOnlyMid } from "#src/middlewares/user-only.ts";
import { userCtrlr as c } from "#src/app/user/user.controller.ts";
import { userPipes as p } from "#src/app/user/user.pipes.ts";
import { endpoints as e } from "#src/shared/endpoints.ts";
import { newRtr } from "#src/utils/new-router.ts";
export const userRtr = newRtr()
    .get(e.user.byId(":user_id"), p.userById, userOnlyMid, c.userById)
    .post(e.user.block, userOnlyMid, c.block)
    .delete(e.user.delUser, userOnlyMid, c.deleteUsr);
