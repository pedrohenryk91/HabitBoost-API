import { FastifyInstance } from "fastify";
import { GETRanking } from "http/controllers/profile/GET_GetRankingController";
import { VerifyAuthToken } from "http/middlewares/VerifyAuthToken";

export async function RankRoutes(app: FastifyInstance){
    app.route({
        url:"",
        method:"GET",
        preHandler:VerifyAuthToken,
        handler:GETRanking,
    })
}