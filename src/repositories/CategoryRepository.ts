import { category, Prisma } from "@prisma/client";

export interface CategoryRepository {
    create(data: Prisma.categoryCreateInput): Promise<category>
    findById(id: string): Promise<category | null>
    findByName(name: string): Promise<category | null>
    findByProfileId(profile_id: string): Promise<category[]>
    delete(id: string): Promise<void>
}