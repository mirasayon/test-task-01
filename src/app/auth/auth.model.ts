import { db } from "#src/db/prisma-client.ts";
import { NotFoundExc, UnauthExc } from "#src/errors/client-exceptions.ts";
import type { Password, RoleEnum, Session, User } from "#orm";
import type { HashResult } from "../../services/password.service.ts";
import { remoteSvc } from "../../services/remotes.service.ts";

class AuthModels {
    delAllSessionExcept41 = async (ids: str[], keepId: str) =>
        (
            await db.session.deleteMany({
                where: {
                    AND: [{ id: { in: ids } }, { id: { not: keepId } }],
                },
            })
        ).count;
    delSessionByIdAndUsrId = async (id: str, usrId: str): Promise<void> =>
        void (await db.session.delete({
            where: {
                id,
                by_user_id: usrId,
            },
        }));

    updPassw = async (p: { hashRes: HashResult; usrId: str; passwId: str }) =>
        void (await db.password.update({
            where: { by_user_id: p.usrId, id: p.passwId },
            select: { id: true },
            data: { ...p.hashRes },
        }));

    sessBySelector = async (st: str): Promise<Session> => {
        const fnd = await db.session.findUnique({
            where: {
                selector: st,
            },
        });
        if (!fnd) throw new NotFoundExc();
        return fnd;
    };
    allSessionIds = async (usrId: str) =>
        (
            await db.session.findMany({
                where: {
                    by_user_id: usrId,
                },
                select: {
                    id: true,
                },
            })
        ).map((s) => s.id);

    allSessions = async (usrId: str) => {
        return await db.session.findMany({
            where: {
                by_user_id: usrId,
            },
            select: {
                id: true,
                created_at: true,
                agent: true,
                expires_at: true,
                last_used_at: true,
                ip: true,
                ip_country: true,
                device_type: true,
                device_model: true,
                os: true,
                os_version: true,
                browser: true,
                browser_version: true,
            },
        });
    };
    passwordByUserId = async (userId: str): Promise<Password> => {
        const fnd = await db.password.findUnique({
            where: {
                by_user_id: userId,
            },
        });
        if (!fnd) throw new NotFoundExc();
        return fnd;
    };
    updSessIp = async (id: str, ip: str): Promise<void> =>
        void (await db.session.update({
            where: {
                id: id,
            },
            data: {
                ...remoteSvc.ipInfo(ip),
            },
        }));

    updSessUA = async (id: str, newUA: str | null) =>
        void (await db.session.update({
            where: {
                id: id,
            },
            data: {
                ...remoteSvc.uaInfo(newUA),
            },
        }));

    findUserByIdsId = async (id: str): Promise<User> => {
        const fnd = await db.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!fnd) throw new NotFoundExc();
        return fnd;
    };
    delSessionBySelector = async (selector: str) =>
        void (await db.session.delete({
            where: { selector },
        }));

    sessionByItsId = async (id: str): Promise<Session> => {
        const fnd = await db.session.findUnique({
            where: { id: id },
        });
        if (!fnd) throw new UnauthExc();
        return fnd;
    };
    newSession = async (data: NewSession) =>
        void (await db.session.create({
            data: data,
        }));

    delSessBySelector = async (st: str) =>
        void (await db.session.delete({
            where: {
                selector: st,
            },
        }));

    usrIdByEmail = async (email: str) =>
        await db.user.findUnique({
            where: { email },
            select: { id: true },
        });
    userByEmail = async (email: str): Promise<User | null> =>
        await db.user.findUnique({
            where: {
                email,
            },
        });
    sessionsCount = async (userId: str) =>
        await db.session.count({
            where: {
                by_user_id: userId,
            },
        });

    newUserAndPassw = async (data: CredsForReg, hashResult: HashResult) =>
        await db.user.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                patronymic: data.patronymic,
                email: data.email,
                role: data.role,
                birthdate: data.birthdate,
                password: {
                    create: {
                        ...hashResult,
                    },
                },
            },
            select: { id: true },
        });
}
export const authModel = new AuthModels();
export type CredsForReg = {
    first_name: str;
    last_name: str;
    patronymic: str;
    email: str;
    role: RoleEnum;
    birthdate: Date;
};
export type RepeatedPasswords = {
    password_repeat: str;
    password: str;
};

type NewSession = Omit<
    Session,
    "id" | "updated_at" | "algorithm_version" | "last_used_at"
>;
