import { habit, Prisma } from "@prisma/client";
import { HabitWithGoal } from "lib/types/HabitWithGoal";

export interface HabitRepository {
    create(data: Prisma.habitCreateInput): Promise<habit>
    findById(id: string): Promise<habit | null>
    findByProfileId(profileId: string): Promise<HabitWithGoal[]>
    update(id: string, data: Prisma.habitUpdateInput): Promise<habit | null>
    delete(id: string): Promise<void>
}