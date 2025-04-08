import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { UserRepository } from "repositories/UserRepository";

interface EditUserParams {
    email?: string,
    password?: string,
    username?: string,
}

export class EditUserUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute(id: string, {
        email,
        password,
        username,
    }: EditUserParams){
        const doesUserExists = await this.UserRepo.findById(id)
        if(!doesUserExists) throw new EntityNotFoundError("User")

        if(!doesUserExists.verified_status){
            throw new NotAllowedError("The user is not verified.")
        }

        if(email){
            const doesEmailAlreadyInUse = await this.UserRepo.findByEmail(email)
            if(doesEmailAlreadyInUse) throw new AlreadyInUseError("Email")
        }
        if(username){
            const doesUsernameAlreadyInUse = await this.UserRepo.findByUsername(username)
            if(doesUsernameAlreadyInUse) throw new AlreadyInUseError("Username")
        }

        const updatedUser = this.UserRepo.update(id, {
            email:(email?email:doesUserExists.email),
            password:(password?password:doesUserExists.password),
            username:(username?username:doesUserExists.username),
            updated_at:new Date(),
        })

        return updatedUser
    }
}