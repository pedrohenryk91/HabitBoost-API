import { Prisma, profile } from "@prisma/client";
import { UserForRank } from "lib/interfaces/UserForRank";

export interface ProfileRepository {
    create(data: Partial<profile>): Promise<profile>
    getRanking(): Promise<UserForRank[]>//Gets the users with the biggest number of completed goals in the week
    findById(id: string): Promise<profile | null>
    findByUserId(userId: string): Promise<profile | null>
    update(id: string, data: Partial<profile>): Promise<profile | null>
    updatePrismaInput(id: string, data: Prisma.profileUpdateInput): Promise<profile | null>
    delete(id: string): Promise<void>
}