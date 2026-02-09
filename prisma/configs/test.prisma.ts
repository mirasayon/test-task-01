import { loadEnvFile } from "node:process";
import type { PrismaConfig } from "prisma";
import { pathCfg } from "./paths-config.ts";

loadEnvFile(pathCfg.testEnv);

export default {
    schema: pathCfg.schema,
    datasource: {
        url: process.env["DATABASE_URL"],
    },
    migrations: {
        path: pathCfg.migrations,
    },
    views: {
        path: pathCfg.views,
    },
    typedSql: {
        path: pathCfg.typedSql,
    },
} satisfies PrismaConfig;
