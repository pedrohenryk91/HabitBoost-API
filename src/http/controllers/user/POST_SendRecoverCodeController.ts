import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { SendRecoverMailUseCase } from "services/user/SendRecoverMailService";
import { z } from "zod";

export async function POSTSendRecoverCode(request: FastifyRequest, reply: FastifyReply) {
    try {
        const {email} = z.object({
            email:z.string().email()
        }).parse(request.body)

        const userRepo = new PrismaUserRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new SendRecoverMailUseCase(userRepo, profileRepo)

        const code = await service.execute(email)
        
        reply.setCookie("recoverCookie", code, {
            signed:true,
            path:"/",
            httpOnly:true,
            sameSite:"none",
            maxAge:3600,
        })

        reply.status(201).send({
            message: "Code sent."
        })
    }
    catch(err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message,
            })
        }

        throw err
    }
}