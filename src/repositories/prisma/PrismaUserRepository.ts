import { Prisma, user } from "@prisma/client";
import { prisma } from "lib/prisma";
import { UserRepository } from "repositories/UserRepository";

export class PrismaUserRepository implements UserRepository {

    async create(data: Prisma.userCreateInput): Promise<user> {
        return await prisma.user.create({
            data,
        })
    }

    async findById(id: string): Promise<user | null> {
        return await prisma.user.findUnique({
            where:{
                id,
            }
        })
    }

    async findByEmail(email: string): Promise<user | null> {
        return await prisma.user.findFirst({
            where:{
                email:{
                    equals:email,
                    mode:"insensitive",
                }
            },
        })
    }

    async findByUsername(username: string): Promise<user | null> {
        return await prisma.user.findFirst({
            where:{
                username:{
                    equals:username,
                    mode:"insensitive",
                },
            }
        })
    }

    async update(id: string, data: Partial<user>): Promise<user | null> {
        return await prisma.user.update({
            where:{
                id,
            },
            data,
        })
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where:{
                id,
            }
        })
    }

}