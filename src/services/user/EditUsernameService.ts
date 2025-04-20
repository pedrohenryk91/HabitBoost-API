import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";

interface EditUsernameParams {
    old_username: string,
    new_username: string,
}

export class EditUsernameUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute(id: string, {
        old_username,
        new_username,
    }: EditUsernameParams){
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile (impossible error)")
        }

        const user = await this.UserRepo.findById(String(doesProfileExists.user_id))
        if(!user){
            throw new EntityNotFoundError("User (impossible error)")
        }

        const oldUsernameIsCorrect = await this.UserRepo.findByUsername(old_username)
        if(!oldUsernameIsCorrect){
            throw new EntityNotFoundError("Old Username")
        }

        if(old_username !== user.username){
            throw new NotAllowedError("Old username does not belong to the user")
        }

        const doesUsernameAlreadyInUse = await this.UserRepo.findByUsername(new_username)
        if(doesUsernameAlreadyInUse) throw new AlreadyInUseError("Username")

        this.UserRepo.update(user.id, {
            username:new_username,
            updated_at:new Date(),
        })
    }
}