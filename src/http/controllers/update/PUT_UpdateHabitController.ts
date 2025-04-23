import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaCategoryRepository } from "repositories/prisma/PrismaCategoryRepository";
import { PrismaHabitRepository } from "repositories/prisma/PrismaHabitRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { EditHabitUseCase } from "services/habits/EditHabitService";
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


export async function PUTUpdateHabit(request:FastifyRequest, reply:FastifyReply) {
    try {
        const id = String(request.user)

        const UpdateHabitSchema = z.object({
            habit_id:z.string(),
            title:z.string().optional(),
            dates:datesSchema.optional(),
            description:z.string().optional(),
            reminder_time:reminderSchema.optional(),
            category_id:z.coerce.number().optional(),
        })

        const {habit_id,category_id,dates,description,reminder_time,title} = UpdateHabitSchema.parse(request.body)

        const categoryRepo = new PrismaCategoryRepository()
        const profileRepo = new PrismaProfileRepository()
        const habitRepo = new PrismaHabitRepository()
        const service = new EditHabitUseCase(habitRepo,profileRepo,categoryRepo)

        const habit = await service.execute(id, habit_id,{
            category_id,
            dates,
            description,
            reminder_time:(reminder_time?new Date(reminder_time):undefined),
            title,
        })

        reply.status(201).send({
            Description:"Updated.",
            habit,
        })
    }
    catch (err) {
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