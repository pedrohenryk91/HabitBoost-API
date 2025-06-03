import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { InvalidTokenError } from "errors/InvalidTokenError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { RecoverPasswordService } from "services/user/RecoverPasswordService";
import { z } from "zod";

export async function PATCHRecoverPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
        const RecoverPasswordParamsSchema = z.object({
            newPassword:z.string().min(6),
            email:z.string().email(),
            token:z.string(),
        })

        const {newPassword,email,token} = RecoverPasswordParamsSchema.parse(request.body)

        const repo = new PrismaUserRepository()
        const service = new RecoverPasswordService(repo)

        await service.execute({
            token,
            email,
            newPassword,
        })

        reply.status(201).send({
            Description:"Password updated."
        })
    }
    catch (err) {
        if(err instanceof InvalidTokenError){
            reply.status(400).send({
                message:err.message,
            })
        }        
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message,
            })
        }
        throw err
    }
}