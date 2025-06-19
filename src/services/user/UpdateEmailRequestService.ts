import { compare } from "bcryptjs";
import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectPasswordError } from "errors/IncorrectPasswordError";
import { NotAllowedError } from "errors/NotAllowedError";
import { Email } from "lib/interfaces/Email";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";
import { sendMail } from "utils/mail/Mail";
import { genToken } from "utils/token/generateToken";

interface UpdateEmailParams {
    password: string,
    old_email: string,
    new_email: string,
}

export class UpdateEmailRequestUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute(id:string,{
        password,
        new_email,
        old_email,
    }: UpdateEmailParams){
        //1 Verification
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile (impossible error)")
        }

        const user = await this.UserRepo.findById(String(doesProfileExists.user_id))
        if(!user){
            throw new EntityNotFoundError("User (impossible error)")
        }

        //2 Verification
        if(!(await compare(password, user.password))){
            throw new IncorrectPasswordError()
        }

        //3 Verification
        const oldEmailIsCorrect = await this.UserRepo.findByEmail(old_email)
        if(!oldEmailIsCorrect){
            throw new EntityNotFoundError("Old Email")
        }

        //4 Verification
        if(!(old_email === user.email)){
            throw new NotAllowedError("Old email does not belong to the user.")
        }

        //5 Verification
        const doesEmailAlreadyInUse = await this.UserRepo.findByEmail(new_email)
        if(doesEmailAlreadyInUse) throw new AlreadyInUseError("Email")

        const token = genToken({
            email:new_email,
            id:doesProfileExists.id
        })

        const email: Email = {
            to:new_email,
            subject:"No-Reply <Alert>",
            html:`
<body style="margin:0; padding:20px; font-family:Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellpadding="10">
        <tr>
            <td style="text-align: center;">
                <table width="600" cellpadding="20" style="border-radius: 5px; background-color: #ffffff;">
                    <tr>
                        <td style="text-align: center;">
                            <h1 style="color:#333;">Welcome to the HabitBoost app</h1>
                            <p style="font-size:large; color:#555;"> Hello ${user.username},<br>
                                You are trying to change your email
                            </p>
                            <p style="font-size: large;">Click on the button below to validate your new email:</p>
                            <a href="https://habitboost.com/confirm-email?token=${token}" style="display:inline-block; background:#007BFF; color:#fff; padding:10px 20px; text-decoration:none; font-size:medium; border-radius:5px; margin-top:10px;">
                                Validate Email
                            </a>
                            <p style="font-size:large; color:#555;">The link expires in 1 hour.</p>
                            <p style="font-size:large; color:#555;">Best Regards,<br>
                               <strong>HabitBoost Team</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`
        }

        await sendMail(email)
    }
}