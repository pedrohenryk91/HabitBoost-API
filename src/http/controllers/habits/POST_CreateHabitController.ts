import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaHabitRepository } from "repositories/prisma/PrismaHabitRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { CreateHabitUseCase } from "services/habits/CreateHabitService";
import { z } from "zod";

const datesSchema = z.preprocess(
    (arg) => {
        if (Array.isArray(arg)) {
            return arg.map(item => new Date(item));
        }
        return [];
    },
    z.array(z.date())
);

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
            dates:datesSchema,
            reminder_time:reminderSchema.optional(),
            description:z.string().optional(),
            category_id:z.coerce.number(),
        })
    
        const profile_id = String(request.user)
    
        const {category_id,dates,title,reminder_time,description} = CreateHabitSchema.parse(request.body)
    
        const habitRepo = new PrismaHabitRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new CreateHabitUseCase(habitRepo, profileRepo)
    
        const {id,status,created_at,updated_at} = await service.execute({
            category_id,
            profile_id,
            dates,
            title,
            description,
            reminder_time,
        })
    
        reply.status(201).send({
            Description:"Habit created",
            habit:{
                id,
                title,
                dates,
                status,
                created_at,
                updated_at,
                category_id,
                reminder_time,
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