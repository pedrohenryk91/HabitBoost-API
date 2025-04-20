import { FastifyInstance } from "fastify";
import { POSTUploadImage } from "http/controllers/upload/POST_UploadImageController";
import { SupabaseLogin } from "http/middlewares/SupabaseLogin";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";
import { VerifyCustomAuth } from "http/middlewares/VerifyCustomAuth";

export async function UploadRoutes(app: FastifyInstance) {
    app.route({
        url:"/image",
        method:"POST",
        preHandler:[SupabaseLogin,VerifyCustomAuth],
        handler:POSTUploadImage,
    })
}