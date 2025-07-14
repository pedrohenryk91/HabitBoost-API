import { habit, Prisma } from "@prisma/client";

export interface HabitRepository {
    create(data: Prisma.habitCreateInput): Promise<habit>
    findById(id: string): Promise<habit | null>
    findByProfileId(profileId: string): Promise<habit[]>
    update(id: string, data: Prisma.habitUpdateInput): Promise<habit | null>
    delete(id: string): Promise<void>
}