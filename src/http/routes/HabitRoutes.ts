import { FastifyInstance } from "fastify";
import { POSTCreateHabit } from "http/controllers/habits/POST_CreateHabitController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function HabitRoutes(app: FastifyInstance) {
    app.route({
        url:"/create",
        method:"POST",
        preHandler:[VerifyAuthToken],
        handler:POSTCreateHabit,
    })
    // app.route({
    //     url:"/get/"
    // })
    // app.route({
    //     url:"/edit/name/:new",
    //     method:"PATCH",
    //     handler:
    // })
    // app.route({
    //     url:"/edit/status/:new",
    //     method:"PATCH",
    //     handler:
    // })
    // app.route({
    //     url:"/delete",
    //     method:"DELETE",
    //     handler:
    // })
}