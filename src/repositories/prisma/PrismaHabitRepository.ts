import { Prisma, habit } from "@prisma/client";
import { prisma } from "lib/prisma";
import { HabitRepository } from "repositories/HabitRepository";

export class PrismaHabitRepository implements HabitRepository {
    async create(data: Prisma.habitCreateInput): Promise<habit> {
        return await prisma.habit.create({
            data,
        })
    }

    async findById(id: string): Promise<habit | null> {
        return await prisma.habit.findUnique({
            where:{
                id,
            },
        })
    }

    async findByProfileId(profileId: string): Promise<habit[]> {
        return await prisma.habit.findMany({
            where:{
                profile_id:profileId,
            },
        })
    }

    async update(id: string, data: Prisma.habitUpdateInput): Promise<habit | null> {
        return await prisma.habit.update({
            where:{
                id,
            },
            data,
        })
    }

    async delete(id: string): Promise<void> {
        await prisma.habit.delete({
            where:{
                id,
            }
        })
    }
}