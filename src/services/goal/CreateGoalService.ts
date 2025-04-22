import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { GoalRepository } from "repositories/GoalRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface CreateGoalParams {
    title:string,
    habit_id?:string,
}

export class CreateGoalUseCase {
    constructor(private GoalRepository: GoalRepository,private ProfileRepo: ProfileRepository){}
    async execute(profile_id: string,{
        habit_id,
        title,
    }: CreateGoalParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }
    
        const {id,created_at,updated_at} = await this.GoalRepository.create({
            title,
            habit_id:(habit_id?habit_id:undefined),
            profile_id,
        })

        return {
            id,
            title,
            habit_id,
            created_at,
            updated_at,
        }
    }
}