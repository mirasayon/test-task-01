import { envCfg } from "#src/configs/env-config.ts";
import { fsCfg } from "#src/configs/fs-config.ts";
import { newRtr } from "#src/utils/new-router.ts";
import { readFile } from "node:fs/promises";
import { serve, setup, type JsonObject } from "swagger-ui-express";
import { parse } from "yaml";
const file = await readFile(fsCfg.openapi, "utf8");
const spec = parse(file) as JsonObject;
spec["servers"] = [
    {
        url: `http://${envCfg.host}:${envCfg.port}/api`,
        description: `${envCfg.mode} server`,
    },
];
export const swaggerRtr = newRtr()
    .use(
        "/docs",
        serve,
        setup(spec, {
            customfavIcon: "/favicon.ico",
            customSiteTitle: "Test Task API",
            swaggerOptions: { displayRequestDuration: true },
        }),
    )
    .get("/docs-json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(spec);
    });
