import { status } from "@prisma/client"
import { z } from "zod"

export type StatusByDate = {
    [date: string]: string,
}

export const statusByDateSchema = z.record(z.enum(["unstarted","concluded","missed"]))