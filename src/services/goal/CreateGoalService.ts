import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { GoalRepository } from "repositories/GoalRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface CreateGoalParams {
    title:string,
    habit_id?:string,
    target_count:number,
}

export class CreateGoalUseCase {
    constructor(private GoalRepository: GoalRepository,private ProfileRepo: ProfileRepository){}
    async execute(profile_id: string,{
        target_count,
        habit_id,
        title,
    }: CreateGoalParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const {id,created_at,updated_at,current_count} = await this.GoalRepository.create({
            title,
            habit_id,
            profile_id,
            target_count,
            current_count:0
        })

        return {
            id,
            title,
            habit_id,
            created_at,
            updated_at,
            target_count,
            current_count
        }
    }
}