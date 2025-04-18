import { FastifyInstance } from "fastify";
import { PATCHEditUsername } from "http/controllers/user/PATCH_EditUsernameController";
import { POSTCreateUserController } from "http/controllers/user/POST_CreateUserController";
import { POSTSendRecoverCode } from "http/controllers/user/POST_SendRecoverCodeController";
import { PATCHRecoverPassword } from "http/controllers/user/PATCH_RecoverPasswordController";
import { GETUserData } from "http/controllers/user/GET_UserDataController";

export async function userRouter(app: FastifyInstance) {
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
    app.route({
        url:"/get/overview/:username",
        method:"GET",
        handler:GETUserData,
    })
}