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
    status_by_date: Prisma.JsonValue;
    reminder_time: Date | null;
    created_at: Date;
    updated_at: Date | null;
    category_id: number;
    profile_id: string | null;
    goals: goal[];
};
