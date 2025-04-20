import { MAIL_ADDRESS, MAIL_PASSWORD } from "lib/env"
import { Email } from "lib/interfaces/Email"
import * as nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASSWORD,
    },
    tls:{
        rejectUnauthorized:false
    },
})

export async function sendMail(email:Email){
    return transport.sendMail({
        from:`HabitBoost Team <No-Reply${MAIL_ADDRESS}>`,
        to: email.to,
        subject: email.subject,
        text: email.text,
        html: email.html,
    })
}