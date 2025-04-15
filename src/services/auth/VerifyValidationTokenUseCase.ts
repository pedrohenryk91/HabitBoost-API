import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { UserRepository } from "repositories/UserRepository";
import { verifyToken } from "utils/token/verifyToken";
import { z } from "zod";

export class VerifyValidationTokenUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute(token: string){

        const tokenSchema = z.object({ sub: z.string() })

        const result = tokenSchema.safeParse(verifyToken(token))

        if(!result.success){ //Verify if token format is valid
            throw result.error
        }

        const doesUserExits = await this.UserRepo.findById(result.data.sub) //Verify if user exists in database
        if(!doesUserExits){
            throw new EntityNotFoundError("User")
        }
        console.log(doesUserExits.id)
        //Set user's verified status to true if everything was succesful
        await this.UserRepo.update(doesUserExits.id, {
            verified_status: true
        })

        return true
    }
}