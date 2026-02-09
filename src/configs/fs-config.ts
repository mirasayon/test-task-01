import { checkAndJoin } from "#src/utils/check-and-join.ts";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const filenamePath = fileURLToPath(import.meta.url);
const dirnamePath = dirname(filenamePath);
const rootPath = checkAndJoin(dirnamePath, "..", "..");
const res = checkAndJoin(rootPath, "res");
export const fsCfg = {
    openapi: join(rootPath, "src", "docs", "openapi.yaml"),
    publicFiles: checkAndJoin(rootPath, "public"),
    mmCountries: checkAndJoin(res, "GeoLite2-Country.mmdb"),
};
