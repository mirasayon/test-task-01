import { finish } from "#src/services/responder.ts";
import { rateLimit } from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res, next, opts) => {
        console.warn(`Rate limit hit by IP: ${req.ip}`);
        return finish.tooManyReqs(
            res,
            "Too many requests, try again in " +
                Math.ceil(opts.windowMs / 1000) +
                " seconds",
        );
    },
});
