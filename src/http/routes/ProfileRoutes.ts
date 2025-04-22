import { FastifyInstance } from "fastify";
import { GETUserHabits } from "http/controllers/profile/GET_GetHabitsController";
import { GETOverviewAndTotal } from "http/controllers/profile/GET_OverviewAndTotalController";
import { POSTCreateProfileController } from "http/controllers/profile/POST_CreateProfileController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function profileRoutes(app: FastifyInstance) {
    app.route({
        url:"/create",
        method:"POST",
        handler:POSTCreateProfileController,
    })
    app.route({
        url:"/get/overview",
        method:"GET",
        preHandler:[VerifyAuthToken],
        handler:GETOverviewAndTotal,
    })
    app.route({
        url:"/get/habits",
        method:"GET",
        preHandler:[VerifyAuthToken],
        handler:GETUserHabits,
    })
    // app.route({
    //     url:"/delete",
    //     method:"DELETE",
    //     handler:
    // })
}