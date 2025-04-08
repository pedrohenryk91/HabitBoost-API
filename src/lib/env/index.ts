import "dotenv/config"
import {z} from "zod"

export const {MAIL_ADDRESS,MAIL_PASSWORD,JWT_SECRET,NODE_ENV,HOST,PORT} = z.object({
    MAIL_PASSWORD:z.string(),
    MAIL_ADDRESS:z.string(),
    JWT_SECRET:z.string(),
    NODE_ENV:z.enum(["dev","test","prod"]),
    HOST:z.string(),
    PORT:z.string()
}).parse(process.env)