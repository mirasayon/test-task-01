import { newPipe } from "#src/utils/pipe-factory.ts";
import { adminSchemas, type AdminInput } from "#src/shared/validators.ts";
import type { MakeReq } from "#src/types/dtos.ts";

export interface AdminReq {
    byId: MakeReq<AdminInput["byId"], { user_id: str }>;
}

export const adminPipes = {
    byId: newPipe<AdminReq["byId"]>(adminSchemas.byId, (r) => r.params.user_id),
};
