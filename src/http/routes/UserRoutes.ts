import { FastifyInstance } from "fastify";
import { PATCHVerifyValidationToken } from "http/controllers/user/PATCH_VerifyValidationTokenController";
import { PATCHEditUsername } from "http/controllers/user/PATCH_EditUsernameController";
import { POSTCreateUserController } from "http/controllers/user/POST_CreateUserController";
import { POSTGenValidationToken } from "http/controllers/user/POST_GenValidationTokenController";
import { POSTSendRecoverCode } from "http/controllers/user/POST_SendRecoverCodeController";
import { PATCHRecoverPassword } from "http/controllers/user/PATCH_RecoverPasswordController";

export async function userRouter(app: FastifyInstance) {
    app.route({
        url:"/validate/sendToken",
        method:"POST",
        handler:POSTGenValidationToken,
    })
    app.route({
        url:"/validate/verifyToken",
        method:"PATCH",
        handler:PATCHVerifyValidationToken,
    })
    app.route({
        url:"/register",
        method:"POST",
        handler:POSTCreateUserController,
    })
    app.route({
        url:"/edit/username",
        method:"PATCH",
        handler:PATCHEditUsername,
    })
    app.route({
        url:"/recover/sendToken",
        method:"POST",
        handler:POSTSendRecoverCode,
    })
    app.route({
        url:"/recover",
        method:"PATCH",
        handler:PATCHRecoverPassword,
    })
}