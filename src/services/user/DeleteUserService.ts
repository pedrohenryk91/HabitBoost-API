import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";

export class DeleteUserUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute(id: string){
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const user = await this.UserRepo.findById(String(doesProfileExists.user_id))
        if(!user){
            throw new EntityNotFoundError("User")
        }

        await this.UserRepo.delete(user.id)
        await this.ProfileRepo.delete(id)
    }
}