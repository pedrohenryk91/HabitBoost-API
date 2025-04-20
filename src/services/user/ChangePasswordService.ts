import { compare, hash } from "bcryptjs";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectPasswordError } from "errors/IncorrectPasswordError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";

interface ChangePasswordParams {
    old_password: string,
    new_password: string,
}

export class ChangePasswordUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute(id: string,{
        new_password,
        old_password,
    }: ChangePasswordParams){
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile (impossible error)")
        }

        const user = await this.UserRepo.findById(String(doesProfileExists.user_id))
        if(!user){
            throw new EntityNotFoundError("User (impossible error)")
        }

        if(!(await compare(old_password, user.password))){
            throw new IncorrectPasswordError()
        }

        const hashpassword = await hash(new_password,11)

        await this.UserRepo.update(user.id, {
            password:hashpassword,
            updated_at:new Date(),
        })
    }
}