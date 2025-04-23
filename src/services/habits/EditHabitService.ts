import { status } from "@prisma/client";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { CategoryRepository } from "repositories/CategoryRepository";
import { HabitRepository } from "repositories/HabitRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface UpdateHabitParams {
    dates?: Date[],
    title?: string,
    status?: status,
    description?: string,
    category_name?: string,
    reminder_time?: Date,
}

export class EditHabitUseCase {
    constructor(private HabitRepo: HabitRepository, private ProfileRepo: ProfileRepository, private CategoryRepo: CategoryRepository){}
    async execute(profile_id: string, habit_id: string, {
        dates,
        title,
        status,
        description,
        category_name,
        reminder_time,
    }: UpdateHabitParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        
        const doesCategoryExists = (category_name?await this.CategoryRepo.findByName(category_name):undefined)
        if(category_name && !doesCategoryExists){
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
            dates,
            title,
            status,
            description,
            reminder_time,
            category_id:doesCategoryExists?.id,
            updated_at: new Date(),
        })

        if(!habit){
            throw new Error("Impossible")
        }
        const {id,created_at,updated_at} = habit
        return {
            id,
            dates,
            title,
            status,
            created_at,
            updated_at,
            description,
            category_name,
            reminder_time,
        }
    }
}