
import { FastifyReply, FastifyRequest } from "fastify"
import { SUPA_EMAIL, SUPA_PASSWORD } from "lib/env"
import { app } from "lib/fastify"
import { supabase } from "lib/supabase"
import { z } from "zod"

export async function SupabaseLogin(request: FastifyRequest, reply: FastifyReply) {

    const rawtoken = z.object({
        authorization:z.string()
    }).safeParse(request.headers)

    if(!rawtoken.success){
        throw rawtoken.error
    }
    const token = rawtoken.data.authorization.replace("Bearer ","")

    const decoded = app.jwt.decode(token)

    const {sub} = z.object({
            sub:z.object({
                id:z.string()
            })
    }).parse(decoded)

    request.headers.profile = sub.id.replace("7auth-","")

    const result = await supabase.auth.signInWithPassword({
        email:SUPA_EMAIL,
        password:SUPA_PASSWORD,
    })

    if (result.error || !result.data.session?.access_token) {
        throw result.error || new Error("No token!");
    }

    request.headers.authorization = `Bearer ${result.data.session.access_token}`

    await request.jwtVerify()
}