import { userOnlyMid } from "#src/middlewares/user-only.ts";
import { endpoints as e } from "#src/shared/endpoints.ts";
import { newRtr } from "#src/utils/new-router.ts";
import { adminCtrlr as c } from "./admin.controller.ts";
import { adminGuard } from "./admin.guard.ts";
import { adminPipes as p } from "./admin.pipes.ts";

export const adminRtr = newRtr()
    .use(userOnlyMid)
    .use(adminGuard)
    .get(e.admin.allUsers, c.allUsers)
    .post(e.admin.blockUser(":user_id"), p.byId, c.blockUserById)
    .post(e.admin.unblockUser(":user_id"), p.byId, c.unblockUserById)
    .post(e.admin.activateUser(":user_id"), p.byId, c.activateUser)
    .post(e.admin.inactivateUser(":user_id"), p.byId, c.inactivateUser);
