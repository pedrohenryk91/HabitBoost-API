import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { GetUserDataUseCase } from "services/user/GetUserDataService";

export async function GETOverviewAndTotal(request: FastifyRequest, reply: FastifyReply) {
    try {
        const id = String(request.user)

        const profileRepo = new PrismaProfileRepository()
        const service = new GetUserDataUseCase(profileRepo)

        const {detailed_habit_count,total_habit_count} = await service.execute(id)

        reply.status(200).send({
            overview:detailed_habit_count,
            totalHabitCount:total_habit_count,
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message
            })
        }

        throw err
    }
}