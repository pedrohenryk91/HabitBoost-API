import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
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
            title:z.string(),
            reminder_time:reminderSchema.optional(),
            description:z.string().optional(),
            category_id:z.coerce.number(),
            statusByDate:statusByDateSchema
        })
    
        const profile_id = String(request.user)
    
        const {statusByDate,category_id,title,reminder_time,description} = CreateHabitSchema.parse(request.body)
    
        const habitRepo = new PrismaHabitRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new CreateHabitUseCase(habitRepo, profileRepo)
    
        const {id,status,created_at,updated_at,status_by_date} = await service.execute({
            category_id,
            profile_id,
            title,
            description,
            reminder_time,
            status_by_date: statusByDate,
        })
    
        reply.status(201).send({
            Description:"Habit created",
            habit:{
                id,
                title,
                status,
                created_at,
                updated_at,
                category_id,
                reminder_time,
                statusByDate: status_by_date,
            },
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