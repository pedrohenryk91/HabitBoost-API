import { category, Prisma } from "@prisma/client";

export interface CategoryRepository {
    create(data: Prisma.categoryCreateInput): Promise<category>
    findById(id: number): Promise<category | null>
    findByName(name: string): Promise<category | null>
    update(id: number, data: Partial<category>): Promise<category | null>
    delete(id: number): Promise<void>
}