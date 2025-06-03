import { days, status } from "@prisma/client";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { StatusByDate } from "lib/types/StatusByDate";
import { CategoryRepository } from "repositories/CategoryRepository";
import { HabitRepository } from "repositories/HabitRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface UpdateHabitParams {
    days?: string[]
    title?: string,
    status?: status,
    description?: string,
    category_id?: string,
    reminder_time?: Date,
    status_by_date?: StatusByDate
}

export class EditHabitUseCase {
    constructor(private HabitRepo: HabitRepository, private ProfileRepo: ProfileRepository, private CategoryRepo: CategoryRepository){}
    async execute(profile_id: string, habit_id: string, {
        days,
        title,
        status,
        description,
        category_id,
        reminder_time,
        status_by_date,
    }: UpdateHabitParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const doesCategoryExists = (category_id?await this.CategoryRepo.findById(category_id):undefined)
        if(category_id && !doesCategoryExists){
            throw new EntityNotFoundError("Category")
        }

        const doesHabitExists = await this.HabitRepo.findById(habit_id)
        if(!doesHabitExists){
            throw new EntityNotFoundError("Habit")
        }

        if(doesHabitExists.profile_id !== profile_id){
            throw new NotAllowedError("User does not own habit.")
        }

        const habit = await this.HabitRepo.update(habit_id,{
            days:{
                set:days
            },
            title,
            status,
            description,
            reminder_time,
            status_by_date,
            category:(category_id?{
                connect:{
                    id:category_id,
                }
            }:undefined),
            updated_at: new Date(),
        })

        if(!habit){
            throw new Error("Impossible")
        }
        const {id,created_at,updated_at} = habit
        return {
            id,
            days,
            title,
            status,
            created_at,
            updated_at,
            description,
            category_id,
            reminder_time,
            status_by_date,
        }
    }
}