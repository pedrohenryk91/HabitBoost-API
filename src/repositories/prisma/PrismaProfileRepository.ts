import { Prisma, profile } from "@prisma/client";
import { prisma } from "lib/prisma";
import { ProfileRepository } from "repositories/ProfileRepository";

export class PrismaProfileRepository implements ProfileRepository {

    async create(data: Partial<profile>): Promise<profile> {
        const {user_id,created_at,detailed_habit_count,image_url,total_habit_count,updated_at} = data
        return await prisma.profile.create({
            data:{
                user_id,
                image_url,
                created_at,
                updated_at,
                total_habit_count,
                detailed_habit_count:(detailed_habit_count?detailed_habit_count:undefined),
            }
        })
    }

    async findById(id: string): Promise<profile | null> {
        return await prisma.profile.findUnique({
            where:{
                id,
            }
        })
    }

    async findByUserId(userId: string): Promise<profile | null> {
        return await prisma.profile.findUnique({
            where:{
                user_id:userId,
            },
        })
    }

    async update(id: string, data: Partial<profile>): Promise<profile> {
        return await prisma.profile.update({
            where:{
                id,
            },
            data:{
                image_url:data.image_url,
                detailed_habit_count:(data.detailed_habit_count?data.detailed_habit_count:undefined),
                total_habit_count:data.total_habit_count,
            },
        })
    }

    async delete(id: string): Promise<void> {
        await prisma.profile.delete({
            where:{
                id,
            }
        })
    }

}