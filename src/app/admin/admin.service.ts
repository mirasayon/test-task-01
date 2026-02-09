import { adminModel } from "./admin.model.ts";
import type { AdminRes } from "#src/shared/responses.ts";
import { ConflictExc } from "#src/errors/client-exceptions.ts";
import { userModel } from "../user/user.model.ts";
class AdminService {
    allUsers = async (): Promise<AdminRes["allUsers"]> =>
        await adminModel.allUsers();

    blockUser = async (id: str) => {
        const fnd = await userModel.userById(id);
        if (fnd.blocked) throw new ConflictExc("Already blocked");
        await adminModel.blockUsr(fnd.id);
    };
    unblockUser = async (id: str) => {
        const fnd = await userModel.userById(id);
        if (!fnd.blocked) throw new ConflictExc("Already unblocked");
        await adminModel.unblockUsr(fnd.id);
    };

    activateUser = async (id: str) => {
        const fnd = await userModel.userById(id);
        if (fnd.blocked) throw new ConflictExc("Already activated");
        await adminModel.activateUsr(fnd.id);
    };
    inactivateUser = async (id: str) => {
        const fnd = await userModel.userById(id);
        if (!fnd.blocked) throw new ConflictExc("Already inactivated");
        await adminModel.inactivateUsr(fnd.id);
    };
}
export const adminSvc = new AdminService();
