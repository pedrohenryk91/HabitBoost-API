import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { GoalRepository } from "repositories/GoalRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface EditGoalParams {
    goal_id: string,
    profile_id: string,
    new_title: string,
}

export class EditGoalUseCase {
    constructor(private GoalRepo: GoalRepository, private ProfileRepo: ProfileRepository){}
    async execute({
        goal_id,
        new_title,
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

        const goal = await this.GoalRepo.update(goal_id, {
            title:new_title,
            updated_at:new Date(),
        })

        if(!goal){
            throw new EntityNotFoundError("Goal")
        }

        const {id,habit_id,title,created_at,updated_at} = goal

        return {
            id,
            title,
            habit_id,
            created_at,
            updated_at,
        }
    }
}