import { finish as f } from "../services/responder.ts";
export const notFndHandler = (req: Req, res: Res, next: Next) =>
    f.notFound(res, "Route not found");
