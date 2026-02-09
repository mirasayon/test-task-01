import { RoleEnum } from "#orm";
import { userModel } from "#src/app/user/user.model.ts";
import { ForbidExc } from "#src/errors/client-exceptions.ts";
class UserService {
    userById = async (id: str, who: SessDto) => {
        const u = await userModel.userById(id);
        if (who.user_id === id || who.role === RoleEnum.ADMIN) return u;
        throw new ForbidExc("Access denied");
    };
    deleteUsr = async (id: str) => {
        const u = await userModel.userById(id);
        await userModel.delUserById(u.id);
    };
}
export const userSvc = new UserService();
