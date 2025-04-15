import { FastifyInstance } from "fastify";
import { PATCHVerifyValidationToken } from "http/controllers/auth/PATCH_VerifyValidationTokenController";
import { POSTGenValidationToken } from "http/controllers/auth/POST_GenValidationTokenController";
import { POSTLogin } from "http/controllers/auth/POST_LoginController";

export async function authRoutes(app: FastifyInstance) {
    app.route({
        url:"/login",
        method:"POST",
        handler:POSTLogin,
    })
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
}