import { hash } from "bcryptjs";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { ExpiredCookieError } from "errors/ExpiredCookieError";
import { IncorrectFormatError } from "errors/IncorrectFormatError";
import { IncorrectCodeError } from "errors/IncorretCodeError";
import { InvalidCookieError } from "errors/InvalidCookieError";
import { UserRepository } from "repositories/UserRepository";
import { verifyToken } from "utils/token/verifyToken";
import { z } from "zod";

interface UnsignedCookie {
    renew: boolean,
    valid: boolean,
    value: string | null,
}

interface RecoverPasswordParams {
    code: string,
    email: string,
    newPassword: string,
    unsignedCookie: UnsignedCookie,
}

export class RecoverPasswordUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute({
        code,
        email,
        newPassword,
        unsignedCookie,
    }: RecoverPasswordParams){
        const doesUserExists = await this.UserRepo.findByEmail(email)
        if(!doesUserExists){
            throw new EntityNotFoundError("User")
        }

        if(!unsignedCookie.valid){
            throw new InvalidCookieError()
        }

        if(unsignedCookie.renew){
            throw new ExpiredCookieError()
        }

        if(code !== unsignedCookie.value){
            throw new IncorrectCodeError()
        }

        await this.UserRepo.update(doesUserExists.id, {
            password: await hash(newPassword, 11),
            updated_at:new Date()
        })
    }
}