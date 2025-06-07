import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { GoalRepository } from "repositories/GoalRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface CreateGoalParams {
    id:string,
    title:string,
    habit_id?:string,
    target_count:number,
    current_count?:number,
    createdAt?: Date,
    updatedAt?: Date,
}

export class CreateGoalUseCase {
    constructor(private GoalRepository: GoalRepository,private ProfileRepo: ProfileRepository){}
    async execute(profile_id: string,{
        target_count,
        createdAt,
        updatedAt,
        current_count,
        habit_id,
        title,
        id,
    }: CreateGoalParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const {created_at,updated_at} = await this.GoalRepository.create({
            id,
            title,
            habit_id,
            created_at:createdAt,
            updated_at:updatedAt,
            profile_id,
            target_count,
            current_count:(current_count?current_count:0),
        })

        return {
            id,
            title,
            habitId:habit_id,
            createdAt:created_at,
            updatedAt:updated_at,
            targetCount:target_count,
            currentCount:(current_count?current_count:0)
        }
    }
}