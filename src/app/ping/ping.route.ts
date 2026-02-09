import { finish } from "#src/services/responder.ts";
import { endpoints as e } from "#src/shared/endpoints.ts";
import { newRtr } from "#src/utils/new-router.ts";
export const pingRtr = newRtr().get(e.ping.ping, (rq, rs) =>
    finish.ok(rs, { data: "pong" }),
);
