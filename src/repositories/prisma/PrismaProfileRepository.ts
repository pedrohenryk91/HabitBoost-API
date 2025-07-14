import { Prisma, profile } from "@prisma/client";
import { endOfWeek, startOfWeek } from "date-fns";
import { prisma } from "lib/prisma";
import { ProfileRepository } from "repositories/ProfileRepository";
import { rankUsers } from "utils/RankUsers";
export class PrismaProfileRepository implements ProfileRepository {

    async create(data: Partial<profile>): Promise<profile> {
        const {user_id,created_at,detailed_habit_count,image_url,total_habit_count,count_updated_at,updated_at} = data
        return await prisma.profile.create({
            data:{
                user_id,
                image_url,
                created_at,
                updated_at,
                count_updated_at,
                total_habit_count,
                detailed_habit_count:(detailed_habit_count?detailed_habit_count:undefined),
            }
        })
    }

    async getRanking(){
        type RawResult = {
            profile_id: string;
            total_completed: number;
        };

        const now = new Date()
    
        const start = startOfWeek(now, { weekStartsOn: 1})
        const end = endOfWeek(now, { weekStartsOn: 1})
    
        const results: RawResult[] = await prisma.$queryRawUnsafe(`
            SELECT profile_id, COUNT(*) as total_completed
            FROM "goal"
            WHERE
                "updated_at" BETWEEN $1 AND $2
                AND "current_count" = "target_count"
                AND "profile_id" IS NOT NULL
            GROUP BY profile_id
            ORDER BY total_completed DESC
            LIMIT 3;
        `, start, end);

        const profilesIds = results.map(item => item.profile_id)

        const profiles = await prisma.profile.findMany({
            where:{
                id:{
                    in: profilesIds,
                },
            },
            select:{
                id:true,
                image_url:true,
                count_updated_at:true,
                user:{
                    select:{
                        username:true,
                    }
                }
            }
        })

        const usersEntry = results.map(item => {
            const profile = profiles.find(p => p.id === item.profile_id)
            
            return {
                weektotal:Number(item.total_completed),
                username:String(profile?.user?.username),
                date:(profile?.count_updated_at?profile.count_updated_at.toISOString():new Date(3099,12,31).toISOString())
            }
        })

        const users = rankUsers(usersEntry)
        const leaderboard = users.map(user => {
            const profile = profiles.find(p => p.user?.username === user.username)
            const {weektotal,position,username} = user
            return {
                weektotal,
                position,
                username,
                imageUrl:(profile?.image_url ?? null)
            }
        })

        return leaderboard
    }

    async findById(id: string): Promise<profile | null> {
        return await prisma.profile.findUnique({
            where:{
                id,
            }
        })
    }

    async findByUserId(userId: string): Promise<profile | null> {
        return await prisma.profile.findUnique({
            where:{
                user_id:userId,
            },
        })
    }

    async update(id: string, data: Partial<profile>): Promise<profile> {
        return await prisma.profile.update({
            where:{
                id,
            },
            data:{
                image_url:(data.image_url?data.image_url:undefined),
                detailed_habit_count:(data.detailed_habit_count?data.detailed_habit_count:undefined),
                total_habit_count:data.total_habit_count,
                updated_at:data.updated_at,
            },
        })
    }

    async updatePrismaInput(id: string, data: Prisma.profileUpdateInput): Promise<profile | null> {
        return await prisma.profile.update({
            where:{
                id,
            },
            data,
        })
    }

    async delete(id: string): Promise<void> {
        await prisma.profile.delete({
            where:{
                id,
            }
        })
    }

}