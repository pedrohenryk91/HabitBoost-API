import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { supabase } from "lib/supabase";
import path from "path";
import { ProfileRepository } from "repositories/ProfileRepository";

interface UploadImageParams {
    blob: Blob,
    filename: string,
    mimetype: string,
}

export class UploadImageUseCase {
    constructor(private ProfileRepo: ProfileRepository){}
    async execute(id: string,{
        blob,
        filename,
        mimetype,
    }:UploadImageParams){
        const doesProfileExists = await this.ProfileRepo.findById(id)
        if(!doesProfileExists) throw new EntityNotFoundError("Profile")

        const ext = path.extname(filename)
        const name = `${Date.now()}${ext}`

        const {data,error} = await supabase.storage
        .from("pics-073")
        .upload(`uploads/${name}`,blob,{
            contentType:mimetype,
            upsert:false,
        })

        if(error){
            throw error
        }

        const result = supabase.storage.from("pics-073").getPublicUrl(`uploads/${name}`)
        const image_url = result.data.publicUrl

        await this.ProfileRepo.update(doesProfileExists.id,{
            image_url,
        })

        return {
            image_url
        }
    }
}