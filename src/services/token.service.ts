import { envCfg } from "#src/configs/env-config.ts";
import { type Session } from "#orm";
import { db } from "#src/db/prisma-client.ts";
import { UnauthExc } from "#src/errors/client-exceptions.ts";
import { timingSafeEqual, createHmac, randomBytes } from "node:crypto";
export type TokenInfo = {
    selector: str;
    validator_hash: str;
};
export type Token4Client = `${str}.${str}`;
export type NewSessionToken = {
    created_at: Date;
    expires_at: Date;
} & TokenInfo;
export const SESS_LIMIT = 10;
export const SESS_EXP_HOURS = 24 * 7;
class SessionTokenService {
    private readonly ALGO = "sha512";
    private readonly SELECTOR_BYTES = 32;
    private readonly VALIDATOR_BYTES = 32;
    private newHmac = (validator: str) =>
        createHmac(this.ALGO, envCfg.tokenHmacSecret)
            .update(validator, "utf8")
            .digest("hex");

    private genTokenPair(): {
        selector: str;
        validator: str;
        token: Token4Client;
    } {
        const selector = randomBytes(this.SELECTOR_BYTES).toString("hex");
        const validator = randomBytes(this.VALIDATOR_BYTES).toString("hex");
        const token = `${selector}.${validator}` as const;
        return { selector, validator, token };
    }
    public create = async (): Promise<{
        db: NewSessionToken;
        client: Token4Client;
    }> => {
        const { selector, validator, token } = this.genTokenPair();
        const fnd = await db.session.findUnique({
            where: { selector: selector },
        });
        if (fnd) return await this.create();
        const valHash = this.newHmac(validator);
        const crAt = new Date();
        const exAt = new Date(crAt.getTime() + SESS_EXP_HOURS * 3600 * 1000);
        return {
            client: token,
            db: {
                selector: selector,
                validator_hash: valHash,
                created_at: crAt,
                expires_at: exAt,
            },
        };
    };

    public verify = async (
        validator: str,
        selector: str,
    ): Promise<{ dto: SessDto; session: Session }> => {
        if (!validator || !selector) {
            throw new UnauthExc();
        }
        const fnd = await db.session.findUnique({
            where: { selector },
        });
        if (!fnd) throw new UnauthExc();
        if (fnd.expires_at < new Date()) {
            await db.session.delete({ where: { selector: selector } });
            throw new UnauthExc("Session expired. Log in again");
        }
        const hash = this.newHmac(validator);
        const a = Buffer.from(hash, "hex");
        const b = Buffer.from(fnd.validator_hash, "hex");
        if (a.length !== b.length) throw new UnauthExc();
        if (timingSafeEqual(a, b)) {
            const upd = await db.session.update({
                where: { selector: selector },
                select: {
                    by_user: {
                        select: {
                            role: true,
                            id: true,
                        },
                    },
                },
                data: { last_used_at: new Date() },
            });
            return {
                session: fnd,
                dto: {
                    selector: selector,
                    role: upd.by_user.role,
                    user_id: upd.by_user.id,
                },
            };
        }
        throw new UnauthExc();
    };
}
export const tokenSvc = new SessionTokenService();
