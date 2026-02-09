import { db } from "#src/db/prisma-client.ts";
import {
    BadReqExc,
    ConflictExc,
    ForbidExc,
    NotFoundExc,
    UnauthExc,
} from "#src/errors/client-exceptions.ts";
import {
    SESS_LIMIT,
    tokenSvc,
    type Token4Client,
} from "#src/services/token.service.ts";
import {
    authModel,
    type CredsForReg,
    type RepeatedPasswords,
} from "#src/app/auth/auth.model.ts";
import {
    INVALID_CREDS,
    PASSWORDS_DONT_MATCH,
    TOO_MANY_SESSIONS,
} from "#src/errors/errors-txt.ts";
import type { User, Password } from "#orm";
import { userModel } from "../user/user.model.ts";
import type { AuthRes } from "#src/shared/responses.ts";
import { passwSvc } from "../../services/password.service.ts";
import { remoteSvc } from "../../services/remotes.service.ts";

class AuthService {
    updPassword = async (c: {
        user_id: str;
        current_password: str;
        new_password: str;
        repeat_new_password: str;
    }): Promise<void> => {
        const fndPassw = await userModel.passwByUserIdOrError(c.user_id);

        if (c.new_password === c.current_password) {
            throw new BadReqExc("New password must be different from current");
        }
        if (c.new_password !== c.repeat_new_password) {
            throw new BadReqExc(PASSWORDS_DONT_MATCH);
        }
        const matches = await passwSvc.verify({
            stored: fndPassw,
            input: c.current_password,
        });
        if (!matches) throw new UnauthExc("Invalid current password");

        const newHashRes = await passwSvc.newHash(c.new_password);
        await authModel.updPassw({
            usrId: c.user_id,
            hashRes: newHashRes,
            passwId: fndPassw.id,
        });
    };
    endOtherSess = async (selector: str, usrId: str): Promise<num> => {
        const fndUsr = await userModel.userById(usrId);
        const allIds = await authModel.allSessionIds(fndUsr.id);
        if (allIds.length === 1) throw new BadReqExc("No other sessions");
        const currId = (await authModel.sessBySelector(selector)).id;
        return await authModel.delAllSessionExcept41(allIds, currId);
    };

    endSessionById = async (id: str, selector: str, usrId: str) => {
        const currId = (await authModel.sessBySelector(selector)).id;
        if (currId === id) {
            throw new BadReqExc("Can't end current session, use logout");
        }
        await authModel.delSessionByIdAndUsrId(id, usrId).catch(() => {
            throw new NotFoundExc();
        });
    };

    logout = async (st: str, usrId: str): Promise<void> => {
        const fnd = await authModel.sessBySelector(st);
        if (fnd.by_user_id !== usrId) throw new NotFoundExc();
        await authModel.delSessionBySelector(st);
    };
    whoami = async (usrId: str): Promise<User> =>
        await userModel.userById(usrId);

    get_sessions = async (usrId: str): Promise<AuthRes["sessions"]> => {
        const fndUsr = await userModel.userById(usrId);
        return await authModel.allSessions(fndUsr.id);
    };
    login = async (c: {
        email: str;
        password: str;
        ip: str;
        agent: str | null;
    }): Promise<Token4Client> => {
        const fndId = (await authModel.userByEmail(c.email))?.id;
        if (!fndId) throw new UnauthExc(INVALID_CREDS);
        const stored = await authModel.passwordByUserId(fndId);
        const isValid = await passwSvc.verify({
            input: c.password,
            stored: stored,
        });
        if (!isValid) throw new UnauthExc(INVALID_CREDS);
        await this.rehashPasswIfNeeded(stored, c.password);
        const cnt = await authModel.sessionsCount(fndId);
        if (cnt >= SESS_LIMIT) throw new ForbidExc(TOO_MANY_SESSIONS);
        const token = await tokenSvc.create();
        await authModel.newSession({
            by_user_id: fndId,
            ...token.db,
            ...remoteSvc.ipInfo(c.ip),
            ...remoteSvc.uaInfo(c.agent),
        });
        return token.client;
    };
    register = async (
        c: CredsForReg & Remote & RepeatedPasswords,
    ): Promise<Token4Client> => {
        if (c.password_repeat !== c.password) {
            throw new BadReqExc(PASSWORDS_DONT_MATCH);
        }
        const fndId = await authModel.usrIdByEmail(c.email);
        if (fndId) throw new ConflictExc(`Email ${c.email} in use`);
        const pHashRes = await passwSvc.newHash(c.password);
        const token = await tokenSvc.create();
        const { id } = await authModel.newUserAndPassw(c, pHashRes);
        await authModel.newSession({
            by_user_id: id,
            ...token.db,
            ...remoteSvc.ipInfo(c.ip),
            ...remoteSvc.uaInfo(c.agent),
        });
        return token.client;
    };
    private rehashPasswIfNeeded = async (
        stored: Password,
        newPassw: str,
    ): Promise<void> => {
        const changed =
            stored.memory !== passwSvc.params.memory ||
            stored.tag_length !== passwSvc.params.tag_length ||
            stored.passes !== passwSvc.params.passes ||
            stored.parallelism !== passwSvc.params.parallelism;
        if (changed) {
            const newHashed = await passwSvc.newHash(newPassw);
            await db.password.update({
                where: { id: stored.id },
                data: {
                    hash: newHashed.hash,
                    salt: newHashed.salt,
                    memory: newHashed.memory,
                    passes: newHashed.passes,
                    parallelism: newHashed.parallelism,
                    tag_length: newHashed.tag_length,
                },
            });
        }
    };
}

export const authSvc = new AuthService();
