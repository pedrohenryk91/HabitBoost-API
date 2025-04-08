import { FastifyInstance } from "fastify";
import { POSTCreateProfileController } from "http/controllers/profile/POST_CreateProfileController";

export async function profileRoutes(app: FastifyInstance) {
    app.route({
        url:"/create",
        method:"POST",
        handler:POSTCreateProfileController,
    })
    // app.route({
    //     url:"/edit/imageUrl/:url",
    //     method:"PATCH",
    //     handler:
    // })
    // app.route({
    //     url:"/delete",
    //     method:"DELETE",
    //     handler:
    // })
}