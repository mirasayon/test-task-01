import type { RoleEnum } from "#orm";
declare global {
    type SessDto = {
        user_id: str;
        selector: str;
        role: RoleEnum;
    };
    type UserOnlyReq = Req & {
        sess?: SessDto;
    };
    type Remote = {
        ip: str;
        agent: str | null;
    };
}
export type MakeReq<D, P extends Dict = {}> = Req<P> & {
    dto?: D;
    sess?: SessDto;
};
