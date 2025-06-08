import { status } from "@prisma/client";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectParamError } from "errors/InvalidParamError";
import { NotAllowedError } from "errors/NotAllowedError";
import { statusByDateSchema } from "lib/types/StatusByDate";
import { HabitRepository } from "repositories/HabitRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface StatusByDateParams {
    date: string,
    status: status
}

export class EditStatusByDateUseCase {
    constructor(private habitRepo: HabitRepository, private profileRepo: ProfileRepository){}
    async execute(habitId: string, profileId: string, {
        date,
        status,
    }: StatusByDateParams){
        const doesProfileExists = await this.profileRepo.findById(profileId)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const doesHabitExists = await this.habitRepo.findById(habitId)
        if(!doesHabitExists){
            throw new EntityNotFoundError("Habit")
        }

        if(doesHabitExists.profile_id !== profileId){
            throw new NotAllowedError("User does not own habit.")
        }

        const statusByDate = statusByDateSchema.parse(doesHabitExists.status_by_date)

        if(!statusByDate[date]){
            throw new IncorrectParamError("date")
        }

        statusByDate[date] = status

        const habit = await this.habitRepo.update(habitId, {
            status_by_date:statusByDate,
        })

        const {id,days,title,created_at,updated_at,description,category_id,reminder_time,} = doesHabitExists

        return {
            id,
            days,
            title,
            createdAt: created_at,
            updatedAt: updated_at,
            description,
            categoryId: category_id,
            reminderTime: reminder_time,
            statusByDate: habit?.status_by_date,
        }
    }
}