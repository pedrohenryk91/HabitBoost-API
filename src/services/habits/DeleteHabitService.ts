import { EntityNotFoundError } from "errors/EntityNotFoundError"
import { NotAllowedError } from "errors/NotAllowedError"
import { HabitRepository } from "repositories/HabitRepository"
import { ProfileRepository } from "repositories/ProfileRepository"

export class DeleteHabitUseCase {
    constructor(private HabitRepo: HabitRepository, private ProfileRepo: ProfileRepository){}
    async execute(profile_id: string, habit_id: string){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const doesHabitExists = await this.HabitRepo.findById(habit_id)
        if(!doesHabitExists){
            throw new EntityNotFoundError("Habit")
        }

        if(doesHabitExists.profile_id !== profile_id){
            throw new NotAllowedError("User does not own habit.")
        }

        await this.HabitRepo.delete(habit_id)
    }
}