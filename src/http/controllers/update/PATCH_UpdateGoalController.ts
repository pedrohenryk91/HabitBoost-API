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
        const {goalId} = z.object({ goalId: z.string()} ).parse(request.params)
        const {currentCount,newTitle,targetCount} = z.object({
            newTitle:z.string().min(3).optional(),
            currentCount:z.coerce.number().optional(),
            targetCount:z.coerce.number().optional(),
        }).parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const goalRepo = new PrismaGoalRepository()
        const service = new EditGoalUseCase(goalRepo,profileRepo)

        const goal = await service.execute({
            goal_id:goalId,
            new_title:newTitle,
            current_count:currentCount,
            target_count:targetCount,
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