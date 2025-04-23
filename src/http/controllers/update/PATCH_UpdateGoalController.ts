import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaGoalRepository } from "repositories/prisma/PrismaGoalRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { EditGoalUseCase } from "services/goal/EditGoalService";
import { z } from "zod";

export async function PATCHUpdateGoal(request:FastifyRequest, reply:FastifyReply) {
    try {
        const profile_id = String(request.user)
        const {goal_id,new_title} = z.object({
            goal_id:z.string(),
            new_title:z.string().min(3),
        }).parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const goalRepo = new PrismaGoalRepository()
        const service = new EditGoalUseCase(goalRepo,profileRepo)

        const goal = await service.execute({
            goal_id,
            new_title,
            profile_id,
        })

        reply.status(201).send({
            Description:"Updated",
            goal,
        })
    }
    catch(err){
        if(err instanceof NotAllowedError){
            reply.status(403).send({
                message:err.message,
            })
        }
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message,
            })
        }
        throw err
    }
}