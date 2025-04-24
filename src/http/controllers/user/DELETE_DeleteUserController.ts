import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { DeleteUserUseCase } from "services/user/DeleteUserService";

export async function DELETEUser(request: FastifyRequest, reply: FastifyReply){
    try {
        const id = String(request.user)

        const profileRepo = new PrismaProfileRepository()
        const userRepo = new PrismaUserRepository()
        const service = new DeleteUserUseCase(userRepo,profileRepo)

        await service.execute(id)

        reply.status(200).send({
            Description:"Deleted."
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message,
            })
        }
        throw err
    }
}