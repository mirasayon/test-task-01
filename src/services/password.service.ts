import { envCfg } from "#src/configs/env-config.ts";
import {
    argon2,
    randomBytes,
    timingSafeEqual,
    type Argon2Parameters as Argon2Params,
} from "node:crypto";
type Params = {
    /** in KiB. */
    memory: num;
    passes: num;
    parallelism: num;
    tag_length: num;
};
export type HashResult = {
    hash: str;
    salt: str;
} & Params;

class PasswordService {
    /** Promise wrapper */
    private argon2id = async (
        prm: Argon2Params,
    ): Promise<Buffer<ArrayBuffer>> =>
        await new Promise<Buffer<ArrayBuffer>>(
            (
                rs: (derivedKey: Buffer<ArrayBuffer>) => void,
                rj: (err: Error) => void,
            ) =>
                argon2("argon2id", prm, (err, derivedKey) => {
                    if (err) return rj(err);
                    return rs(derivedKey);
                }),
        );

    public readonly params: Params = {
        parallelism: 2,
        tag_length: 32,
        memory: 65_536, // 64 * 1024, KiB = 64 MiB
        passes: 3,
    };
    private genSalt = () => randomBytes(16);
    newHash = async (passw: str): Promise<HashResult> => {
        const salt = this.genSalt();
        const params: Argon2Params = {
            message: Buffer.from(passw, "utf8"),
            secret: Buffer.from(envCfg.passwHashPepper, "base64"),
            nonce: salt,
            parallelism: this.params.parallelism,
            tagLength: this.params.tag_length,
            memory: this.params.memory,
            passes: this.params.passes,
        };
        const derived = await this.argon2id(params);
        return {
            hash: derived.toString("base64"),
            salt: salt.toString("base64"),
            memory: params.memory,
            passes: params.passes,
            parallelism: params.parallelism,
            tag_length: params.tagLength,
        };
    };
    verify = async (p: { input: str; stored: HashResult }): Promise<bool> => {
        const dbDerived = Buffer.from(p.stored.hash, "base64");
        const params: Argon2Params = {
            message: Buffer.from(p.input, "utf8"),
            nonce: Buffer.from(p.stored.salt, "base64"),
            parallelism: p.stored.parallelism,
            tagLength: p.stored.tag_length,
            memory: p.stored.memory,
            passes: p.stored.passes,
            secret: Buffer.from(envCfg.passwHashPepper, "base64"),
        };
        const derived = await this.argon2id(params);
        if (derived.length !== dbDerived.length) return false;
        return timingSafeEqual(derived, dbDerived);
    };
}
export const passwSvc = new PasswordService();
