import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { OverviewOptionalSchema } from "lib/types/Overview";
import { WeekDays } from "lib/types/WeekDays";
import { ProfileRepository } from "repositories/ProfileRepository";

interface UpdateOverviewParams {
    id: string,
    overview: object,
}

export class UpdateOverviewService {
    constructor(private ProfileRepo: ProfileRepository){}
    async execute({
        id,
        overview,
    }: UpdateOverviewParams){
        const IsOverview = OverviewOptionalSchema.parse(overview)

        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists) throw new EntityNotFoundError("Profile")

        await this.ProfileRepo.update(id, {
            detailed_habit_count:overview,
        })
    }
}