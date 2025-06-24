import { EntityNotFoundError } from "errors/EntityNotFoundError";
import { Goal } from "lib/types/HabitWithGoal";
import { statusByDateSchema } from "lib/types/StatusByDate";
import { HabitRepository } from "repositories/HabitRepository";
import { ProfileRepository } from "repositories/ProfileRepository";

function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses vão de 0 a 11
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export class GetProfileHabitsUseCase {
    constructor(private ProfileRepo: ProfileRepository, private HabitRepo: HabitRepository){}
    async execute(profile_id: string){
        const doesProfileExists = await this.ProfileRepo.findById(profile_id)
        if(!doesProfileExists){
            throw new EntityNotFoundError("Profile")
        }

        const habits = await this.HabitRepo.findByProfileId(profile_id)

        const habitsResolved = await Promise.all(habits)

        const habitsFiltered = habitsResolved.map((habit)=>{
            const {id,category_id,created_at,status_by_date,description,reminder_time,status,title,days,updated_at} = habit
            const statusByDate = statusByDateSchema.parse(status_by_date)
            const today = formatDateToYYYYMMDD(new Date())
            const keys = Object.keys(statusByDate)
            keys.forEach((key)=>{
                const value = statusByDate[key]
                if(key < today && value !== "concluded"){
                    statusByDate[key] = "missed"
                }
            })
            return {
                id,
                days,
                title,
                createdAt:created_at,
                updatedAt:updated_at,
                description,
                categoryId:category_id,
                reminderTime:reminder_time,
                statusByDate:statusByDate,
            }
        })

        for(let i = 0; i < habitsFiltered.length; i++){
            const newStatus = habitsFiltered[i].statusByDate
            const oldStatus = statusByDateSchema.parse(habitsResolved[i].status_by_date)

            const isDifferent = Object.keys(newStatus).some(
                key => oldStatus[key] !== newStatus[key]
            )

            if(isDifferent){
                await this.HabitRepo.update(habitsFiltered[i].id, {
                    status_by_date:newStatus
                })
            }
        }

        return habitsFiltered
    }
}