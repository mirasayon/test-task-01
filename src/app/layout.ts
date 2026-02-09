import { newRtr } from "#src/utils/new-router.ts";
import { userRtr } from "#src/app/user/user.route.ts";
import { adminRtr } from "#src/app/admin/admin.routes.ts";
import { authRtr } from "#src/app/auth/auth.route.ts";
import { pingRtr } from "#src/app/ping/ping.route.ts";
import { endpoints as e } from "#src/shared/endpoints.ts";
export const apiLayout = newRtr()
    .use(e.auth.baseUrl, authRtr)
    .use(e.admin.baseUrl, adminRtr)
    .use(e.user.baseUrl, userRtr)
    .use(e.ping.baseUrl, pingRtr);
