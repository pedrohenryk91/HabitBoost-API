import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { VerifyValidationTokenUseCase } from "services/user/VerifyValidationTokenUseCase";
import { z, ZodError } from "zod";

export async function PATCHVerifyValidationToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {token} = z.object({
            token:z.string(),
        }).parse(request.body)

        const userRepo = new PrismaUserRepository()
        const service = new VerifyValidationTokenUseCase(userRepo)

        await service.execute(token)

        reply.status(200).send({
            Description:"E-mail validated successfully"
        })
    }
    catch(err){
        if(err instanceof ZodError){
            reply.status(417).send({
                message: err.format()
            })
        }

        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message
            })
        }

        throw err
    }
}