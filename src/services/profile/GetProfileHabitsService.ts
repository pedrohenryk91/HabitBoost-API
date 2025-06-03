import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { Goal } from "lib/types/HabitWithGoal";
import { HabitRepository } from "repositories/HabitRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

export class GetProfileHabitsUseCase {
    constructor(private ProfileRepo: ProfileRepository, private HabitRepo: HabitRepository){}
    async execute(profile_id: string){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const habits = await this.HabitRepo.findByProfileId(profile_id)

        const habitsResolved = await Promise.all(habits)

        const habitsFiltered = habitsResolved.map((habit)=>{
            const {id,category_id,created_at,status_by_date,description,reminder_time,status,title,days,updated_at} = habit
            return {
                id,
                days,
                title,
                status,
                createdAt:created_at,
                updatedAt:updated_at,
                description,
                categoryId:category_id,
                reminderTime:reminder_time,
                statusByDate:status_by_date,
            }
        })
        return habitsFiltered
    }
}