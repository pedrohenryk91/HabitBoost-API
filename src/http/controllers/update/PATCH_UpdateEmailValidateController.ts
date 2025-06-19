import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "lib/fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { ValidateEmailUpdateTokenUseCase } from "services/user/ValidateUpdateEmailTokenService";
import { z } from "zod";

export async function PATCHUpdateEmailValidate(request: FastifyRequest, reply: FastifyReply) {

    try {
        const profileId = String(request.user)

        const {token} = z.object({
            token:z.string(),
        }).parse(request.body)

        const payloadRaw = app.jwt.verify(token)

        const payload = z.object({
            sub: z.object({
                email:z.string().email(),
                id:z.string()
            })
        }).parse(payloadRaw)

        const profileRepo = new PrismaProfileRepository()
        const userRepo = new PrismaUserRepository()
        const service = new ValidateEmailUpdateTokenUseCase(userRepo,profileRepo)

        await service.execute({
            profileId,
            payload:payload.sub,
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
        throw err
    }

}