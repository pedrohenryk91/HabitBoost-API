import { WeekDay } from "lib/types/WeekDay";
import { z } from "zod";

const DailyInfo = z.object({
    expt: z.number(),//O Número esperado para se atingir em um dia
    acvd: z.number(),//O Número que realmente foi atingido
})

type DailyInfo = z.infer<typeof DailyInfo>

export const OverviewSchema = z.object({
    dom: DailyInfo,
    seg: DailyInfo,
    ter: DailyInfo,
    qua: DailyInfo,
    qui: DailyInfo,
    sex: DailyInfo,
    sab: DailyInfo,
    total:z.number().optional(),
})

type Overview = z.infer<typeof OverviewSchema>;

export const OverviewOptionalSchema = z.object({
    dom: DailyInfo.optional(),
    seg: DailyInfo.optional(),
    ter: DailyInfo.optional(),
    qua: DailyInfo.optional(),
    qui: DailyInfo.optional(),
    sex: DailyInfo.optional(),
    sab: DailyInfo.optional(),
    total:z.number().optional(),
})

export type OverviewOptionalType = z.infer<typeof OverviewOptionalSchema>

export class OverviewOptional implements OverviewOptionalType {
    dom?: { expt: number; acvd: number }
    seg?: { expt: number; acvd: number }
    ter?: { expt: number; acvd: number }
    qua?: { expt: number; acvd: number }
    qui?: { expt: number; acvd: number }
    sex?: { expt: number; acvd: number }
    sab?: { expt: number; acvd: number }
    total?: number

    constructor(data: OverviewOptionalType) {
        Object.assign(this, data)
    }
  
    totalAcvd(): number {
        return (["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as const)
            .map(dia => (this[dia] as DailyInfo)?.acvd ?? 0)
            .reduce((total, valor) => total + valor, 0)
    }
}
  
export function getWeekDay(){
    const days: WeekDay[] = ["dom","seg","ter","qua","qui","sex","sab"]
    const num = (new Date()).getDay()
    return days[num]
}