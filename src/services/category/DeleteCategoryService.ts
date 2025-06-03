import { EntityNotFoundError } from "errors/EntityNotFoundError"
import { NotAllowedError } from "errors/NotAllowedError"
import { CategoryRepository } from "repositories/CategoryRepository"
import { ProfileRepository } from "repositories/ProfileRepository"

export class DeleteCategoryUseCase {
    constructor(private CategoryRepo:CategoryRepository, private ProfileRepo: ProfileRepository){}
    async execute(profile_id: string, category_id: string){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const doesCategoryExists = await this.CategoryRepo.findById(category_id)
        if(!doesCategoryExists){
            throw new EntityNotFoundError("Category")
        }

        if(doesCategoryExists.profile_id !== profile_id){
            throw new NotAllowedError("User does not own goal.")
        }

        await this.CategoryRepo.delete(category_id)
    }
}