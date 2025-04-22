import { FastifyInstance } from "fastify";
import { POSTCreateGoal } from "http/controllers/goals/POST_CreateGoalController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function GoalRoutes(app: FastifyInstance) {
    app.route({
        url:"/create",
        method:"POST",
        preHandler:[VerifyAuthToken],
        handler:POSTCreateGoal,
    })
}