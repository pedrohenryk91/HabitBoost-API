import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { CategoryRepository } from "repositories/CategoryRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

export class GetProfileCategoriesUseCase {
    constructor(private CategoryRepo: CategoryRepository, private ProfileRepo: ProfileRepository){}
    async execute(profile_id: string){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const categories = await this.CategoryRepo.findByProfileId(profile_id)

        const resolvedCategories = await Promise.all(categories)

        const filteredCategories = categories.map((category)=>{
            const {id,name,created_at,updated_at,is_custom,icon_id} = category
            return {
                id,
                name,
                iconId:icon_id,
                isCustom:is_custom,
                createdAt:created_at,
                updatedAt:updated_at,
            }
        })

        return filteredCategories
    }
}