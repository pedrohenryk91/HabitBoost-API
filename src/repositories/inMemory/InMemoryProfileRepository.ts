import { Prisma, profile, user } from "@prisma/client";
import { randomUUID } from "crypto";
import { ProfileRepository } from "repositories/ProfileRepository";
import { nullable } from "zod";

export class InMemoryProfileRepository implements ProfileRepository {
    profiles: profile[] = []

    async create(data: Partial<profile>): Promise<profile> {
        const newProfile: profile = {
            id:randomUUID(),
            detailed_habit_count:(data.detailed_habit_count?data.detailed_habit_count:null),
            total_habit_count:Number(data.total_habit_count),
            image_url:String(data.image_url),
            user_id:null,
            created_at: new Date(),
            updated_at: null,
        }
        this.profiles.push(newProfile)
        return newProfile
    }

    async findById(id: string): Promise<profile | null> {
        return this.profiles.find(profile => (profile.id === id)) ?? null
    }

    async findByUserId(userId: string): Promise<profile | null> {
        return this.profiles.find(profile => (profile.user_id === userId)) ?? null
    }

    async update(id: string, data: Partial<profile>): Promise<profile | null> {
        const doesProfileExists = await this.findById(id)
        if(!doesProfileExists) return null
    
        const updatedProfile = {
            ...doesProfileExists,
            ...data,
        }
    
        this.profiles.map(profile => (profile.id === id ? updatedProfile : profile))
        return updatedProfile
    }

    async delete(id: string): Promise<void> {
        const index = this.profiles.findIndex(profile => (profile.id === id))
        this.profiles.splice(index, 1)
    }
}