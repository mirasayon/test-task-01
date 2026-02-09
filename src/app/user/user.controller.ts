import { valReq } from "#src/utils/validate-request.ts";
import type { UserReq } from "#src/app/user/user.pipes.ts";
import { userSvc } from "#src/app/user/user.service.ts";
import type { UserRes } from "#src/shared/responses.ts";
import { finish } from "#src/services/responder.ts";
import { adminSvc } from "../admin/admin.service.ts";
class UserController {
    userById = async (req: UserReq["userById"], res: Res) => {
        const { dto, sess } = valReq(req, ["sess", "dto"]);
        return finish.ok<UserRes["userById"]>(res, {
            data: await userSvc.userById(dto, sess),
            msg: "User by ID",
        });
    };
    deleteUsr = async (req: UserOnlyReq, res: Res) => {
        const { sess } = valReq(req, ["sess"]);
        await userSvc.deleteUsr(sess.user_id);
        return finish.deleted<UserRes["deleteUsr"]>(res, {
            data: true,
            msg: "User deleted",
        });
    };
    block = async (req: UserOnlyReq, res: Res) => {
        const { sess } = valReq(req, ["sess"]);
        await adminSvc.blockUser(sess.user_id);
        return finish.accepted<UserRes["block"]>(res, {
            data: true,
            msg: "You are blocked",
        });
    };
}
export const userCtrlr = new UserController();
