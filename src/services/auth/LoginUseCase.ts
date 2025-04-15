import { compare } from "bcryptjs";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectPasswordError } from "errors/IncorrectPasswordError";
import { NotAllowedError } from "errors/NotAllowedError";
import { Email } from "lib/types/Email";
import { UserRepository } from "repositories/UserRepository";
import { genToken } from "utils/token/generateToken";

interface LoginParams {
    email: string,
    password: string,
}

export class LoginUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute({
        email,
        password,
    }: LoginParams){
        const doesUserExists = await this.UserRepo.findByEmail(email)
        if(!doesUserExists) throw new EntityNotFoundError("User")

        const result = await compare(password, doesUserExists.password)
        if(!result) throw new IncorrectPasswordError()

        if(!doesUserExists.verified_status){
            throw new NotAllowedError("The user is not verified.")
        }

        const token = genToken({
            id:"7auth-"+doesUserExists.id,
        })

        return {
            token,
            username: doesUserExists.username,
        }
    }
}