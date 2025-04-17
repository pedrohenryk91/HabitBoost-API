import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { VerifyValidationTokenUseCase } from "services/auth/VerifyValidationTokenUseCase";
import { z, ZodError } from "zod";

export async function PATCHVerifyValidationToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {token} = z.object({
            token:z.string(),
        }).parse(request.body)

        const userRepo = new PrismaUserRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new VerifyValidationTokenUseCase(userRepo, profileRepo)

        const authToken = await service.execute(token)

        reply.status(200).send({
            Description:"E-mail validated successfully",
            token:authToken,
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