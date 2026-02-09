import type { User } from "#orm";
import { db } from "#src/db/prisma-client.ts";
class AdminModel {
    allUsers = async (): Promise<User[]> =>
        await db.user.findMany({
            orderBy: {
                created_at: "desc",
            },
        });
    blockUsr = async (id: str) =>
        void (await db.user.update({
            where: { id },
            data: { blocked: true },
        }));
    unblockUsr = async (id: str) =>
        void (await db.user.update({
            where: { id },
            data: { blocked: false },
        }));
    activateUsr = async (id: str) =>
        void (await db.user.update({
            where: { id },
            data: { active: true },
        }));
    inactivateUsr = async (id: str) =>
        void (await db.user.update({
            where: { id },
            data: { active: false },
        }));
}
export const adminModel = new AdminModel();
