import { fsCfg } from "#src/configs/fs-config.ts";
import express from "express";

export const publicFiles = express.static(fsCfg.publicFiles, {
    index: false,
    etag: true,
    lastModified: true,
    maxAge: "1d",
    immutable: true,
});
