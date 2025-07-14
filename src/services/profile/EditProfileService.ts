import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectFormatError } from "errors/IncorrectFormatError";
import { OverviewOptional, OverviewOptionalSchema, OverviewOptionalType } from "lib/types/Overview";
import { ProfileRepository } from "repositories/ProfileRepository";

interface EditProfileParams {
    imageUrl?: string,
    thc?: number, //Total Habits Count
    overview?: OverviewOptionalType,
}

export class EditProfileUseCase {
    constructor(private ProfileRepo: ProfileRepository){}
    async execute(id: string, {
        imageUrl,
        thc,
        overview,
    }: EditProfileParams){
        const profileExists = await this.ProfileRepo.findById(id)
        if(!profileExists) throw new EntityNotFoundError("Profile")

        if(overview){
            const isOverview = OverviewOptionalSchema.safeParse(overview)
            if(!isOverview.success){
                throw new IncorrectFormatError("Overview object format is incorrect.")
            }
            const overviewObject = new OverviewOptional(isOverview.data)
            overview.total = overviewObject.totalAcvd()
        }

        const newProfile = await this.ProfileRepo.update(id, {
            image_url:(imageUrl?imageUrl:profileExists.image_url),
            total_habit_count:(thc?thc:profileExists.total_habit_count),
            detailed_habit_count:(overview?overview:profileExists.detailed_habit_count),
            updated_at:new Date(),
        })
    }
}