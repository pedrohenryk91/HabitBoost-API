import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { FastifyReply, FastifyRequest } from "fastify";
import { DetailedHabitCountSchema } from "lib/types/DetailedHabitCount";
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
            total_habit_count:z.number().optional(),
            detailed_habit_count:DetailedHabitCountSchema.optional(),
        })

        const { id, image_url, created_at, updated_at, total_habit_count, detailed_habit_count } = CreateProfileSchema.parse(request.query)

        const profileRepo = new PrismaProfileRepository()
        const userRepo = new PrismaUserRepository()
        const service = new CreateProfileUseCase(profileRepo, userRepo)

        const profile = await service.execute({
            id,
            image_url:image_url,
            createdAt:created_at,
            updatedAt:updated_at,
            total_habit_count,
            detailed_habit_count,
        })

        reply.status(201).send({
            Description: `Profile created`,
            profile,
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