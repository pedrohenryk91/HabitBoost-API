import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectFormatError } from "errors/IncorrectFormatError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { EditProfileUseCase } from "services/profile/EditProfileService";
import { z } from "zod";

export async function PATCHUpdateTotalCount(request: FastifyRequest, reply: FastifyReply){
    try {
        const id = String(request.user)

        const { number } = z.object({
            number: z.coerce.number()
        }).parse(request.params)

        const profileRepo = new PrismaProfileRepository()
        const service = new EditProfileUseCase(profileRepo)

        await service.execute(id,{
            thc:number,
        })

        reply.status(201).send({
            message: "Updated",
        })
    } catch (err) {
        if(err instanceof IncorrectFormatError){
            reply.status(400).send({
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