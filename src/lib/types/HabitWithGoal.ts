import { goal, Prisma, status } from "@prisma/client";

export type Goal = {
    id: string,
    createdAt: Date,
    updateAt?: Date,
    title: string,
    currentCount: number,
    targetCount: number,
}

export type HabitWithGoal = {
    id: string;
    title: string;
    status: status;
    description: string | null;
    statusByDate: Prisma.JsonValue;
    reminderTime: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
    categoryId: number;
    profileId: string | null;
    goals: goal[];
};
