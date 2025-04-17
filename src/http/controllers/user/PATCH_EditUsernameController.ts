import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { EditUserUseCase } from "services/user/EditUserService";
import { z } from "zod";

export async function PATCHEditUsername(request: FastifyRequest, reply: FastifyReply) {
   try {
        const { id, username } = z.object({
            id:z.string(),
            username:z.string().min(3).max(20),
        }).parse(request.body)

        //TODO: Change user id to profile id.

        const repo = new PrismaUserRepository()
        const service = new EditUserUseCase(repo)

        await service.execute(id, {
            username,
        })

        reply.status(201).send({
            message: "Username changed successfully."
        })

   } catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message
            })
        }

        if(err instanceof AlreadyInUseError){
            reply.status(409).send({
                message: err.message
            })
        }

        throw err
   }
}