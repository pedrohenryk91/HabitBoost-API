import { AbsentFileError } from "errors/AbsentFileError";
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProfileRepository } from "repositories/prisma/PrismaProfileRepository";
import { UploadImageUseCase } from "services/upload/UploadImageService";

export async function POSTUploadImage(request: FastifyRequest, reply: FastifyReply) {
    try {
        const id = String(request.headers.profile)
        const file = await request.file()
        if(!file){
            throw new AbsentFileError()
        }
        const buffer = await file.toBuffer()

        const blob = new Blob([buffer],{type:file.mimetype})
        
        const profileRepo = new PrismaProfileRepository()
        const service = new UploadImageUseCase(profileRepo)

        const {image_url} = await service.execute(id,{
            blob,
            filename:file.filename,
            mimetype:file.mimetype,
        })

        reply.status(201).send({
            Description:"Saved.",
            image_url,
        })
    }
    catch (err) {
        if(err instanceof AbsentFileError){
            reply.status(400).send({
                message:err.message,
            })
        }
        throw err
    }
}