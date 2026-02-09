import type { Response, NextFunction, Request, Application } from "express";

declare global {
    type str = string;
    type num = number;
    type bool = boolean;
    type undef = undefined;
    type Res = Response;
    type Next = NextFunction;
    type Dict = { [k: str]: str };
    type Req<T = Dict> = Request<T>;
    type App = Application;
    type Server = ReturnType<App["listen"]>;
}
