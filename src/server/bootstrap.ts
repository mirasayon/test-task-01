console.time("in");
import { envCfg } from "#src/configs/env-config.ts";
import { pool, db } from "#src/db/prisma-client.ts";
import { listen } from "#src/utils/listen.ts";
import { format } from "date-fns";
import type { AddressInfo } from "node:net";
import { app } from "./app.ts";

const bootstrap = async (): Promise<void> => {
    const inst = await listen(app, envCfg.port, envCfg.host);
    const { port, address, family } = inst.address() as AddressInfo;
    const host = address === "::" || address === "0.0.0.0" ? "localhost" : address;
    const addr = `http://${host}:${port}`;
    const time = format(new Date(), "HH:mm:ss dd.MM.yyyy (OOOO)");
    console.info(`Launched at ${time} in ${envCfg.mode}. \nURL(${family}): ${addr}`);
    let terminating = false;
    const gracefulShutdown = async (signal: str) => {
        if (terminating) return;
        terminating = true;
        console.info(
            `\n${signal} received. Shutting down the server and db connection...`,
        );
        try {
            await new Promise<void>((rs, rj) =>
                inst.close((err) => {
                    if (err) return rj(err);
                    rs();
                }),
            );
            console.info("HTTP Server closed.");
            await db.$disconnect();
            await pool.end();
            console.info("Database disconnected.");
            console.info("Shutdown complete. Goodbye!");
            process.exit(0);
        } catch (error) {
            console.error("Error during shutdown:", error);
            process.exit(1);
        }
    };
    process.on("SIGINT", () => void gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
};

await bootstrap();
console.timeEnd("in");
