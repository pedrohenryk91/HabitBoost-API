import { Prisma, user } from "@prisma/client";

export interface UserRepository {
    create(data: Prisma.userCreateInput): Promise<user>
    findById(id: string): Promise<user | null>
    update(id: string, data: Partial<user>): Promise<user>
    delete(id: string): Promise<void>
}