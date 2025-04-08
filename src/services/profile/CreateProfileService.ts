import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";

interface CreateProfileParams {
    id?: string,
    image_url?: string,
    createdAt?: Date,
    updatedAt?: Date,
    total_habit_count?: number,
    detailed_habit_count?: object,
    user_id?: string,
}

export class CreateProfileUseCase {
    constructor(private ProfileRepo: ProfileRepository, private UserRepo: UserRepository){}
    async execute({
        id,
        user_id,
        image_url,
        updatedAt,
        createdAt,
        total_habit_count,
        detailed_habit_count,
    }: CreateProfileParams){
        if(user_id){
            const doesUserExists = await this.UserRepo.findById(user_id)
            if(!doesUserExists) throw new EntityNotFoundError("User")
        }

        const profile = this.ProfileRepo.create({
            id,
            image_url,
            user_id,
            created_at: createdAt,
            updated_at: updatedAt,
            total_habit_count,
            detailed_habit_count,
        })

        return profile
    }
}