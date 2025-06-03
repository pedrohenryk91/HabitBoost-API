import { compare, hash } from "bcryptjs";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { InvalidTokenError } from "errors/InvalidTokenError";
import { PASSWORD_SIGN } from "lib/env";
import { UserRepository } from "repositories/UserRepository";

interface Params {
    newPassword: string,
    token: string,
    email: string,
}

export class RecoverPasswordService {
    constructor(private UserRepo: UserRepository){}
    async execute({
        newPassword,
        email,
        token,
    }: Params){
        const doesUserExists = await this.UserRepo.findByEmail(email)
        if(!doesUserExists){
            throw new EntityNotFoundError("User")
        }

        const result = await compare(PASSWORD_SIGN, token)
        if(!result){
            throw new InvalidTokenError()
        }

        const hashed = await hash(newPassword, Math.floor(Math.random()*12)+10)

        await this.UserRepo.update(doesUserExists.id, {
            password:hashed,
            updated_at:new Date(),
        })
    }
}