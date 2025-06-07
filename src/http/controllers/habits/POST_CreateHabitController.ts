import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { Habit } from "lib/types/Habit";
import { statusByDateSchema } from "lib/types/StatusByDate";
import { PrismaHabitRepository } from "repositories/prisma/PrismaHabitRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { CreateHabitUseCase } from "services/habits/CreateHabitService";
import { z } from "zod";

const reminderSchema = z.preprocess((arg) => {
    if (typeof arg === "string") {
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date; 
    }
    return arg;
}, z.date())

export async function POSTCreateHabit(request: FastifyRequest, reply: FastifyReply) {
    try {
        const CreateHabitSchema = z.object({
            id:z.string(),
            title:z.string(),
            days:z.array(z.string()),
            reminderTime:reminderSchema.optional(),
            description:z.string().optional(),
            categoryId:z.string(),
            statusByDate:statusByDateSchema,
            createdAt:z.coerce.date().optional(),
            updatedAt:z.coerce.date().optional(),
        })
    
        const profile_id = String(request.user)
    
        const {id,days,statusByDate,categoryId,title,reminderTime,description} = CreateHabitSchema.parse(request.body)
    
        const habitRepo = new PrismaHabitRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new CreateHabitUseCase(habitRepo, profileRepo)
    
        const result = await service.execute({
            category_id:categoryId,
            profile_id,
            title,
            days,
            id,
            description,
            reminder_time:reminderTime,
            status_by_date: statusByDate,
        })

        const habit: Habit = {
            id:result.id,
            title:result.title,
            description:(result.description?result.description:undefined),
            statusByDate:statusByDateSchema.parse(result.status_by_date),
            categoryId:result.category_id,
            createdAt:result.created_at,
            updatedAt:result.updated_at,
            days:result.days,
            reminderTime:String(result.reminder_time),
        }

        reply.status(201).send({
            Description:"Habit created",
            habit,
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