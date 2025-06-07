import { hash } from "bcryptjs";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectPasswordError } from "errors/IncorrectPasswordError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { ChangePasswordUseCase } from "services/user/ChangePasswordService";
import { z } from "zod";

export async function PATCHUpdatePassword(request: FastifyRequest, reply: FastifyReply) {
    try {
        const id = String(request.user)

        const {newPassword,oldPassword} = z.object({
            newPassword: z.string().min(6),
            oldPassword: z.string().min(6),
        }).parse(request.body)

        const userRepo = new PrismaUserRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new ChangePasswordUseCase(userRepo, profileRepo)

        await service.execute(id, {
            new_password:newPassword,
            old_password:oldPassword,
        })

        reply.status(201).send({
            Description:"Password changed."
        })
    }
    catch (err) {
        if(err instanceof IncorrectPasswordError){
            reply.status(403).send({
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