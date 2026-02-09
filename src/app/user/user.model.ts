import { db } from "#src/db/prisma-client.ts";
import { NotFoundExc } from "#src/errors/client-exceptions.ts";
import type { Password } from "#orm";
class UserModel {
    userById = async (id: str) => {
        const fnd = await db.user.findUnique({
            where: { id },
        });
        if (!fnd) throw new NotFoundExc();
        return fnd;
    };
    passwByUserIdOrError = async (id: str): Promise<Password> => {
        const fnd = await db.password.findUnique({
            where: { by_user_id: id },
        });
        if (!fnd) throw new NotFoundExc();
        return fnd;
    };
    delSessionByToken = async (selector: str) =>
        void (await db.session.delete({ where: { selector } }));
    delUserById = async (id: str) =>
        void (await db.user.delete({ where: { id } }));
}
export const userModel = new UserModel();
