import { goal } from "@prisma/client";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaGoalRepository } from "repositories/prisma/PrismaGoalRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { CreateGoalUseCase } from "services/goal/CreateGoalService";
import { z } from "zod";

export async function POSTCreateGoal(request: FastifyRequest, reply: FastifyReply) {
    try {
        const id = String(request.user)
        const GoalSchema = z.object({
            title:z.string(),
            habit_id:z.string().optional(),
            target_count:z.coerce.number(),
        })
    
        const {habit_id,title,target_count} = GoalSchema.parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const goalRepo = new PrismaGoalRepository()
        const service = new CreateGoalUseCase(goalRepo,profileRepo)

        const goal = await service.execute(id,{
            title,
            habit_id,
            target_count,
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