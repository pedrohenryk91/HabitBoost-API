import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { cpuUsage } from "process";
import { GoalRepository } from "repositories/GoalRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

export class GetProfileGoalsUseCase {
    constructor(private GoalRepo: GoalRepository, private ProfileRepo: ProfileRepository){}
    async execute(id: string){
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const goals = await this.GoalRepo.findByProfileId(id)

        const goalsResolved = await Promise.all(goals)

        const goalsFiltered = goalsResolved.map((goal)=>{
            const {id,title,habit_id,target_count,current_count,created_at,updated_at} = goal
            return {
                id,
                title,
                habit_id,
                created_at,
                updated_at,
                target_count,
                current_count,
            }
        })
    
        return goalsFiltered
    }
}