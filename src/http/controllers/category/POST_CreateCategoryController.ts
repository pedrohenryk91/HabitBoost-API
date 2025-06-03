import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaCategoryRepository } from "repositories/prisma/PrismaCategoryRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { CreateCategoryUseCase } from "services/category/CreateCategoryService";
import { z } from "zod";

export async function POSTCreateCategory(request:FastifyRequest, reply:FastifyReply) {
    try {
        const profile_id = String(request.user)

        const {id,name,iconId} = z.object({
            id:z.string(),
            name:z.string(),
            iconId:z.string(),
        }).parse(request.body)

        const categoryRepo = new PrismaCategoryRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new CreateCategoryUseCase(categoryRepo,profileRepo)

        const category = await service.execute({
            id,
            name,
            iconId,
            profile_id,
        })

        reply.status(201).send({
            Description:"Created",
            category,
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message
            })
        }
        if(err instanceof AlreadyInUseError){
            reply.status(403).send({
                message:err.message
            })
        }
        throw err
    }
}