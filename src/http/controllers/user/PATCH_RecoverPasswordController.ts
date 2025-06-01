import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { ExpiredCookieError } from "errors/ExpiredCookieError";
import { IncorrectFormatError } from "errors/IncorrectFormatError";
import { InvalidCookieError } from "errors/InvalidCookieError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { RecoverPasswordUseCase } from "services/user/RecoverPasswordService";
import { z } from "zod";

export async function PATCHRecoverPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
        const recoverPasswordParams = z.object({
            email: z.string().email(),
            newPassword: z.string().min(6),
            code: z.string(),
        })

        const recoverCookieSchema = z.object({
            recoverCookie: z.string()
        })

        const {code,email,newPassword} = recoverPasswordParams.parse(request.body)
        const {recoverCookie} = recoverCookieSchema.parse(request.cookies)

        const userRepo = new PrismaUserRepository()
        const service = new RecoverPasswordUseCase(userRepo)
        const unsignedCookie = request.unsignCookie(recoverCookie)

        await service.execute({
            email,
            code,
            newPassword,
            unsignedCookie,
        })

        reply.status(201).send({
            description:"Password changed successfully.",
        })
    }
    catch (err) {
        if(err instanceof InvalidCookieError || err instanceof ExpiredCookieError){
            reply.status(401).send({
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