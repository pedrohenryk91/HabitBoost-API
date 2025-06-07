import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { OverviewOptional, OverviewOptionalType } from "lib/interfaces/Overview";
import { ProfileRepository } from "repositories/ProfileRepository";

interface TempProfile {
    id: string,
    detailed_habit_count: OverviewOptionalType | null,
    image_url: string | null,
    created_at:Date,
    updated_at?:Date,
    user_id:string,
    username:string,
}

export class GetRankingService {
    constructor(private ProfileRepo: ProfileRepository){}
    async execute(id:string){
        const doesProfileExist = await this.ProfileRepo.findById(id)
        if(!doesProfileExist) throw new EntityNotFoundError("Profile")

        const users: TempProfile[] = await this.ProfileRepo.getRanking()

        const resolvedUsers = await Promise.all(users)

        const topUsers = resolvedUsers.map((user)=>{
            const {username,image_url,created_at,detailed_habit_count,} = user
            let weektotal
            if(!detailed_habit_count){
                weektotal = 0
            }
            weektotal = (detailed_habit_count?.total?detailed_habit_count.total:0)
            return {
                username,
                imageUrl:image_url,
                weektotal,
            }
        })

        return topUsers
    }
}