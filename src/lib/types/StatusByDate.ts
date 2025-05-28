import { status } from "@prisma/client"
import { z } from "zod"

export type StatusByDate = {
    [date: string]: string
}[]

export const statusByDateSchema = z.array(z.record(z.string()))