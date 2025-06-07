import { goal } from "@prisma/client";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaGoalRepository } from "repositories/prisma/PrismaGoalRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { CreateGoalUseCase } from "services/goal/CreateGoalService";
import { z } from "zod";

export async function POSTCreateGoal(request: FastifyRequest, reply: FastifyReply) {
    try {
        const profile_id = String(request.user)
        const GoalSchema = z.object({
            id:z.string(),
            title:z.string(),
            habitId:z.string().optional(),
            targetCount:z.coerce.number(),
            currentCount:z.coerce.number().optional(),
            createdAt:z.coerce.date().optional(),
            updatedAt:z.coerce.date().optional(),
        })
    
        const {id,habitId,title,targetCount,currentCount,createdAt,updatedAt} = GoalSchema.parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const goalRepo = new PrismaGoalRepository()
        const service = new CreateGoalUseCase(goalRepo,profileRepo)

        const goal = await service.execute(profile_id,{
            id,
            title,
            habit_id:habitId,
            target_count:targetCount,
            current_count:currentCount,
            createdAt,
            updatedAt,
        })

        reply.status(201).send({
            Description: "Created.",
            goal,
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