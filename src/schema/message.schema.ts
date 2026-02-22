import {email, z} from "zod"

export const messageSchema = z.object({
    constent: z
        .string()
        .min(10, {message: "Content Must be Atleast 10 Characters"})
        .max(500, {message: "Content Must be Atmost 500 Characters"})
})