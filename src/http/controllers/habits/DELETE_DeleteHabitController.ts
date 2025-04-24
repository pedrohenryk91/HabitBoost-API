import { EntityNotFoundError } from "errors/EntityNotFoundError"
import { NotAllowedError } from "errors/NotAllowedError"
import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaHabitRepository } from "repositories/prisma/PrismaHabitRepository"
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository"
import { DeleteHabitUseCase } from "services/habits/DeleteHabitService"
import { z } from "zod"

export async function DELETEHabit(request: FastifyRequest, reply: FastifyReply){
    try {
        const id = String(request.user)

        const {habit_id} = z.object({
            habit_id:z.string()
        }).parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const habitRepo = new PrismaHabitRepository()
        const service = new DeleteHabitUseCase(habitRepo,profileRepo)

        await service.execute(id,habit_id)

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