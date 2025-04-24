import { FastifyInstance } from "fastify";
import { DELETEHabit } from "http/controllers/habits/DELETE_DeleteHabitController";
import { POSTCreateHabit } from "http/controllers/habits/POST_CreateHabitController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function HabitRoutes(app: FastifyInstance) {
    app.route({
        url:"/create",
        method:"POST",
        preHandler:[VerifyAuthToken],
        handler:POSTCreateHabit,
    })
    app.route({
        url:"/delete",
        method:"DELETE",
        preHandler:VerifyAuthToken,
        handler:DELETEHabit,
    })    
}