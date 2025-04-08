import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { SendValidationMailUseCase } from "services/user/SendValidationMailUseCase";
import { z } from "zod";

export async function POSTGenValidationToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {email} = z.object({ email: z.string().email() }).parse(request.body)

        const repo = new PrismaUserRepository()
        const service = new SendValidationMailUseCase(repo)

        await service.execute(email)

        reply.status(200).send({
            message:"ok"
        })
    }
    catch(err){
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message
            })
        }

        throw err
    }
}