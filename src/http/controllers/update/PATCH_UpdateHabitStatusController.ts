import { status } from "@prisma/client";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaCategoryRepository } from "repositories/prisma/PrismaCategoryRepository";
import { PrismaHabitRepository } from "repositories/prisma/PrismaHabitRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { EditHabitUseCase } from "services/habits/EditHabitService";
import { EditStatusByDateUseCase } from "services/habits/EditStatusByDateService";
import { z } from "zod";

export async function PATCHUpdateHabitStatus(request:FastifyRequest, reply:FastifyReply) {
    try {
        const id = String(request.user)

        const {date,status} = z.object({
            date:z.string(),
            status:z.enum(["unstarted","concluded","missed"]),
        }).parse(request.body)

        const {habitId} = z.object({
            habitId: z.string()
        }).parse(request.params)

        const profileRepo = new PrismaProfileRepository()
        const habitRepo = new PrismaHabitRepository()
        const service = new EditStatusByDateUseCase(habitRepo, profileRepo)

        const habit = await service.execute(habitId, id,{
            status,
            date,
        })

        reply.status(201).send({
            Description:"Status updated",
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