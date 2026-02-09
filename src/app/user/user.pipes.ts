import type { MakeReq } from "#src/types/dtos.ts";
import { userSchemas, type UserInput } from "#src/shared/validators.ts";
import { newPipe } from "#src/utils/pipe-factory.ts";

export interface UserReq {
    userById: MakeReq<UserInput["userById"], { user_id: str }>;
}
export const userPipes = {
    userById: newPipe<UserReq["userById"]>(
        userSchemas.userById,
        (req) => req.params.user_id,
    ),
};
