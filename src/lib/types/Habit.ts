export type HabitStatus = "unstarted" | "concluded" | "missed"

export type Habit = {
    id: string;
    title: string;
    description?: string;
    statusByDate: {
        [date: string]: HabitStatus;
    };
    reminderTime?: string;
    categoryId: string;
    days: string[];
    createdAt: Date;
    updatedAt: Date | null;
}