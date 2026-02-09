import type { MakeReq } from "#src/types/dtos.ts";
import { authSchemas, type AuthInput } from "#src/shared/validators.ts";
import { newPipe } from "#src/utils/pipe-factory.ts";
export interface AuthReq {
    register: MakeReq<AuthInput["register"]>;
    endSessById: MakeReq<AuthInput["endSessionById"], { session_id: str }>;
    login: MakeReq<AuthInput["login"]>;
    update_password: MakeReq<AuthInput["updPassword"]>;
}
export const authPipes = {
    updPassw: newPipe<AuthReq["update_password"]>(
        authSchemas.update_password,
        (req) => req.body,
    ),
    register: newPipe<AuthReq["register"]>(
        authSchemas.register,
        (req) => req.body,
    ),
    endSessById: newPipe<AuthReq["endSessById"]>(
        authSchemas.endSessionById,
        (req) => req.params.session_id,
    ),
    login: newPipe<AuthReq["login"]>(authSchemas.login, (req) => req.body),
};
