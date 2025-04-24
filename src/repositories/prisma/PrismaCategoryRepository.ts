import { Prisma, category } from "@prisma/client";
import { prisma } from "lib/prisma";
import { CategoryRepository } from "repositories/CategoryRepository";

export class PrismaCategoryRepository implements CategoryRepository {
    async create(data: Prisma.categoryCreateInput): Promise<category> {
        return await prisma.category.create({
            data,
        })
    }

    async findById(id: number): Promise<category | null> {
        return await prisma.category.findUnique({
            where:{
                id,
            }
        })
    }

    async findByName(name: string): Promise<category | null> {
        return await prisma.category.findFirst({
            where:{
                name:{
                    equals:name,
                    mode:"insensitive",
                }
            }
        })
    }

    async findByProfileId(profile_id: string): Promise<category[]> {
        return await prisma.category.findMany({
            where:{
                profile_id,
            }
        })
    }

    async delete(id: number): Promise<void> {
        await prisma.category.delete({
            where:{
                id,
            }
        })
    }
}