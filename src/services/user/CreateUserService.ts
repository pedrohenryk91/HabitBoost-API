import { hash } from "bcryptjs";
import { AlreadyInUseError } from "errors/AlreadyInUseError";
import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { Email } from "lib/types/Email";
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
            subject:"<No-Reply> Welcome to the HabitBoost",
            text:`Description: Welcome to the HabitBoost app
            
                Hello ${username},
                Welcome to our app, we hope you'll be able to boost your habits to the maximum.
                Please, make sure to validate your account to fully enjoy the app!

                Click on the following link to confirm your account:
                habitboost://confirm-email?token=${token}
                The link expires in 1 hour

                Best regards,
                -HabitBoost Team-`,
            html:`<h1>Welcome to the HabitBoost app</h1><br>
            <p style="font-size:large;"> Hello ${username},
                Welcome to our app, we hope you'll be able to boost your habits to the maximum.</p>
                
                <p style="font-size: large;">Click on the following link to confirm your account:<br></p>
                <a style="font-size: medium;">habitboost://confirm-email?token=${token}</a>
                <p>The link expires in 1 hour</p>
            
            <p style="font-size:large;">Best Regards
               -HabitBoost Team-
            </p>`
        }

        await sendMail(welcomeEmail)

        return user
    }
}