import { hash } from "bcryptjs";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectFormatError } from "errors/IncorrectFormatError";
import { UserRepository } from "repositories/UserRepository";
import { verifyToken } from "utils/token/verifyToken";
import { z } from "zod";

export class RecoverPasswordUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute(code: string){
        
        

        // const doesUserExists = await this.UserRepo.findById(id)
        // if(!doesUserExists){
        //     throw new EntityNotFoundError("User")
        // }

    }
}