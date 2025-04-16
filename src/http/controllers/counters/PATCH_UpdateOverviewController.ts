import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { OverviewOptionalSchema } from "lib/types/Overview";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { UpdateOverviewService } from "services/counter/UpdateOverviewService";
import { z } from "zod";

export async function PATCHUpdateOverview(request: FastifyRequest, reply: FastifyReply) {
    try {
        const UpdateOverviewParams = z.object({
            overview: OverviewOptionalSchema,
        })

        const {overview} = UpdateOverviewParams.parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const service = new UpdateOverviewService(profileRepo)

        await service.execute({
            id:String(request.user),
            overview,
        })

        reply.status(201).send({
            Description:"Overview Updated"
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