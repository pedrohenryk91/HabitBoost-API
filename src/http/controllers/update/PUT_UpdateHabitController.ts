import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { statusByDateSchema } from "lib/types/StatusByDate";
import { PrismaCategoryRepository } from "repositories/prisma/PrismaCategoryRepository";
import { PrismaHabitRepository } from "repositories/prisma/PrismaHabitRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { EditHabitUseCase } from "services/habits/EditHabitService";
import { z } from "zod";

export async function PUTUpdateHabit(request:FastifyRequest, reply:FastifyReply) {
    try {
        const id = String(request.user)

        const UpdateHabitSchema = z.object({
            status:z.enum(["unstarted","concluded","missed"]).optional(),
            days:z.array(z.string()).optional(),
            title:z.string().optional(),
            description:z.string().optional(),
            reminderTime:z.string().optional(),
            categoryId:z.string().optional(),
            statusByDate:statusByDateSchema.optional(),
        })

        const {habitId} = z.object({habitId:z.string()}).parse(request.params)
        const {days,status,categoryId,statusByDate,description,reminderTime,title} = UpdateHabitSchema.parse(request.body)

        const categoryRepo = new PrismaCategoryRepository()
        const profileRepo = new PrismaProfileRepository()
        const habitRepo = new PrismaHabitRepository()
        const service = new EditHabitUseCase(habitRepo,profileRepo,categoryRepo)

        const habit = await service.execute(id, habitId,{
            status_by_date:statusByDate,
            category_id:categoryId,
            description,
            reminder_time:reminderTime,
            status,
            title,
            days,
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