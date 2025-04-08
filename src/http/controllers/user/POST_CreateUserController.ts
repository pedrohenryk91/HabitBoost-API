import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { NODE_ENV } from "lib/env";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { CreateUserUseCase } from "services/user/CreateUserService";
import { z } from "zod";

export async function POSTCreateUserController(request: FastifyRequest, reply: FastifyReply){
    try {
        const {email, password, username, profileId} = z.object({
            email: z.string().email(),
            password: z.string().min(6),
            username: z.string().min(3).max(20),
            profileId: z.string(),
        }).parse(request.body)

        const userRepo = new PrismaUserRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new CreateUserUseCase(userRepo, profileRepo)

        await service.execute({
            email,
            password,
            username,
            profile_id: profileId,
        })

        reply.status(201).send({
            message: "Success, user created."
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