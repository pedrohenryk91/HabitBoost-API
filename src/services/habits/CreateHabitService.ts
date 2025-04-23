import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { CategoryRepository } from "repositories/CategoryRepository";
import { HabitRepository } from "repositories/HabitRepository";
import { ProfileRepository } from "repositories/ProfileRepository";
import { isUserVerifiedFromProfile } from "utils/IsUserVerified";

interface CreateHabitParams {
    category_name: string,
    profile_id: string,
    title: string,
    dates: Date[],
    description?: string,
    reminder_time?: Date,
}

export class CreateHabitUseCase {
    constructor(private HabitRepo: HabitRepository, private ProfileRepo: ProfileRepository){}
    async execute({
        category_name,
        profile_id,
        title,
        dates,
        description,
        reminder_time,
    }: CreateHabitParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists) throw new EntityNotFoundError("Profile (somehow)")

        const isVerified = await isUserVerifiedFromProfile(profile_id)

        if(!isVerified){
            throw new NotAllowedError("The user is not verified.")
        }

        const habit = await this.HabitRepo.create({
            title,
            dates,
            description,
            reminder_time,
            profile:{
                connect:{
                    id:profile_id,
                }
            },
            category:{
                connect:{
                    name:category_name,
                }
            }
        })

        return habit
    }
}