import { FastifyInstance } from "fastify";
import { PATCHUpdateEmail } from "http/controllers/update/PATCH_UpdateEmailController";
import { PATCHUpdateOverview } from "http/controllers/update/PATCH_UpdateOverviewController";
import { PATCHUpdatePassword } from "http/controllers/update/PATCH_UpdatePasswordController";
import { PATCHUpdateTotalCount } from "http/controllers/update/PATCH_UpdateTotalCountController";
import { PATCHUpdateUsername } from "http/controllers/update/PATCH_UpdateUsernameController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function UpdateRoutes(app: FastifyInstance) {
    app.route({
        url:"/overview",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdateOverview,
    })
    app.route({
        url:"/username",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdateUsername,
    })
    app.route({
        url:"/total/:number",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdateTotalCount,
    })
    app.route({
        url:"/email",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdateEmail,
    })
    app.route({
        url:"/password",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdatePassword,
    })
}