import { existsSync } from "node:fs";
import { join } from "node:path";
export const checkAndJoin = (...paths: str[]) => {
    const j = join(...paths);
    if (!existsSync(j)) throw new Error(`Path ${j} does not exist`);
    return j;
};
