import dotenv from "dotenv"
import {z} from "zod"

dotenv.config({ override: true })

export const {COOKIE_SECRET,SUPA_EMAIL,SUPA_PASSWORD,PROJECT_LINK,PROJECT_KEY,MAIL_ADDRESS,MAIL_PASSWORD,JWT_SECRET,NODE_ENV,HOST,PORT,PASSWORD_SIGN} = z.object({
    MAIL_PASSWORD:z.string(),
    MAIL_ADDRESS:z.string(),
    JWT_SECRET:z.string(),
    COOKIE_SECRET:z.string(),
    NODE_ENV:z.enum(["dev","test","prod"]),
    HOST:z.string(),
    PORT:z.string(),
    PROJECT_LINK:z.string(),
    PROJECT_KEY:z.string(),
    SUPA_EMAIL:z.string().email(),
    SUPA_PASSWORD:z.string(),
    PASSWORD_SIGN:z.string()
}).parse(process.env)