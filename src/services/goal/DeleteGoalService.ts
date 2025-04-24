import { EntityNotFoundError } from "errors/EntityNotFoundError"
import { NotAllowedError } from "errors/NotAllowedError"
import { GoalRepository } from "repositories/GoalRepository"
import { ProfileRepository } from "repositories/ProfileRepository"

export class DeleteGoalUseCase {
    constructor(private GoalRepo:GoalRepository, private ProfileRepo: ProfileRepository){}
    async execute(profile_id: string, goal_id: string){
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

        await this.GoalRepo.delete(goal_id)
    }
}