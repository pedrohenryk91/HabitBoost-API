import { Prisma, goal } from "@prisma/client";
import { prisma } from "lib/prisma";
import { GoalRepository } from "repositories/GoalRepository";

export class PrismaGoalRepository implements GoalRepository {
    async create(data: Prisma.goalUncheckedCreateInput): Promise<goal> {
        return await prisma.goal.create({
            data,
        })
    }

    async findById(id: string): Promise<goal | null> {
        return await prisma.goal.findUnique({
            where:{
                id,
            }
        })
    }

    async findByHabitId(habitId: string): Promise<goal[]> {
        return await prisma.goal.findMany({
            where:{
                habit_id:habitId,
            }
        })
    }

    async findByProfileId(profileId: string): Promise<goal[]> {
        return await prisma.goal.findMany({
            where:{
                profile_id:profileId,
            }
        })
    }

    async update(id: string, data: Partial<goal>): Promise<goal | null> {
        return await prisma.goal.update({
            where:{
                id,
            },
            data,
        })
    }

    async delete(id: string): Promise<void> {
        await prisma.goal.delete({
            where:{
                id,
            }
        })
    }
}