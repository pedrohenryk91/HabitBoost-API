import { compare } from "bcryptjs";
import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectPasswordError } from "errors/IncorrectPasswordError";
import { NotAllowedError } from "errors/NotAllowedError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";

interface UpdateEmailParams {
    password: string,
    old_email: string,
    new_email: string,
}

export class UpdateEmailUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute(id:string,{
        password,
        new_email,
        old_email,
    }: UpdateEmailParams){
        //1 Verification
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile (impossible error)")
        }

        const user = await this.UserRepo.findById(String(doesProfileExists.user_id))
        if(!user){
            throw new EntityNotFoundError("User (impossible error)")
        }

        //2 Verification
        if(!(await compare(password, user.password))){
            throw new IncorrectPasswordError()
        }

        //3 Verification
        const oldEmailIsCorrect = await this.UserRepo.findByEmail(old_email)
        if(!oldEmailIsCorrect){
            throw new EntityNotFoundError("Old Email")
        }

        //4 Verification
        if(!(old_email === user.email)){
            throw new NotAllowedError("Old email does not belong to the user.")
        }

        //5 Verification
        const doesEmailAlreadyInUse = await this.UserRepo.findByEmail(new_email)
        if(doesEmailAlreadyInUse) throw new AlreadyInUseError("Email")

        await this.UserRepo.update(user.id, {
            email:new_email,
            updated_at:new Date(),
        })
    }
}