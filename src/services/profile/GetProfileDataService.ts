import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";

export class GetProfileDataUseCase {
    constructor(private ProfileRepo: ProfileRepository, private UserRepo: UserRepository){}
    async execute(profile_id: string){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists) throw new EntityNotFoundError("User")

        const user = await this.UserRepo.findById(String(doesProfileExists.user_id))
        if(!user) throw new EntityNotFoundError("User")

        return {
            username: user.username,
            email: user.email,
            imageUrl: doesProfileExists.image_url
        }
    }
}