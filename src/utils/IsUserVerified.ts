import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { prisma } from "lib/prisma";

/**
 * Checks if an user is verified
 * @param user_id The user's id
 * @returns The verified_status of the user
 * @throws EntityNotFoundError - if the user is not found.
 */
export async function isUserVerified(user_id: string){
    const user = await prisma.user.findUnique({
        where:{
            id:user_id,
        }
    })

    if(!user){
        throw new EntityNotFoundError("User")
    }

    return user.verified_status
}

/**
 * Checks if an user is verified, but it searches the user based on it's profile
 * @param profile_id  The profile's id
 * @returns The verified status of the user
 * @throws EntityNotFoundError - if the user or the profile are not found.
 */
export async function isUserVerifiedFromProfile(profile_id: string) {
    const profile = await prisma.profile.findUnique({
        where:{
            id:profile_id,
        },
        include:{
            user:{
                select:{
                    verified_status:true
                }
            }
        }
    })

    if(!profile){
        throw new EntityNotFoundError("Profile")
    }

    if(!profile.user){
        throw new EntityNotFoundError("User")
    }

    return profile.user.verified_status
}