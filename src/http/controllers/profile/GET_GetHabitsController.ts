import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaHabitRepository } from "repositories/prisma/PrismaHabitRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { GetProfileHabitsUseCase } from "services/profile/GetProfileHabitsService";

export async function GETUserHabits(request:FastifyRequest, reply:FastifyReply) {
    try {
        const id = String(request.user)

        const profileRepo = new PrismaProfileRepository()
        const habitRepo = new PrismaHabitRepository()
        const service = new GetProfileHabitsUseCase(profileRepo, habitRepo)

        const habits = await service.execute(id)

        reply.status(200).send({
            habits:[...habits]
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