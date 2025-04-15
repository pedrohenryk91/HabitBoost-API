import { genToken } from "utils/token/generateToken";
import { sendMail } from "utils/mail/Mail";
import { UserRepository } from "repositories/UserRepository";
import { EntityNotFoundError } from "errors/EntityNotFoundError";

export class SendValidationMailUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute(email: string){
        const doesUserExists = await this.UserRepo.findByEmail(email)
        if(!doesUserExists) {
            throw new EntityNotFoundError("User")
        }

        const token = genToken(doesUserExists.id)

        await sendMail({
            to:email,
            subject:"<No-Reply> User Validation",
            html:`<h1>User Validation</h1>
<hr>
<p style="font-size: large;">You're receiving this message so that we can validate your account here on the HabitBoost App</p>

<p style="font-size: large;">Click on the following link to confirm your account:<br></p>
<a style="font-size: medium;">habitboost://confirm-email?token=${token}</a>
<p>The link expires in 1 hour</p>

<p style="font-size: large;">If it wasn't you that tried to create this account, please ignore this e-mail</p>`
        })
    }
}