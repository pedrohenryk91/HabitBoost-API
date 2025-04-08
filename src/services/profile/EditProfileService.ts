import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { ProfileRepository } from "repositories/ProfileRepository";

interface EditProfileParams {
    imageUrl?: string,
    thc?: number, //Total Habits Count
}

export class EditProfileUseCase {
    constructor(private ProfileRepo: ProfileRepository){}
    async execute(id: string, {
        imageUrl,
        thc,
    }: EditProfileParams){
        const profileExists = await this.ProfileRepo.findById(id)
        if(!profileExists) throw new EntityNotFoundError("Profile")

        const newProfile = await this.ProfileRepo.update(id, {
            image_url:(imageUrl?imageUrl:profileExists.image_url),
            total_habit_count:(thc?thc:profileExists.total_habit_count),
        })

        return newProfile
    }
}