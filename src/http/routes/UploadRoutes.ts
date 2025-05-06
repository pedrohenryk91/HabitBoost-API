import { FastifyInstance } from "fastify";
import { POSTUploadImage } from "http/controllers/upload/POST_UploadImageController";
import { SupabaseLogin } from "http/middlewares/SupabaseLogin";

export async function UploadRoutes(app: FastifyInstance) {
    app.route({
        url:"/image",
        method:"POST",
        preHandler:[SupabaseLogin],
        handler:POSTUploadImage,
    })
}