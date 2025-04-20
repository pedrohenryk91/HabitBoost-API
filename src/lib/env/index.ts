import "dotenv/config"
import {z} from "zod"

export const {SUPA_EMAIL,SUPA_PASSWORD,PROJECT_LINK,PROJECT_KEY,MAIL_ADDRESS,MAIL_PASSWORD,JWT_SECRET,NODE_ENV,HOST,PORT} = z.object({
    MAIL_PASSWORD:z.string(),
    MAIL_ADDRESS:z.string(),
    JWT_SECRET:z.string(),
    NODE_ENV:z.enum(["dev","test","prod"]),
    HOST:z.string(),
    PORT:z.string(),
    PROJECT_LINK:z.string(),
    PROJECT_KEY:z.string(),
    SUPA_EMAIL:z.string().email(),
    SUPA_PASSWORD:z.string(),
}).parse(process.env)