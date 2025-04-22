import { hash } from "bcryptjs";
import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { Email } from "lib/interfaces/Email";
import { ProfileRepository } from "repositories/ProfileRepository";
import { UserRepository } from "repositories/UserRepository";
import { sendMail } from "utils/mail/Mail";
import { genToken } from "utils/token/generateToken";

interface CreateUserParams {
    email: string,
    password: string,
    username: string,
    profile_id?: string,
}

export class CreateUserUseCase {
    constructor(private UserRepo: UserRepository, private ProfileRepo: ProfileRepository){}
    async execute({
        email,
        password,
        username,
        profile_id,
    }:CreateUserParams){
        const doesEmailAlreadyInUse = await this.UserRepo.findByEmail(email)
        if(doesEmailAlreadyInUse){
            throw new AlreadyInUseError("Email")
        }

        const doesUsernameAlreadyInUse = await this.UserRepo.findByUsername(username)
        if(doesUsernameAlreadyInUse){
            throw new AlreadyInUseError("Username")
        }

        if(profile_id){
            const doesProfileExists = await this.ProfileRepo.findById(profile_id)
            if(!doesProfileExists){
                throw new EntityNotFoundError("Profile")
            }
        }

        const hashpassword = await hash(password, 11)

        const user = await this.UserRepo.create({
            email,
            password: hashpassword,
            username,
        })

        await this.ProfileRepo.create({
            user_id:user.id
        })

        const token = genToken(user.id)

        const welcomeEmail:Email = {
            to:email,
            subject:"<No-Reply> Validate account",
            text:`Description: Welcome to the HabitBoost app
            
                Hello ${username},
                Welcome to our app, we hope you'll be able to boost your habits to the maximum.
                Please, make sure to validate your account to fully enjoy the app!

                Click on the following link to confirm your account:
                habitboost://confirm-email?token=${token}
                The link expires in 1 hour

                Best regards,
                -HabitBoost Team-`,
            html:`<body style="margin:0; padding:20px; font-family:Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellpadding="10">
        <tr>
            <td style="text-align: center;">
                <table width="600" cellpadding="20" style="border-radius: 5px; background-color: #ffffff;">
                    <tr>
                        <td style="text-align: center;">
                            <h1 style="color:#333;">Welcome to the HabitBoost app</h1>
                            <p style="font-size:large; color:#555;"> Hello ${username},<br>
                                Welcome to our app, we hope you'll be able to boost your habits to the maximum.
                            </p>
                            <p style="font-size: large;">Click on the button below to confirm your account:</p>
                            <a href="https://habitboost.com/confirm-email=${token}" style="display:inline-block; background:#007BFF; color:#fff; padding:10px 20px; text-decoration:none; font-size:medium; border-radius:5px; margin-top:10px;">
                                Confirm Account
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
</body>`//TODO: The link
        }

        const result = await sendMail(welcomeEmail)

        return user
    }
}