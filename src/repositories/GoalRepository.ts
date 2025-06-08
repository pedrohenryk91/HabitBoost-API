import { goal, Prisma } from "@prisma/client";

export interface GoalRepository {
    create(data: Prisma.goalUncheckedCreateInput): Promise<goal>
    findById(id: string): Promise<goal | null>
    findByHabitId(habitId: string): Promise<goal[]>
    findByProfileId(profileId: string): Promise<goal[]>
    update(id: string, data: Partial<goal>): Promise<goal | null>
    delete(id: string): Promise<void>
}