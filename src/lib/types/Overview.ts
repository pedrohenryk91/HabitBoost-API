import { z } from "zod";

const DailyInfo = z.object({
    expt: z.number(),//O Número esperado para se atingir em um dia
    acvd: z.number(),//O Número que realmente foi atingido
})

export const OverviewSchema = z.object({
    dom: DailyInfo,
    seg: DailyInfo,
    ter: DailyInfo,
    qua: DailyInfo,
    qui: DailyInfo,
    sex: DailyInfo,
    sab: DailyInfo,
})

export const OverviewOptionalSchema = z.object({
    dom: DailyInfo.optional(),
    seg: DailyInfo.optional(),
    ter: DailyInfo.optional(),
    qua: DailyInfo.optional(),
    qui: DailyInfo.optional(),
    sex: DailyInfo.optional(),
    sab: DailyInfo.optional(),
})