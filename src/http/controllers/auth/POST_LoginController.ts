import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { IncorrectPasswordError } from "errors/IncorrectPasswordError";
import { NotAllowedError } from "errors/NotAllowedError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaUserRepository } from "repositories/prisma/PrismaUserRepository";
import { LoginUseCase } from "services/auth/LoginUseCase";
import { z } from "zod";

export async function POSTLogin(request: FastifyRequest, reply: FastifyReply) {
    try {
        const loginParamsSchema = z.object({
            email:z.string(),
            password:z.string().min(6),
        })
    
        const {email, password} = loginParamsSchema.parse(request.body)
    
        const repo = new PrismaUserRepository()
        const service = new LoginUseCase(repo)
    
        const {token,username} = await service.execute({
            email,
            password,
        })
    
        reply.status(201).send({
            message:"Login success",
            token,
            username,
        })
    } 
    catch (err) {
        if(err instanceof IncorrectPasswordError){
            reply.status(400).send({
                message:err.message,
            })
        }
        if(err instanceof EntityNotFoundError){
            reply.status(404).send({
                message:err.message,
            })
        }
        if(err instanceof NotAllowedError){
            reply.status(403).send({
                message:err.message
            })
        }
        throw err
    }
}