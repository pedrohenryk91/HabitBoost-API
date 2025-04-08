import { Prisma, user } from "@prisma/client";

export interface UserRepository {
    create(data: Prisma.userCreateInput): Promise<user>
    findById(id: string): Promise<user | null>
    findByEmail(email: string): Promise<user | null>
    findByUsername(username: string): Promise<user | null>
    update(id: string, data: Partial<user>): Promise<user | null>
    delete(id: string): Promise<void>
}