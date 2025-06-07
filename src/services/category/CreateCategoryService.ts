import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { CategoryRepository } from "repositories/CategoryRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

interface CreateCategoryParams {
    id: string,
    name: string,
    iconId: string,
    createdAt?:Date,
    updatedAt?:Date,
    profile_id: string,
}

export class CreateCategoryUseCase {
    constructor(private CategoryRepo: CategoryRepository, private ProfileRepo: ProfileRepository){}
    async execute({
        id,
        name,
        iconId,
        createdAt,
        updatedAt,
        profile_id,
    }: CreateCategoryParams){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists) throw new EntityNotFoundError("Profile")

        const doesCategoryAlreadyExists = await this.CategoryRepo.findByName(name)
        if(doesCategoryAlreadyExists) throw new AlreadyInUseError("Category")

        const {created_at,updated_at,is_custom} = await this.CategoryRepo.create({
            id,
            name,
            is_custom:true,
            icon_id:iconId,
            profile:{
                connect:{
                    id:profile_id,
                }
            },
            created_at:createdAt,
            updated_at:updatedAt,
        })

        return {
            id,
            name,
            iconId,
            isCustom:is_custom,
            createdAt:created_at,
            updatedAt:updated_at,
        }
    }
}