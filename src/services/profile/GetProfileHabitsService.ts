import { EntityNotFoundError } from "errors/EntityNotFoundError";
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
            const {id,category_id,created_at,dates,description,reminder_time,status,title,updated_at} = habit
            return {
                id,
                title,
                dates,
                status,
                created_at,
                updated_at,
                description,
                category_id,
                reminder_time,
            }
        })
        return habitsFiltered
    }
}