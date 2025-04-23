import { FastifyInstance } from "fastify";
import { POSTCreateCategory } from "http/controllers/category/POST_CreateCategoryController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function CategoryRoutes(app: FastifyInstance) {
    app.route({
        url:"/create/:name",
        method:"POST",
        preHandler:VerifyAuthToken,
        handler:POSTCreateCategory,
    })
}