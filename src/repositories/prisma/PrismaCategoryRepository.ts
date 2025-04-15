import { Prisma, category } from "@prisma/client";
import { prisma } from "lib/prisma";
import { CategoryRepository } from "repositories/CategoryRepository";

export class PrismaCategoryRepository implements CategoryRepository {
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
}