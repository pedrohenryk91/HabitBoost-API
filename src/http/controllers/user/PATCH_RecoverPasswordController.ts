import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectFormatError } from "errors/IncorrectFormatError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { RecoverPasswordUseCase } from "services/user/RecoverPasswordService";
import { z } from "zod";

export async function PATCHRecoverPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
        const RecoverPasswordParams = z.object({
            code: z.string(),
        })

        const {code} = RecoverPasswordParams.parse(request.body)

        const userRepo = new PrismaUserRepository()
        const service = new RecoverPasswordUseCase(userRepo)

        await service.execute(code)

        reply.status(201).send({
            description:"Password changed successfully.",
        })
    }
    catch (err) {
        if(err instanceof IncorrectFormatError){
            reply.status(417).send({
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