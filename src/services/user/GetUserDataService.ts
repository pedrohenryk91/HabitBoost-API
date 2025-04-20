import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";

export class GetUserDataUseCase {
    constructor(private ProfileRepo: ProfileRepository){}
    async execute(id: string){
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists) throw new EntityNotFoundError("Profile (somehow)")

        const {total_habit_count, detailed_habit_count} = doesProfileExists

        return {
            total_habit_count,
            detailed_habit_count,
        }
    }
}