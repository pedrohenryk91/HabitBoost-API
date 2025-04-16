import { FastifyInstance } from "fastify";
import { PATCHUpdateOverview } from "http/controllers/counters/PATCH_UpdateOverviewController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function OverviewRoutes(app: FastifyInstance) {
    app.route({
        url:"/update",
        method:"PATCH",
        preHandler:[VerifyAuthToken],
        handler:PATCHUpdateOverview,
    })
}