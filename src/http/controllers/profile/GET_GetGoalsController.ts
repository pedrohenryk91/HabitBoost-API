import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaGoalRepository } from "repositories/prisma/PrismaGoalRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { GetProfileGoalsUseCase } from "services/profile/GetProfileGoalsService";
import { z } from "zod";

export async function GETGoalsController(request:FastifyRequest, reply:FastifyReply) {
    try {
        const id = String(request.user)

        const {habitId} = z.object({
            habitId: z.string()
        }).parse(request.params)

        const profileRepo = new PrismaProfileRepository()
        const goalRepo = new PrismaGoalRepository()
        const service = new GetProfileGoalsUseCase(goalRepo,profileRepo)

        const goals = await service.execute(id,habitId)

        reply.status(201).send({
            Description:"Ok",
            Goals:[...goals],
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