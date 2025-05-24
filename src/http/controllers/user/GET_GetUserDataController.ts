import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { GetProfileDataUseCase } from "services/profile/GetProfileDataService";

export async function GETUserData(request: FastifyRequest, reply: FastifyReply) {
    try {
        const profile_id = String(request.user)

        const profileRepo = new PrismaProfileRepository()
        const userRepo = new PrismaUserRepository()
        const service = new GetProfileDataUseCase(profileRepo,userRepo)

        const data = await service.execute(profile_id)

        reply.status(200).send({
            Description:"Success",
            data,
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message,
            })
        }
        throw err
    }
}