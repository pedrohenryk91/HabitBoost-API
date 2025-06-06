import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { ExpiredCookieError } from "errors/ExpiredCookieError";
import { IncorrectCodeError } from "errors/IncorretCodeError";
import { InvalidCookieError } from "errors/InvalidCookieError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { ValidateCodeUseCase } from "services/user/ValidateCodeService";
import { z } from "zod";

export async function PATCHValidateCode(request: FastifyRequest, reply: FastifyReply) {
    try {
        const recoverPasswordParams = z.object({
            code: z.string(),
        })

        const recoverCookieSchema = z.object({
            recoverCookie: z.string()
        })

        const {code} = recoverPasswordParams.parse(request.body)
        const {recoverCookie} = recoverCookieSchema.parse(request.body)

        const userRepo = new PrismaUserRepository()
        const service = new ValidateCodeUseCase(userRepo)
        const unsignedCookie = request.unsignCookie(recoverCookie)

        const token = await service.execute({
            code,
            unsignedCookie,
        })

        reply.status(200).send({
            description:"Code is correct.",
            token
        })
    }
    catch (err) {
        if(err instanceof IncorrectCodeError){
            reply.status(400).send({
                message:err.message,
            })
        }
        if(err instanceof InvalidCookieError || err instanceof ExpiredCookieError){
            reply.status(401).send({
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