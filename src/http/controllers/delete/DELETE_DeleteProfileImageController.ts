import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { DeleteProfileImageUseCase } from "services/delete/DeleteProfileImageService";

export async function DELETEProfileImage(request: FastifyRequest, reply: FastifyReply) {
    try {
        const profileId = String(request.user)

        const profileRepo = new PrismaProfileRepository()
        const service = new DeleteProfileImageUseCase(profileRepo)

        await service.execute(profileId)

        reply.status(200).send({
            Description:"Deleted."
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message,
            })
        }
        if(err instanceof NotAllowedError){
            reply.status(400).send({
                message:err.message
            })
        }
        throw err
    }
}