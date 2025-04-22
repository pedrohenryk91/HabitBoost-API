import { FastifyInstance } from "fastify";
import { POSTCreateUserController } from "http/controllers/user/POST_CreateUserController";
import { POSTSendRecoverCode } from "http/controllers/user/POST_SendRecoverCodeController";
import { PATCHRecoverPassword } from "http/controllers/user/PATCH_RecoverPasswordController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function userRouter(app: FastifyInstance) {
    app.route({
        url:"/register",
        method:"POST",
        handler:POSTCreateUserController,
    })
    app.route({
        url:"/recover/sendToken",
        method:"POST",
        preHandler:[VerifyAuthToken],
        handler:POSTSendRecoverCode,
    })
    app.route({
        url:"/recover",
        method:"PATCH",
        handler:PATCHRecoverPassword,
    })
}