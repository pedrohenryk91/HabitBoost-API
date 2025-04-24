import { FastifyInstance } from "fastify";
import { DELETEGoal } from "http/controllers/goals/DELETE_DeleteGoalController";
import { POSTCreateGoal } from "http/controllers/goals/POST_CreateGoalController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function GoalRoutes(app: FastifyInstance) {
    app.route({
        url:"/create",
        method:"POST",
        preHandler:[VerifyAuthToken],
        handler:POSTCreateGoal,
    })
    app.route({
        url:"/delete",
        method:"DELETE",
        preHandler:VerifyAuthToken,
        handler:DELETEGoal,
    })    
}