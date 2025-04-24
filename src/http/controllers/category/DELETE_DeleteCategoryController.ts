import { EntityNotFoundError } from "errors/EntityNotFoundError"
import { NotAllowedError } from "errors/NotAllowedError"
import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaCategoryRepository } from "repositories/prisma/PrismaCategoryRepository"
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository"
import { DeleteCategoryUseCase } from "services/category/DeleteCategoryService"
import { z } from "zod"

export async function DELETECategory(request: FastifyRequest, reply: FastifyReply){
    try {
        const id = String(request.user)

        const {category_id} = z.object({
            category_id:z.coerce.number()
        }).parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const categoryRepo = new PrismaCategoryRepository()
        const service = new DeleteCategoryUseCase(categoryRepo,profileRepo)

        await service.execute(id,category_id)

        reply.status(200).send({
            Description:"Deleted."
        })
    }
    catch (err) {
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message: err.message,
            })
        }
        if(err instanceof NotAllowedError){
            reply.status(403).send({
                message:err.message,
            })
        }
        throw err
    }
}