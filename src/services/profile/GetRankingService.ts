import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { UserForRank } from "lib/interfaces/UserForRank";
import { ProfileRepository } from "repositories/ProfileRepository";

export class GetRankingService {
    constructor(private ProfileRepo: ProfileRepository){}
    async execute(id:string){
        const doesProfileExist = await this.ProfileRepo.findById(id)
        if(!doesProfileExist) throw new EntityNotFoundError("Profile")

        const users: UserForRank[] = await this.ProfileRepo.getRanking()

        return users
    }
}