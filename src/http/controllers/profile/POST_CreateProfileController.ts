import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { OverviewOptionalSchema } from "lib/types/Overview";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { CreateProfileUseCase } from "services/profile/CreateProfileService";
import { z } from "zod";

export async function POSTCreateProfileController(request: FastifyRequest, reply: FastifyReply){
    try {
        const CreateProfileSchema = z.object({
            id:z.string().optional(),
            user_id:z.string().optional(),
            image_url: z.string().optional(),
            created_at:z.date().optional(),
            updated_at:z.date().optional(),
            count_updated_at:z.date().optional(),
            total_habit_count:z.number().optional(),
            overview:OverviewOptionalSchema.optional(),
        })

        const { id, image_url, created_at, updated_at, total_habit_count, count_updated_at,overview } = CreateProfileSchema.parse(request.body)

        const profileRepo = new PrismaProfileRepository()
        const userRepo = new PrismaUserRepository()
        const service = new CreateProfileUseCase(profileRepo, userRepo)

        const profile = await service.execute({
            id,
            image_url:image_url,
            createdAt:created_at,
            updatedAt:updated_at,
            count_updated_at,
            total_habit_count,
            detailed_habit_count:overview,
        })

        reply.status(201).send({
            Description: `Profile created`,
            Profile:{
                id:profile.id,
                image_url:profile.image_url,
                total_habit_count:profile.total_habit_count,
                overview:profile.detailed_habit_count,
            },
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