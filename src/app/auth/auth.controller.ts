import { valReq } from "#src/utils/validate-request.ts";
import type { AuthReq } from "#src/app/auth/auth.pipes.ts";
import { authSvc } from "#src/app/auth/auth.service.ts";
import type { AuthRes } from "#src/shared/responses.ts";
import { finish } from "#src/services/responder.ts";
import { remoteSvc } from "#src/services/remotes.service.ts";
import { cookieSvc } from "#src/services/cookies.service.ts";
class AuthController {
    endOtherSess = async (req: UserOnlyReq, res: Res) => {
        const { sess } = valReq(req, ["sess"]);
        const sr = await authSvc.endOtherSess(sess.selector, sess.user_id);
        return finish.deleted<AuthRes["endOtherSess"]>(res, {
            data: sr,
            msg: "Other sessions deleted",
        });
    };

    endSessionById = async (req: AuthReq["endSessById"], res: Res) => {
        const { sess, dto } = valReq(req, ["sess", "dto"]);
        await authSvc.endSessionById(dto, sess.selector, sess.user_id);
        return finish.deleted<AuthRes["end1session"]>(res, {
            data: true,
            msg: "Specified session deleted",
        });
    };
    login = async (req: AuthReq["login"], res: Res) => {
        const { dto } = valReq(req, ["dto"]);
        const tk = await authSvc.login({
            ...dto,
            ...remoteSvc.fromReq(req),
        });
        cookieSvc.setToken(res, tk);
        return finish.accepted<AuthRes["login"]>(res, {
            data: true,
            msg: "Logged in",
        });
    };
    sessions = async (req: UserOnlyReq, res: Res) => {
        const { sess } = valReq(req, ["sess"]);
        const data = await authSvc.get_sessions(sess.user_id);
        return finish.ok<AuthRes["sessions"]>(res, {
            data,
            msg: "Your sessions",
        });
    };
    register = async (req: AuthReq["register"], res: Res) => {
        const { dto } = valReq(req, ["dto"]);
        const token = await authSvc.register({
            ...dto,
            ...remoteSvc.fromReq(req),
        });
        cookieSvc.setToken(res, token);
        return finish.accepted<AuthRes["register"]>(res, {
            data: true,
            msg: "Registered",
        });
    };
    whoami = async (req: UserOnlyReq, res: Res) => {
        const { sess } = valReq(req, ["sess"]);
        const user = await authSvc.whoami(sess.user_id);
        return finish.ok<AuthRes["whoami"]>(res, {
            data: {
                id: user.id,
                role: user.role,
                email: user.email,
            },
            msg: "Current session",
        });
    };
    logout = async (req: UserOnlyReq, res: Res) => {
        const { user_id, selector } = valReq(req, ["sess"]).sess;
        await authSvc.logout(selector, user_id);
        cookieSvc.clearToken(res);
        return finish.deleted<AuthRes["logout"]>(res, {
            msg: "Logged out",
            data: true,
        });
    };
    updPassword = async (req: AuthReq["update_password"], res: Res) => {
        const { sess, dto } = valReq(req, ["sess", "dto"]);
        await authSvc.updPassword({
            ...dto,
            user_id: sess.user_id,
        });
        return finish.accepted<AuthRes["updPassword"]>(res, {
            data: true,
            msg: "Password updated",
        });
    };
}
export const authCtrlr = new AuthController();
