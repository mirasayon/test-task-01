export const endpoints = {
    baseUrl: "/api",
    admin: {
        allUsers: "/all-users",
        blockUser: <T extends str>(id: T) => `/block/${id}` as const,
        unblockUser: <T extends str>(id: T) => `/unblock/${id}` as const,
        activateUser: <T extends str>(id: T) => `/activate/${id}` as const,
        inactivateUser: <T extends str>(id: T) => `/inactivate/${id}` as const,
        baseUrl: "/admin",
    },
    auth: {
        baseUrl: "/auth",
        endOtherSess: "/session/end-others",
        end1Session: <T extends str>(id: T) => `/session/end/${id}` as const,
        register: "/register",
        login: "/login",
        whoami: "/whoami",
        updPassword: "/upd/password",
        sessionsList: "/sessions",
        logout: "/logout",
    },
    user: {
        baseUrl: "/user",
        delUser: "/delete",
        block: "/block",
        byId: <T extends str>(id: T) => `/id/${id}` as const,
    },
    ping: {
        baseUrl: "/ping",
        ping: "/",
    },
} as const;
