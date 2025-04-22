import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { Email } from "lib/interfaces/Email";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";
import { sendMail } from "utils/mail/Mail";
import { genToken } from "utils/token/generateToken";

export class SendRecoverMailUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute(id: string){
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists) {
            throw new EntityNotFoundError("Profile")
        }

        const doesUserExists = await this.UserRepo.findById(String(doesProfileExists.user_id))
        if(!doesUserExists){
            throw new EntityNotFoundError("User")
        }

        const token = genToken({
            id: doesUserExists.id,
            act: "r99",
        })

        const email: Email = {
            to:doesUserExists.email,
            subject:"No-Reply Recover Password",
            html:`<h1>Recover Password</h1>
                <br>
                <p style="font-size: large;">Recover token: ${token}</p>
                <br>
                <footer>
                    <p>If you did not have anything to do with this email or company, please verify the safety of your data.</p>
                    <p>auto-generated</p>
                </footer>`,
        }

        await sendMail(email)
    }
}