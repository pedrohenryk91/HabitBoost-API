import { FastifyInstance } from "fastify";
import { POSTCreateUserController } from "http/controllers/user/POST_CreateUserController";
import { POSTSendRecoverCode } from "http/controllers/user/POST_SendRecoverCodeController";
import { PATCHValidateCode } from "http/controllers/user/PATCH_ValidateCodeController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";
import { DELETEUser } from "http/controllers/user/DELETE_DeleteUserController";
import { GETUserData } from "http/controllers/user/GET_GetUserDataController";
import { PATCHRecoverPassword } from "http/controllers/user/PATCH_RecoverPasswordController";

export async function userRouter(app: FastifyInstance) {
    app.route({
        url:"/register",
        method:"POST",
        handler:POSTCreateUserController,
    })
    app.route({
        url:"/recover/sendCode",
        method:"POST",
        handler:POSTSendRecoverCode,
    })
    app.route({
        url:"/recover/validate",
        method:"PATCH",
        handler:PATCHValidateCode,
    })
    app.route({
        url:"/recover",
        method:"PATCH",
        handler:PATCHRecoverPassword,
    })
    app.route({
        url:"/get",
        method:"GET",
        preHandler:VerifyAuthToken,
        handler:GETUserData,
    })
    app.route({
        url:"/delete",
        method:"DELETE",
        preHandler:VerifyAuthToken,
        handler:DELETEUser,
    })
}