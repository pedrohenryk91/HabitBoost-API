import "dotenv/config"
import {z} from "zod"

export const {NODE_ENV,HOST,PORT} = z.object({
    NODE_ENV:z.enum(["dev","test","prod"]),
    HOST:z.string(),
    PORT:z.string()
}).parse(process.env)