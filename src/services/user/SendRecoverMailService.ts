import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { Email } from "lib/types/Email";
import { UserRepository } from "repositories/UserRepository";
import { sendMail } from "utils/mail/Mail";
import { genToken } from "utils/token/generateToken";

export class SendRecoverMailUseCase {
    constructor(private UserRepo: UserRepository){}
    async execute(id: string){
        const doesUserExists = await this.UserRepo.findById(id)
        if(!doesUserExists)
            throw new EntityNotFoundError("User")

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