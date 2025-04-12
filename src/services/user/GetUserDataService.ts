import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";

export class GetUserDataUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute(username: string){
        const doesUserExists = await this.UserRepo.findByUsername(username)
        if(!doesUserExists) throw new EntityNotFoundError("User")

        const doesProfileExists = await this.ProfileRepo.findByUserId(doesUserExists.id)
        if(!doesProfileExists) throw new NotAllowedError("Can't do that, user does not have an Profile (God knows how)")

        const {total_habit_count, detailed_habit_count} = doesProfileExists

        return {
            total_habit_count,
            detailed_habit_count,
        }
    }
}