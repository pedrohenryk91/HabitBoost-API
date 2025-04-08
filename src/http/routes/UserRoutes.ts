import { FastifyInstance } from "fastify";
import { PATCHVerifyValidationToken } from "http/controllers/user/PATCH_VerifyValidationTokenController";
import { PATCHEditUsername } from "http/controllers/user/PATCH_EditUsernameController";
import { POSTCreateUserController } from "http/controllers/user/POST_CreateUserController";
import { POSTGenValidationToken } from "http/controllers/user/POST_GenValidationTokenController";

export async function userRouter(app: FastifyInstance) {
    app.route({
        url:"/validate/getToken",
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
    // app.route({
    //     url:"/recover/sendCode",
    //     method:"POST",
    //     handler:
    // })
    // app.route({
    //     url:"recover/validate",
    //     method:"PATCH",
    //     handler:
    // })
}