import { hash } from "bcryptjs";
import { ExpiredCookieError } from "errors/ExpiredCookieError";
import { IncorrectCodeError } from "errors/IncorretCodeError";
import { InvalidCookieError } from "errors/InvalidCookieError";
import { PASSWORD_SIGN } from "lib/env";
import { UserRepository } from "repositories/UserRepository";

interface UnsignedCookie {
    renew: boolean,
    valid: boolean,
    value: string | null,
}

interface ValidateCodeParams {
    code: string,
    unsignedCookie: UnsignedCookie,
}

export class ValidateCodeUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute({
        code,
        unsignedCookie,
    }: ValidateCodeParams){
        if(!unsignedCookie.valid){
            throw new InvalidCookieError()
        }

        if(unsignedCookie.renew){
            throw new ExpiredCookieError()
        }

        if(code !== unsignedCookie.value){
            throw new IncorrectCodeError()
        }

        return await hash(PASSWORD_SIGN, Math.floor(Math.random() * 20))
    }
}