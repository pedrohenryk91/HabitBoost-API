import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { EditProfileUseCase } from "services/profile/EditProfileService";
import { z } from "zod";

export async function PATCHUpdateImageUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
        const id = String(request.user)
        const {url} = z.object({
            url:z.string().url()
        }).parse(request.params)

        const profileRepo = new PrismaProfileRepository()
        const service = new EditProfileUseCase(profileRepo)

        await service.execute(id,{
            imageUrl:url,
        })

        reply.status(201).send({
            Description:"Updated."
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message,
            })
        }
        throw err
    }
}