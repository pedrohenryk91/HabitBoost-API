import { compare } from "bcryptjs";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectPasswordError } from "errors/IncorrectPasswordError";
import { NotAllowedError } from "errors/NotAllowedError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";
import { genEternalToken } from "utils/token/generateToken";

interface LoginParams {
    email: string,
    password: string,
}

export class LoginUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute({
        email,
        password,
    }: LoginParams){
        const doesUserExists = await this.UserRepo.findByEmail(email)
        if(!doesUserExists) throw new EntityNotFoundError("User")

        const doesProfileExists = await this.ProfileRepo.findByUserId(doesUserExists.id)
        if(!doesProfileExists) throw new EntityNotFoundError("Profile (somehow)")

        const result = await compare(password, doesUserExists.password)
        if(!result) throw new IncorrectPasswordError()

        const token = genEternalToken({
            id:"7auth-"+doesProfileExists.id,
        })

        return {
            token,
            username: doesUserExists.username,
        }
    }
}