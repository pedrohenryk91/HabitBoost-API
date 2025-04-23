import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { CategoryRepository } from "repositories/CategoryRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface CreateCategoryParams {
    name: string,
    profile_id: string,
}

export class CreateCategoryUseCase {
    constructor(private CategoryRepo: CategoryRepository, private ProfileRepo: ProfileRepository){}
    async execute({
        name,
        profile_id,
    }: CreateCategoryParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists) throw new EntityNotFoundError("Profile")

        const doesCategoryAlreadyExists = await this.CategoryRepo.findByName(name)
        if(doesCategoryAlreadyExists) throw new AlreadyInUseError("Category")

        const category = await this.CategoryRepo.create({
            name,
        })

        return category
    }
}