import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaCategoryRepository } from "repositories/prisma/PrismaCategoryRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { GetProfileCategoriesUseCase } from "services/profile/GetProfileCategoriesService";

export async function GETProfileCategories(request:FastifyRequest, reply:FastifyReply) {
    try {
        const id = String(request.user)

        const categoryRepo = new PrismaCategoryRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new GetProfileCategoriesUseCase(categoryRepo,profileRepo)

        const categories = await service.execute(id)

        reply.status(201).send({
            Description:"Ok",
            categories,
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