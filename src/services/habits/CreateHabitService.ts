import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { NotAllowedError } from "errors/NotAllowedError";
import { StatusByDate } from "lib/types/StatusByDate";
import { CategoryRepository } from "repositories/CategoryRepository";
import { HabitRepository } from "repositories/HabitRepository";
import { ProfileRepository } from "repositories/ProfileRepository";
import { isUserVerifiedFromProfile } from "utils/IsUserVerified";

interface CreateHabitParams {
    category_id: number,
    profile_id: string,
    title: string,
    description?: string,
    reminder_time?: Date,
    status_by_date: StatusByDate,
}

export class CreateHabitUseCase {
    constructor(private HabitRepo: HabitRepository, private ProfileRepo: ProfileRepository){}
    async execute({
        category_id,
        profile_id,
        title,
        description,
        reminder_time,
        status_by_date,
    }: CreateHabitParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists) throw new EntityNotFoundError("Profile (somehow)")

        const isVerified = await isUserVerifiedFromProfile(profile_id)

        if(!isVerified){
            throw new NotAllowedError("The user is not verified.")
        }

        const habit = await this.HabitRepo.create({
            title,
            description,
            reminder_time,
            profile:{
                connect:{
                    id:profile_id,
                }
            },
            category:{
                connect:{
                    id:category_id,
                }
            },
            status_by_date,
        })

        return habit
    }
}