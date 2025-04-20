
import { FastifyReply, FastifyRequest } from "fastify"
import { SUPA_EMAIL, SUPA_PASSWORD } from "lib/env"
import { supabase } from "lib/supabase"

export async function SupabaseLogin(request: FastifyRequest, reply: FastifyReply) {
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