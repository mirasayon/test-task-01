export type ServerSideExceptions = ServerErrorExc;

export class ServerErrorExc {
    constructor(err: str) {
        console.error("Server error:", err);
    }
}
