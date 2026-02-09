import { json } from "express";
export const jsonParser = json({
    strict: true,
    limit: "10kb",
    inflate: true,
    type: "application/json",
});
