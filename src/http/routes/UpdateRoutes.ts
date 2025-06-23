import { FastifyInstance } from "fastify";
import { PATCHUpdateEmailRequest } from "http/controllers/update/PATCH_UpdateEmailRequestController";
import { PATCHUpdateGoal } from "http/controllers/update/PATCH_UpdateGoalController";
import { PATCHUpdateHabitStatus } from "http/controllers/update/PATCH_UpdateHabitStatusController";
import { PATCHUpdateOverview } from "http/controllers/update/PATCH_UpdateOverviewController";
import { PATCHUpdatePassword } from "http/controllers/update/PATCH_UpdatePasswordController";
import { PATCHUpdateTotalCount } from "http/controllers/update/PATCH_UpdateTotalCountController";
import { PATCHUpdateUsername } from "http/controllers/update/PATCH_UpdateUsernameController";
import { PUTUpdateHabit } from "http/controllers/update/PUT_UpdateHabitController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";
import { PATCHUpdateEmailValidate } from "http/controllers/update/PATCH_UpdateEmailValidateController";

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
        url:"/email/request",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdateEmailRequest,
    })
    app.route({
        url:"/email/validate",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdateEmailValidate,
    })
    app.route({
        url:"/password",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdatePassword,
    })
    app.route({
        url:"/habit/status/:habitId",
        method:"PATCH",
        preHandler:VerifyAuthToken,
        handler:PATCHUpdateHabitStatus,
    })
    app.route({
        url:"/habit/:habitId",
        method:"PUT",
        preHandler:VerifyAuthToken,
        handler:PUTUpdateHabit,
    })
    app.route({
        url:"/goal/:goalId",
        method:"PATCH",
        preHandler:VerifyAuthToken,
        handler:PATCHUpdateGoal,
    })
}