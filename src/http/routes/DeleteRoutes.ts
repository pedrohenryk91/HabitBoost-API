import { FastifyInstance } from "fastify";
import { DELETEProfileImage } from "http/controllers/delete/DELETE_DeleteProfileImageController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function DeleteRoutes(app: FastifyInstance) {
    app.route({
        url:"/image",
        method:"DELETE",
        preHandler:VerifyAuthToken,
        handler:DELETEProfileImage,
    })
}