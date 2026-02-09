import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const dirnamePath = dirname(fileURLToPath(import.meta.url));
const prismaPath = join(dirnamePath, "..");
const rootPath = join(prismaPath, "..");
export const pathCfg = {
    schema: join(prismaPath, "schemas", "main.prisma"),
    migrations: join(prismaPath, "migrations"),
    views: join(prismaPath, "views"),
    typedSql: join(prismaPath, "queries"),
    devEnv: join(rootPath, ".env.development"),
    testEnv: join(rootPath, ".env.test"),
    prodEnv: join(rootPath, ".env.production"),
};
