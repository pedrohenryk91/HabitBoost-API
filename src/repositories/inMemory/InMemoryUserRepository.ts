import { Prisma, user } from "@prisma/client";
import { randomUUID } from "crypto";
import { UserRepository } from "repositories/UserRepository";

export class InMemoryUserRepository implements UserRepository {
    users: user[] = []

    async create(data: Prisma.userCreateInput): Promise<user> {
        const newUser: user = {
            id:randomUUID(),
            email:data.email,
            password:data.password,
            username:data.username,
            verified_status:false,
            created_at:new Date(),
            updated_at:null,
        }
        this.users.push(newUser)
        return newUser
    }

    async findById(id: string): Promise<user | null> {
        return this.users.find(user => (user.id === id)) ?? null
    }

    async findByEmail(email: string): Promise<user | null> {
        return this.users.find(user => (user.email === email)) ?? null
    }

    async findByUsername(username: string): Promise<user | null> {
        return this.users.find(user => (user.username === username)) ?? null
    }

    async update(id: string, data: Partial<user>): Promise<user | null> {
        const doesUserExist = await this.findById(id)
        if(!doesUserExist) return null

        const updatedUser: user = {
            ...doesUserExist,
            ...data,
        }

        this.users.map(user => (user.id === id ? updatedUser : user))
        return updatedUser
    }

    async delete(id: string): Promise<void> {
        const index = this.users.findIndex(user => user.id === id)
        this.users.splice(index, 1)
    }
}