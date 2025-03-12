import { Prisma, profile } from "@prisma/client";

export interface ProfileRepository {
    create(data: Prisma.profileCreateInput): Promise<profile>
    findById(id: string): Promise<profile | null>
    findByUserId(userId: string): Promise<profile | null>
    update(id: string, data: Partial<profile>): Promise<profile>
    delete(id: string): Promise<void>
}