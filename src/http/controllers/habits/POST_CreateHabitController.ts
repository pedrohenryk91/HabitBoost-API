import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaHabitRepository } from "repositories/prisma/PrismaHabitRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { CreateHabitUseCase } from "services/habits/CreateHabitService";
import { z } from "zod";

export async function POSTCreateHabit(request: FastifyRequest, reply: FastifyReply) {
    try {
        const CreateHabitSchema = z.object({
            title:z.string(),
            dates:z.array(z.date()),
            reminder_time:z.date().optional(),
            description:z.string().optional(),
            category_name:z.string(),
        })
    
        const profile_id = String(request.user)
    
        const {category_name,dates,title,reminder_time,description} = CreateHabitSchema.parse(request.body)
    
        const habitRepo = new PrismaHabitRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new CreateHabitUseCase(habitRepo, profileRepo)
    
        const id = await service.execute({
            category_name,
            profile_id,
            dates,
            title,
            description,
            reminder_time,
        })
    
        reply.status(201).send({
            Description:"Habit created",
            habit_id:id,
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message
            })
        }
        if(err instanceof NotAllowedError){
            reply.status(403).send({
                message:err.message
            })
        }
        throw err
    }
}