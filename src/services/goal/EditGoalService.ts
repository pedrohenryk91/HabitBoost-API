import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { GoalRepository } from "repositories/GoalRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface EditGoalParams {
    goal_id: string,
    profile_id: string,
    target_count?: number,
    current_count?: number,
    new_title?: string,
}

export class EditGoalUseCase {
    constructor(private GoalRepo: GoalRepository, private ProfileRepo: ProfileRepository){}
    async execute({
        goal_id,
        new_title,
        target_count,
        current_count,
        profile_id,
    }: EditGoalParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const doesGoalExists = await this.GoalRepo.findById(goal_id)
        if(!doesGoalExists){
            throw new EntityNotFoundError("Goal")
        }

        if(doesGoalExists.profile_id !== profile_id){
            throw new NotAllowedError("User does not own goal.")
        }

        let count_updated_at: Date | null = null
        if(current_count && target_count){
            if(current_count > target_count){
                throw new NotAllowedError("Current count can not be higher than Target count.")
            }
        } else if(current_count){
            if(current_count == doesGoalExists.target_count){
                count_updated_at = new Date()
            }
            if(current_count > doesGoalExists.target_count){
                throw new NotAllowedError("Current count can not be higher than Target count.")
            }
        } else if(target_count){
            if(target_count < doesGoalExists.current_count){
                throw new NotAllowedError("Target count can not be lower than Current count.")
            }
        }

        const goal = await this.GoalRepo.update(goal_id, {
            title:new_title,
            current_count,
            target_count,
            updated_at:new Date(),
        })

        if(!goal){
            throw new EntityNotFoundError("Goal")
        }
        if(count_updated_at){
            await this.ProfileRepo.update(doesProfileExists.id,{
                count_updated_at,
                updated_at: new Date(),
            })
        }

        const {id,habit_id,title,created_at,updated_at} = goal

        return {
            id,
            title,
            habitId:habit_id,
            createdAt:created_at,
            updatedAt:updated_at,
            targetCount:target_count,
            currentCount:current_count,
        }
    }
}