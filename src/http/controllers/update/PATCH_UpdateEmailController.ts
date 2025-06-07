import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { UpdateEmailUseCase } from "services/user/UpdateEmailService";
import { z } from "zod";

export async function PATCHUpdateEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
        const id = String(request.user)

        const {password,newEmail,oldEmail} = z.object({
            password:z.string().min(6),
            oldEmail:z.string().email(),
            newEmail:z.string().email(),
        }).parse(request.body)

        const userRepo = new PrismaUserRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new UpdateEmailUseCase(userRepo, profileRepo)

        await service.execute(id,{
            password,
            old_email:oldEmail,
            new_email:newEmail,
        })

        reply.status(201).send({
            Description:"Email updated."
        })
    }
    catch (err) {
        if(err instanceof NotAllowedError){
            reply.status(400).send({
                message:err.message
            })
        }
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message,
            })
        }
        if(err instanceof AlreadyInUseError){
            reply.status(409).send({
                message:err.message,
            })
        }
        throw err
    }
}