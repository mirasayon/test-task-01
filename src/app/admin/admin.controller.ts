import { finish } from "#src/services/responder.ts";
import type { AdminRes } from "#src/shared/responses.ts";
import { valReq } from "#src/utils/validate-request.ts";
import type { AdminReq } from "./admin.pipes.ts";
import { adminSvc } from "./admin.service.ts";
class AdminController {
    allUsers = async (req: Req, res: Res) => {
        const sr = await adminSvc.allUsers();
        return finish.ok<AdminRes["allUsers"]>(res, {
            data: sr,
            msg: "All info",
        });
    };
    blockUserById = async (req: AdminReq["byId"], res: Res) => {
        const id = valReq(req, ["dto"]).dto;
        await adminSvc.blockUser(id);
        return finish.ok<AdminRes["blockUser"]>(res, {
            data: true,
            msg: "User blocked",
        });
    };
    unblockUserById = async (req: AdminReq["byId"], res: Res) => {
        const id = valReq(req, ["dto"]).dto;
        await adminSvc.unblockUser(id);
        return finish.ok<AdminRes["unblockUser"]>(res, {
            data: true,
            msg: "User unblocked",
        });
    };

    activateUser = async (req: AdminReq["byId"], res: Res) => {
        const id = valReq(req, ["dto"]).dto;
        await adminSvc.activateUser(id);
        return finish.ok<AdminRes["activateUser"]>(res, {
            data: true,
            msg: "User activated",
        });
    };
    inactivateUser = async (req: AdminReq["byId"], res: Res) => {
        const id = valReq(req, ["dto"]).dto;
        await adminSvc.inactivateUser(id);
        return finish.ok<AdminRes["inactivateUser"]>(res, {
            data: true,
            msg: "User inactivated",
        });
    };
}
export const adminCtrlr = new AdminController();
