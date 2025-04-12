import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectFormatError } from "errors/IncorrectFormatError";
import { UserRepository } from "repositories/UserRepository";
import { verifyToken } from "utils/token/verifyToken";
import { z } from "zod";

interface RecoverPasswordParams {
    token: string,
    new_password: string,
}

export class RecoverPasswordUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute({
        new_password,
        token,
    }: RecoverPasswordParams){
        const RecoverTokenFormat = z.object({
            sub:z.object({
                id: z.string(),
                act: z.literal("r99")
            })
        })

        const result = RecoverTokenFormat.safeParse(verifyToken(token))

        if(!result.success){
            throw new IncorrectFormatError("The token format is incorrect.")
        }

        const {id} = result.data.sub

        const doesUserExists = await this.UserRepo.findById(id)
        if(!doesUserExists){
            throw new EntityNotFoundError("User")
        }

        await this.UserRepo.update(id, {
            password: new_password,
        })
    }
}