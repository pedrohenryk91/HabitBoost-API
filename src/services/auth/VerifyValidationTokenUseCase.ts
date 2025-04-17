import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";
import { genEternalToken } from "utils/token/generateToken";
import { verifyToken } from "utils/token/verifyToken";
import { z } from "zod";

export class VerifyValidationTokenUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
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

        //Set user's verified status to true if everything was succesful
        await this.UserRepo.update(doesUserExits.id, {
            verified_status: true
        })

        const profile = await this.ProfileRepo.findByUserId(doesUserExits.id)

        if(!profile){
            throw new EntityNotFoundError("Profile (imposible)")
        }

        const authToken = genEternalToken({
            id:"7auth-"+profile.id,
        })

        return authToken
    }
}