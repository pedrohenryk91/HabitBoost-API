import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";
import { z } from "zod";

interface payload {
    email: string,
    id:string,
}

interface params {
    profileId: string,
    payload: payload,
}

export class ValidateEmailUpdateTokenUseCase {
    constructor(private userRepo: UserRepository, private profileRepo: ProfileRepository){}
    async execute({
        profileId,
        payload,
    }: params){
        const doesProfileExists = await this.profileRepo.findById(profileId)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        if(payload.id !== doesProfileExists.id){
            throw new NotAllowedError("The user does not own this action")
        }

        await this.userRepo.update(String(doesProfileExists.user_id), {
            email:payload.email,
            updated_at:new Date()
        })
    }
}