import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { EditUsernameUseCase } from "services/user/EditUsernameService";
import { z } from "zod";

export async function PATCHUpdateUsername(request: FastifyRequest, reply: FastifyReply) {
   try {
        const id = String(request.user)

        const { old_username, new_username } = z.object({
            old_username: z.string().min(3).max(20),
            new_username:z.string().min(3).max(20),
        }).parse(request.body)

        const userRepo = new PrismaUserRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new EditUsernameUseCase(userRepo, profileRepo)

        await service.execute(id, {
            old_username,
            new_username,
        })

        reply.status(201).send({
            message: "Username updated."
        })

   } catch (err) {
        if(err instanceof NotAllowedError){
            reply.status(400).send({
                message: err.message,
            })
        }

        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message,
            })
        }

        if(err instanceof AlreadyInUseError){
            reply.status(409).send({
                message: err.message,
            })
        }

        throw err
   }
}