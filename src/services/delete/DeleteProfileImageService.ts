import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { supabase } from "lib/supabase";
import { ProfileRepository } from "repositories/ProfileRepository";

export class DeleteProfileImageUseCase {
    constructor(private profileRepo: ProfileRepository){}
    async execute(profileId: string){
        const doesProfileExists = await this.profileRepo.findById(profileId)
        if(!doesProfileExists) throw new EntityNotFoundError("User")

        if(!doesProfileExists.image_url) throw new NotAllowedError("User does not have an profile image")

        const name = doesProfileExists.image_url.slice(75)
        console.log(name)
        const { error } = await supabase.storage
            .from("pics-073")
            .remove([`uploads/${name}`])

        if(error) {
            throw error
        }

        await this.profileRepo.updatePrismaInput(profileId,{
            image_url:{
                set:null
            },
            updated_at:new Date(),
        })
    }
}