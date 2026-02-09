import { apiLayout } from "#src/app/layout.ts";
import { envCfg } from "#src/configs/env-config.ts";
import { jsonError } from "#src/middlewares/payload-error.ts";
import { clientErrHandler } from "#src/middlewares/client-errors.ts";
import { serverErrHandler } from "#src/middlewares/server-errors.ts";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { publicFiles } from "#src/middlewares/public-files.ts";
import { jsonParser } from "#src/middlewares/json-parser.ts";
import { useHttpsGuard } from "#src/guards/user-secure-http.ts";
import { notFndHandler } from "#src/middlewares/route-not-found.ts";
import { rateLimiter } from "#src/middlewares/rate-limiter.ts";
import { swaggerRtr } from "#src/docs/swagger.ts";
export const app = (() => {
    const a = express();
    if (envCfg.prod) a.set("trust proxy", 1);
    a.use(morgan("common"));
    if (envCfg.prod) a.use(useHttpsGuard);
    a.use(compression());
    a.use(
        cors({
            origin: [envCfg.frontendUrl],
            credentials: true,
        }),
    );
    a.use(swaggerRtr);
    a.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

    a.use("/", publicFiles);
    a.use(rateLimiter);

    a.use(jsonParser);
    a.use(jsonError);
    a.use(cookieParser(envCfg.cookieSignSecret));
    // api
    a.use("/api", apiLayout);
    // Error handlers
    a.use(notFndHandler);
    a.use(clientErrHandler);
    a.use(serverErrHandler);
    return a;
})();
