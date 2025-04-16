import { z } from "zod";

export const WeekDays = z.array(z.enum(["dom","seg","ter","qua","qui","sex","sab"]))