import type { User } from "#orm";
type RoleEnum = "USER" | "ADMIN";
export interface UserRes {
    deleteUsr: bool;
    userById: User;
    block: bool;
}
export interface AdminRes {
    blockUser: bool;
    unblockUser: bool;
    activateUser: bool;
    inactivateUser: bool;
    allUsers: {
        id: str;
        last_name: str;
        first_name: str;
        patronymic: str;
        active: bool;
        email: str;
        created_at: Date;
        updated_at: Date;
        role: RoleEnum;
    }[];
}
export interface AuthRes {
    updPassword: bool;
    endOtherSess: num;
    end1session: bool;
    sessions: {
        id: str;
        created_at: Date;
        expires_at: Date;
        last_used_at: Date;
        ip: str;
        ip_country: str | null;
        agent: str | null;
        device_type: str | null;
        device_model: str | null;
        os: str | null;
        os_version: str | null;
        browser: str | null;
        browser_version: str | null;
    }[];
    login: bool;
    register: bool;
    whoami: {
        id: str;
        role: RoleEnum;
        email: str;
    };
    logout: bool;
}

export const STATUSES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    DELETED: 204,
    BAD_REQUEST: 400,
    UNAUTH: 401,
    FORBIDDEN: 403,
    USE_HTTPS: 426,
    PAYLOAD_TOO_LARGE: 413,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQ: 429,
    SERVER_ERR: 500,
} as const;
export interface ResBody<D> {
    data?: D | null;
    ok?: bool | undef;
    msg: str;
    status: num;
}
export type Msg = { msg?: str | undef };
export type DataAndMsg<D> = { data?: D | undef } & Msg;
