import { PrismaClient as Client } from "#orm";
import { PrismaPg } from "@prisma/adapter-pg";
import { envCfg } from "#src/configs/env-config.ts";
import { Pool } from "pg";
const pool = new Pool({ connectionString: envCfg.dbUrl });
const createOnce = () => new Client({ adapter: new PrismaPg(pool) });

declare global {
    var prismaClientGlobal: ReturnType<typeof createOnce> | undef;
}
const client = globalThis.prismaClientGlobal ?? createOnce();
if (!envCfg.prod) globalThis.prismaClientGlobal = client;

export { client as db, pool };
