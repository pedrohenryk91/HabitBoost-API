import { EntityNotFoundError } from "errors/EntityNotFoundError"
import { NotAllowedError } from "errors/NotAllowedError"
import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaGoalRepository } from "repositories/prisma/PrismaGoalRepository"
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository"
import { DeleteGoalUseCase } from "services/goal/DeleteGoalService"
import { z } from "zod"

export async function DELETEGoal(request: FastifyRequest, reply: FastifyReply){
    try {
        const id = String(request.user)

        const {goal_id} = z.object({
            goal_id:z.string()
        }).parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const goalRepo = new PrismaGoalRepository()
        const service = new DeleteGoalUseCase(goalRepo,profileRepo)

        await service.execute(id,goal_id)

        reply.status(200).send({
            Description:"Deleted."
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message,
            })
        }
        if(err instanceof NotAllowedError){
            reply.status(403).send({
                message:err.message,
            })
        }
        throw err
    }
}