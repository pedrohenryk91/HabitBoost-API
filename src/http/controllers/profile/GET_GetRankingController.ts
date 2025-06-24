import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { GetRankingService } from "services/profile/GetRankingService";

export async function GETRanking(request:FastifyRequest, reply:FastifyReply) {
    try {
        const id = String(request.user)

        const profileRepo = new PrismaProfileRepository()
        const service = new GetRankingService(profileRepo)

        const leaderboard = await service.execute(id)

        reply.status(200).send({
            Description:"Ok",
            leaderboard,
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message,
            })
        }
        throw err
    }
}