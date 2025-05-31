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
            const {id,categoryId,createdAt,statusByDate,description,reminderTime,status,title,updatedAt,goals} = habit
            const goalsFiltered: Goal[] = goals.map(goal => {
                const {id,created_at,current_count,habit_id,target_count,title,updated_at} = goal;
                return {
                    id,
                    createdAt: created_at,
                    updatedAt: updated_at,
                    title,
                    currentCount:current_count,
                    targetCount:target_count
                }
            });
            return {
                id,
                goals:goalsFiltered,
                title,
                status,
                createdAt,
                updatedAt,
                description,
                categoryId,
                reminderTime,
                statusByDate,
            }
        })
        return habitsFiltered
    }
}