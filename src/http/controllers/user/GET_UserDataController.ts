import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { GetUserDataUseCase } from "services/user/GetUserDataService";
import { z } from "zod";

export async function GETUserData(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {username} = z.object({
            username: z.string().min(3).max(20),
        }).parse(request.params)

        const profileRepo = new PrismaProfileRepository()
        const userRepo = new PrismaUserRepository()
        const service = new GetUserDataUseCase(userRepo, profileRepo)

        const {detailed_habit_count,total_habit_count} = await service.execute(username)

        reply.status(200).send({
            detailed_habit_count,
            total_habit_count,
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message
            })
        }

        if(err instanceof NotAllowedError){
            reply.status(400).send({
                message: err.message
            })
        }

        throw err
    }
}