import { strictObject as obj, type z as Z, z } from "zod";
const roles = z.enum(["USER", "ADMIN"] as const);
const name = (n: str, min = 1, max = 30, rgx = /^[\p{L}\p{M}0-9 _'-]+$/u) =>
    z
        .string(`${n} required`)
        .min(min, `${n} must be more than ${min} character`)
        .max(max, `${n} is too long (maximum ${max} characters)`)
        .trim()
        .refine(
            (v) => v === v.normalize("NFC"),
            `${n} contains invalid characters`,
        )
        .regex(
            rgx,
            `A ${n} may only contain letters (of any language), nums, spaces, hyphens, underscores, and apostrophes`,
        );

const passw = (n: str, min = 8, max = 80) =>
    z
        .string(`${n} field is required`)
        .min(min, `${n} must contain more than ${min} characters`)
        .max(max, `${n} must contain less than ${max} characters`);
const birthdate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .transform((str, ctx) => {
        const date = new Date(str);
        if (isNaN(date.getTime())) {
            ctx.addIssue({
                code: "custom",
                message: "Invalid date value",
            });
            return z.NEVER;
        }
        return date;
    })
    .refine((date) => date < new Date(), "Birthdate must be in the past");
const cuid = (n: str) =>
    z.cuid({
        error: (iss) =>
            iss.input ? `Invalid ${n} format` : `${n} is required`,
    });
const email = z.email("Invalid email").trim().max(512, "Email too long");

export const userSchemas = { userById: cuid("User ID") };
export interface UserInput {
    userById: Z.infer<(typeof userSchemas)["userById"]>;
}
export const adminSchemas = {
    byId: cuid("User ID"),
};
export interface AdminInput {
    byId: Z.infer<(typeof adminSchemas)["byId"]>;
}
export const authSchemas = {
    update_password: obj({
        new_password: passw("new_password"),
        repeat_new_password: passw("repeat_new_password"),
        current_password: passw("current_password"),
    }),
    endSessionById: cuid("Session ID"),
    register: obj({
        last_name: name("last_name"),
        role: roles,
        patronymic: name("patronymic"),
        first_name: name("first_name"),
        email: email,
        birthdate: birthdate,
        password: passw("password"),
        password_repeat: passw("password_repeat"),
    }),
    login: obj({
        email: email,
        password: passw("password"),
    }),
};
export interface AuthInput {
    updPassword: Z.infer<(typeof authSchemas)["update_password"]>;
    endSessionById: Z.infer<(typeof authSchemas)["endSessionById"]>;
    register: Z.infer<(typeof authSchemas)["register"]>;
    login: Z.infer<(typeof authSchemas)["login"]>;
}
