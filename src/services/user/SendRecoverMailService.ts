import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { Email } from "lib/interfaces/Email";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";
import { sendMail } from "utils/mail/Mail";
import { genToken } from "utils/token/generateToken";

export class SendRecoverMailUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute(email: string){
        const doesUserExists = await this.UserRepo.findByEmail(email)
        if(!doesUserExists){
            throw new EntityNotFoundError("User")
        }

        const code = String(Math.floor(100000 + Math.random() * 900000))

        const mail: Email = {
            to:doesUserExists.email,
            subject:"No-Reply Recover Password",
            html:`<h1>Recover Password</h1>
                <br>
                <p style="font-size: large;">Recover code: ${code}</p>
                <br>
                <footer>
                    <p>If you did not have anything to do with this email or company, please verify the safety of your data.</p>
                    <p>auto-generated</p>
                </footer>`,
        }

        await sendMail(mail)

        return code
    }
}