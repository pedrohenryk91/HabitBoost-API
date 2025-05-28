import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaCategoryRepository } from "repositories/prisma/PrismaCategoryRepository";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { CreateCategoryUseCase } from "services/category/CreateCategoryService";
import { z } from "zod";

export async function POSTCreateCategory(request:FastifyRequest, reply:FastifyReply) {
    try {
        const id = String(request.user)

        const {name,iconId} = z.object({
            name:z.string(),
            iconId:z.string(),
        }).parse(request.params)

        const categoryRepo = new PrismaCategoryRepository()
        const profileRepo = new PrismaProfileRepository()
        const service = new CreateCategoryUseCase(categoryRepo,profileRepo)

        const category = await service.execute({
            name,
            iconId,
            profile_id:id
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