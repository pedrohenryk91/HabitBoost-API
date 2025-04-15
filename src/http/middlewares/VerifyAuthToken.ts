import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function VerifyAuthToken(request: FastifyRequest) {
    await request.jwtVerify()

    const result = z.object({
        sub:z.object({
            id:z.string(),
        })
    }).safeParse(request.user)

    if(!result.success){
        throw new Error("The token is not valid for this route.")
    }

    if(!result.data.sub.id.includes("7auth-")){
        throw new Error("The token is not valid for this route.")
    }

    request.user = result.data.sub.id.replace("7auth-","")
}