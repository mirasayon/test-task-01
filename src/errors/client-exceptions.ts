export class BadReqExc {
    msg: str;
    constructor(msg?: str | undef) {
        this.msg = msg ?? "Bad request";
    }
}
export class ConflictExc {
    msg: str;
    constructor(msg?: str | undef) {
        this.msg = msg ?? "Conflict";
    }
}

export class NotFoundExc {
    msg: str;
    constructor(msg?: str | undef) {
        this.msg = msg ?? "Not found";
    }
}
export class UnauthExc {
    msg: str;
    constructor(msg?: undef | str) {
        this.msg = msg ?? "Unauthorized";
    }
}
export class ForbidExc {
    msg: str;
    constructor(msg?: str | undef) {
        this.msg = msg ?? "Forbidden";
    }
}
